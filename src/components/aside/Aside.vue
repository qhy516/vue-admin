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
    <el-menu-item index="/index">
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
      <el-menu-item index="/walletloglist">钱包日志列表</el-menu-item>
      <el-menu-item index="/">仓息列表</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>报表管理</span>
      </template>
      <el-menu-item index="/">资金报表</el-menu-item>
      <el-menu-item index="/">持仓报表</el-menu-item>
      <el-menu-item index="/">平仓报表</el-menu-item>
      <el-menu-item index="/">挂单报表</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>委托管理</span>
      </template>
      <el-menu-item index="/">委托列表</el-menu-item>
    </el-submenu>
     <el-submenu index="6">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>风险管理</span>
      </template>
      <el-menu-item index="/">风险率列表</el-menu-item>
    </el-submenu>
      <el-submenu index="7">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>股票管理</span>
      </template>
      <el-menu-item index="/">股票列表</el-menu-item>
      <el-menu-item index="/">交易时间</el-menu-item>
    </el-submenu>
    <el-submenu index="8">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>充值提现管理</span>
      </template>
      <el-menu-item index="/">充值列表</el-menu-item>
      <el-menu-item index="/">提现列表</el-menu-item>
    </el-submenu>
    <el-submenu index="9">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>文章分类管理</span>
      </template>
      <el-menu-item index="/">文章分类列表</el-menu-item>
    </el-submenu>
     <el-submenu index="10">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>文章管理</span>
      </template>
      <el-menu-item index="/">文章列表</el-menu-item>
    </el-submenu>
     <el-submenu index="11">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>银行管理</span>
      </template>
      <el-menu-item index="/">银行列表</el-menu-item>
    </el-submenu>
     <el-submenu index="12">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>银行卡管理</span>
      </template>
      <el-menu-item index="/">银行卡列表</el-menu-item>
    </el-submenu>
     <el-submenu index="13">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>移动支付管理</span>
      </template>
      <el-menu-item index="/">移动支付列表</el-menu-item>
    </el-submenu>
     <el-submenu index="14">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>公司管理</span>
      </template>
      <el-menu-item index="/">公司列表</el-menu-item>
    </el-submenu>
     <el-submenu index="15">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>管理员管理</span>
      </template>
      <el-menu-item index="/">管理员列表</el-menu-item>
      <el-menu-item index="/">操作日志列表</el-menu-item>
    </el-submenu>
     <el-submenu index="16">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>APP版本管理</span>
      </template>
      <el-menu-item index="/">APP版本列表</el-menu-item>
    </el-submenu>
     <el-submenu index="17">
      <template slot="title">
        <i class="el-icon-s-finance"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/">系统参数列表</el-menu-item>
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

