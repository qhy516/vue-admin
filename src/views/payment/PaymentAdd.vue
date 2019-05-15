<template>
  <el-dialog title="新增支付方式" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="支付分类：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.type" placeholder="支付分类">
            <el-option label="支付宝" value="0"></el-option>
            <el-option label="微信" value="1"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="account" label="账户：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.account"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="accountName" label="账户名称：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.accountName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="qrCodeUrl" label="收款二维码：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :before-remove="beforeRemove"
            :multiple="multiple"
            :limit="limit"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList"
          >
            <el-button size="small" plain>
              点击上传二维码
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" :loading="adding" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      detail: {
        type: "",
        account: "",
        accountName: "",
        qrCodeUrl: ""
      },
      headers: {
        token: "",
        userId: "",
        companyId: "",
        level: ""
      },
      action: "",
      fileList: [],
      multiple: false,
      limit: 1,
      rules: {
        type: [{ required: true, message: "请选择支付分类", trigger: "blur" }],
        account: [{ required: true, message: "请填写账号", trigger: "blur" }],
        accountName: [
          { required: true, message: "请填写账户名", trigger: "blur" }
        ],
        qrCodeUrl: [
          { required: true, message: "请上传收款二维码", trigger: "blur" }
        ]
      },
      formLabelWidth: "160px",
      adding: false,
      visible: true
    };
  },
  methods: {
    save(vet) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.adding = true;
          let param = new URLSearchParams();
          param.append("type", this.detail.type);
          param.append("account", this.detail.account);
          param.append("accountName", this.detail.accountName);
          param.append("qrCodeUrl", this.detail.qrCodeUrl);
          this.axios
            .post("/admin/aliWechatPay/add", param)
            .then(data => {
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
                this.cancle();
              }
            })
            .catch(error => {
              this.adding = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSuccess(response, file, fileList) {
      if (response.isSucc == false) {
        this.$message({
          message: response.message,
          type: "error"
        });
      } else {
        this.$message({
          message: "二维码上传成功",
          type: "success"
        });
        this.detail.qrCodeUrl = response.result;
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
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
    this.action = this.axios.defaults.baseURL + "/admin/video/add";
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.headers.token = user.token;
    this.headers.userId = user.id;
    this.headers.companyId = user.companyId;
    this.headers.level = user.level;
  }
};
</script>
