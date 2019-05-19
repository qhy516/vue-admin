<template>
  <div>
    <el-card :style="{width:'96%',height:'350px'}">
      <!-- <div id="main" :style="{width:'50%',height: '300px'}" style="float: left;"></div> -->
      <div id="myChart" :style="{width:'50%', height: '300px'}" style="float: left;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        legend: {},
        xAxis: {},
        yAxis: {},
        label: {},
        tooltip: {},
        series: [
          {
            name: "招商银行",
            data: [],
            type: "line"
          }
        ]
      },
      countData: []
    };
  },
  methods: {
    list() {
      this.axios
        .get("/admin/entrust/successTradeList", {
          params: {}
        })
        .then(data => {
          if (data.data.isSucc === false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            let arrcount = [];
            data.data.result.map(function(value, index) {
              arrcount.push(value.counts);
            });
            this.countData = arrcount;
            this.option.series[0].data = arrcount;
            console.log(this.option.series[0].data);
            this.draw();
          }
        });
    },
    fuzhi() {
      // x轴
      this.option.xAxis.type = "category";
      this.option.xAxis.name = "x轴";
      this.option.xAxis.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      // this.option.xAxis.nameTextStyle.fontWeight = 200;
      // this.option.xAxis.nameTextStyle.fontSize = "18";
      // y轴
      this.option.yAxis.type = "value";
      this.option.yAxis.name = "y轴";
      // this.option.yAxis.nameTextStyle.fontWeight = 200;
      // this.option.yAxis.nameTextStyle.fontSize = "18";
      // tooltip
      this.option.tooltip.trigger = "axis";
    },
    draw() {
      this.fuzhi();
      let myChart = this.echarts.init(document.getElementById("myChart"));
      myChart.setOption(this.option);
    }
  },
  mounted() {},
  created() {
    this.list();
  }
};
</script>

