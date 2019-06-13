<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="用户ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.uId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="条件搜索：" label-width="90px">
              <el-input
                class="forminput"
                size="small"
                v-model="search.qValUser"
                placeholder="用户账号/真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="认证状态：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.status" placeholder="认证状态">
                  <el-option label="全部" value></el-option>
                  <el-option label="待审核" value="1"></el-option>
                  <el-option label="拒绝" value="2"></el-option>
                  <el-option label="通过" value="3"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="realAuthDetail">详情</el-button>
        <el-button type="warning" size="small" @click="realAuthEdit">审核</el-button>
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
          label="申请时间"
          :formatter="dateFormat"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column prop="userName" label="用户账户" width="120" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" mini-width="120" align="center"></el-table-column>
        <el-table-column prop="icardNum" label="身份证号码" width="165" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="100" align="center"></el-table-column>
        <el-table-column prop="bankCardNum" label="银行卡号" width="180" align="center"></el-table-column>
        <el-table-column prop="openBank" label="开户行" mini-width="140" align="center"></el-table-column>
        <el-table-column prop="deleted" label="认证状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="info" disable-transitions>待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="warning" disable-transitions>拒绝</el-tag>
            <el-tag v-if="scope.row.status === 3" type="success" disable-transitions>通过</el-tag>
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
      <Detail
        v-if="this.detail"
        v-bind:data="this.multipleSelection[0]"
        v-on:childEvent="listenDetailChild"
      ></Detail>
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
import Detail from "./RealAuthDetail.vue";
import Edit from "./RealAuthEdit.vue";
export default {
  components: { Detail, Edit },
  data() {
    return {
      search: {
        uId: "",
        qValUser: "",
        status: "",
        pageNumber: 1,
        pageSize: 8
      },
      detail: false,
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
        .get("/admin/realAuthentication/list", {
          params: {
            uId: this.search.uId,
            qValUser: this.search.qValUser,
            status: this.search.status,
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
    realAuthDetail() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一条数据",
          type: "warning"
        });
      } else {
        this.detail = true;
      }
    },
    realAuthEdit() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一条数据",
          type: "warning"
        });
      } else {
        if (this.multipleSelection[0].status !== 1) {
          this.$message({
            message: "我只操作待审核的数据",
            type: "warning"
          });
        } else {
          this.edit = true;
        }
      }
    },
    listenDetailChild(data) {
      this.detail = false;
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

