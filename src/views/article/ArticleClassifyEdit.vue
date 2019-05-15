<template>
  <el-dialog title="文章分类编辑" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item prop="title" label="标题：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.title"></el-input>
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
      detail: null,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      },
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
          param.append("title", this.detail.title);
          this.axios
            .post("/admin/articleClassify/modify", param)
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
  }
};
</script>
