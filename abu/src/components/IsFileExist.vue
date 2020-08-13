<template>
  <div>
    <v-text-field v-model="path"></v-text-field>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      path: "",
    };
  },
  methods: {},
});
</script>
