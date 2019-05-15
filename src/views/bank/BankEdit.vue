<template>
  <el-dialog title="银行编辑" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item prop="name" label="银行名称：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name"></el-input>
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
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入银行名称", trigger: "blur" }]
      },
      classifys: [],
      formLabelWidth: "160px",
      editing: false,
      visible: true
    };
  },
  methods: {
    save(vet) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.editing = true;
          let param = new URLSearchParams();
          param.append("id", this.detail.id);
          param.append("name", this.detail.name);
          this.axios
            .post("/admin/bank/modify", param)
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
    this.classifyList();
  }
};
</script>
