<template>
  <div>
    <v-snackbar
      v-model="visible"
      :color="color"
      :timeout="2000"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    message: {
      type: String,
    },
    color: {
      type: String
    }
  }
};
</script>

<style>
</style>