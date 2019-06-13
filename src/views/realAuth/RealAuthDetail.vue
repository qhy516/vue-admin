<template>
  <el-dialog title="实名认证详情" :visible="this.visible" width="65%" @close="cancle">
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
      <el-form :model="detail">
        <el-form-item prop="remarks" label="备注：" :label-width="formLabelWidth">
          <el-col :span="22">
            <el-input type="textarea" :rows="2" v-model="detail.remarks" :disabled="true"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">关闭</el-button>
    </div>-->
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
  background: rgba(223, 226, 230, 0.452);
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




