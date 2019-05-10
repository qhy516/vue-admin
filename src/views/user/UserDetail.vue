<template>
  <el-dialog title="用户信息修改" :visible="this.visible" width="40%" @close="closeDialog">
    <el-form :model="detail">
      <el-form-item label="昵称：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="真实姓名：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.realName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="身份证号：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.icardNum"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所属公司：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.companyCode" placeholder="请选择所在公司">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["visibleShow", "detailData"],
  data() {
    return {
      detail: null,
      visible: true,
      companys: [],
      formLabelWidth: "160px"
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
    closeDialog() {
      this.visible = false;
      this.callBack();
    },
    cancle() {
      this.visible = false;
      this.callBack();
    },
    save() {
      this.visible = false;
      this.callBack();
    },
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.detail = this.detailData;
    this.visible = this.visibleShow;
    this.companyList();
  }
};
</script>
<style>
.select {
  width: 100%;
}
</style>

