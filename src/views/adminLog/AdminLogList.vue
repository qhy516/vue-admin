<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="7">
            <el-form-item label="管理员ID：" label-width="100px">
              <el-input class="forminput" size="small" v-model="search.adminId" placeholder="管理员ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间筛选：" label-width="100px">
              <el-date-picker
                class="picker"
                v-model="search.time"
                @change="pickerChage"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
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
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column prop="adminName" label="管理员账户" width="120" align="center"></el-table-column>
        <el-table-column prop="des" label="操作描述" width="160" align="center"></el-table-column>
        <el-table-column prop="url" label="操作地址" mini-width="280" align="center"></el-table-column>
        <el-table-column prop="content" label="操作内容" mini-width="390" align="center">
          <template slot-scope="scope">
            <el-input type="textarea" :rows="1" v-model="scope.row.content"></el-input>
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
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      search: {
        adminId: "",
        pageNumber: 1,
        time: "",
        startTime: "",
        endTime: ""
      },
      loading: false,
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
        .get("/admin/adminLog/list", {
          params: {
            adminId: this.search.adminId,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
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
    onSubmit() {
      this.search.pageNumber = 1;
      this.list();
    },
    pickerChage() {
      let pick = this.search.time;
      if (pick) {
        this.search.startTime = moment(pick[0]).format("YYYY-MM-DD");
        this.search.endTime = moment(pick[1]).format("YYYY-MM-DD");
      } else {
        this.search.startTime = "";
        this.search.endTime = "";
      }
    },
    currentChange(cur) {
      this.search.pageNumber = cur;
      this.list();
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    this.list();
  }
};
</script>

<style>
.chaozuobut {
  text-align: right;
  margin-bottom: -12px;
  margin-right: 20px;
}
</style>
