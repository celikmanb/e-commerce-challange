<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
export default {
  name: "ChartBox",
  props: {
    dataSeries: {
      type: Array,
    },
    xAxis: {
      type: Array,
    },
  },
  data() {
    let self = this;
    return {
      chartOptions: {
        chart: {
          type: "column",
        },
        
        title: {
          text: "Daily Sales",
          align: "left"
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
            events: {
              click: function (event) {
                self.showData(event);
              },
            },
          },
        },
        xAxis: {
          categories: this.xAxis,
        },
        legend: {
          align: "left",
          x: 70,
          verticalAlign: "top",
          y: 70,
          floating: true,
          backgroundColor: "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Amount",
          },
          stackLabels: {
            enabled: true,
          },
        },
        series: this.dataSeries,
      },
    };
  },
  methods: {
    showData(val) {
      this.$emit("sendItem", val);
    },
  },
};
</script>

<style>
</style>