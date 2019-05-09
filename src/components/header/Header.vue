<template>
  <el-row>
    <el-col :span="8" class="biaoti">久梦股票管理系统</el-col>
    <el-col :span="8" class="userinfo">
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner">
          <img src="../../assets/user.png">
          {{adminName}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>我的消息</el-dropdown-item>
          <el-dropdown-item>设置</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return { adminName: "" };
  },
  methods: {
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch(() => {});
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.adminName = user.name || "";
    }
  }
};
</script>


<style scoped lang="scss">
@import "~scss_vars";
.userinfo {
  text-align: right;
  padding-right: 35px;
  float: right;
  .userinfo-inner {
    cursor: pointer;
    color: #fff;
    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 10px 0px 10px 10px;
      float: right;
    }
  }
}
.biaoti {
  text-align: left;
  margin-left: 85px;
  color: #fff;
  font-size: 19px;
  font-style: italic;
}
</style>
