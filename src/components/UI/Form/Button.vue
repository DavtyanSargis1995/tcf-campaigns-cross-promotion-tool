<template>
  <button ref="button" :type="buttonType" class="btn">{{text}}</button>
</template>

<script>
export default {
  props: {
    text: String,
    handler: Function,
    buttonType: String
  },
  mounted () {
    if (this.handler) {
      this.$refs.button.addEventListener('click', this.handler);
    }
  }
};
</script>
