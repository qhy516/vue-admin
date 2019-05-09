<template>
  <el-menu
    :default-active="$route.path"
    :router="router"
    :unique-opened="uniqueopened"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-user-solid"></i>
        <span>用户管理</span>
      </template>
      <el-menu-item index="/userlist">用户列表</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>钱包管理</span>
      </template>
      <el-menu-item index="/walletlist">钱包列表</el-menu-item>
      <el-menu-item index="/walletasset">资产估值</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      router: true,
      uniqueopened: true
    };
  },
  methods: {
    toPage(path) {
      this.$router.push(path);
    }
  }
};
</script>

