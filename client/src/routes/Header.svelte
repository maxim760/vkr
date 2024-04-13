<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/logo.png';
	import exit from '$lib/images/exit.png';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query'
	import { authApi } from 'src/api/services/auth/authService';
	import { goto } from '$app/navigation';
	import { tokenService } from 'src/utils/config/tokens';
	import { userStore } from 'src/stores/userStore';
	import { HeartSolid, ReceiptSolid, SearchSolid, UserSettingsSolid } from 'flowbite-svelte-icons';

	const queryClient = useQueryClient();

	const mutation = createMutation({
		mutationFn: () => authApi.logout(),
		onSuccess: () => {
			goto("/login");
			tokenService.removeAccessToken();
			userStore.clearUser();
			queryClient.invalidateQueries();

		}
	})

	const logout = () => {
		$mutation.mutate();
	}

	const links = [
		{ title: 'Все рецепты', href: '/', icon: ReceiptSolid },
		{ title: 'Избранные', href: '/like', icon: HeartSolid },
		{ title: 'Поиск', href: '/search', icon: SearchSolid },
		{ title: 'Настройки', href: '/settings', icon: UserSettingsSolid },
	]
</script>

<header>
	<div class="corner">
		<div>
			<img src={logo} alt="SvelteKit" />
		</div>
	</div>
	<nav class="desktop">
		<svg viewBox="0 0 2 3" aria-hidden="true"><path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" /></svg>
		<ul>
			{#each links as link}
				<li aria-current={$page.url.pathname === link.href ? 'page' : undefined}>
					<a href={link.href}>{link.title}</a>
				</li>
			{/each}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true"><path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" /></svg>
	</nav>
	<nav class="mobile">
		<ul>
			{#each links as link}
				<li aria-current={$page.url.pathname === link.href ? 'page' : undefined}>
					<a href={link.href}><svelte:component this={link.icon} color={$page.url.pathname === link.href ? 'red' : undefined} /></a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="corner">
		<div class="out" on:click={logout} on:keydown tabindex="0" role="button">
			<img src={exit} alt="login" />
		</div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.out {
		cursor: pointer;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner div {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.mobile {
		display: none;
	}

	@media (max-width: 720px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: block;
			width: 100%;
		}
		.mobile ul {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
		}
		.mobile ul > * {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.corner {
			display: none;
		}
	}
</style>
