<template>
  <Card max-width="450">
    <p v-if="res" class="alert alert-success">Password resset link sent to you email</p>
    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="heading">
        <h1>Reset Password</h1>
      </div>
      <hr class="line my-5">
      <Input
        type="email"
        field-name="email"
        label="Enter your email"
        :error="$v.email.$dirty && $v.email.$error"
        value="email"
        @input="(newName)=>onInput(newName, 'email')"
      >
        <p class="error text-left mb-2" v-for="(message,index) in errorMessages" :key="index">
          <small v-if="$v.email.$dirty && !$v.email[index]">{{message}}</small>
        </p>
      </Input>
      <Button class="btn-purple btn-large" text="Submit" />
      <router-link to="/signup" class="link d-block mt-4">Create new account</router-link>
      <router-link to="/login" class="link d-block mt-4">Login</router-link>
    </form>
  </Card>
</template>

<style>
  .forgot-password {
    font-size: 11px;
  }
</style>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { mixin } from '../mixins/Forms';
import { required, email } from 'vuelidate/lib/validators';

library.add(faEye, faEyeSlash);

export default {
  mixins: [mixin],
  validations: {
    email: {
      required,
      email
    }
  },
  data () {
    return {
      errorMessages: {
        required: 'Field is required',
        email: 'Must be a valid email'
      },
      res: ''
    };
  },
  methods: {
    handleSubmit () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.resetPassword();
    },
    async resetPassword () {
      this.res = await this.$store.dispatch('user/resetPasswordWithEmail', { email: this.email });
    }
  }
};
</script>
