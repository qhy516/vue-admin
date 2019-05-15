<template>
  <el-dialog title="新增文章" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item prop="title" label="标题：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="des" label="简介：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.des"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="classifyId" label="文章分类：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.classifyId" placeholder="请选择文章分类">
            <el-option
              v-for="item in classifys"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="content" label="内容：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input type="textarea" :rows="3" v-model="detail.content"></el-input>
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
        title: "",
        des: "",
        classifyId: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        des: [{ required: true, message: "请输入简介", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        classifyId: [
          { required: true, message: "请选择文章分类", trigger: "blur" }
        ]
      },
      classifys: [],
      formLabelWidth: "160px",
      adding: false,
      visible: true
    };
  },
  methods: {
    classifyList() {
      this.axios.get("/admin/articleClassify/all").then(data => {
        if (data.data.isSucc == false) {
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.classifys = data.data.result;
        }
      });
    },
    save(vet) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.adding = true;
          let param = new URLSearchParams();
          param.append("title", this.detail.title);
          param.append("des", this.detail.des);
          param.append("content", this.detail.content);
          param.append("classifyId", this.detail.classifyId);
          this.axios
            .post("/admin/article/add", param)
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
    cancle() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.classifyList();
  }
};
</script>
