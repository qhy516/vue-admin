<template>
  <el-dialog title="钱包提现" :visible="this.visible" width="50%" @close="cancle">
    <el-form :inline="true" :model="detail" class="demo-form-inline">
      <el-col :span="12">
        <el-form-item label="用户ID：" label-width="100px">
          <el-input v-model="detail.userId" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户账户：" label-width="100px">
          <el-input v-model="detail.userName" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户姓名：" label-width="100px">
            <el-input v-model="detail.realName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可取金额：" label-width="100px">
            <el-input v-model="detail.stockTake" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-form-item label="提取金额：" label-width="100px">
            <el-input-number
              class="inputNumber"
              v-model="amount"
              controls-position="right"
              @change="handleChange"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save">提现</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["wallet"],
  data() {
    return {
      visible: true,
      detail: null,
      amount: 0
    };
  },
  methods: {
    save() {
      if (this.amount > this.detail.stockTake) {
        this.$message({
          message: "提现金额错误",
          type: "error"
        });
        return;
      }
      let param = new URLSearchParams();
      param.append("uid", this.detail.userId);
      param.append("amount", this.amount);
      this.axios.post("/admin/wallet/withdraw", param).then(data => {
        if (data.data.isSucc === false) {
          console.log(data);
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.cancle();
        }
      });
    },
    handleChange(val) {
      if (val > this.detail.stockTake || val < 0) {
        this.$message({
          message: "提现金额错误",
          type: "error"
        });
        this.amount = 0;
      }
    },
    cancle() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.detail = this.wallet;
  }
};
</script>

