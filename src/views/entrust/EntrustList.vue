<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="用户ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.uId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.phone" placeholder="用户手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户姓名：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.realName" placeholder="真实名字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="股票代码：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.symbol" placeholder="股票代码"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="批次ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.batchId" placeholder="批次ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="买卖类型：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.statistics" placeholder="买卖类型">
                  <el-option label="全部" value></el-option>
                  <el-option label="买进" value="0"></el-option>
                  <el-option label="卖出" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="融资/融券：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.statistics" placeholder="资券类型">
                  <el-option label="全部" value></el-option>
                  <el-option label="融资" value="0"></el-option>
                  <el-option label="融券" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" plain @click="this.shaixuan">
                筛选
                <i :class="this.shaixuanclass"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-collapse-transition>
        <el-row v-if="this.shaixuanVisible">
          <el-form :inline="true" :model="search" class="demo-form-inline">
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
      </el-collapse-transition>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small" @click="info">详情</el-button>
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="userId" label="用户#" width="60"></el-table-column>
        <el-table-column fixed prop="realName" label="姓名" width="100" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="160"
          align="center"
        ></el-table-column>

        <el-table-column prop="companyName" label="所属公司" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="股票名字" width="100" align="center"></el-table-column>
        <el-table-column prop="count" label="挂单股数" width="100" align="center"></el-table-column>
        <el-table-column prop="price" label="挂单单价" width="100" align="center"></el-table-column>
        <el-table-column prop="amount" label="挂单总额" width="100" align="center"></el-table-column>
        <el-table-column prop="type" label="买卖类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" type="info">买进</el-tag>
            <el-tag v-if="scope.row.type === 1" type="success">卖出</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100" align="center"></el-table-column>
        <el-table-column prop="yinhuasui" label="印花税" width="100" align="center"></el-table-column>
        <el-table-column prop="tradePrice" label="实际成交单价" width="110" align="center"></el-table-column>
        <el-table-column prop="tradeAmount" label="实际成交总额" width="110" align="center"></el-table-column>
        <el-table-column prop="averagePrice" label="均价" width="100" align="center"></el-table-column>
        <el-table-column prop="status" label="交易状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">挂单</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">成交</el-tag>
            <el-tag v-if="scope.row.status === 2" type="warning">用户撤单</el-tag>
            <el-tag v-if="scope.row.status === 3" type="danger">系统撤单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="profitLoss" label="成交盈亏" width="100" align="center"></el-table-column>
        <el-table-column prop="forceSell" label="强制平仓" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.forceSell === 0" type="info">否</el-tag>
            <el-tag v-if="scope.row.forceSell === 1" type="success">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isMargin" label="融资/融券" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isMargin === 0" type="info">融资</el-tag>
            <el-tag v-if="scope.row.isMargin === 1" type="success">融券</el-tag>
          </template>
        </el-table-column>
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
    <transition name="el-zoom-in-center">
      <detail
        v-if="this.detail"
        v-bind:entrustId="this.multipleSelection[0].id"
        v-on:childEvent="listenDetailChild"
      ></detail>
    </transition>
  </div>
</template>
<script>
import Detail from "./EntrustDetail.vue";
import moment from "moment";
export default {
  components: { Detail },
  data() {
    return {
      search: {
        uId: "",
        phone: "",
        symbol: "",
        realName: "",
        batchId: "",
        recharge: "",
        isMargin: "",
        time: null,
        startTime: "",
        endTime: "",
        pageNumber: 1,
        pageSize: 8
      },
      multipleSelection: [],
      shaixuanclass: "el-icon-caret-bottom el-icon--right",
      shaixuanVisible: false,
      loading: false,
      detail: false,
      tableData: [],
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
    list() {
      this.loading = true;
      this.axios
        .get("/admin/entrust/list", {
          params: {
            uId: this.search.uId,
            phone: this.search.phone,
            symbol: this.search.symbol,
            realName: this.search.realName,
            batchId: this.search.batchId,
            recharge: this.search.recharge,
            isMargin: this.search.isMargin,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
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
    },
    onSubmit() {
      this.search.pageNumber = 1;
      this.list();
    },
    info() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一条数据",
          type: "warning"
        });
      } else {
        this.detail = true;
      }
    },
    currentChange(cur) {
      this.search.pageNumber = cur;
      this.list();
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    shaixuan() {
      if (this.shaixuanVisible) {
        this.shaixuanVisible = false;
        this.shaixuanclass = "el-icon-caret-bottom el-icon--right";
      } else {
        this.shaixuanVisible = true;
        this.shaixuanclass = "el-icon-caret-top el-icon--right";
      }
    },
    listenDetailChild(data) {
      this.detail = false;
    }
  },
  created() {
    this.list();
  }
};
</script>
<style>
.chaozuobut {
  text-align: right;
  margin-bottom: -12px;
  margin-right: 20px;
}
</style>


