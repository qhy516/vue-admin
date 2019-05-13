<template>
  <div>
    <el-card class="box-card">
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="adminAdd">新增</el-button>
        <el-button type="warning" size="small" @click="adminEdit">编辑</el-button>
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
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="账号" width="120" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="120" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
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
              @click="enableClick(scope.row)"
              type="text"
              size="small"
            >启用</el-button>
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
      <Add v-if="this.add" v-on:childEvent="listenAddChild"></Add>
    </transition>
    <transition name="el-zoom-in-center">
      <Edit
        v-if="this.edit"
        v-bind:detail="this.multipleSelection[0]"
        v-on:childEvent="listenEditChild"
      ></Edit>
    </transition>
  </div>
</template>
<script>
import Add from "./AdminAdd.vue";
import Edit from "./AdminEdit.vue";
import moment from "moment";
export default {
  components: { Add, Edit },
  data() {
    return {
      search: {
        pageNumber: 1,
        pageSize: 8
      },
      total: 0,
      loading: false,
      add: false,
      edit: false,
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
        .get("/admin/admin/list", {
          params: {
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
    deleteClick(row) {
      this.axios
        .delete("/admin/admin/deleted", { params: { id: row.id } })
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
    enableClick(row) {
      let param = new URLSearchParams();
      param.append("id", row.id);
      this.axios.post("/admin/admin/enable", param).then(data => {
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
    adminAdd() {
      this.add = true;
    },
    adminEdit() {
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
    },
    listenAddChild(data) {
      this.add = false;
      this.list();
    },
    listenEditChild(data) {
      this.edit = false;
      this.list();
    }
  },
  created() {
    this.list();
  }
};
</script>
<style>
.box-card {
  margin-bottom: 10px;
}
.chaozuobut {
  text-align: right;
  margin-bottom: -12px;
  margin-right: 20px;
}
</style>


