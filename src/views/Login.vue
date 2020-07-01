<template>
  <Card max-width="450" v-if="!loading">
    <p v-if="status && !emailVerified" class="alert alert-danger">Please verify your email</p>
    <p class="alert alert-danger" v-if="errorMessage">{{errorMessage}}</p>
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="heading text-center">
        <h1>Login</h1>
      </div>
      <hr class="line my-5">
      <Input
        v-for="field in inputFields"
        :icon="field.icon"
        :key="field.fieldName"
        :type="field.type"
        :field-name="field.fieldName"
        :label="field.label"
        :error="$v[field.fieldName].$dirty && $v[field.fieldName].$error"
        :value="[field.fieldName]"
        @input="(newName)=>onInput(newName, field.fieldName)"
        @showPassword="(icon)=>onTogglePassword(icon, field.fieldName)"
      >
        <p class="error text-left mb-2" v-for="(message,index) in field.errorMessages" :key="index">
          <small v-if="$v[field.fieldName].$dirty && !$v[field.fieldName][index]">{{message}}</small>
        </p>
      </Input>
      <p class="forgot-password text-right mt-2">
        <router-link to="/reset-password" class="link">Forgot password?</router-link>
      </p>
      <Button class="btn-purple btn-large" text="Login" />
      <router-link to="/signup" class="link d-block mt-4">Create new account</router-link>
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
import { required, minLength, email } from 'vuelidate/lib/validators';

library.add(faEye, faEyeSlash);

export default {
  mixins: [mixin],
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  computed: {
    emailVerified () {
      return this.$store.getters['user/emailVerified'];
    },
    loading () {
      return this.$store.getters.loading;
    }
  },
  methods: {
    handleSubmit () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.onLogin();
    },
    onLogin () {
      this.$store.dispatch('user/signUserIn', { email: this.email, password: this.password });
    }
  }
};
</script>
