<template>
  <el-dialog title="新增银行卡" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item prop="bankId" label="银行：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.bankId" placeholder="请选择银行">
            <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="cardNumber" label="银行卡号：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.cardNumber"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="realName" label="账户姓名：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.realName"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" :loading="editing" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      detail: {
        id: "",
        bankId: "",
        cardNumber: "",
        realName: ""
      },
      rules: {
        bankId: [{ required: true, message: "请选择银行", trigger: "blur" }],
        realName: [
          { required: true, message: "请填写真实姓名", trigger: "blur" }
        ],
        cardNumber: [
          { required: true, message: "请填写银行卡号", trigger: "blur" }
        ]
      },
      banks: [],
      formLabelWidth: "160px",
      editing: false,
      visible: true
    };
  },
  methods: {
    bankList() {
      this.axios.get("/admin/bank/all").then(data => {
        if (data.data.isSucc == false) {
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.banks = data.data.result;
        }
      });
    },
    save(vet) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.editing = true;
          let param = new URLSearchParams();
          param.append("id", this.detail.id);
          param.append("bankId", this.detail.bankId);
          param.append("cardNumber", this.detail.cardNumber);
          param.append("realName", this.detail.realName);
          this.axios
            .post("/admin/bankCard/modify", param)
            .then(data => {
              this.editing = false;
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
                this.cancle();
              }
            })
            .catch(error => {
              this.editing = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    this.detail = this.data;
    this.bankList();
  }
};
</script>
