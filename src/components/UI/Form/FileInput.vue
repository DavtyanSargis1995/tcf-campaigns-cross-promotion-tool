<template>
  <div class="file-uploader">
    <span v-if="imageUrl" class="remove-pic" @click="removeUploadedPic">&#10006;</span>
    <label>
      <div class="rectangle">
        <img v-if="imageUrl" :src="imageUrl" alt="" class="uploaded-image">
        <div class="content d-flex flex-column justify-content-center align-items-center" :class="{transparent: imageUrl}">
          <img src="../../../assets/images/cloud-upload.svg" alt="">
          <small class="d-block mt-2">Upload your pic in <br> JPG or PNG format</small>
        </div>
      </div>
      <input @change="showImage($event)" type="file" name="img" accept="image/jpeg, image/png, image/jpg">
      <small class="d-block mt-3 text-center">
        <span :class="{error: fileSizeError}">Max. file size 500kb.</span> <br>ratio 1x1 format</small>
    </label>
  </div>
</template>

<style scoped lang="scss">
  @import "../../../assets/styles/colors";
  .file-uploader{
    .remove-pic {
      cursor: pointer;
      position: absolute;
      top: -25px;
      font-size: 20px;
      right: 0;
    }
    .uploaded-image {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      object-fit: cover;
    }
    .rectangle{
      cursor: pointer;
      width: 100%;
      padding-top: 100%;
      position: relative;
      .content{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: $gray-lighter;
        &.transparent {
          background-color: rgba(34,34,34,0.8);
          color: $white;
          opacity: 0;
          transition: .5s;
        }
      }
      &:hover {
        .content {
          &.transparent {
            opacity: 1;
          }
        }
      }
    }
    input {
      display: none;
    }
  }
</style>

<script>
export default {
  data () {
    return {
      imageUrl: '',
      fileSizeError: false,
      image: null
    };
  },
  props: {
    imageSource: String
  },
  computed: {
    modalIsOpen () {
      return this.$store.getters['modal/isOpen'];
    }
  },
  watch: {
    imageSource (newValue) {
      this.imageUrl = newValue;
    },
    modalIsOpen (newVal) {
      if (!newVal) {
        this.imageUrl = '';
      }
    }
  },
  methods: {
    showImage (event) {
      const input = event.target;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        if (input.files[0].size / 1000 > 500) {
          this.fileSizeError = true;
          return;
        }
        this.fileSizeError = false;

        reader.onload = (event) => {
          this.imageUrl = event.target.result;
        };

        reader.readAsDataURL(input.files[0]); // convert to base64 string
        this.$store.commit('campaigns/setCampaign', { image: input.files[0] });
      }
    },
    removeUploadedPic () {
      this.imageUrl = '';
      this.$store.commit('campaigns/setCampaign', { image: null, imageUrl: '' });
    }
  }
};
</script>
