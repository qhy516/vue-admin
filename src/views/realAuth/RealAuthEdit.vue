<template>
  <el-dialog title="实名认证审核" :visible="this.visible" width="65%" @close="cancle">
    <el-form :model="detail">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户账户：" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="detail.userName" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="真实姓名：" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="detail.realName" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号码：" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="detail.icardNum" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="detail">
      <el-row>
        <el-col :span="8">
          <el-form-item label="银行卡号：" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="detail.bankCardNum" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户行：" :label-width="formLabelWidth">
            <el-col :span="22">
              <el-input v-model="detail.openBank" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="12" class="colimg">
        <div class="outer_box">
          <img
            @click="icardzmRotate"
            :src="detail.icardZm"
            :style="{transform:'rotateZ('+icardzmDeg+'deg)'}"
          >
        </div>
        <div>
          <span style="fontSize:18px;">身份证正面</span>
        </div>
      </el-col>
      <el-col :span="12" class="colimg">
        <div class="outer_box">
          <img
            @click="icardfmRotate"
            :src="detail.icardFm"
            :style="{transform:'rotateZ('+icardfmDeg+'deg)'}"
          >
        </div>
        <div>
          <span style="fontSize:18px;">身份证反面</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="colimg">
        <div class="outer_box">
          <img
            @click="bankcardzmRotate"
            :src="detail.bankCardZm"
            :style="{transform:'rotateZ('+bankcardzmDeg+'deg)'}"
          >
        </div>
        <div>
          <span style="fontSize:18px;">银行卡正面</span>
        </div>
      </el-col>
    </el-row>
    <el-row style="marginTop:20px">
      <el-form :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item prop="remarks" label="备注：" :label-width="formLabelWidth">
          <el-col :span="22">
            <el-input type="textarea" :rows="2" v-model="detail.remarks"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="danger" :loading="jujue" @click="save(2)">拒绝</el-button>
      <el-button type="primary" :loading="tongguo" @click="save(3)">通过</el-button>
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
        icardZm: "",
        icardFm: "",
        bankCardZm: "",
        remarks: ""
      },
      rules: {
        remarks: [{ required: true, message: "请填写备注", trigger: "blur" }]
      },
      icardzmDeg: 0,
      icardfmDeg: 0,
      bankcardzmDeg: 0,
      multiples: 1,
      formLabelWidth: "100px",
      jujue: false,
      tongguo: false,
      visible: true
    };
  },
  methods: {
    save(status) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (status === 2) {
            this.jujue = true;
          }
          if (status === 3) {
            this.tongguo = true;
          }
          this.editing = true;
          let param = new URLSearchParams();
          param.append("id", this.detail.id);
          param.append("status", status);
          param.append("remarks", this.detail.remarks);
          this.axios
            .post("/admin/realAuthentication/examine", param)
            .then(data => {
              if (status === 2) {
                this.jujue = true;
              }
              if (status === 3) {
                this.tongguo = true;
              }
              if (data.data.isSucc == false) {
                if (status === 2) {
                this.jujue = false;
              }
              if (status === 3) {
                this.tongguo = false;
              }
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
              if (status === 2) {
                this.jujue = true;
              }
              if (status === 3) {
                this.tongguo = true;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 身份证正面旋转
    icardzmRotate() {
      this.icardzmDeg += 90;
      if (this.icardzmDeg >= 360) {
        this.icardzmDeg = 0;
      }
    },
    // 身份证反面旋转
    icardfmRotate() {
      this.icardfmDeg += 90;
      if (this.icardfmDeg >= 360) {
        this.icardfmDeg = 0;
      }
    },
    // 银行卡正面旋转
    bankcardzmRotate() {
      this.bankcardzmDeg += 90;
      if (this.bankcardzmDeg >= 360) {
        this.bankcardzmDeg = 0;
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
    this.detail = this.data;
  }
};
</script>
<style scoped>
.colimg {
  text-align: center;
}
.outer_box {
  margin: 0 auto;
  display: flex;
  vertical-align: middle;
  text-align: center;
  background: #e6dbdb;
  border-radius: 25px;
  width: 350px;
  height: 220px;
}

.outer_box > img {
  margin: auto auto;
  cursor: pointer;
  width: 300px;
  height: 200px;
}
</style>




