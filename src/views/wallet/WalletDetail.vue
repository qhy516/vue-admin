<template>
  <el-dialog title="钱包详情" :visible="this.visible" width="60%" @close="cancel">
    <el-card>
      <el-table
        v-loading="this.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(230,230,250, 0.8)"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="stock.name" label="股票名字" width="110"></el-table-column>
        <el-table-column prop="stock.symbol" label="股票代码" width="110" align="center"></el-table-column>
        <el-table-column prop="profitAndLoss" label="参考盈亏" width="100" align="center"></el-table-column>
        <el-table-column prop="profitAndLossPercent" label="盈亏比" width="100" align="center"></el-table-column>
        <el-table-column prop="hold" label="持仓" width="100" align="center"></el-table-column>
        <el-table-column prop="used" label="可用" width="100" align="center"></el-table-column>
        <el-table-column prop="averagePrice" label="成本" width="100" align="center"></el-table-column>
        <el-table-column prop="tradePrice" label="现价" width="100" align="center"></el-table-column>
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
export default {
  props: ["userId", "userName"],
  data() {
    return {
      visible: true,
      loading: false,
      pageNumber: 1,
      tableData: [],
      total: 0,
      currentRow: null
    };
  },
  methods: {
    list() {
      this.axios
        .get("/admin/wallet/detail", {
          params: {
            uId: this.userId
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
            console.log(data);
            this.tableData = data.data.result;
            this.total = this.tableData.length;
          }
        });
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

