<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item label="用户ID：">
            <el-input class="forminput" size="small" v-model="formInline.uId" placeholder="用户ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户姓名：">
            <el-input
              class="forminput"
              size="small"
              v-model="formInline.realName"
              placeholder="用户姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：">
            <el-input class="forminput" size="small" v-model="formInline.phone" placeholder="手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row class="chaozuobut">
      <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
      <el-button type="warning" size="small" @click="add">新增</el-button>
      <el-button type="success" size="small" @click="update">修改</el-button>
      <el-button type="info" size="small" @click="deleted">删除</el-button>
    </el-row>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(230,230,250, 0.8)"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="#" width="60"></el-table-column>
      <el-table-column
        prop="createTime"
        label="日期"
        :formatter="dateFormat"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column prop="companyName" label="公司" width="120" align="center"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
      <el-table-column prop="icardNum" label="身份证号" width="180" align="center"></el-table-column>
      <el-table-column prop="deleted" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deleted === 0" type="primary" disable-transitions>正常</el-tag>
          <el-tag v-if="scope.row.deleted === 1" type="warning" disable-transitions>删除</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      page-size=8
      background
      layout="prev, pager, next, total"
      :total="this.total"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      formInline: {
        uId: "",
        phone: "",
        realName: "",
        pageNumber: 1
      },
      total: null,
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
        .get("/admin/user/list", {
          params: {
            uId: this.formInline.uId,
            phone: this.formInline.phone,
            realName: this.formInline.realName,
            pageNumber: this.formInline.pageNumber
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
      this.formInline.pageNumber = 1;
      this.list();
    },
    add() {
      console.log("add!");
    },
    update() {
      console.log(this.multipleSelection);
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "必须勾选一个用户",
          type: "warning"
        });
      }
    },
    deleted() {
      console.log("deleted!");
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    currentChange(cur) {
      this.formInline.pageNumber = cur;
      this.list();
    }
  },
  created() {
    this.list();
  }
};
</script>
<style>
.chaxun {
  float: right;
}
.forminput {
  width: 200px;
}
.pagination {
  text-align: center;
  margin-top: 10px;
}
.chaozuobut {
  text-align: right;
  margin-bottom: 5px;
  margin-right: 20px;
}
</style>

