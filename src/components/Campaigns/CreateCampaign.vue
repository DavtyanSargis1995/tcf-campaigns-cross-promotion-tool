<template>
  <Button :handler="showModal" class="btn-purple mr-3" text="Create" />
</template>

<script>
import Button from '../UI/Form/Button';
export default {
  components: {
    Button
  },
  methods: {
    showModal () {
      this.$store.commit('modal/toggleModal');
    }
  }
};
</script>
