<template>
  <div>
    <el-card class="box-card">
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="bankCardAdd">新增</el-button>
        <el-button type="warning" size="small" @click="bankCardEdit">修改</el-button>
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
          label="创建时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="bankName" label="银行名称" width="200" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="银行卡号" width="200" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="200" align="center"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
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
        v-bind:data="this.multipleSelection[0]"
        v-on:childEvent="listenEditChild"
      ></Edit>
    </transition>
  </div>
</template>
<script>
import Add from "./BankCardAdd.vue";
import Edit from "./BankCardEdit.vue";
import moment from "moment";
export default {
  components: { Add, Edit },
  data() {
    return {
      search: {
        pageNumber: 1,
        pageSize: 8
      },
      add: false,
      edit: false,
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
        .get("/admin/bankCard/list", {
          params: {
            pageNumber: this.search.pageNumber
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
    },
    deleteClick(row) {
      this.$confirm("确认删除吗？请谨慎操作。", "提示", {
        type: "warning"
      })
        .then(() => {
          this.axios
            .delete("/admin/bankCard/deleted", {
              params: { id: row.id }
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
    bankCardAdd() {
      this.add = true;
    },
    bankCardEdit() {
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
    listenEditChild() {
      this.edit = false;
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
