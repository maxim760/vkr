<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Alert, ButtonGroup, Textarea } from 'flowbite-svelte';
  import { toasts }  from "svelte-toasts";


  import { createMutation, useQueryClient } from '@tanstack/svelte-query'
import { authApi } from '$api/services/auth/authService';
import type { LoginUserDto } from '$api/services/auth/dto';
import { toastEvents } from 'src/utils/functions/showToast';
import { getBaseUrl } from 'src/utils/config/config';
import { userStore } from 'src/stores/userStore';
import { tokenService } from 'src/utils/config/tokens';
import { goto } from '$app/navigation';
	import { recipeApi } from 'src/api/services/recipe/recipeService';
	import type { Recipe } from 'src/api/services/recipe/types';
	import { QueryKey } from 'src/utils/types/types';
  let link = '';
  const queryClient = useQueryClient();

  const mutation = createMutation({ 
    mutationFn: (data: string) => recipeApi.createLink(data),
    onSuccess: () => {
      toastEvents.success();
      queryClient.invalidateQueries({ queryKey: [QueryKey.FOLDERS] })
      goto('/')
    },
    onError: () => toastEvents.error(),
  })

  const onSubmit = () => {
    $mutation.mutate(link)
  }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Создание рецепта по ссылке</h3>
<Label class="space-y-2 flex flex-col">
  <span>Ссылка</span>
  <Input bind:value={link} type="text" name="name" required />
</Label>

<Button type="submit" class="w-full">Создать</Button>
</form>
