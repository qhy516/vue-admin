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
                v-model="search.realName"
                placeholder="用户账号/真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户ID：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.userId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：" label-width="90px">
              <el-input class="forminput" size="small" v-model="search.phone" placeholder="用户手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充值/提现：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.recharge" placeholder="充值/提现">
                  <el-option label="充值" :value="0"></el-option>
                  <el-option label="提现" :value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="支付方式：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.payType" placeholder="支付方式">
                  <el-option label="全部" value></el-option>
                  <el-option
                    v-for="item in payTypes"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付状态：" label-width="90px" style="width:102%">
              <el-col :span="22">
                <el-select class="select" v-model="search.status" placeholder="支付状态">
                  <el-option label="全部" value></el-option>
                  <el-option
                    v-for="item in statess"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
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
        <el-table-column fixed prop="userId" label="用户#" width="80" align="center"></el-table-column>
        <el-table-column
          fixed
          prop="createTime"
          label="创建时间"
          :formatter="dateFormat"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="120" align="center"></el-table-column>
        <el-table-column prop="recharge" label="充值/提现" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.recharge===0">充值</el-tag>
            <el-tag type="info" v-if="scope.row.recharge===1">提现</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icardNum" label="身份证号" width="180" align="center"></el-table-column>
        <el-table-column prop="tradeSn" label="交易单号" width="220" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" width="120" align="center"></el-table-column>
        <el-table-column prop="type" label="支付方式" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.type===0">支付宝</el-tag>
            <el-tag type="info" v-if="scope.row.type===1">微信</el-tag>
            <el-tag type="info" v-if="scope.row.type===2">面对面-银联</el-tag>
            <el-tag type="info" v-if="scope.row.type===3">微支联快捷</el-tag>
            <el-tag type="info" v-if="scope.row.type===4">微支联托管</el-tag>
            <el-tag type="info" v-if="scope.row.type===5">Citpay支付</el-tag>
            <el-tag type="info" v-if="scope.row.type===6">网银1</el-tag>
            <el-tag type="info" v-if="scope.row.type===7">网银2</el-tag>
            <el-tag type="info" v-if="scope.row.type===100">人工充值</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="merchantAccount" label="收款账号" width="220" align="center"></el-table-column>
        <el-table-column prop="merchantName" label="收款名字" width="120" align="center"></el-table-column>
        <el-table-column prop="merchantBankName" label="银行名字" width="120" align="center"></el-table-column>
        <el-table-column prop="status" label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status===0 && scope.row.recharge===0">未支付</el-tag>
            <el-tag type="success" v-if="scope.row.status===0 && scope.row.recharge===1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status===1 && scope.row.recharge===0">已支付</el-tag>
            <el-tag type="danger" v-if="scope.row.status===2">拒绝</el-tag>
            <el-tag type="warning" v-if="scope.row.status===3">取消</el-tag>
            <el-tag v-if="scope.row.status===4">确认收款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.recharge===0"
              @click="refuseReceivables(scope.row)"
              type="text"
              size="small"
            >拒绝收款</el-button>
            <el-button
              v-if="scope.row.recharge===0"
              @click="confirmReceivables(scope.row)"
              type="text"
              size="small"
            >确认收款</el-button>
            <el-button
              v-if="scope.row.recharge===1"
              @click="refuseReceivables(scope.row)"
              type="text"
              size="small"
            >拒绝</el-button>
            <el-button
              v-if="scope.row.recharge===1"
              @click="confirmReceivables(scope.row)"
              type="text"
              size="small"
            >通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :show-header="showHeader" :data="tableSum">
        <el-table-column class-name="talbleTitle" prop="title" width="120"></el-table-column>
        <el-table-column prop="sumFee" width="1000"></el-table-column>
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
        userId: "",
        phone: "",
        realName: "",
        time: "",
        startTime: "",
        endTime: "",
        recharge: 0,
        payType: "",
        status: "",
        pageNumber: 1,
        pageSize: 8
      },
      payTypes: [
        { code: "0", name: "支付宝" },
        { code: "1", name: "微信" },
        { code: "2", name: "面对面-银联" },
        { code: "3", name: "微支联快捷" },
        { code: "4", name: "微支联托管" },
        { code: "5", name: "Citpay支付" },
        { code: "6", name: "Joinpay网银支付" },
        { code: "7", name: "网银2支付" },
        { code: "100", name: "人工充值" }
      ],
      statess: [
        { code: "0", name: "未支付/提现待审核" },
        { code: "1", name: "已支付" },
        { code: "2", name: "取消" },
        { code: "3", name: "拒绝" },
        { code: "4", name: "确认收款" }
      ],
      total: 0,
      loading: false,
      showHeader: false,
      tableSum: [{ title: "", sumFee: "" }],
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
        .get("/admin/rechargeWithdrawOrder/list", {
          params: {
            userId: this.search.userId,
            phone: this.search.phone,
            realName: this.search.realName,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
            recharge: this.search.recharge,
            payType: this.search.payType,
            status: this.search.status,
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
      this.querySum();
    },
    querySum() {
      this.axios
        .get("/admin/rechargeWithdrawOrder/sum", {
          params: {
            userId: this.search.userId,
            phone: this.search.phone,
            realName: this.search.realName,
            startTime: this.search.startTime,
            endTime: this.search.endTime,
            recharge: this.search.recharge,
            payType: this.search.payType,
            status: this.search.status
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
            this.tableSum[0].title = "汇总统计：";
            if (this.search.recharge === 0) {
              this.tableSum[0].sumFee = "充值共计：" + data.data.result;
            }
            if (this.search.recharge === 1) {
              this.tableSum[0].sumFee = "提现共计：" + data.data.result;
            }
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
    refuseReceivables(row) {
      this.receivables(row, 3);
    },
    confirmReceivables(row) {
      this.receivables(row, 4);
    },
    receivables(row, status) {
      if (row.recharge === 0) {
        if (row.status !== 1) {
          this.$message({
            message: "充值订单只有已支付的订单才能有此操作",
            type: "error"
          });
          return;
        }
      }
      if (row.recharge === 1) {
        if (row.status !== 0) {
          this.$message({
            message: "提现订单只有待审核的订单才能有此操作",
            type: "error"
          });
          return;
        }
      }

      let param = new URLSearchParams();
      param.append("id", row.id);
      param.append("status", 4);
      param.append("userId", row.userId);
      this.axios
        .post("/admin/rechargeWithdrawOrder/modify", param)
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

