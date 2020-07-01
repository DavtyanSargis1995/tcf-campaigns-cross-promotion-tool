<template>
  <transition name="fade">
    <div class="dialog-mask" v-show="visible" @click.self="close">
      <div class="dialog">
        <form @submit.prevent="save" novalidate>
          <div class="dialog-header">
            <slot name="header">
              default header
            </slot>
          </div>
          <hr class="line my-5">
          <div class="dialog-body">
            <slot name="body">
              default body
            </slot>
          </div>
          <hr class="line my-4">
          <div class="dialog-footer">
            <div class="d-flex justify-content-between">
              <Button :handler="close" class="btn-purple-link" button-type="button" text="Cancel" />
              <Button class="btn-outline-primary px-4" text="Save"/>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from './Form/Button';
export default {
  components: {
    Button
  },
  props: {
    save: Function,
    close: Function
  },
  computed: {
    visible () {
      return this.$store.getters['modal/isOpen'];
    }
  }
};
</script>

<style lang="scss">
  @import "../../assets/styles/dialog";
</style>
