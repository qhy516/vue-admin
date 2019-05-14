<template>
  <el-dialog title="交易时间新增" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="交易时间：" prop="time" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-date-picker
            style="width:100%"
            v-model="detail.time"
            type="date"
            placeholder="选择交易时间"
            @change="pickerChage"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="交易状态：" prop="type" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.type" placeholder="请选择交易类型">
            <el-option label="可交易" :value="0"></el-option>
            <el-option label="不可交易" :value="1"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save" :loading="adding">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      visible: true,
      detail: {
        type: "",
        tradeTime: "",
        time: ""
      },
      rules: {
        time: [
          { required: true, message: "请选择交易时间", trigger: "blur" }
          //{ validator: validaePass }
        ],
        type: [
          { required: true, message: "请选择交易状态", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      adding: false,
      formLabelWidth: "160px"
    };
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.adding = true;
          let param = new URLSearchParams();
          param.append("type", this.detail.type);
          param.append("tradeTime", this.detail.tradeTime);
          this.axios.post("/admin/stockTradeTime/add", param).then(data => {
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
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    pickerChage() {
      let pick = this.detail.time;
      if (pick) {
        this.detail.tradeTime = moment(pick[0]).format("YYYY-MM-DD");
      } else {
        this.detail.tradeTime = "";
      }
    },
    cancle() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  }
};
</script>

