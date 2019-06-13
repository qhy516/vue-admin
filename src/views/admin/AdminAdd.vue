<template>
  <el-dialog title="新增管理员" :visible="this.visible" width="40%" @close="cancel">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="昵称：" prop="name" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name" placeholder="请设置账户名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.password" placeholder="请设置账户密码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.phone" placeholder="请设置手机号"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="验证码：" prop="verifyCode" :label-width="formLabelWidth">
        <el-col :span="8">
          <el-input v-model="detail.verifyCode" placeholder="输入验证码"></el-input>
        </el-col>
        <el-col :span="1">
          <el-input type="hidden"></el-input>
        </el-col>
        <el-col :span="10">
          <el-button @click="send" :disabled="butDisabled" type="danger" size="small" plain>
            <span v-show="show">获取验证码</span>
            <span v-show="!show" style>{{count}} 秒后重新获取</span>
          </el-button>
        </el-col>
      </el-form-item> -->
      <el-form-item label="所属公司：" prop="companyId" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.companyId" placeholder="请选择所在公司">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save" :loading="adding">新增</el-button>
    </div>
  </el-dialog>
</template>
<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      detail: {
        name: "",
        password: "",
        phone: "",
        companyId: "",
        verifyCode: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        // phone: [
        //   { required: true, message: "请输入手机号", trigger: "blur" }
        //   //{ validator: validaePass2 }
        // ],
        // verifyCode: [
        //   { required: true, message: "请输入验证码", trigger: "blur" }
        //   //{ validator: validaePass2 }
        // ],
        companyId: [
          { required: true, message: "请选择所在公司", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      count: 60,
      show: true,
      butDisabled: false,
      timer: null,
      formLabelWidth: "160px",
      companys: [],
      visible: true,
      adding: false
    };
  },
  methods: {
    companyList() {
      this.axios.get("/admin/company/all").then(data => {
        if (data.data.isSucc == false) {
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.companys = data.data.result;
        }
      });
    },
    send() {
      this.axios
        .post("/admin/admin/getRegisterVerifyCode")
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
    save(ev) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.adding = true;
          let param = new URLSearchParams();
          param.append("name", this.detail.name);
          param.append("password", md5(this.detail.password));
          param.append("phone", this.detail.phone);
          param.append("verifyCode", this.detail.verifyCode);
          param.append("companyId", this.detail.companyId);
          this.axios.post("/admin/admin/add", param).then(data => {
            this.adding = false;
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
              this.cancel();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.companyList();
  }
};
</script>

