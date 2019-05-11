<template>
  <el-dialog title="钱包充值" :visible="this.visible" width="50%" @close="cancle">
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
          <el-form-item label="充值金额：" label-width="100px">
            <el-input-number
              class="inputNumber"
              v-model="amount"
              controls-position="right"
              @change="handleChange"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save">充值</el-button>
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
      if (this.amount <= 0) {
        this.$message({
          message: "充值金额错误",
          type: "error"
        });
        return;
      }
      let param = new URLSearchParams();
      param.append("uid", this.detail.userId);
      param.append("amount", this.amount);
      this.axios.post("/admin/wallet/recharge", param).then(data => {
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
    cancle() {
      this.visible = false;
      this.callBack();
    },
    handleChange(value) {
      if (value < 0) {
        this.$message({
          message: "充值金额错误",
          type: "error"
        });
        return;
      }
      this.amount = value;
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
<style>
.inputNumber {
  width: 206px;
}
</style>

