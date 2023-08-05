<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">EVA</div>
    </v-app-bar>

    <v-main>
      <v-overlay :opacity="0.7" :value="$store.state.loading" :absolute="true">
        <v-progress-circular indeterminate size="128">
          ...Loading
        </v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
