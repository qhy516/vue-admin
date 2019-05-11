<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-col :span="6">
            <el-form-item label="用户ID：">
              <el-input class="forminput" size="small" v-model="search.uId" placeholder="用户ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：">
              <el-input class="forminput" size="small" v-model="search.phone" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户姓名：">
              <el-input
                class="forminput"
                size="small"
                v-model="search.realName"
                placeholder="用户真实姓名"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row class="chaozuobut">
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        <el-button type="warning" size="small" @click="info">详情</el-button>
        <el-button type="info" size="small" @click="recharge">充值</el-button>
        <el-button type="danger" size="small" @click="reWithdraw">提现</el-button>
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
        <el-table-column fixed prop="userId" label="用户#" width="60"></el-table-column>
        <el-table-column fixed prop="userName" label="用户账号" width="110" align="center"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" width="110" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="110" align="center"></el-table-column>
        <el-table-column prop="companyName" label="公司" width="110" align="center"></el-table-column>
        <el-table-column prop="owner" label="自有本金" width="110" align="center"></el-table-column>
        <el-table-column prop="stockAsset" label="总市值" width="110" align="center"></el-table-column>
        <el-table-column prop="totalKuisun" label="总盈亏" width="110" align="center"></el-table-column>
        <el-table-column prop="totalProfitAndLoss" label="浮动盈亏" width="110" align="center"></el-table-column>
        <el-table-column prop="stockTake" label="可取余额" width="110" align="center"></el-table-column>
        <el-table-column prop="stockUsed" label="可用余额" width="110" align="center"></el-table-column>
        <el-table-column prop="totalRecharge" label="累计入金" width="110" align="center"></el-table-column>
        <el-table-column prop="totalWithdraw" label="累计出金" width="110" align="center"></el-table-column>
        <el-table-column prop="netRecharge" label="净入金" width="110" align="center"></el-table-column>
        <el-table-column prop="totalInterest" label="累计过夜费" width="110" align="center"></el-table-column>
        <el-table-column prop="totalFee" label="累计手续费" width="110" align="center"></el-table-column>
        <el-table-column prop="totalStampDuty" label="累计印花税" width="110" align="center"></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        page-size="8"
        background
        layout="prev, pager, next, total"
        :total="this.total"
        :current-page="this.search.pageNumber"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
    <transition name="el-zoom-in-center">
      <detail
        v-if="this.detail"
        v-bind:userId="this.multipleSelection[0].userId"
        v-bind:userName="this.multipleSelection[0].userName"
        v-on:childEvent="listenDetailChild"
      ></detail>
    </transition>
    <transition name="el-zoom-in-center">
      <Charge
        v-if="this.charge"
        v-on:childEvent="listenChargeChild"
        v-bind:wallet="this.multipleSelection[0]"
      ></Charge>
    </transition>
    <transition name="el-zoom-in-center">
      <Withdraw
        v-if="this.withdraw"
        v-on:childEvent="listenWithdrawChild"
        v-bind:wallet="this.multipleSelection[0]"
      ></Withdraw>
    </transition>
  </div>
</template>
<script>
import Detail from "./WalletDetail.vue";
import Charge from "./WalletRecharge.vue";
import Withdraw from "./WalletWithdraw.vue";
export default {
  components: {
    Detail,
    Charge,
    Withdraw
  },
  data() {
    return {
      search: {
        uId: "",
        phone: "",
        realName: "",
        pageNumber: 1,
        pageSize: 8
      },
      total: null,
      loading: false,
      tableData: [],
      multipleSelection: [],
      detail: false,
      charge: false,
      withdraw: false
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    list() {
      this.loading = true;
      this.axios
        .get("/admin/wallet/list", {
          params: {
            uId: this.search.uId,
            phone: this.search.phone,
            realName: this.search.realName,
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
    info() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一个用户",
          type: "warning"
        });
      } else {
        this.detail = true;
      }
    },
    recharge() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一个用户",
          type: "warning"
        });
      } else {
        this.charge = true;
      }
    },
    reWithdraw() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length !== 1
      ) {
        this.$message({
          message: "我只能操作一个用户",
          type: "warning"
        });
      } else {
        this.withdraw = true;
      }
    },
    listenDetailChild(data) {
      this.detail = false;
    },
    listenChargeChild(data) {
      this.charge = false;
      this.list();
    },
    listenWithdrawChild() {
      this.withdraw = false;
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
<style>
.chaxun {
  float: right;
}
.forminput {
  width: 200px;
}
.pagination {
  text-align: center;
  margin-top: 20px;
}
.chaozuobut {
  text-align: right;
  margin-bottom: -12px;
  margin-right: 20px;
}
.box-card {
  margin-bottom: 10px;
}
</style>

