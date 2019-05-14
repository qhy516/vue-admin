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
                v-model="search.qValName"
                placeholder="KEY/VALUE/DESCRIBE"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="systemEdit">编辑</el-button>
        <el-button type="warning" size="small"></el-button>
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
        <el-table-column prop="contentKey" label="KEY" width="320" align="center"></el-table-column>
        <el-table-column prop="content" label="VALUE" width="340" align="center">
          <template slot-scope="scope">
            <el-input type="textarea" :rows="1" v-model="scope.row.content"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="des" label="参数描述" width="320" align="center"></el-table-column>
        <el-table-column prop="deleted" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.deleted === false" type="info" disable-transitions>正常</el-tag>
            <el-tag v-if="scope.row.deleted === true" type="danger" disable-transitions>禁用</el-tag>
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
    <Edit
      v-if="this.edit"
      v-bind:data="this.multipleSelection[0]"
      v-on:childEvent="listenEditChild"
    ></Edit>
  </div>
</template>
<script>
import moment from "moment";
import Edit from "./SystemEdit.vue";
export default {
  components: { Edit },
  data() {
    return {
      search: {
        qValName: "",
        pageNumber: 1,
        pageSize: 8
      },
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
        .get("/admin/systemConfig/list", {
          params: {
            qValName: this.search.qValName,
            pageNumber: this.search.pageNumber,
            pageSize: this.search.pageSize
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
            this.tableData = data.data.result.result.records;
            this.total = data.data.result.result.total;
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
    systemEdit() {
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

