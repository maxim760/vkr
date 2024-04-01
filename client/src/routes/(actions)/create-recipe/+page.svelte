<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Alert, ButtonGroup, Textarea } from 'flowbite-svelte';
  import { toasts }  from "svelte-toasts";
  import { MinusOutline, PlusOutline } from 'flowbite-svelte-icons';


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
  let name = '';
  let description = '';
  let time_recipe = '';
  let ingredients = ['']
  let tags = ['']
  let steps: Recipe["steps"] = [{
    name: '',
    photos: [''],
    time_step: '',
  }]

  const queryClient = useQueryClient();

  const mutation = createMutation({ 
    mutationFn: (data: Omit<Recipe, 'id'>) => recipeApi.create(data),
    onSuccess: () => {
      toastEvents.success();
      queryClient.invalidateQueries({ queryKey: [QueryKey.FOLDERS]})
      goto('/')
    },
    onError: () => toastEvents.error(),
  })

  const onSubmit = () => {
    $mutation.mutate({ name, description, ingredients, tags, steps, time_recipe })
  }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Создание рецепта</h3>
<Label class="space-y-2 flex flex-col">
  <span>Название</span>
  <Input bind:value={name} type="text" name="name" required />
</Label>
<Label class="space-y-2  flex flex-col">
  <span>Описание</span>
  <Textarea rows={3}  bind:value={description} type="text" name="name" required />
</Label>
<Label class="space-y-2 flex flex-col">
  <span>Время приготовления</span>
  <Input bind:value={time_recipe} type="text" name="time_recipe" />
</Label>
<Label class="space-y-2 flex flex-col">
  <span>Ингредиенты</span>
  {#each ingredients as ing, idx}
    <ButtonGroup>
      <Input bind:value={ingredients[idx]} type="text" name="ingredient" required />
      {#if ingredients.length > 1}
      <Button on:click={() => ingredients = [...ingredients.slice(0, idx), ...ingredients.slice(idx + 1)]}>
          <MinusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
        </Button>
      {/if}
      <Button on:click={() => ingredients = [...ingredients, '']}>
          <PlusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
        </Button>
    </ButtonGroup>
  {/each}
</Label>
<Label class="space-y-2 flex flex-col">
  <span>Теги</span>
  {#each tags as item, idx}
    <ButtonGroup>
      <Input bind:value={tags[idx]} type="text" name="ingredient" />
      {#if tags.length > 1}
      <Button on:click={() => tags = [...tags.slice(0, idx), ...tags.slice(idx + 1)]}>
          <MinusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
      </Button>
      {/if}
      <Button on:click={() => tags = [...tags, '']} >
          <PlusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
      </Button>
    </ButtonGroup>
  {/each}
</Label>
<Label class="space-y-2">
  <span>Шаги</span>
  {#each steps as item, idx}
    <div>
      <div class="space-y-2">Номер шага - {idx+1}</div>
      <Label class="space-y-2">
        <span>Описание шага</span>
        <Textarea rows={3} bind:value={steps[idx].name} type="text" name="step_name" required />
      </Label>
      <Label class="space-y-2">
        <span>Время шага</span>
        <Input bind:value={steps[idx].time_step} type="text" name="step_time_step" />
      </Label>
      <Label class="space-y-2">
        <span>Ссылки на картинки</span>
        {#each steps[idx].photos as photo, photoIdx}
        <ButtonGroup >
          <Input bind:value={item.photos[photoIdx]} type="text" name="step_photos" />
          {#if steps[idx].photos.length > 1}
          <Button on:click={() => (steps[idx].photos = [...steps[idx].photos.slice(0, photoIdx), ...steps[idx].photos.slice(photoIdx + 1)])}>
              <MinusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
          </Button>
          {/if}
          <Button on:click={() => steps[idx].photos = [...steps[idx].photos, '']} >
              <PlusOutline class="w-4 h-4 text-green-500 dark:text-green-400" />
          </Button>
        </ButtonGroup>
        {/each}
      </Label>
    </div>

    <ButtonGroup>
      {#if steps.length > 1}
      <Button on:click={() => (steps = [...steps.slice(0, idx), ...steps.slice(idx + 1)])} >
          <MinusOutline class="w-8 h-8 text-green-500 dark:text-green-400" />
      </Button>
      {/if}
      <Button on:click={() => steps = [...steps, { name: '', photos: [''], time_step: '' }]}>
          <PlusOutline class="w-8 h-8 text-green-500 dark:text-green-400" />
      </Button>
    </ButtonGroup>
    <hr />
  {/each}
</Label>

<Button type="submit" class="w-full">Создать</Button>
</form>
