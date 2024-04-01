<script lang="ts">
	import '../app.pcss';
	import './styles.css';

  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { browser } from '$app/environment';
  import { SvelteEasyToast, toast } from 'svelte-easy-toast';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })
</script>

<QueryClientProvider client={queryClient}>
  <div>
    <slot />
  </div>
  <SvelteEasyToast />
</QueryClientProvider>
