<template>
  <div class="multipleColumn">
    <el-row style="margin-bottom: 20px;">
      <el-col span="5">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日销量</span>
          </div>
          <div class="card-list">
            <span class="card-big-font">11</span>
            <p style="font-size: 14px;padding-top: 10px;">总销售量：2,029台</p>
          </div>
        </el-card>
      </el-col>
      <el-col span="5" offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日收入</span>
          </div>
          <span class="card-big-font">13,900</span>
          <p style="font-size: 14px;padding-top: 10px;">总收入：2,299,990元</p>
        </el-card>
      </el-col>
      <el-col span="5" offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日支出</span>
          </div>
          <span class="card-big-font">1,803</span>
          <p style="font-size: 14px;padding-top: 10px;">总支出：12万</p>
        </el-card>
      </el-col>
      <el-col span="5" offset="1">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日访客</span>
          </div>
          <span class="card-big-font">2,803</span>
          <p style="font-size: 14px;padding-top: 10px;">总访客：29万</p>
        </el-card>
      </el-col>
    </el-row>
    <Row>
      <el-col>
        <el-card :style="{width:'96%',height:'350px'}">
          <div id="main" :style="{width:'50%',height: '300px'}" style="float: left;"></div>
          <div id="echarts" :style="{width:'50%', height: '300px'}" style="float: left;"></div>
        </el-card>
      </el-col>
    </Row>
  </div>
</template>
<script>
import echarts from "echarts";
import cookies from "js-cookie";
export default {
  data() {
    return {
      isCollapsed: false,
      charts: ""
    };
  },
  methods: {
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "每月销售量"
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
            formatter: "{value} 台"
          }
        },
        series: [
          {
            name: "销售量",
            type: "line",
            data: [108, 133, 136, 101, 155, 113, 125, 100, 181, 128, 79, 131]
          }
        ]
      });
    },
    drawPie2(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "每月销售额"
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
            name: "销售额",
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
            data: [11, 15, 14, 14, 17, 12, 13, 12, 20, 15, 9, 12]
          }
        ]
      });
    }
  },
  //调用
  mounted() {
    this.$nextTick(function() {
      this.drawPie("main");
      this.drawPie2("echarts");
    });
  },
  created() {
    console.log(cookies.get("user"));
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
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

