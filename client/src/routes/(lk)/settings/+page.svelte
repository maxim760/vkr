<script lang="ts">
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { ButtonGroup, Button, GradientButton, Heading, Card, Avatar, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ArrowRightOutline, DotsHorizontalOutline, HeartOutline, HeartSolid, ThumbsUpSolid } from 'flowbite-svelte-icons';
	import { recipeApi } from 'src/api/services/recipe/recipeService';
	import { toastEvents } from 'src/utils/functions/showToast';
  import recipeImg from '$lib/images/recipe_default.jpeg';
  import { persisted } from 'svelte-persisted-store'
	import { writable } from 'svelte/store';
	import { spaceApi } from 'src/api/services/space/spaceService';
	import { authApi } from 'src/api/services/auth/authService';
	import { goto } from '$app/navigation';
	import { tokenService } from 'src/utils/config/tokens';
	import { userStore } from 'src/stores/userStore';
	import { QueryKey } from 'src/utils/types/types';

	const queryClient = useQueryClient();

	const mutationLogout = createMutation({
		mutationFn: () => authApi.logout(),
		onSuccess: () => {
			goto("/login");
			tokenService.removeAccessToken();
			userStore.clearUser();
			queryClient.invalidateQueries();
		}
	})

	const logout = () => {
		$mutationLogout.mutate();
	}

  const querySpaces = createQuery({
    queryKey: [QueryKey.SPACES],
    queryFn: () => spaceApi.getAll()
  });
  const queryMe = createQuery({
    queryKey: [QueryKey.ME],
    queryFn: () => authApi.me()
  });

	$: console.log({$querySpaces})

	$: user = $queryMe?.data || { id: '', displayName: '', email: '' };
	$: space = $querySpaces?.data?.find(s => s?.userSpaces?.find(u => u.is_selected  && u.user.id === user.id));
  $: userInSpace = space?.userSpaces.find(u => u?.user?.id === user?.id);
  $: isEdit = userInSpace?.is_edit;
  $: isAdmin = userInSpace?.is_admin;
  $: console.log({userInSpace, isAdmin, isEdit, space})


</script>

<div class="container">
  <div class="actions mb-8">
  </div>
	<div class="mb-8">

	<Card padding="md">
		<!-- <div class="flex justify-end">
			<DotsHorizontalOutline />
			<Dropdown class="w-36">
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Export data</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</Dropdown>
		</div> -->
		<div class="flex flex-col items-center pb-4">
			<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.displayName}</h5>
			<span class="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
			<div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
				<Button on:click={logout}>Выйти</Button>
				<Button color="light" class="dark:text-white" href="/edit-display-name">Переименовать</Button>
			</div>
		</div>
	</Card>
</div>
<div class="mb-8">


	<Card padding="md">
		<div class="flex justify-end" style:min-width="240px">
			<Heading tag="h5" class="mb-8">Пространства</Heading>

			<DotsHorizontalOutline size="lg" class="cursor-pointer" />
			<Dropdown class="w-48">
				{#if isAdmin}
				<DropdownItem href="/add-user-to-space"><div class="text-slate-800">Добавить пользователя</div></DropdownItem>
				<DropdownItem href="/edit-space-permissions"><div class="text-slate-800">Изменить права</div></DropdownItem>
				{/if}
				<DropdownItem href="/select-space"><div class="text-slate-800">Выбрать активное</div></DropdownItem>
			</Dropdown>
		</div>
		<div class="flex flex-col items-center pb-4">
			{#if space}
				<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Выбрано: {space?.name ?? ''}</h5>
				<span class="text-sm text-gray-500 dark:text-gray-400 mr-auto w-full">Пользователей: {space?.userSpaces?.length ?? 1}</span>
			{/if}
		</div>
	</Card>
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