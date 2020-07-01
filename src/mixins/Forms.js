import Card from '../components/UI/Card';
import Button from '../components/UI/Form/Button';
import Input from '../components/UI/Form/Input';

export const mixin = {
  components: {
    Button,
    Input,
    Card
  },
  data () {
    return {
      email: '',
      password: '',
      inputFields: null
    };
  },
  computed: {
    user () {
      return this.$store.getters['user/user'];
    },
    status () {
      return this.$store.getters['user/status'];
    },
    errorMessage () {
      return this.$store.getters.error;
    }
  },
  beforeMount () {
    this.inputFields = [
      {
        fieldName: 'email',
        type: 'email',
        label: 'Enter your email',
        errorMessages: {
          required: 'Field is required',
          email: 'Must be a valid email'
        }
      }
    ];
    if (this.$route.name !== 'ResetPass') {
      this.inputFields = [
        ...this.inputFields,
        {
          fieldName: 'password',
          icon: 'eye-slash',
          type: 'password',
          label: 'Enter your password',
          errorMessages: {
            required: 'Field is required',
            minLength: `Password must have at least ${this.$v.password.$params.minLength.min} characters.`
          }
        }
      ];
    }
  },
  destroyed () {
    this.$store.commit('user/setStatus', '');
  },
  methods: {
    onInput (newValue, field) {
      this[field] = newValue;
      this.$v[field].$touch();
    },
    onTogglePassword (icon, fieldName) {
      const newIcon = icon === 'eye' ? 'eye-slash' : 'eye';
      const type = icon === 'eye' ? 'password' : 'text';
      this.inputFields = [...this.inputFields.map(item => {
        if (item.fieldName === fieldName) {
          item.icon = newIcon;
          item.type = type;
        }
        return item;
      })];
    }
  }
};
