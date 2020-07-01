<template>
  <div class="container">
    <add-campaign />
    <div class="row" v-if="campaigns.length">
      <campaign v-for="item in campaigns" :key="item.id" :item="item"/>
    </div>
    <div v-else-if="!loading && !campaigns.length">
      <h3>There aren't added campaigns yet.</h3>
    </div>
  </div>
</template>

<script>
import Campaign from '../components/Campaigns/CampaignCard';
import AddCampaign from '../components/Campaigns/SaveCampaign';

export default {
  components: {
    Campaign,
    AddCampaign
  },
  mounted () {
    this.$store.dispatch('campaigns/loadCampaigns');
  },
  computed: {
    campaigns () {
      return this.$store.getters['campaigns/campaigns'];
    },
    loading () {
      return this.$store.getters.loading;
    }
  }
};
</script>
