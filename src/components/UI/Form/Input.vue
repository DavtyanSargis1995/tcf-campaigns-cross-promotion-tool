<template>
  <div class="mb-3">
    <div v-if="type!=='textarea'" :class="{'form-group': true, 'form-group-error error': error}">
      <input :type="type" class="form-input" v-model="value" required />
      <span class="highlight"></span>
      <label>{{label}}</label>
      <font-awesome-icon class="icon" v-if="icon" :icon="icon" @click="showPassword" />
    </div>
    <div v-else :class="{'form-group': true, 'form-group-error error': error}">
      <textarea class="form-input" v-model="value" required></textarea>
      <span class="highlight"></span>
      <label>{{label}}</label>
    </div>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    outerValue: String,
    label: String,
    placeholder: String,
    error: Boolean,
    icon: String,
    fieldName: String
  },
  data () {
    return {
      value: ''
    };
  },
  watch: {
    value () {
      this.$emit('input', this.value);
    },
    outerValue (newVal) {
      this.value = newVal;
    }
  },
  methods: {
    showPassword () {
      this.$emit('showPassword', this.icon);
    }
  }
};
</script>

<style scoped lang="scss">
  @import '../../../assets/styles/colors';
  .icon {
    right: 10px;
    position: absolute;
    top: 10px;
    cursor: pointer;
  }

  .form-group{
    border: 1px solid #C7C4C4;
    border-radius: 5px;
    position: relative;
    &.form-group-error {
      border: 1px solid rgba(250,92,124,.7);
      label {
        background: #fff;
        font-size: 12px;
        color: rgba(250,92,124,.7);
        top: -10px;
      }
    }
    input,
    textarea {
      background: none;
      color: $gray;
      font-size: 16px;
      padding: 15px 20px;
      display: block;
      width: 100%;
      border: none;
      &:focus {
        outline: none;
      }
      &:focus ~ label,
      &:valid ~ label {
        top: -10px;
        background: #fff;
        font-size: 12px;
        color: $hl-color;
      }
    }

    textarea {
      min-height: 150px;
    }

    input[type="password"] {
      letter-spacing: 0.3em;
    }

    label {
      color: #c6c6c6;
      font-size: 13px;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      padding: 0 10px;
      top: 10px;
      left: 10px;
      transition: .3s ease all;
    }
  }

</style>
