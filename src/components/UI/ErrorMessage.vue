<template>
  <div class="alert alert-danger error-message">
    Something went wrong !!!
  </div>
</template>

<style lang="scss">
  .error-message {
    position: absolute;
    top: 100px;
    animation: showErrorMessage 6s;
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.320, 1.275);
    animation-fill-mode: forwards;
    z-index: 100;
  }

  @keyframes  showErrorMessage {
    20%{
      transform: scale(1);
    }
    80% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
</style>

export default {

}
