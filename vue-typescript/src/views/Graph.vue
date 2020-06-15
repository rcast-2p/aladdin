<template>
  <div>
    <v-row>
      <v-text-field
        v-model="svgname"
        label="出力ファイル名"
        type="string"
        suffix=".svg"
        required
        outlined
      ></v-text-field>
      <v-text-field
        v-model="every"
        label="毎(every)"
        type="number"
        required
        outlined
      ></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="limit"
        label="まで(limit)"
        type="number"
        required
        outlined
      ></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="xlabel"
        label="x軸のラベル"
        type="string"
        required
        outlined
      ></v-text-field>
      <v-text-field
        v-model="ylabel"
        label="y軸のラベル"
        type="string"
        required
        outlined
      ></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="fcolor_hex"
        label="塗りつぶしの色"
        type="string"
        required
        outlined
      ></v-text-field>
      <v-text-field
        v-model="lcolor_hex"
        label="線の色"
        type="string"
        required
        outlined
      ></v-text-field>
    </v-row>
    <v-color-picker v-model="fcolor"></v-color-picker>
    <v-color-picker v-model="lcolor"></v-color-picker>
    <v-textarea v-model="gnuplot_text"> </v-textarea>
    <v-btn @click="write_gs">書き込み</v-btn>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import * as child from "child_process";
export default Vue.extend({
  data() {
    return {
      fcolor: { r: 255, g: 0, b: 255, a: 1 } as { [s: string]: number },
      lcolor: { r: 255, g: 100, b: 255, a: 1 } as { [s: string]: number },
      svgname: "graph",
      xlabel: "time [ms]",
      ylabel: "PRUDAQ count [AU 0-1023]",
      every: 1000,
      limit: -1,
    };
  },
  computed: {
    gnuplot_text() {
      let text: string = "";
      text += `set terminal svg font "Arial,18" size 1200 600\n`;
      text += `set output "${this.svgname}.svg"\n`;
      text += `set xlabel "${this.xlabel}"\n`;
      text += `set ylabel "${this.ylabel}"\n`;
      text += `set size ratio 0.3\n`;
      text += `set autoscale\n`;
      text += ` plot "-" u($1*0.1):($4):($5)  w filledcu lc rgb "${this.fcolor_hex}" notitle, "-" u ($1*0.1):($2) w l lc rgb "${this.lcolor_hex}" notitle; `;
      return text;
    },
    fcolor_hex: {
      set(newval: string) {
        const fcolor: { [s: string]: number } = this.fcolor;
        fcolor.r = parseInt(newval.slice(1, 3), 16);
        fcolor.g = parseInt(newval.slice(3, 5), 16);
        fcolor.b = parseInt(newval.slice(5, 7), 16);
      },
      get() {
        const hexU = (color: { [s: string]: number }, rgb: string)=> {
          return ("0" + color[rgb].toString(16)).slice(-2);
        };
        console.log(this.svgname);
        const fcolor: { [s: string]: number } = this.fcolor;
        console.log(this.fcolor);
        return `#${hexU(fcolor, "r")}${hexU(fcolor, "g")}${hexU(
          fcolor,
      "b"
        )}`;
      },
    },
    lcolor_hex: {
      set(newval: string) {
        this.lcolor.r = parseInt(newval.slice(1, 3), 16);
        this.lcolor.g = parseInt(newval.slice(3, 5), 16);
        this.lcolor.b = parseInt(newval.slice(5, 7), 16);
      },
      get() {
        const hexU = (color: { [s: string]: number }, rgb: string)=> {
          return ("0" + color[rgb].toString(16)).slice(-2);
        };
        const lcolor: { [s: string]: number } = this.lcolor;
        return `#${hexU(lcolor, "r")}${hexU(lcolor, "g")}${hexU(
          lcolor,
          "b"
        )}`;
      },
    },
  },

  methods: {
    write_gs() {
      const command = `echo '${this.gnuplot_text}' > /home/endo/Documents/2papp/process_bin/newcppera/evescan/graph/sin.gs`;
      const foo = child.exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
        } else {
          console.log(stdout);
        }
      });
    },
  },
});
</script>
