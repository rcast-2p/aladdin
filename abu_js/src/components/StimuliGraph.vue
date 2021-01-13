<template>
  <div>
    stimuli graph
    <v-textarea v-model="stimuliJsonStr" label="stimuli config" />
    <v-btn @click="jsonInterpret">interpret</v-btn>
    <apexchart
      type="line"
      height="150"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <v-row>
      <v-col v-for="(indicatorE, indicatorI) in indicators" :key="indicatorI">
        <v-chip :color="indicatorE.color"> </v-chip> {{ indicatorE.name }} x
        {{ indicatorE.repeat }}
      </v-col>
    </v-row>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
  data() {
    return {
      indicators: [],
      stimuliJsonStr: "",
      chartOptions: {
        stroke: {
          curve: "stepline",
        },
        xaxis: {
          type: "numeric",
          title: {
            text: "time (ms) ",
          },
        },
        yaxis: {
          reversed: true,
          labels: { show: false },
        },
        colors: [
          "#174e9e",
          "#68b8dd",
          "#d16b16",
          "#88b83e",
          "#f2cf01",
          "#019fe6",
          "#c60019",
          "#019c96",
          "#b0d7f4",
          "#fff001",
          "#0074bf",
          "#c83955",
        ],
      },
      series: [
        {
          name: "series1",
          data: [1, 2, 3, 1, 2],
        },
        {
          name: "series2",
          data: [0, 1, 2],
        },
      ],
    };
  },
  components: { apexchart: VueApexCharts },
  created() {
    const stimuli = JSON.parse(localStorage.getItem("stimuliConfig"));
    this.stimuliJsonStr = JSON.stringify(stimuli, null, "\t");
  },
  methods: {
    flatten(on, coef) {
      return on.map((ele) => [
        Math.floor(ele[0] * coef),
        Math.floor(ele[1] * coef),
      ]);
    },
    jsonInterpret() {
      const stimuli = JSON.parse(this.stimuliJsonStr);
      localStorage.setItem("stimuliConfig", this.stimuliJsonStr);
      const series = [];
      const indicators = [];
      Object.keys(stimuli).forEach((ele, index) => {
        if (!ele.startsWith("chan")) {
          return;
        }
        const element = stimuli[ele];
        let onFlat = [];
        let { period } = element;
        if (element.unit === "ms") {
          onFlat = this.flatten(
            element.on,
            1000 / stimuli.config.timeResolution
          );
          period *= 1000;
        } else {
          onFlat = this.flatten(element.on, 1 / stimuli.config.timeResolution);
        }
        const periodEnd = Math.floor(period / stimuli.config.timeResolution);
        const dataArray = [];
        for (let dI = 0; dI < periodEnd + 1; dI += 1) {
          dataArray.push([
            (dI * stimuli.config.timeResolution) / 1000,
            index * 2 + 1,
          ]);
        }

        onFlat.forEach((on) => {
          for (let bI = on[0]; bI < on[1]; bI += 1) {
            dataArray[bI][1] = index * 2;
          }
        });
        series.push({ name: element.name, data: dataArray });
        indicators.push({
          name: element.name,
          color: this.chartOptions.colors[index],
          repeat: element.repeat,
        });
      });
      this.series = series;
      this.indicators = indicators;
    },
  },
};
</script>
