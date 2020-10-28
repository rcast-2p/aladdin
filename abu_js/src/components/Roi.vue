<template>
  <div id="chart" class="orange lighten-4">
    <apexchart
      type="line"
      height="150"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <v-row>
      <v-col cols="3">
        <v-text-field label="max" v-model="maximum" :disabled="maxauto" />
      </v-col>
      <v-col cols="3">
        <v-switch v-model="maxauto" label="max auto" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="min" v-model="minimum" :disabled="minauto" />
      </v-col>
      <v-col cols="3">
        <v-switch v-model="minauto" label="min auto" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  props: { average: Number, count: Number },
  components: { apexchart: VueApexCharts },
  data() {
    return {
      maximum: 1023,
      minimum: 0,
      maxauto: true,
      minauto: true,
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
          decimalsInFloat: 2,
        },
        legend: {
          show: false,
        },
      },
    };
  },
  mounted() {
    const data = [];
    for (let i = 0; i < 20; i += 1) {
      data.push({ x: i - 20, y: 0 });
    }
    this.chartData = data;
    this.$refs.chart.updateSeries([
      {
        data,
      },
    ]);
  },
  watch: {
    count(val) {
      const data = this.chartData;
      data.shift();
      data.push({ x: val, y: this.average });
      this.chartData = data;
      this.$refs.chart.updateSeries([
        {
          data,
        },
      ]);
    },
  },
};
</script>
