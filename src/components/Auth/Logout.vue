<template>
  <Button :handler="logout" class="btn-outline-primary px-4" text="Logout"/>
</template>

<script>
import Button from '../UI/Form/Button';
export default {
  components: {
    Button
  },
  methods: {
    logout () {
      this.$store.dispatch('user/logout');
    }
  }
};
</script>
