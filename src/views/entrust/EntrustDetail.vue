<template>
  <el-dialog title="委托详情" :visible="this.visible" width="60%" @close="cancel">
    <el-card>
      <el-table
        v-loading="this.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(230,230,250, 0.8)"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column fixed prop="userId" label="用户#" width="60"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column prop="stockId" label="股票ID" width="80" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" type="info">买进</el-tag>
            <el-tag v-if="scope.row.type === 1" type="success">卖出</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="实际成交价格" width="110" align="center"></el-table-column>
        <el-table-column prop="count" label="数量" width="80" align="center"></el-table-column>
        <el-table-column prop="amount" label="实际成交总额" width="110" align="center"></el-table-column>
        <el-table-column prop="fee" label="手续费" width="80" align="center"></el-table-column>
        <el-table-column prop="yinhuasui" label="印花税" width="80" align="center"></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, total"
        :current-page="this.pageNumber"
        :total="this.total"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
  </el-dialog>
</template>
<script>
import moment from "moment";
export default {
  props: ["entrustId"],
  data() {
    return {
      visible: true,
      loading: false,
      pageNumber: 1,
      tableData: [],
      total: 0
    };
  },
  methods: {
    list() {
      this.axios
        .get("/admin/entrust/detail", {
          params: {
            entrustId: this.entrustId
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
            this.tableData = data.data.result.detailList;
            this.total = this.tableData.length;
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
      this.pageNumber = cur;
      this.list();
    },
    cancel() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.list();
  }
};
</script>

