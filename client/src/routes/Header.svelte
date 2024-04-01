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
</script>

<header>
	<div class="corner">
		<div>
			<img src={logo} alt="SvelteKit" />
		</div>
	</div>

	<nav class="desktop">
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Все рецепты</a>
			</li>
			<li aria-current={$page.url.pathname === '/like' ? 'page' : undefined}>
				<a href="/like">Избранные</a>
			</li>
			<li aria-current={$page.url.pathname === '/search' ? 'page' : undefined}>
				<a href="/search">Поиск</a>
			</li>
			<li aria-current={$page.url.pathname === '/settings' ? 'page' : undefined}>
				<a href="/settings">Настройки</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<nav class="mobile">
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/"><ReceiptSolid color={$page.url.pathname === '/' ? 'red' : undefined}  /></a>
			</li>
			<li aria-current={$page.url.pathname === '/like' ? 'page' : undefined}>
				<a href="/like"><HeartSolid color={$page.url.pathname === '/like' ? 'red' : undefined} /></a>
			</li>
			<li aria-current={$page.url.pathname === '/search' ? 'page' : undefined}>
				<a href="/search"><SearchSolid color={$page.url.pathname === '/search' ? 'red' : undefined}  /></a>
			</li>
			<li aria-current={$page.url.pathname === '/settings' ? 'page' : undefined}>
				<a href="/settings"><UserSettingsSolid color={$page.url.pathname === '/settings' ? 'red' : undefined}  /></a>
			</li>
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
