<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="用户ID：">
              <el-input class="forminput" size="small" v-model="formInline.uId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：">
              <el-input class="forminput" size="small" v-model="formInline.phone" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户姓名：">
              <el-input
                class="forminput"
                size="small"
                v-model="formInline.realName"
                placeholder="用户真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small" @click="add">新增</el-button>
        <el-button type="info" size="small" @click="update">修改</el-button>
        <el-button type="danger" size="small" @click="rrole">权限</el-button>
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
        <el-table-column prop="deleted" label="状态" width="150" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.deleted === 0" type="info" disable-transitions>正常</el-tag>
            <el-tag v-if="scope.row.deleted === 1" type="danger" disable-transitions>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.deleted===0"
              @click="deleteClick(scope.row)"
              type="text"
              size="small"
            >禁用</el-button>
            <el-button
              v-if="scope.row.deleted===1"
              @click="deleteClick(scope.row)"
              type="text"
              size="small"
            >启用</el-button>
            <el-button @click="realDeleteClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        page-size="8"
        background
        layout="prev, pager, next, total"
        :total="this.total"
        :current-page="this.formInline.pageNumber"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
    <transition name="el-zoom-in-center">
      <Detail
        v-if="this.detail"
        v-bind:visibleShow="this.detailShow"
        v-bind:detailData="this.multipleSelection[0]"
        v-on:childEvent="listenDetailChild"
      ></Detail>
    </transition>
    <transition name="el-zoom-in-center">
      <Role
        v-if="this.role"
        v-bind:visibleShow="this.roleShow"
        v-bind:name="this.multipleSelection[0].name"
        v-on:childEvent="listenRoleChild"
      ></Role>
    </transition>
  </div>
</template>
<script>
import moment from "moment";
import Detail from "./UserDetail.vue";
import Role from "./UserRole.vue";
export default {
  components: {
    Detail,
    Role
  },
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
      multipleSelection: [],
      detail: false,
      role: false,
      detailShow: false,
      roleShow: false
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteClick(row) {
      this.axios
        .delete("/admin/user/deleted", { params: { userId: row.id } })
        .then(data => {
          if (data.data.isSucc == false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.list();
          }
        });
    },
    realDeleteClick(row) {
      this.$confirm("确认删除吗？删除后无法恢复，请谨慎操作。", "提示", {
        type: "warning"
      })
        .then(() => {
          this.axios
            .delete("/admin/user/realDeleted", {
              params: { userId: row.id }
            })
            .then(data => {
              if (data.data.isSucc == false) {
                this.$message({
                  message: data.data.message,
                  type: "error"
                });
              } else {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.list();
              }
            });
        })
        .catch(() => {});
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
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一个用户",
          type: "warning"
        });
      } else {
        this.detail = true;
        this.detailShow = true;
      }
    },
    listenDetailChild(data) {
      this.detail = false;
      this.list();
    },
    listenRoleChild(data) {
      this.role = false;
      this.list();
    },
    rrole() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一个用户",
          type: "warning"
        });
      } else {
        this.role = true;
        this.roleShow = true;
      }
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
  margin-top: 20px;
}
.chaozuobut {
  text-align: right;
  margin-bottom: -12px;
  margin-right: 20px;
}
.box-card {
  margin-bottom: 10px;
}
</style>

