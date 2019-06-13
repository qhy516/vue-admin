<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="条件搜索：" label-width="90px">
              <el-input
                class="forminput"
                size="small"
                v-model="search.qValUser"
                placeholder="用户账户/真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条件搜索：" label-width="90px">
              <el-input
                class="forminput"
                size="small"
                v-model="search.qValStock"
                placeholder="股票代码/股票名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.uId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属公司：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.cId" placeholder="所属公司">
                  <el-option label="全部" value></el-option>
                  <el-option
                    v-for="item in companys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="统计状态：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.statistics" placeholder="统计状态">
                  <el-option label="全部" value></el-option>
                  <el-option label="未统计" value="0"></el-option>
                  <el-option label="已统计" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间筛选：" label-width="90px">
              <el-date-picker
                class="picker"
                v-model="search.time"
                @change="pickerChage"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small"></el-button>
        <el-button type="info" size="small"></el-button>
        <el-button type="danger" size="small"></el-button>
      </el-row>
    </el-card>
    <el-card>
      <el-table
        v-loading="this.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(230,230,250, 0.8)"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="userId" label="用户#" width="80" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          label="计费日期"
          :formatter="dateFormat"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="userName" label="账户" width="120" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" mini-width="120" align="center"></el-table-column>
        <el-table-column prop="stockName" label="股票名字" mini-width="120" align="center"></el-table-column>
        <el-table-column prop="averagePrice" label="成本价" width="120" align="center"></el-table-column>
        <el-table-column prop="count" label="股数" width="120" align="center"></el-table-column>
        <el-table-column prop="amount" label="总成本" width="120" align="center"></el-table-column>
        <el-table-column prop="fee" label="仓息" width="120" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="showHeader" :data="tableSum">
        <el-table-column class-name="talbleTitle" prop="title" width="120"></el-table-column>
        <el-table-column prop="sumFee" width="1000"></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :page-size="this.search.pageSize"
        background
        layout="prev, pager, next, total"
        :total="this.total"
        :current-page="this.search.pageNumber"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      search: {
        uId: "",
        cId: "",
        qValUser: "",
        qValStock: "",
        statistics: "",
        time: "",
        startTime: "",
        endTime: "",
        pageNumber: 1,
        pageSize: 8
      },
      companys:[],
      showHeader: false,
      tableData: [],
      tableSum: [{ title: "", sumFee: "" }],
      loading: false,
      total: 0
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pickerChage() {
      let pick = this.search.time;
      if (pick) {
        this.search.startTime = moment(pick[0]).format("YYYY-MM-DD");
        this.search.endTime = moment(pick[1]).format("YYYY-MM-DD");
      } else {
        this.search.startTime = "";
        this.search.endTime = "";
      }
    },
    companyList() {
      this.axios.get("/admin/company/all").then(data => {
        if (data.data.isSucc == false) {
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.companys = data.data.result;
        }
      });
    },
    list() {
      this.loading = true;
      this.axios
        .get("/admin/wallet/feeList", {
          params: {
            uId: this.search.uId,
            cId: this.search.cId,
            qValUser: this.search.qValUser,
            qValStock: this.search.qValStock,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
            statistics: this.search.statistics,
            pageNumber: this.search.pageNumber,
            pageSize: this.search.pageSize
          }
        })
        .then(data => {
          this.loading = false;
          if (data.data.isSucc == false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.tableData = data.data.result.records;
            this.total = data.data.result.total;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            message: "数据获取失败",
            type: "error"
          });
        });
      this.querySum();
    },
    querySum() {
      this.loading = true;
      this.axios
        .get("/admin/wallet/querySumFee", {
          params: {
            uId: this.search.uId,
            cId: this.search.cId,
            qValUser: this.search.qValUser,
            qValStock: this.search.qValStock,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
            statistics: this.search.statistics
          }
        })
        .then(data => {
          this.loading = false;
          if (data.data.isSucc == false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.tableSum[0].title = "汇总统计：";
            this.tableSum[0].sumFee = "累计仓息:" + data.data.result.sumFee;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            message: "统计项数据获取失败",
            type: "error"
          });
        });
    },
    onSubmit() {
      this.search.pageNumber = 1;
      this.list();
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    currentChange(cur) {
      this.search.pageNumber = cur;
      this.list();
    }
  },
  created() {
    this.list();
    this.companyList();
  }
};
</script>
<style>
.talbleTitle {
  font-family: PingFang SC;
  font-size: 17px;
}
.select {
  width: 100%;
}
.picker {
  margin-top: 4px;
}
</style>


