<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Alert, ButtonGroup, Textarea, Select } from 'flowbite-svelte';
  import { toasts }  from "svelte-toasts";
  import { MinusOutline, PlusOutline } from 'flowbite-svelte-icons';


  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { authApi } from '$api/services/auth/authService';
import type { LoginUserDto } from '$api/services/auth/dto';
import { toastEvents } from 'src/utils/functions/showToast';
import { getBaseUrl } from 'src/utils/config/config';
import { userStore } from 'src/stores/userStore';
import { tokenService } from 'src/utils/config/tokens';
import { goto } from '$app/navigation';
	import { recipeApi } from 'src/api/services/recipe/recipeService';
	import type { Recipe } from 'src/api/services/recipe/types';
	import { folderApi } from 'src/api/services/folder/folderService';
	import type { Folder } from 'src/api/services/folder/types';
	import { page } from '$app/stores';
	import { QueryKey } from 'src/utils/types/types';
  
  let folderId = '';
  let name = '';
  let description = '';

  const query = createQuery({
    queryKey: [QueryKey.RECIPE_BY_ID, $page.params?.id],
    queryFn: () => recipeApi.getOne($page.params?.id ?? ''),
  });

  const queryFolders = createQuery({
    queryKey: [QueryKey.FOLDERS],
    queryFn: () => recipeApi.folders('')
  });

  const queryClient = useQueryClient();

  const mutationFolder = createMutation({ 
    mutationFn: (params: any) => recipeApi.update($page.params?.id ?? '', { folderId: folderId === '-1' ? '' : folderId, name, description }),
    onSuccess: () => {
      toastEvents.success();
      queryClient.invalidateQueries({ queryKey: [QueryKey.FOLDERS] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.RECIPE_BY_ID, $page.params?.id ?? ''] })
      goto($page.params?.id  ? ('/recipe/' + $page.params?.id ?? '') : '/');
    },
    onError: () => toastEvents.error(),
  });

  $: initialData = $query?.data?.data;
  $: loaded = Boolean(initialData);
  $: initialFolderId = initialData?.folder?.id ?? '-1';
  $: initialName = initialData?.name ?? '';
  $: initialDesc = initialData?.description ?? '';

  $: if (loaded) {
    folderId = initialFolderId
    name = initialName
    description = initialDesc
  }

  $: folders = $queryFolders?.data?.data ?? [];

  $: folderItems = [{ value: '-1', name: 'Без папки' }, ...folders.filter(item => item.id !== '-1').map((item) => ({
    value: item.id, name: item.name,
  }))];

  $: console.log({folderItems, folders})

  const onSubmit = () => {
    $mutationFolder.mutate({ name, description, folderId })
  }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Редактирование рецепта</h3>
<Label class="space-y-2 flex flex-col">
  <span>Название</span>
  <Input bind:value={name} type="text" name="name" required />
</Label>
<Label class="space-y-2  flex flex-col">
  <span>Описание</span>
  <Textarea rows={3}  bind:value={description} type="text" name="name" required />
</Label>

<Label>
  Выберите папку
  <Select placeholder="Выберите" class="mt-2" items={folderItems} bind:value={folderId} />
</Label>

<Button type="submit" class="w-full">Сохранить</Button>
</form>
