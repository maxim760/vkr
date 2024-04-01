<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
  import { ButtonGroup, Button, GradientButton, Heading, Card, Input } from 'flowbite-svelte';
	import { ArrowRightOutline, CloseOutline, HeartOutline, HeartSolid, SearchOutline, ThumbsUpSolid } from 'flowbite-svelte-icons';
	import { recipeApi } from 'src/api/services/recipe/recipeService';
	import { toastEvents } from 'src/utils/functions/showToast';
  import recipeImg from '$lib/images/recipe_default.jpeg';
  import { persisted } from 'svelte-persisted-store'
	import { writable } from 'svelte/store';
	import { QueryKey } from 'src/utils/types/types';

  const likeRecipes = persisted('like-recipes', []);

  let q = '';

  const query = createQuery({
    queryKey: [QueryKey.SEARCH_RECIPE],
    queryFn: () => recipeApi.search(q)
  });

  $: items = $query?.data?.data ?? [];

  $: if ($query.isError) {
    toastEvents.error('Ошибка при загрузке рецептов');
  }
</script>

<div class="container">
  <div class="row flex gap-2 w-full mb-2">
    <form class="relative w-full" on:submit|preventDefault={() => {
   toastEvents.info('Начинаем поиск')
          $query.refetch();
    }}>
      <div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
        <SearchOutline class="w-4 h-4" />
      </div>
      <Input bind:value={q} style="padding-right:6rem;" size="lg" id="search-navbar" class="ps-10 pe-20" placeholder="Введите..." />
      <div class="flex absolute inset-y-0 end-0 items-center p-2">
        {#if q}
          <div on:click={() => (q = '')} on:keydown role="button" tabindex="0" class="pr-2">
            <CloseOutline size="xl" class="w-8 h-8 text-primary-700" />
          </div>
        {/if}
        <Button type="submit" on:click={() => {
      
        }}>Найти</Button>
      </div>
    </form>

  </div>

  <div class="items">
      <div class="group">
        {#each items as recipe (recipe.id)}
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
      </div>
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