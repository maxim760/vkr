<script lang="ts">
    import { Card, Button, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
    import { toasts }  from "svelte-toasts";

    import { createMutation } from '@tanstack/svelte-query'
	import { authApi } from '$api/services/auth/authService';
	import type { LoginUserDto } from '$api/services/auth/dto';
	import { toastEvents } from 'src/utils/functions/showToast';
	import { getBaseUrl } from 'src/utils/config/config';
	import { userStore } from 'src/stores/userStore';
	import { tokenService } from 'src/utils/config/tokens';
	import { goto } from '$app/navigation';
    let email = '';
    let password = '';
    const mutation = createMutation({ 
      mutationFn: (data: LoginUserDto) => authApi.login(data),
      onSuccess: (res) => {
        toastEvents.success();
        userStore.setUser(res.user);
        tokenService.setAccessToken(res.accessToken);
        goto('/')
      },
      onError: () => toastEvents.error(),
    })

    const onSubmit = () => {
      $mutation.mutate({ email, password })
    }
</script>

<form class="flex flex-col space-y-6" on:submit|preventDefault={onSubmit}>
  <h3 class="text-xl font-medium text-gray-900 dark:text-white">Вход</h3>
  <Label class="space-y-2">
    <span>Почта</span>
    <Input bind:value={email} id="login" autocomplete="userName" type="email" name="email" placeholder="name@company.com" required />
  </Label>
  <Label class="space-y-2">
    <span>Пароль</span>
    <Input bind:value={password} autocomplete="current-password" id="current-password" type="password" name="password" placeholder="" required />
  </Label>
  <Button type="submit" class="w-full">Войти в аккаунт</Button>
  <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
    Не зарегистрированы? <a href="/signup" class="text-primary-700 hover:underline dark:text-primary-500"> Создать аккаунт </a>
  </div>
</form>
