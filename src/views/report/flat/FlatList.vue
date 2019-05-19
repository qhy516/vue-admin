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
                v-model="search.searchKeys"
                placeholder="交易账号/姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属公司：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.cid" placeholder="所属公司">
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
        <el-button type="warning" size="small" @click="capitalExport">导出</el-button>
        <el-button type="info" size="small">详情</el-button>
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
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column fixed prop="id" label="用户#" width="80" align="center"></el-table-column>
        <el-table-column prop="phone" label="用户账户" width="160" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="160" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" mini-width="120" align="center"></el-table-column>
        <el-table-column prop="usedMoney" label="账户余额" width="160" align="center"></el-table-column>
        <el-table-column prop="capital" label="本金" width="160" align="center"></el-table-column>
        <el-table-column prop="counts" label="平仓量" width="140" align="center"></el-table-column>
        <el-table-column prop="yinkui" label="总盈亏" width="140" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="showHeader" :data="tableSum">
        <el-table-column class-name="talbleTitle" prop="title" width="120"></el-table-column>
        <el-table-column prop="usedMoney" width="180"></el-table-column>
        <el-table-column prop="counts" width="180"></el-table-column>
        <el-table-column prop="profitLoss" width="180"></el-table-column>
        <el-table-column prop="fee" width="180"></el-table-column>
        <el-table-column prop="yinhuasui" width="180"></el-table-column>
        <el-table-column prop="guoyeff" width="180"></el-table-column>
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
        searchKeys: "",
        cid: "",
        time: "",
        startTime: "",
        endTime: "",
        pageNumber: 1,
        pageSize: 8
      },
      user: null,
      companys: [],
      add: false,
      edit: false,
      total: 0,
      loading: false,
      showHeader: false,
      tableSum: [
        {
          title: "",
          profitLoss: "",
          capital: "",
          counts: "",
          fee: "",
          usedMoney: "",
          yinhuasui: "",
          guoyefee: "总的过夜费：0"
        }
      ],
      tableData: [],
      multipleSelection: []
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
        .get("/admin/entrust/orderList", {
          params: {
            searchKeys: this.search.searchKeys,
            cid: this.search.cid,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
            pageNumber: this.search.pageNumber,
            pageSize: this.search.pageSize
          }
        })
        .then(data => {
          this.loading = false;
          if (data.data.isSucc === false) {
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
      this.axios
        .get("/admin/entrust/orderListSum", {
          params: {
            searchKeys: this.search.searchKeys,
            cid: this.search.cid,
            startTime: this.search.startTime,
            endTime: this.search.endTime
          }
        })
        .then(data => {
          this.loading = false;
          if (data.data.isSucc === false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.tableSum[0].title = "汇总统计：";
            this.tableSum[0].usedMoney =
              "账户余额：" + data.data.result.usedMoney;
            this.tableSum[0].counts = "总平仓股数：" + data.data.result.counts;
            this.tableSum[0].profitLoss =
              "总盈亏：" + data.data.result.profitLoss;
            this.tableSum[0].fee = "总手续费：" + data.data.result.fee;
            this.tableSum[0].yinhuasui =
              "总印花税：" + data.data.result.yinhuasui;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            message: "数据获取失败",
            type: "error"
          });
        });
    },
    onSubmit() {
      this.search.pageNumber = 1;
      this.list();
    },
    capitalExport() {
      this.axios
        .get("/admin/excel/walletListExport", {
          params: {
            searchKeys: this.search.searchKeys,
            companyId: this.user.companyId,
            level: this.user.level,
            token: this.user.token,
            userId: this.user.id
          }
        })
        .then(data => {
          this.loading = false;
          if (data.data.isSucc === false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            message: "资金报表导出失败",
            type: "error"
          });
        });
    },
    companyEdit() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一条数据",
          type: "warning"
        });
      } else {
        this.edit = true;
      }
    },
    listenAddChild(data) {
      this.add = false;
      this.list();
    },
    listenEditChild(data) {
      this.edit = false;
      this.list();
    },
    currentChange(cur) {
      this.search.pageNumber = cur;
      this.list();
    }
  },
  created() {
    this.list();
    this.companyList();
    this.user = JSON.parse(sessionStorage.getItem("user"));
  }
};
</script>

