<template>
  <el-dialog title="管理员编辑" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="账号：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name" :disabled="nameDisabled"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="password" label="密码：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.password" type="password" show-password></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" :loading="editing" @click="save">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import cookies from "js-cookie";
import md5 from "js-md5";
export default {
  data() {
    return {
      nameDisabled: true,
      visible: true,
      editing: false,
      detail: {
        id: "",
        name: "",
        password: ""
      },
      formLabelWidth: "180px",
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      }
    };
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.editing = true;
          let param = new URLSearchParams();
          param.append("id", this.detail.id);
          param.append("password", md5(this.detail.password));
          this.axios.post("/admin/admin/modifyPassword", param).then(data => {
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
              sessionStorage.removeItem("user");
              cookies.remove("user");
              this.$router.push("/login");
              this.cancel();
            }
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
    let admin = JSON.parse(sessionStorage.getItem("user"));
    this.detail.id = admin.id;
    this.detail.name = admin.name;
  }
};
</script>

