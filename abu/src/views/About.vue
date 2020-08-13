<template>
  <div class="about">
    <ssh-alive />
    <address-input />
    <pulse-output />
    <activate-gpio />
    <shutdown />
  </div>
</template>
<script>
import ActivateGpio from "@/components/ActivateGpio.vue";
import SshAlive from "@/components/SshAlive.vue";
import PulseOutput from "@/components/Pulse.vue";
import AddressInput from "@/components/Address.vue";
import Shutdown from "@/components/Shutdown.vue";
import * as child from "child_process";
// const exec = require("child_process");
import axios from "axios";
export default {
  components: {
    SshAlive,
    AddressInput,
    PulseOutput,
    ActivateGpio,
    Shutdown,
  },
};
</script>
