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
            <el-form-item label="条件搜索：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.qVal" placeholder="手机号/用户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="风险率：" label-width="90px">
              <el-input
                class="forminput"
                size="small"
                v-model="search.closeLine"
                placeholder="风险率范围0~1"
              ></el-input>
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
        <el-table-column prop="userId" label="用户#" width="180"></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="realName" label="姓名" width="190" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="190" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="190" align="center"></el-table-column>
        <el-table-column prop="closeLine" label="风险率(亏损百分之)" width="190" align="center">
          <template slot-scope="scope">
            <el-tag type="danger">{{scope.row.closeLine*100}}%</el-tag>
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
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      search: {
        uId: "",
        qVal: "",
        closeLine: "",
        pageNumber: 1,
        pageSize: 8
      },
      total: 0,
      loading: false,
      tableData: [],
      multipleSelection: []
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    list() {
      this.loading = true;
      this.axios
        .get("/admin/closeLine/list", {
          params: {
            uId: this.search.uId,
            qVal: this.search.qVal,
            closeLine: this.search.closeLine,
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
  }
};
</script>

