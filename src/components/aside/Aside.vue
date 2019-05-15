<template>
  <el-menu
    :default-active="$route.path"
    :router="router"
    :unique-opened="uniqueopened"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/index">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-submenu v-for="(item, index) in routerData" :key="index" :index="item.id+''">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>
      <el-menu-item
        v-for="(child,indexx) in item.childs"
        :key="indexx"
        :index="child.path"
      >{{child.name}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      router: true,
      uniqueopened: true,
      routerData: [
        {
          id: 2,
          name: "用户管理",
          path: "",
          icon: "el-icon-user-solid",
          childs: [{ id: 21, name: "用户列表", path: "/userlist" }]
        },
        {
          id: 3,
          name: "钱包管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 31, name: "钱包列表", path: "/walletlist" },
            { id: 32, name: "钱包日志列表", path: "/walletloglist" },
            { id: 33, name: "仓息列表", path: "/feelist" }
          ]
        },
        {
          id: 4,
          name: "报表管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 41, name: "资金报表", path: "/" },
            { id: 42, name: "持仓报表", path: "/" },
            { id: 43, name: "平仓报表", path: "/" },
            { id: 44, name: "挂单报表", path: "/" }
          ]
        },
        {
          id: 5,
          name: "委托管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 51, name: "委托列表", path: "/entrustlist" }]
        },
        {
          id: 6,
          name: "风险管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 61, name: "风险率列表", path: "/closelinelist" }]
        },
        {
          id: 7,
          name: "股票管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 71, name: "股票列表", path: "/stocklist" },
            { id: 72, name: "交易时间", path: "/tradetimelist" }
          ]
        },
        {
          id: 8,
          name: "财务管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 81, name: "充值/提现列表", path: "/rechargelist" }
            // { id: 82, name: "提现列表", path: "/withdrawallist" }
          ]
        },
        {
          id: 9,
          name: "公司管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 91, name: "公司列表", path: "/companylist" }]
        },
        {
          id: 10,
          name: "管理员管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 101, name: "管理员列表", path: "/adminlist" },
            { id: 102, name: "操作日志列表", path: "/adminloglist" }
          ]
        },
        {
          id: 11,
          name: "app版本管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 111, name: "app版本列表", path: "/appversionlist" }]
        },
        {
          id: 12,
          name: "系统管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 121, name: "系统参数列表", path: "/systemlist" }]
        },
        {
          id: 13,
          name: "文章管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 131, name: "文章分类列表", path: "/articleclassifylist" },
            { id: 132, name: "文章列表", path: "/articlelist" }
          ]
        },
        {
          id: 14,
          name: "银行管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 141, name: "银行列表", path: "/banklist" },
            { id: 142, name: "银行卡列表", path: "/bankcardlist" }
          ]
        },
        {
          id: 15,
          name: "支付方式管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 151, name: "支付方式列表", path: "/paymentlist" }]
        }
      ]
    };
  },
  methods: {}
};
</script>

