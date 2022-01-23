<script>
  export let steps; // prop
  export let stepName; // prop
</script>

<div>
  {#if steps[stepName].state === steps.STATES.BLANK}
    <div>
      <p>blank {stepName}</p>
    </div>
  {/if}
  {#if steps[stepName].state === steps.STATES.LOADING}
    <div>
      <p>loading {stepName}</p>
    </div>
  {/if}
  {#if steps[stepName].state === steps.STATES.ERROR}
    <div>
      <p>error {stepName}: {steps[stepName].error}</p>
    </div>
  {/if}
  {#if steps[stepName].state === steps.STATES.LOADED}
    <!-- loaded state markup -->
     <slot></slot>
  {/if}
</div>