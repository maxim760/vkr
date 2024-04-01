<script>
  import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
</script>

<div class='container'>
  <Card>
    <slot />
  </Card>
</div>

<style>
  .container {
    padding: 1rem;
    min-height: 100vh;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    margin: auto;
  }
</style>