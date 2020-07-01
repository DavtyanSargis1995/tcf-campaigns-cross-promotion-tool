<template>
  <Dialog :is-visible="visible" :save="saveCampaign" :close="close">
    <div class="heading" slot="header">
      <h3 class="mb-4">Add cross-promotion information</h3>
      <p>
        Add cross-promotion information that your partner <br>
        campaigns are to post in their updates. You can always edit <br>
        this information to adjust it to your needs.
      </p>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-12 col-lg-4">
          <file-input :image-source="campaign.imageUrl"/>
        </div>
        <div class="col-12 col-lg-6">
          <Data-list
            ref="datalist"
            label="Search campaign by title"
            field-name="title"
            :getData="getCampaignsTitlesList"
            :data="campaignsTitlesList"
            :selected-option="{ hitId, title }"
            :setItem="setItem"
          />
          <Input
            type="textarea"
            label="Description"
            :error="$v.description.$dirty && $v.description.$error"
            :outer-value="description"
            @input="(newName)=>onInput(newName, 'description')"
          >
            <p class="error text-left mb-2" v-for="(message,index) in errorMessages" :key="index">
              <small v-if="$v.description.$dirty && !$v.description[index]">{{message}}</small>
            </p>
          </Input>
          <Input
            type="text"
            label="Url (Optional)"
            :outer-value="url"
            :error="$v.url.$dirty && $v.url.$error"
            @input="(newName)=>onInput(newName, 'url')"
          >
            <p class="error text-left mb-2">
              <small v-if="$v.url.$dirty && $v.url.$error">Please fill in a valid URL</small>
            </p>
          </Input>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
  @import "../../assets/styles/colors";
  .heading {
    h3 {
      color: $gray-heading;
      font-weight: bold;
      font-size: 27px;
      line-height: 35px;
    }
    p {
      line-height: 23px;
    }
  }
</style>

<script>
import FileInput from '../UI/Form/FileInput';
import Input from '../UI/Form/Input';
import DataList from '../UI/Form/Datalist';
import { required, minLength, maxLength, url } from 'vuelidate/lib/validators';

export default {
  name: 'add-campaign',

  data () {
    return {
      description: '',
      url: '',
      hitId: null,
      title: '',
      errorMessages: null
    };
  },
  components: {
    DataList,
    Dialog: () => import('../UI/Dialog'),
    FileInput,
    Input
  },
  computed: {
    campaignsTitlesList () {
      return this.$store.getters['campaigns/campaignsTitlesList'];
    },
    campaign () {
      return this.$store.getters['campaigns/campaign'];
    },
    modalIsOpen () {
      return this.$store.getters['modal/isOpen'];
    }
  },
  props: ['visible'],
  validations: {
    description: {
      required,
      minLength: minLength(20),
      maxLength: maxLength(80)
    },
    url: {
      url
    }
  },
  watch: {
    modalIsOpen (newVal) {
      if (!newVal) {
        this.$nextTick(() => { this.$v.$reset(); });
        this.description = '';
        this.url = '';
        this.$refs.datalist.reset();
      }
    },
    'campaign.url': function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.url = newVal;
      }
    },
    'campaign.description': function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.description = newVal;
      }
    },
    'campaign.title': function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.title = newVal;
      }
    },
    'campaign.hitId': function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.hitId = newVal;
      }
    }
  },
  beforeMount () {
    this.errorMessages = {
      required: 'Field is required',
      minLength: `Description must have at least ${this.$v.description.$params.minLength.min} characters.`,
      maxLength: `Description must have at most ${this.$v.description.$params.maxLength.max} characters.`
    };
  },
  methods: {
    onInput (newValue, field) {
      this[field] = newValue;
      this.$v[field].$touch();
    },
    getCampaignsTitlesList (payload) {
      this.$store.dispatch('campaigns/loadCampaignsTitles', payload);
    },
    setItem (payload) {
      this.$store.commit('campaigns/setCampaign', payload);
    },
    saveCampaign () {
      this.$v.$touch();
      this.$refs.datalist.touchDatalist();
      if (this.$v.$invalid) {
        return;
      }
      this.setItem({ description: this.description, url: this.url });
      this.$store.dispatch('campaigns/saveCampaign');
    },
    close () {
      this.$store.commit('campaigns/resetCampaign');
      this.$store.commit('modal/toggleModal');
    }
  }
};
</script>
