<template>
  <div>
    <el-card class="box-card">
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="tradeTimeAdd">添加</el-button>
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
          label="创建时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="type" label="交易状态" width="250" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" type="info">可交易</el-tag>
            <el-tag v-if="scope.row.type === 1" type="danger">不可交易</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="是否删除" width="250" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.deleted === false" type="success">正常</el-tag>
            <el-tag v-if="scope.row.deleted === true" type="warning">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
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
    <Add v-if="this.add" v-on:childEvent="listenAddChild"></Add>
  </div>
</template>
<script>
import Add from "./TradeTimeAdd.vue";
import moment from "moment";
export default {
  components: { Add },
  data() {
    return {
      search: {
        pageNumber: 1,
        pageSize: 8
      },
      total: 0,
      loading: false,
      add: false,
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
        .get("/admin/stockTradeTime/list", {
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
    tradeTimeAdd() {
      this.add = true;
    },
    deleteClick(row) {
      this.$confirm(
        "确认关闭吗？关闭后该时间段将无法交易，请谨慎操作。",
        "提示",
        {
          type: "warning"
        }
      )
        .then(() => {
          this.axios
            .delete("/admin/stockTradeTime/deleted", {
              params: { tradeTimeId: row.id }
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
    listenAddChild() {
      this.add = false;
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

