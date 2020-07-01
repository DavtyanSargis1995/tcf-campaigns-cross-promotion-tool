<template>
  <transition name="fade">
    <div class="dialog-mask" v-show="visible" @click.self="close">
      <div class="dialog confirm">
        <div class="dialog-header">
          <slot name="header">
            default header
          </slot>
        </div>
        <hr class="line my-4">
        <div class="dialog-footer">
          <div class="d-flex justify-content-between">
            <Button :handler="close" class="btn-purple-link" button-type="button" text="Cancel" />
            <Button :handler="confirm" class="btn-outline-primary px-4" text="Confirm"/>
          </div>
        </div>
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
    confirm: Function,
    close: Function,
    visible: Boolean
  }
};
</script>

<style lang="scss">
  @import "../../assets/styles/dialog";
</style>
