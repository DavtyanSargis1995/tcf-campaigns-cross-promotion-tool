<template>
  <div class="card" :style="{maxWidth: maxWidth+'px'}">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
  .card {
    background: #fff;
    box-shadow: 0 18px 23px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    margin: 0 auto;
    padding: 50px 60px;
  }
</style>

<script>
export default {
  props: {
    maxWidth: String
  }
};
</script>
