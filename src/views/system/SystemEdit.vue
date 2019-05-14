<template>
  <el-dialog title="系统参数编辑" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item prop="contentKey" label="参数名：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.contentKey" :disabled="this.contentDisable"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="content" label="参数值：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.content"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="des" label="参数描述：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.des"></el-input>
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
      contentDisable: true,
      detail: null,
      formLabelWidth: "160px",
      editing: false,
      visible: true
    };
  },
  methods: {
    save(vet) {
      this.adding = true;
      let param = new URLSearchParams();
      param.append("id", this.detail.id);
      param.append("content", this.detail.content);
      param.append("des", this.detail.des);
      this.axios
        .post("/admin/systemConfig/modify", param)
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

