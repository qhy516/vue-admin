<template>
  <div class="multipleColumn">
    <el-row style="margin-bottom: 20px;">
      <el-col :span="5">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日成交量</span>
          </div>
          <div class="card-list">
            <span class="card-big-font">{{todaySum.counts}}</span>
            <p style="font-size: 14px;padding-top: 10px;">总成交量：{{totalSum.totalCount}}股</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日成交额</span>
          </div>
          <span class="card-big-font">{{todaySum.amounts}}</span>
          <p style="font-size: 14px;padding-top: 10px;">总收入：{{totalSum.totalAmount}}元</p>
        </el-card>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日支出</span>
          </div>
          <span class="card-big-font">1,803</span>
          <p style="font-size: 14px;padding-top: 10px;">总支出：12万</p>
        </el-card>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日访客</span>
          </div>
          <span class="card-big-font">2,803</span>
          <p style="font-size: 14px;padding-top: 10px;">总访客：29万</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card :style="{width:'96%',height:'350px'}">
          <div id="main" :style="{width:'50%',height: '300px'}" style="float: left;"></div>
          <div id="echarts" :style="{width:'50%', height: '300px'}" style="float: left;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      charts: "",
      todaySum: {
        counts: "",
        amounts: ""
      },
      totalSum: {
        totalCount: 0,
        totalAmount: 0
      },
      countData: [],
      amountData: []
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
            let arramount = [];
            let talcount = 0;
            let talamount = 0;
            data.data.result.map(function(value, index) {
              talcount = talcount + value.counts;
              talamount = talamount + value.amounts;
              arrcount.push(value.counts);
              arramount.push(value.amounts);
            });
            this.totalSum.totalCount = talcount;
            this.totalSum.totalAmount = talamount;
            this.countData = arrcount;
            this.amountData = arramount;
            this.drawPie("main");
            this.drawPie2("echarts");
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    todayList() {
      this.axios
        .get("/admin/entrust/todaySuccessTradeList", {
          params: {}
        })
        .then(data => {
          if (data.data.isSucc === false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.todaySum = data.data.result;
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    drawPie(id) {
      this.charts = this.echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "2019年每月成交量"
        },
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}股"
          }
        },
        series: [
          {
            name: "成交量",
            type: "line",
            // data: [108, 133, 136, 101, 155, 113, 125, 100, 181, 128, 79, 131]
            data: this.countData
          }
        ]
      });
    },
    drawPie2(id) {
      this.charts = this.echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "2019年每月成交额"
        },
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 万"
          }
        },
        series: [
          {
            name: "成交额",
            type: "line",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "#99CCFF",
                lineStyle: {
                  color: "#99CCFF"
                }
              }
            },
            // data: [11, 15, 14, 14, 17, 12, 13, 12, 20, 15, 9, 12]
            data: this.amountData
          }
        ]
      });
    }
  },
  //调用
  mounted() {},
  created() {
    this.list();
    this.todayList();
  }
};
</script>
<style scoped="scoped">
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.card-big-font {
  font-size: 36px;
  color: #666;
  line-height: 36px;
  padding: 5px 0 10px;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  margin-bottom: 5px;
}

.card-span-color {
  position: absolute;
  right: 15px;
}
</style>

