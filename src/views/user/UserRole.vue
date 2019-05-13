<template>
  <el-dialog title="用户权限编辑" :visible="this.visible" width="50%" @close="closeDialog">
    <el-form :inline="true" :model="role" class="demo-form-inline">
      <el-col :span="12">
        <el-form-item label="用户账号：" label-width="100px">
          <el-input v-model="role.userName" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户姓名：" label-width="100px">
          <el-input v-model="role.realName" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-form :inline="true" :model="role" class="demo-form-inline">
      <el-col :span="12">
        <el-form-item label="所属公司：" label-width="100px">
          <el-input v-model="role.companyName" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户状态：" label-width="100px">
          <el-input v-if="role.deleted===0" value="正常" :disabled="true"></el-input>
          <el-input v-if="role.deleted===1" value="禁用" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-form ref="form" :model="userAuth">
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unLogin">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="买进权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unBuy">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="卖出权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unSell">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="充值权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unRecharge">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="提现权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unWithdraw">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="券买权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unBuyMargin">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="券卖权限：" label-width="100px">
            <el-col :span="19">
              <el-select v-model="userAuth.unSellMargin">
                <el-option label="允许" :value="false"></el-option>
                <el-option label="禁止" :value="true"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="save">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["visibleShow", "name"],
  data() {
    return {
      role: null,
      visible: true,
      formLabelWidth: "160px",
      userAuth: {
        unLogin: false,
        unBuy: false,
        unBuyMargin: false,
        unRecharge: false,
        unSell: false,
        unSellMargin: false,
        unWithdraw: false
      }
    };
  },
  methods: {
    userRole() {
      this.axios
        .get("/admin/userAuth/list", {
          params: {
            qValUser: this.name
          }
        })
        .then(data => {
          if (data.data.isSucc == false) {
            this.$message({
              message: data.data.message,
              type: "error"
            });
          } else {
            this.role = data.data.result.records[0];
            this.userAuth.unLogin =
              data.data.result.records[0].unLogin === 0 ? false : true;
            this.userAuth.unBuy =
              data.data.result.records[0].unBuy === 0 ? false : true;
            this.userAuth.unSell =
              data.data.result.records[0].unSell === 0 ? false : true;
            this.userAuth.unWithdraw =
              data.data.result.records[0].unWithdraw === 0 ? false : true;
            this.userAuth.unRecharge =
              data.data.result.records[0].unRecharge === 0 ? false : true;
            this.userAuth.unBuyMargin =
              data.data.result.records[0].unBuyMargin === 0 ? false : true;
            this.userAuth.unSellMargin =
              data.data.result.records[0].unSellMargin === 0 ? false : true;
          }
        });
    },
    save() {
      let param = new URLSearchParams();
      param.append("id", this.role.id);
      param.append("unLogin", this.userAuth.unLogin);
      param.append("unBuy", this.userAuth.unBuy);
      param.append("unSell", this.userAuth.unSell);
      param.append("unRecharge", this.userAuth.unRecharge);
      param.append("unWithdraw", this.userAuth.unWithdraw);
      param.append("unBuyMargin", this.userAuth.unBuyMargin);
      param.append("unSellMargin", this.userAuth.unSellMargin);

      this.axios.post("/admin/userAuth/update", param).then(data => {
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
          this.visible = false;
          this.callBack();
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
    callBack() {
      this.$emit("childEvent", false);
    }
  },
  created() {
    this.visible = this.visibleShow;
    this.userRole();
  }
};
</script>
<style>
.select {
  width: 100%;
}
.dialog-footer {
  margin-top: 10px;
}
.authRow {
  margin-top: 28px;
}
</style>

