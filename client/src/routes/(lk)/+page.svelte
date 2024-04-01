<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
  import { ButtonGroup, Button, GradientButton, Heading, Card } from 'flowbite-svelte';
	import { ArrowRightOutline, HeartOutline, HeartSolid, ThumbsUpSolid } from 'flowbite-svelte-icons';
	import { recipeApi } from 'src/api/services/recipe/recipeService';
	import { toastEvents } from 'src/utils/functions/showToast';
  import recipeImg from '$lib/images/recipe_default.jpeg';
  import { persisted } from 'svelte-persisted-store'
	import { writable } from 'svelte/store';
	import { spaceApi } from 'src/api/services/space/spaceService';
	import { authApi } from 'src/api/services/auth/authService';
	import { QueryKey } from 'src/utils/types/types';

  const likeRecipes = persisted('like-recipes', []);

  const query = createQuery({
    queryKey: [QueryKey.FOLDERS],
    queryFn: () => recipeApi.folders('')
  });
  const querySpaces = createQuery({
    queryKey: [QueryKey.SPACES],
    queryFn: () => spaceApi.getAll()
  });
  const queryMe = createQuery({
    queryKey: [QueryKey.ME],
    queryFn: () => authApi.me()
  });

  let hiddenGroups = [];

  $: items = ($query?.data?.data ?? []).sort((a, b) => a.id === '-1' ? 1 : -1);

  $: console.log($querySpaces, $queryMe)

  $: if ($query.isError) {
    toastEvents.error('Ошибка при загрузке рецептов');
  }

	$: user = $queryMe?.data || { id: '', displayName: '', email: '' };
	$: space = $querySpaces?.data?.find(s => s?.userSpaces?.find(u => u.is_selected && u.user.id === user.id));
  $: userInSpace = space?.userSpaces.find(u => u?.user?.id === user?.id);
  $: isEdit = userInSpace?.is_edit;
  $: isAdmin = userInSpace?.is_admin;
  $: console.log({userInSpace, isAdmin, isEdit, space})
</script>

<div class="container">
  {#if isEdit}
  <div class="actions mb-2">
    <ButtonGroup>
      <Button href="/create-recipe" outline color="blue">Создать новый</Button>
      <Button href="/create-recipe-link" outline color="blue">Создать по ссылке</Button>
      <Button href="/create-folder" outline color="blue">Создать папку</Button>
    </ButtonGroup>
  </div>
  {/if}

  <div class="items mt-4">
    {#each items as group}
      <div class="flex items-center gap-x-8 wrap flex-wrap mb-2">
        <div class="flex-none">
          <Heading tag="h5">{group.name}</Heading>
        </div>
        <div class="flex gap-2 wrap flex-wrap">
          <Button on:click={() => {
            if (hiddenGroups.includes(group.id)) {
              hiddenGroups = hiddenGroups.filter(item => item !== group.id)
            } else {
              hiddenGroups = [...hiddenGroups, group.id]
            }

          }} outline color='blue'>{hiddenGroups.includes(group.id) ? 'Показать' : 'Скрыть'}</Button>
          {#if group.id !== '-1' && isEdit}
            <Button href="/edit-folder/{group.id}" color='blue'>Переименовать</Button>
            <Button href="/remove-folder/{group.id}" color='red'>Удалить</Button>
          {/if}
        </div>
      </div>
      <div class="group">
        {#if !hiddenGroups.includes(group.id)}
        {#each group.recipes as recipe (recipe.id)}
          {@const isLike = $likeRecipes.some(r => r?.id === recipe.id)}
          <div class="item">
            <Card img={recipe.steps?.at(-1)?.photos?.at(-1) || recipeImg}>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white title">{recipe.name}</h5>
              <p class="subtitle mb-4 font-normal text-gray-700 dark:text-gray-400 leading-tight">{recipe.description}</p>
              <div class="flex gap-4">
                <Button href="/recipe/{recipe.id}">
                  Перейти к рецепту <ArrowRightOutline class="w-3.5 h-3.5 ms-2 text-white" />
                </Button>
                <Button on:click={() => {
                  if (isLike) {
                    likeRecipes.update(prev => prev.filter(item => item?.id !== recipe.id))
                  } else {
                    likeRecipes.update((prev) => [...prev, recipe])
                  }
                }} color="light" class="!p-2" size="lg">
                  {#if isLike}
                  <HeartSolid class="w-5 h-5 text-primary-700" />
                  {:else}
                  <HeartOutline class="w-5 h-5 text-primary-700 fill-white" />
                  {/if}
                </Button>
              </div>
            </Card>
          </div>
        {/each}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    margin: 0 auto;
  }
  .actions {
    display: flex;
    margin: 0 auto;
  }

  .group {
    display: flex;
    flex-wrap: wrap;
  }

  .items {
    width: 100%;
  }

  .group .item {
    width: 33.33%;
    padding: 0.5rem;
  }

  .group .item > :global(div) {
    margin: 0 auto;
  }


  .title {
    min-height: 96px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3; 
    -webkit-box-orient: vertical;
  }

  .subtitle {
    min-height: 120px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6; /* number of lines to show */
    line-clamp: 6; 
    -webkit-box-orient: vertical;
  }

  .item :global(img) {
    aspect-ratio: 16 / 9;
  }
  @media only screen and (max-width: 991px){
    .group .item {
      width: 50%;
    }
  }
  @media only screen and (max-width: 600px){
    .group .item {
      width: 100%;
    }
  }
</style>