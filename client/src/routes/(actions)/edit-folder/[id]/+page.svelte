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
  
  let name = '';

  const queryFolders = createQuery({
    queryKey: [QueryKey.FOLDERS],
    queryFn: () => recipeApi.folders(''),

  });

  $: folder = $queryFolders?.data?.data?.find(item => item?.id === $page.params?.id) ?? undefined;
  const queryClient = useQueryClient();

  const mutationFolder = createMutation({ 
    mutationFn: () => folderApi.rename({ id: $page.params?.id ?? '', name  }),
    onSuccess: () => {
      toastEvents.success();
      queryClient.invalidateQueries({ queryKey: [QueryKey.FOLDERS] })

      goto('/');
    },
    onError: () => toastEvents.error(),
  });

  $: initialName = folder?.name ?? '';

  $: if (initialName) {
    name = initialName;
  }

  const onSubmit = () => {
    $mutationFolder.mutate()
  }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Редактирование папки</h3>
<Label class="space-y-2 flex flex-col">
  <span>Название</span>
  <Input bind:value={name} type="text" name="name" required />
</Label>

<Button type="submit" class="w-full">Сохранить</Button>
</form>
