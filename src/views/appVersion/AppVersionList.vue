<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="操作系统：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.flatform" placeholder="app操作系统">
                  <el-option label="全部" value></el-option>
                  <el-option label="Android" value="0"></el-option>
                  <el-option label="Ios" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="APP版本：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.ver" placeholder="根据APP版本查询"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small" @click="versionAdd">新增</el-button>
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
        <el-table-column prop="platform" label="操作系统" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.platform === 0" type="info" disable-transitions>Android</el-tag>
            <el-tag v-if="scope.row.platform === 1" disable-transitions>Ios</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ver" label="版本号" width="120" align="center"></el-table-column>
        <el-table-column prop="deleted" label="强制更新" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.forceUpdate === 0" type="danger" disable-transitions>不强制更新</el-tag>
            <el-tag v-if="scope.row.forceUpdate === 1" type="warning" disable-transitions>强制更新</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="安装包链接" mini-width="270" align="center"></el-table-column>
        <el-table-column prop="des" label="描述" mini-width="280" align="center">
          <template slot-scope="scope">
            <el-input type="textarea" :rows="1" v-model="scope.row.des"></el-input>
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
  </div>
</template>
<script>
import Add from "./AppVersionAdd.vue";
import moment from "moment";
export default {
  components: { Add },
  data() {
    return {
      search: {
        flatform: "",
        ver: "",
        pageNumber: 1,
        pageSize: 8
      },
      add: false,
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
        .get("/admin/appVersion/list", {
          params: {
            flatform: this.search.flatform,
            ver: this.search.ver,
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
    versionAdd() {
      this.add = true;
    },
    listenAddChild(data) {
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

