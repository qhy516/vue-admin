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
                v-model="search.qVal"
                placeholder="股票代码/股票名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="股票ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.stockId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否删除：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.state" placeholder="是否删除">
                  <el-option label="全部" value></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="融资/融券：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.type" placeholder="融资/融券">
                  <el-option label="全部" value></el-option>
                  <el-option label="融资" value="0"></el-option>
                  <el-option label="融券" value="1"></el-option>
                  <el-option label="融资-融券" value="2"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small" @click="stockEdit">编辑</el-button>
        <el-button type="info" size="small" @click="stockDelete">关闭</el-button>
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
        <el-table-column fixed prop="id" label="#" width="100"></el-table-column>
        <el-table-column fixed prop="symbol" label="股票代码" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="股票名字" width="100" align="center"></el-table-column>
        <el-table-column prop="amount" label="成交额" width="100" align="center"></el-table-column>
        <el-table-column prop="volume" label="成交量/手" width="100" align="center"></el-table-column>
        <el-table-column prop="changepercent" label="涨跌幅" width="100" align="center"></el-table-column>
        <el-table-column prop="pricechange" label="涨跌额" width="100" align="center"></el-table-column>
        <el-table-column prop="buy" label="买一价" width="100" align="center"></el-table-column>
        <el-table-column prop="sell" label="卖一价" width="100" align="center"></el-table-column>
        <el-table-column prop="trade" label="最新价" width="100" align="center"></el-table-column>
        <el-table-column prop="high" label="高" width="100" align="center"></el-table-column>
        <el-table-column prop="low" label="低" width="100" align="center"></el-table-column>
        <el-table-column prop="open" label="开" width="100" align="center"></el-table-column>
        <el-table-column prop="settlement" label="收" width="100" align="center"></el-table-column>
        <el-table-column prop="deleted" label="是否删除" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.deleted===false">正常</el-tag>
            <el-tag type="danger" v-if="scope.row.deleted===true">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type===0">融资</el-tag>
            <el-tag type="success" v-if="scope.row.type===1">融券</el-tag>
            <el-tag type="warning" v-if="scope.row.type===2">融资-融券</el-tag>
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
      <Edit
        v-if="this.edit"
        v-bind:stock="this.multipleSelection[0]"
        v-on:childEvent="listenEditChild"
      ></Edit>
    </transition>
  </div>
</template>

<script>
import Edit from "./StockEdit.vue";
export default {
  components: { Edit },
  data() {
    return {
      search: {
        stockId: "",
        qVal: "",
        state: "",
        type: "",
        pageNumber: 1,
        pageSize: 8
      },
      loading: false,
      edit: false,
      total: 0,
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
        .get("/admin/stock/list", {
          params: {
            stockId: this.search.stockId,
            qVal: this.search.qVal,
            state: this.search.state,
            type: this.search.type,
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
    stockEdit() {
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
    stockDelete() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一条数据",
          type: "warning"
        });
      } else {
        this.$confirm(
          "确认关闭吗？关闭后该支股票将无法使用，请谨慎操作。",
          "提示",
          {
            type: "warning"
          }
        )
          .then(() => {
            this.axios
              .delete("/admin/user/realDeleted", {
                params: { stockId: row.id }
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
      }
    },
    listenEditChild() {
      this.edit = false;
      this.list();
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
