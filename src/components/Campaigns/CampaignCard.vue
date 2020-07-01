<template>
  <div class="col-4">
    <article class="card p-3 mb-5 text-left">
      <header class="card-header">
        <img :src="item.imageUrl" alt="campaign image" class="main-img" v-if="item.imageUrl">
        <img src="../../assets/images/no-image.jpg" alt="no image" class="main-img" v-else>
        <div class="card-info d-flex justify-content-between align-items-center">
          <div>
            <small>backers</small>
            <p class="backers-number">{{item.backers}}</p>
          </div>
          <div class="d-flex">
            <span v-if="item.state" :class="{'state': true, [item.state]: item.state}">
              {{ item.state }}
            </span>
            <img class="logo" src="https://www.smallpressexpo.com/wp-content/uploads/2019/08/fc86b34bc152b3c58d6dfaf90e886bc3.png" alt="">
          </div>
        </div>
      </header>
      <div class="card-body pb-4">
        <h3 class="mt-3 mb-2">
          <a v-if="item.url" :href="item.url" target="_blank">{{item.title}}</a>
          <span v-else>{{item.title}}</span>
        </h3>
        <small>by {{item.authorName}}</small>
        <p class="mt-5">{{item.description}}</p>
      </div>
      <footer class="card-footer d-flex justify-content-between pt-4" v-if="userIsAuthor">
        <div class="d-flex justify-content-center wave">
          <img src="../../assets/images/edit.svg" alt="" @click="showModal(item.id)">
        </div>
        <div class="d-flex justify-content-center wave">
          <img src="../../assets/images/trash.svg" alt="" @click="showConfirm">
        </div>
      </footer>
    </article>
    <Confirm :visible="visible" :close="close" :confirm="deleteCampaign">
      <div slot="header">
        Are you sure you want to delete this campaign ?
      </div>
    </Confirm>
  </div>
</template>

<script>

export default {
  components: {
    Confirm: () => import('../UI/Confirm')
  },
  props: {
    item: Object
  },
  data () {
    return {
      visible: false
    };
  },
  computed: {
    campaigns () {
      return this.$store.getters['campaigns/campaigns'];
    },
    userIsAuthor () {
      return this.$store.getters['user/user'].id === this.item.authorId;
    }
  },
  methods: {
    showModal (itemId) {
      const item = this.campaigns.find(item => item.id === itemId);
      this.$store.commit('campaigns/setCampaign', { ...item, changed: false });
      setTimeout(() => {
        this.$store.commit('modal/toggleModal');
      }, 0);
    },
    deleteCampaign () {
      this.$store.dispatch('campaigns/deleteCampaign', { id: this.item.id, filename: this.item.filename });
    },
    showConfirm () {
      this.visible = true;
    },
    close () {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/colors";
  .card {
    background: #fff;
    -webkit-box-shadow: 0 0 35px rgba(154,161,171,.45);
    box-shadow: 0 0 35px rgba(154,161,171,.45);
    border-radius: 10px;
    transition: .4s;
    &:hover {
      transform: translateY(-8px);
    }
    .card-header {
      position: relative;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      overflow: hidden;
      height: 300px;
      .backers-number {
        font-weight: 900;
      }
      .state {
        text-align: center;
        display: block;
        padding: 3px 5px;
        background-color: $purple;
        margin-right: 10px;
        border-radius: 3px;
        &.indemand {
          background-color: $purple;
        }
        &.live {
        background-color: rgba(10,207,151,.6)
        }
        .funding {
          background: rgba(10,207,151,.6);
        }
        .funding,.live {
          background: rgba(10,207,151,.6);
        }
        .soon {
          background: rgba(242,201,76,.6);
        }

        .canceled {
          background: rgba(141,160,169,.6);
        }

        .ended {
          background: rgba(250,92,124,.6);
        }
      }
      .main-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-info{
        position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        color: #fff;
        padding: 10px;
        p {
          color: #fff;
        }
        .logo {
          width: 30px;
        }
      }
    }
    .card-body {
      border-bottom: 1px solid rgba(141, 160, 169, 0.5);
      h3 {
        color: $gray-dark;
        a {
          color: #4687f4;
        }
      }
    }
    .card-footer {
      .wave {
        width: 30px;
        height: 30px;
        background: $gray-lighter;
        border-radius: 50%;
        transition: .4s;
        &:hover {
          background: $gray-light;
        }
        img {
          width: 15px;
          cursor: pointer;
        }
      }
    }
  }

  .card-container {
    width: 300px;
  }
</style>
