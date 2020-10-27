<script>
import { Line } from "vue-chartjs";

import "chartjs-plugin-streaming";

export default {
  extends: Line,
  props: { average: { type: Number } },
  mounted() {
    const scales = {
      xAxes: [
        {
          type: "realtime",
          realtime: {
            onRefresh: (chart) => {
              chart.data.datasets.forEach((dataset) => {
                dataset.data.push({
                  x: Date.now(),
                  y: this.average,
                });
              });
            },
          },
          delay: 2000,
          duration: 10000,
        },
      ],
    };
    const data = {
      datasets: [{ fill: false, label: "ROI brightness", data: [] }],
    };
    this.renderChart(data, { scales });
  },
};
</script>
