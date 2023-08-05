<template>
  <div class="home">
    <login-view />
  </div>
</template>

<script>
import LoginView from './LoginView.vue'
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    LoginView
  }
}
</script>
