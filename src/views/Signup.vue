<template>
  <Card max-width="450">
    <p class="alert alert-danger" v-if="errorMessage">{{errorMessage}}</p>
    <form @submit.prevent="handleSubmit" novalidate v-if="!status">
      <div class="heading text-center">
        <h1>Sign Up</h1>
        <p>New to CorssProm?</p>
      </div>
      <hr class="line my-4">
      <p class="mb-3">Create an account! It won't take long.</p>
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

      <Button class="btn-purple btn-large" text="Signup" />
      <div class="text-small text-center ">
        <span class="d-block my-4">By clikcing Sign Up you accept <a href="#" class="link">Terms and Conditions</a></span>
        <router-link to="/login" class="link d-block mt-4">Already have an account?</router-link>
      </div>
    </form>
    <div v-else class="alert alert-success">
      Please confirm your email, then <router-link to="/login" class="link" style="font-size: 16px">Sign in</router-link>
    </div>
  </Card>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { mixin } from '../mixins/Forms';

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
library.add(faEye, faEyeSlash);

export default {
  mixins: [mixin],
  data () {
    return {
      name: '',
      repeatPassword: ''
    };
  },
  beforeMount () {
    this.inputFields = [
      {
        fieldName: 'name',
        type: 'text',
        label: 'Enter your name',
        errorMessages: {
          required: 'Field is required',
          minLength: `Name must have at least ${this.$v.name.$params.minLength.min} characters.`
        }
      },
      ...this.inputFields,
      {
        fieldName: 'repeatPassword',
        icon: 'eye-slash',
        type: 'password',
        label: 'Repeat your password',
        errorMessages: {
          sameAsPassword: 'Passwords must be identical.'
        }
      }
    ];
  },
  methods: {
    handleSubmit () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.onSignup();
    },
    onSignup () {
      this.$store.dispatch('user/signUserUp', { email: this.email, password: this.password, name: this.name });
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  }
};
</script>
