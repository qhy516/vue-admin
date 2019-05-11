<template>
  <el-form
    :model="ruleForm2"
    :rules="rules2"
    ref="ruleForm2"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm login-container"
  >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="name">
      <el-input type="text" v-model="ruleForm2.name" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input
            type="text"
            v-model="ruleForm2.verifyCode"
            auto-complete="off"
            placeholder="验证码"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-button @click="send" :disabled="butDisabled" type="danger" size="small" plain>
            <span v-show="show">获取验证码</span>
            <span v-show="!show" style>{{count}} 秒后重新获取</span>
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import md5 from "js-md5";
export default {
  data() {
    return {
      count: 60,
      show: true,
      timer: null,
      logining: false,
      butDisabled: false,
      ruleForm2: {
        name: "admin1",
        password: "123456",
        verifyCode: ""
      },
      rules2: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      }
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    send() {
      let param = new URLSearchParams();
      param.append("name", this.ruleForm2.name);
      param.append("password", this.ruleForm2.password);
      axios
        .post("/admin/user/getVerifyCode", param)
        .then(data => {
          if (data.data.isSucc == false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.$message({
              message: "验证码发送成功",
              type: "success"
            });
            if (!this.timer) {
              this.count = 60;
              this.show = false;
              this.butDisabled = true;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= 60) {
                  this.count--;
                } else {
                  this.show = true;
                  this.butDisabled = false;
                  clearInterval(this.timer); // 清除定时器
                  this.timer = null;
                }
              }, 1000);
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            message: "验证码发送失败",
            type: "error"
          });
        });
    },
    handleSubmit2(ev) {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          let param = new URLSearchParams();
          param.append("name", this.ruleForm2.name);
          param.append("password", md5(this.ruleForm2.password));
          param.append("verifyCode", this.ruleForm2.verifyCode);
          axios
            .post("/admin/user/login", param)
            .then(data => {
              this.logining = false;
              if (data.data.isSucc == false) {
                this.$message({
                  message: data.data.message,
                  type: "error"
                });
              } else {
                sessionStorage.setItem(
                  "user",
                  JSON.stringify(data.data.result)
                );
                this.$router.push({ path: "/index" });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>