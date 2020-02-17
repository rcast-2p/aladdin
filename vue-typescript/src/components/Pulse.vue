<template>
  <v-form ref="form">
    <v-text-field
      v-model="count"
      label="何往復するか?"
      type="number"
      required
    ></v-text-field>
    <v-text-field
      v-model="pulse_width"
      label="パルス幅μs)"
      type="number"
      required
    ></v-text-field>
    <v-text-field
      v-model="pulse_interval"
      label="パルスの休み幅(μs)"
      type="number"
      required
    ></v-text-field>
    <v-text-field
      v-model="pgonum"
      label="行き(スキャン時)のパルス数"
      type="number"
      required
    ></v-text-field>
    <v-text-field
      v-model="pbacknum"
      label="帰りのパルス数"
      type="number"
      required
    ></v-text-field>
    <v-text-field
      v-model="pulsed"
      label="パルスコントロールファイル"
      required
    ></v-text-field>
    <v-text-field
      v-model="cwccwd"
      label="方向コントロールファイル"
      required
    ></v-text-field>
    <v-text-field
      v-model="revd"
      label="ステップコントロールファイル"
      required
    ></v-text-field>
    <v-btn @click="pulse">パルス</v-btn>
    {{ alive }}
  </v-form>
</template>
<script>
import * as child from "child_process";

export default {
  data() {
    return {
      count: 1,
      pulse_width: 100,
      pulse_interval: 1900,
      pgonum: 1000,
      pbacknum: 20000,
      pulsed: "/sys/class/gpio/gpio76/value",
      cwccwd: "/sys/class/gpio/gpio128/value",
      revd: "/sys/class/gpio/gpio241/value",
      alive: false
    };
  },

  methods: {
    pulse() {
      const command =
        `ssh debian@${this.$store.state.address} ` +
        `/home/debian/pulse/pulse_bba ` +
        `-c ${this.count} ` +
        `--pw ${this.pulse_width * 1000} ` +
        `--pi ${this.pulse_interval * 1000} ` +
        `--pulsed ${this.pulsed} ` +
        `--cwccwd ${this.cwccwd} ` +
        `--revd ${this.revd} ` +
        `--pgonum ${this.pgonum} ` +
        `--pbacknum ${this.pbacknum}`;
      console.log(command);
      const foo = child.exec(command, (error, stdout, stderr) => {
        if (error) {
          this.alive = false;
          console.error(stderr);
        } else {
          console.log(stdout);
          this.alive = true;
        }
      });
    }
  }
};
</script>

<!-- count: 10 -->
<!-- pulse_width: 10000 -->
<!-- pulse_interval: 10000 -->
<!-- pulsed: /mnt/ramdisk/ram0.txt -->
<!-- cwccwd: /mnt/ramdisk/ram1.txt -->
<!-- revd: /mnt/ramdisk/ram2.txt -->
<!-- pgonum: 1000 -->
<!-- pbacknum: 50 -->
