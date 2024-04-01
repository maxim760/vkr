<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Alert, ButtonGroup, Textarea, Select, Toggle } from 'flowbite-svelte';
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
	import { spaceApi } from 'src/api/services/space/spaceService';
	import { QueryKey } from 'src/utils/types/types';
  
  let name = '';
  let userId = '';
  let checked = false;

  const queryMe = createQuery({
    queryKey: [QueryKey.ME],
    queryFn: () => authApi.me(),
  });

  const querySpaces = createQuery({
    queryKey: [QueryKey.SPACES],
    queryFn: () => spaceApi.getAll(),
  });

  $: user = $queryMe?.data;
  $: loaded = Boolean($querySpaces.data.length);
  $: space = $querySpaces?.data?.find(s => s?.userSpaces?.find(u => u.is_selected && u.user.id === user.id));
  $: users = space?.userSpaces.filter(u => u.user.id !== user.id).map((u) => ({
    name: u.user.displayName,
    value: u.user.id,
  }));

  $: if (loaded  && !space) {
    toastEvents.error('Вы не являетесь владельцем выбранного пространства');
    goto('/settings');
  }

  $: currentUser = space?.userSpaces?.find(item => item.user.id === userId);

  $: initialChecked = currentUser?.is_edit ?? false

  $: checked = initialChecked;

  const queryClient = useQueryClient();

  const mutationFolder = createMutation({ 
    mutationFn: () => spaceApi.permissions({ canUserEdit: checked, targetUserId: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.SPACES] })
      toastEvents.success();
      goto('/settings');
    },
    onError: () => toastEvents.error(),
  });

  const onSubmit = () => {
    $mutationFolder.mutate()
  }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Редактирование пермиссий</h3>
<Label>
  Выберите пользователя
  <Select placeholder="Выберите" class="mt-2" items={users} bind:value={userId} />
</Label>

<Toggle bind:checked>Возможность редактирования</Toggle>


<Button type="submit" class="w-full">Сохранить</Button>
</form>
