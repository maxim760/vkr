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
  
  let spaceId = '';
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
  $: spaces = $querySpaces?.data?.map(s => ({
    name: s.name,
    value: s.id,
  }));
  $: initialSpaceId =  $querySpaces?.data?.find(item => item?.userSpaces?.find(item => item.is_selected))?.id;

  $: if (initialSpaceId) {
    spaceId = initialSpaceId;
  }

  const queryClient = useQueryClient();
  const mutationFolder = createMutation({ 
    mutationFn: () => spaceApi.select(spaceId),
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
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Выбор активного пространства</h3>
<Label>
  Выберите пространство
  <Select placeholder="Выберите" class="mt-2" items={spaces} bind:value={userId} />
</Label>
<Button type="submit" class="w-full">Выбрать</Button>
</form>
