<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="公司名称：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.cName" placeholder="公司名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="机构代码：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.cCode" placeholder="机构代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间筛选：" label-width="90px">
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
        <el-button type="warning" size="small" @click="companyAdd">新增</el-button>
        <el-button type="info" size="small" @click="companyEdit">编辑</el-button>
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
        <el-table-column prop="id" label="#" width="80" align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="公司名称" mini-width="200" align="center"></el-table-column>
        <el-table-column prop="code" label="机构代码" width="200" align="center"></el-table-column>
        <el-table-column prop="deleted" label="状态" width="200" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.deleted === false" type="info" disable-transitions>正常</el-tag>
            <el-tag v-if="scope.row.deleted === true" type="danger" disable-transitions>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.deleted===false"
              @click="deleteClick(scope.row)"
              type="text"
              size="small"
            >禁用</el-button>
            <el-button
              v-if="scope.row.deleted===true"
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
        v-bind:data="this.multipleSelection[0]"
        v-on:childEvent="listenEditChild"
      ></Edit>
    </transition>
  </div>
</template>
<script>
import moment from "moment";
import Add from "./CompanyAdd.vue";
import Edit from "./CompanyEdit.vue";
export default {
  components: { Add, Edit },
  data() {
    return {
      search: {
        cName: "",
        cCode: "",
        time: "",
        startTime: "",
        endTime: "",
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
    list() {
      this.loading = true;
      this.axios
        .get("/admin/company/list", {
          params: {
            cName: this.search.cName,
            cCode: this.search.cCode,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
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
    companyAdd() {
      this.add = true;
    },
    companyEdit() {
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
    listenEditChild(data) {
      this.edit = false;
      this.list();
    },
    deleteClick(row) {
      this.axios
        .delete("/admin/company/deleted", { params: { id: row.id } })
        .then(data => {
          if (data.data.isSucc === false) {
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
      this.axios.post("/admin/company/enable", param).then(data => {
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

