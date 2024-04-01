<script lang="ts">
  import { Card, Button, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
	import { authApi } from '../../../api/services/auth/authService';
  import { createMutation } from '@tanstack/svelte-query'
	import type { RegisterUserDto } from '$api/services/auth/dto';
	import { toastEvents } from 'src/utils/functions/showToast';

  let email = '';
  let displayName = '';
  let password = '';

  const mutation = createMutation({ 
      mutationFn: (data: RegisterUserDto) => authApi.register(data),
      onSuccess: () => toastEvents.success(),
      onError: () => toastEvents.error(),
    })

    const onSubmit = () => {
      $mutation.mutate(
        { user:  {email, password, displayName} }
        )
    }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
<h3 class="text-xl font-medium text-gray-900 dark:text-white">Регистрация</h3>
<Label class="space-y-2">
  <span>Почта</span>
  <Input bind:value={email} type="email" name="email" placeholder="name@company.com" required />
</Label>
<Label class="space-y-2">
  <span>Отображаемое имя</span>
  <Input bind:value={displayName} type="text" name="displayName" required />
</Label>
<Label class="space-y-2">
  <span>Пароль</span>
  <Input bind:value={password} autocomplete="new-password" id="new-password" type="password" name="password" placeholder="" required />
</Label>
<Button type="submit" class="w-full">Зарегистрироваться</Button>
<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
  Зарегистрированы? <a href="/login" class="text-primary-700 hover:underline dark:text-primary-500"> Войти в аккаунт </a>
</div>
</form>
