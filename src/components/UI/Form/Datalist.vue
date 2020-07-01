<template>
  <div class="datalist-holder">
    <Input :outer-value="val"
           type="text"
           list="newssources-list"
           @input="(newName)=>onInput(newName, 'val')"
           name="source-selection"
           :label="label"
           id="source-selection"
           class="form-control"
           :error="$v.val.$dirty && ($v.val.$error || !campaign.title)"
           placeholder="Please specify news source ...">
      <p class="error text-left mb-2" >
        <small v-if="$v.val.$dirty && ($v.val.$error || !campaign.title)">
          Please select one of the search results from the dropdown
        </small>
      </p>
    </Input>
    <datalist id="newssources-list" v-show="visible" :class="{'hidden' : !data.length}">
      <option
        v-for="item in data"
        @click="setOption(item)"
        :label="item[fieldName]"
        :key="item.id"
      ></option>
    </datalist>
  </div>
</template>

<script>
import Input from './Input';
import { required } from 'vuelidate/lib/validators';

export default {
  components: {
    Input
  },
  data () {
    return {
      val: '',
      visible: false
    };
  },
  validations: {
    val: {
      required
    }
  },
  props: {
    data: Array,
    getData: Function,
    fieldName: String,
    selectedOption: Object,
    label: String,
    setItem: Function
  },
  computed: {
    campaign () {
      return this.$store.getters['campaigns/campaign'];
    }
  },
  watch: {
    selectedOption (newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        this.val = newValue[this.fieldName];
        this.visible = false;
      }
    }
  },
  methods: {
    setOption (item) {
      this.visible = false;
      this.val = item[this.fieldName];
      this.setItem(item);
    },
    onInput (newValue, field) {
      if (newValue.length < 3) {
        return;
      }
      if (!this.campaign.changed) {
        this.setItem({ changed: true });
        return;
      }
      const selectedFromList = this.data.find(item => item[this.fieldName] === newValue);
      if (selectedFromList) {
        this.visible = false;
      } else {
        this.visible = true;
        this.setItem({ hitId: null, [this.fieldName]: '' });
      }
      this.val = newValue;
      this.$v[field].$touch();
      this.handleSearch();
    },
    handleSearch () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getData({ [this.fieldName]: this.val });
      }, 800);
    },
    touchDatalist () {
      this.$v.val.$touch();
    },
    reset () {
      this.val = '';
      setTimeout(() => {
        this.$v.$reset();
      }, 0);
    }
  }
};
</script>
<style lang="scss">
  @import '../../../assets/styles/colors';

  .datalist-holder {
    position: relative;
    #newssources-list {
      display: block;
      position: absolute;
      background: #fff;
      z-index: 2;
      width: 100%;
      border: 1px solid $gray-border;
      max-height: 200px;
      margin-top: -10px;
      overflow-y: auto;
      &.hidden {
        display: none;
      }
      option {
        padding: 10px;
        cursor: pointer;
        white-space: pre-line;
        &:hover {
          background: #b6d7e2;
        }
      }
    }
  }

</style>
