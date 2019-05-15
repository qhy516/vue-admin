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
                placeholder="账号/用户姓名"
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
          <el-col :span="6">
            <el-form-item label="钱包类型：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.type" placeholder="钱包类型">
                  <el-option
                    v-for="item in walletTypes"
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="dateFormat"
          label="创建时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="userName" label="用户账号" width="110" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="110" align="center"></el-table-column>
        <el-table-column prop="type" label="钱包类型" width="150" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type===0">人民币买单</el-tag>
            <el-tag v-if="scope.row.type===2">人民币卖单</el-tag>
            <el-tag v-if="scope.row.type===1" type="success">股票买单</el-tag>
            <el-tag v-if="scope.row.type===3" type="success">股票卖单</el-tag>
            <el-tag v-if="scope.row.type===4" type="info">后台充值</el-tag>
            <el-tag v-if="scope.row.type===5" type="info">后台提现</el-tag>
            <el-tag v-if="scope.row.type===6" type="info">后台提现返还</el-tag>
            <el-tag v-if="scope.row.type===7" type="warning">强制平仓</el-tag>
            <el-tag v-if="scope.row.type===8" type="danger">用户充值</el-tag>
            <el-tag v-if="scope.row.type===9" type="danger">用户提现</el-tag>
            <el-tag v-if="scope.row.type===10" type="warning">扣除仓息</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="110" align="center"></el-table-column>
        <el-table-column prop="des" label="描述" width="420" align="center">
          <template slot-scope="scope">
            <el-input type="textarea" :rows="1" v-model="scope.row.des"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        page-size="8"
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
        uId: null,
        cId: "",
        type: "",
        qValUser: null,
        pageSize: 8,
        pageNumber: 1
      },
      loading: false,
      tableData: [],
      companys: [],
      walletTypes: [
        { id: "", name: "全部" },
        { id: 0, name: "人民币买单" },
        { id: 2, name: "人民币卖单" },
        { id: 1, name: "股票买单" },
        { id: 3, name: "股票卖单" },
        { id: 4, name: "后台充值" },
        { id: 5, name: "后台提现" },
        { id: 6, name: "后台提现返还" },
        { id: 7, name: "强制平仓" },
        { id: 8, name: "用户充值" },
        { id: 9, name: "用户提现" },
        { id: 10, name: "扣除仓息" }
      ]
    };
  },
  methods: {
    onSubmit() {
      this.search.pageNumber = 1;
      this.list();
    },
    list() {
      this.loading = true;
      this.axios
        .get("/admin/walletLog/list", {
          params: {
            qValUser: this.search.qValUser,
            uId: this.search.uId,
            cId: this.search.cId,
            type: this.search.type,
            pageSize: this.search.pageSize,
            pageNumber: this.search.pageNumber
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
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
.select {
  width: 100%;
}
.el-input__inner {
  height: 32px;
}
</style>


