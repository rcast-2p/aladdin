<template>
  <div id="chart" class="orange lighten-4">
    <apexchart
      type="line"
      height="300"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <v-row no-gutters>
      <v-col cols="2">
        <v-chip dark>Y</v-chip>
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="min"
          v-model.number="minimum"
          :disabled="minauto"
          hide-details="auto"
          dense
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="max"
          v-model.number="maximum"
          :disabled="maxauto"
          hide-details="auto"
          dense
        />
      </v-col>
      <v-col cols="2">
        <v-chip dark>X</v-chip>
      </v-col>
      <v-col cols="6">
        <v-text-field
          suffix="sec"
          label="daq time"
          v-model.number="daqSec"
          hide-details="auto"
          dense
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  props: { average: Number, roiGeneration: Number },
  components: { apexchart: VueApexCharts },
  data() {
    return {
      maximum: 1023,
      minimum: 0,
      maxauto: false,
      minauto: false,
      daqSec: 10,
      x: 0,
      chartData: [],
      series: [
        {
          data: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
          ],
        },
      ],
      chartOptions: {
        chart: {
          id: "realtime",
          height: 250,
          type: "line",
          animations: {
            enabled: false,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          yaxis: {},
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Dynamic Updating Chart",
          align: "left",
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "numeric",
        },
        yaxis: {
          decimalsInFloat: 0,
        },
        legend: {
          show: false,
        },
      },
    };
  },
  methods: {
    updateXRange() {
      const data = [];
      for (let i = 0; i < this.daqSec * 30; i += 1) {
        data.push({ x: i / 30 - this.daqSec, y: 0 });
      }
      this.chartData = data;
      this.$refs.chart.updateSeries([
        {
          data,
        },
      ]);
      this.x = 0;
    },
  },
  mounted() {
    this.updateXRange();
  },
  watch: {
    roiGeneration() {
      this.x += 1;
      const data = this.chartData;
      data.shift();
      data.push({ x: this.x / 30, y: this.average });
      this.chartData = data;
      this.$refs.chart.updateSeries([
        {
          data,
        },
      ]);
    },
    daqSec() {
      this.updateXRange();
    },
    maximum(val) {
      this.$refs.chart.updateOptions({
        yaxis: {
          max: val,
          min: this.minimum,
        },
      });
    },
    minimum(val) {
      this.$refs.chart.updateOptions({
        yaxis: {
          max: this.maximum,
          min: val,
        },
      });
    },
    maxauto() {},
    minauto() {},
  },
};
</script>
