<template>
  <el-dialog title="股票编辑" :visible="this.visible" width="40%" @close="cancle">
    <el-form :model="detail">
      <el-form-item label="股票代码：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.symbol" disabled="true"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="股票名称：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-input v-model="detail.name" disabled="true"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="股票类型：" :label-width="formLabelWidth">
        <el-col :span="16">
          <el-select class="select" v-model="detail.type" placeholder="请选择股票类型">
            <el-option label="融资" :value="0"></el-option>
            <el-option label="融券" :value="1"></el-option>
            <el-option label="融资-融券" :value="2"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save" :loading="editing">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["stock"],
  data() {
    return {
      visible: true,
      detail: null,
      editing: false,
      formLabelWidth: "160px"
    };
  },
  methods: {
    cancle() {
      this.visible = false;
      this.callBack();
    },
    save() {
      this.editing = true;
      let param = new URLSearchParams();
      param.append("stockId", this.detail.id);
      param.append("type", this.detail.type);
      this.axios
        .post("/admin/stock/modify", param)
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
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.detail = this.stock;
  }
};
</script>


