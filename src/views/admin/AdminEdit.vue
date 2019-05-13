<template>
  <el-dialog title="管理员编辑" :visible="this.visible" width="50%" @close="cancel">
    <el-form :model="admin">
      <el-form-item label="账号：" :label-width="formLabelWidth">
        <el-col :span="12">
          <el-input v-model="admin.name" placeholder="请设置账户名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-col :span="12">
          <el-input type="password" v-model="admin.password" placeholder="请设置账户密码" show-password></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号：" :label-width="formLabelWidth">
        <el-col :span="12">
          <el-input v-model="admin.phone" placeholder="请设置手机号"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="所属公司：" :label-width="formLabelWidth">
        <el-col :span="12">
          <el-select class="select" v-model="admin.companyId" placeholder="请选择所在公司">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save" :loading="editing">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import md5 from "js-md5";
export default {
  props: ["detail"],
  data() {
    return {
      visible: true,
      editing: false,
      admin: null,
      formLabelWidth: "250px",
      oldpwd: "",
      companys: []
    };
  },
  methods: {
    companyList() {
      this.axios.get("/admin/company/all").then(data => {
        if (data.data.isSucc == false) {
          this.$message({
            message: data.data.message,
            type: "error"
          });
        } else {
          this.companys = data.data.result;
        }
      });
    },
    save() {
      this.editing = true;
      let param = new URLSearchParams();
      param.append("id", this.admin.id);
      param.append("name", this.admin.name);
      if (this.admin.password === this.oldpwd) {
        param.append("password", "");
      } else {
        param.append("password", md5(this.admin.password));
      }
      param.append("phone", this.admin.phone);
      param.append("companyId", this.admin.companyId);
      this.axios.post("/admin/admin/modify", param).then(data => {
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
          this.cancel();
        }
      });
    },
    cancel() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.companyList();
    this.admin = this.detail;
    this.oldpwd = this.admin.password;
  }
};
</script>

