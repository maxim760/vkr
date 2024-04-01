<script lang="ts">
	import { page } from "$app/stores";
	import { createQuery } from "@tanstack/svelte-query";
	import { Badge, Button, Card } from "flowbite-svelte";
	import { recipeApi } from "src/api/services/recipe/recipeService";
	import { toastEvents } from "src/utils/functions/showToast";
  import recipeImg from '$lib/images/recipe_default.jpeg';
	import { persisted } from "svelte-persisted-store";
	import { HeartOutline, HeartSolid } from "flowbite-svelte-icons";
	import { QueryKey } from "src/utils/types/types";
	import { spaceApi } from "src/api/services/space/spaceService";
	import { authApi } from "src/api/services/auth/authService";

  const query = createQuery({
    queryKey: [QueryKey.RECIPE_BY_ID, $page.params?.id ?? ''],
    queryFn: () => recipeApi.getOne($page.params?.id ?? '')
  });

  const likeRecipes = persisted('like-recipes', []);

  $: recipe = $query?.data?.data ?? undefined;

  $: isLike = $likeRecipes.some(r => r?.id === recipe?.id);

  $: if ($query.isError) {
    toastEvents.error('Ошибка при загрузке рецептов');
  }

  const querySpaces = createQuery({
    queryKey: [QueryKey.SPACES],
    queryFn: () => spaceApi.getAll()
  });
  const queryMe = createQuery({
    queryKey: [QueryKey.ME],
    queryFn: () => authApi.me()
  });

  $: user = $queryMe?.data || { id: '', displayName: '', email: '' };
	$: space = $querySpaces?.data?.find(s => s?.userSpaces?.find(u => u.is_selected  && u.user.id === user.id));
  $: userInSpace = space?.userSpaces.find(u => u?.user?.id === user?.id);
  $: isEdit = userInSpace?.is_edit;
  $: isAdmin = userInSpace?.is_admin;
  $: console.log({userInSpace, isAdmin, isEdit, space})
</script>

{#if recipe}
<div class="container">

<Card size="md" style="margin: 0 auto" img={recipe.steps?.at(-1)?.photos?.at(-1) || recipeImg}>
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white title">{recipe.name}</h5>
  <p class="subtitle mb-2 font-normal text-gray-700 dark:text-gray-400 leading-tight">{recipe.description}</p>
  {#if recipe.time_recipe}
  <p class="subtitle mb-4 font-normal text-gray-700 dark:text-gray-400 leading-tight">Время приготовления: {recipe.time_recipe}</p>
  {/if}
  <div class="mb-5 ml-2 mt-4" style:gap="1rem" style:width="100%" style:display="flex" style:flex-wrap="wrap" style:align-items="center">
    {#each  recipe.tags as tag}
      <Badge large color="indigo">{tag}</Badge>
    {/each}
  </div>
  <h6 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white title">Ингредиенты</h6>
  <div class="mb-4 mt-1" style:gap="1rem" style:width="100%" style:justify-content="flex-start" style:display="flex" style:flex-wrap="wrap" style:align-items="center">
    {#each  recipe.ingredients.filter(item => item.length > 3 && !item.includes(":")) as ing}
      <Badge large color="green">{ing}</Badge>
    {/each}
  </div>
  <h6 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white title">Шаги</h6>
  {#each recipe.steps as step}
    <div style:display="flex" style:flex-direction="column" class="mt-8 bg-zinc-100 p-4" style:border-radius="1rem">
      {#if step.time_step}
      <p class="subtitle mb-2 font-normal text-gray-700 dark:text-gray-400 leading-tight">Время приготовления шага: {step.time_step}</p>
      {/if}
      <p class="mb-4 font-normal text-gray-900 dark:text-gray-400 leading-tight">{step.name}</p>
      {#each (step.photos || []) as photo}
        {#if photo}
        <img style:aspect-ratio={16/9} src={photo} alt="" style:width="100%" style:height="auto" style:margin-bottom="1rem" />
        {/if}
      {/each}
    </div>
  {/each}
  <div class="flex gap-4 mt-4 wrap flex-wrap" style:justify-content="flex-end">
    {#if isEdit}
      <Button href="/edit-recipe/{recipe.id}" color="light" class="!p-2" size="lg">
        Редактировать
      </Button>
    {/if}
    <Button on:click={() => {
      if (isLike) {
        likeRecipes.update(prev => prev.filter(item => item?.id !== recipe.id))
      } else {
        likeRecipes.update((prev) => [...prev, recipe])
      }
    }} color="light" class="!p-2" size="lg">
      {#if isLike}
        <span class="pr-2">Удалить из избранного</span>
        <HeartSolid class="w-5 h-5 text-primary-700" />
        {:else}
        <span class="pr-2">Добавить в избранное</span>
        <HeartOutline class="w-5 h-5 text-primary-700 fill-white" />
      {/if}
    </Button>
  </div>
</Card>
</div>

{/if}

<style lang="css">
  .container {
    min-width: 100%;
  }
  .container :global(img) {
    margin: 1rem auto 0;
    max-width: 24rem;
    border-radius: 1rem;
  }
</style>