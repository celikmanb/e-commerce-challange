<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card class="elevation-12">
          <v-card-title>Login</v-card-title>
          <form ref="form" @submit.prevent="login()">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="email"
                name="email"
                label="Email"
                type="text"
                placeholder="email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="password"
                name="password"
                label="Password"
                type="password"
                placeholder="password"
                required
              ></v-text-field>
            </v-col>
            <v-card-actions>
              <v-spacer />
              <v-btn type="submit" class="mt-4" color="primary" value="log in"
                >Login</v-btn
              >
            </v-card-actions>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["setLoginRequest","setUserInformation"]),
    async login() {
      let temp = await this.setLoginRequest({
        email: this.email,
        password: this.password,
      });
      if (temp?.AccessToken) {
        let token = await this.setUserInformation({email: this.email})
        if (token) {
          this.$router.push('/dashboard');
        }
      }
    },
  },
};
</script>

<style>
</style>