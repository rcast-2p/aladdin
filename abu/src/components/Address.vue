<template>
  <div>
    <h1>Connected to {{ $store.state.address }}</h1>
    <v-text-field label="address" v-model="address"></v-text-field>
    <v-btn @click="$store.commit('set_address', address)">Set</v-btn>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  created() {
    this.$store.commit("setAddress", "");
  },
  data() {
    return {
      address: "",
    };
  },
});
</script>
