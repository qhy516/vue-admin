<template>
  <el-dialog title="新增APP版本" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="search" :rules="rules" ref="ruleForm">
      <el-form-item prop="ver" label="版本号：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="search.ver"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="url" label="下载地址：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="search.url"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="des" label="更新内容：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="search.des"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="platform" label="操作系统：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="search.platform" placeholder="app操作系统">
            <el-option label="Android" value="0"></el-option>
            <el-option label="Ios" value="1"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item prop="forceUpdate" label="强制更新：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="search.forceUpdate" placeholder="是否强制更新">
            <el-option label="不强制更新" value="0"></el-option>
            <el-option label="强制更新" value="1"></el-option>
          </el-select>
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
      search: {
        ver: "",
        url: "",
        des: "",
        platform: "",
        forceUpdate: ""
      },
      rules: {
        ver: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        url: [{ required: true, message: "请输入安装包链接", trigger: "blur" }],
        des: [{ required: true, message: "请输入更新内容", trigger: "blur" }],
        platform: [
          { required: true, message: "请选择APP操作系统", trigger: "blur" }
        ],
        forceUpdate: [
          { required: true, message: "请选择是否强制更新", trigger: "blur" }
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
          param.append("ver", this.search.ver);
          param.append("url", this.search.url);
          param.append("des", this.search.des);
          param.append("platform", this.search.platform);
          param.append("forceUpdate", this.search.forceUpdate);
          this.axios
            .post("/admin/appVersion/add", param)
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
  }
};
</script>

