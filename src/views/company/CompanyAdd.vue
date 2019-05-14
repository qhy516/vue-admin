<template>
  <el-dialog title="新增公司" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail">
      <el-form-item label="公司名称：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="机构代码：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.code"></el-input>
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
        name: "",
        code: ""
      },
      formLabelWidth: "160px",
      adding: false,
      visible: true
    };
  },
  methods: {
    save() {
      this.editing = true;
      let param = new URLSearchParams();
      param.append("name", this.detail.name);
      param.append("code", this.detail.code);
      this.axios
        .post("/admin/company/add", param)
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
  }
};
</script>

