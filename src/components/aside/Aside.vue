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

    <el-submenu v-for="(item, index) in routerData" :key="index" :index="item.id">
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
          childs: [{ id: 51, name: "委托列表", path: "/" }]
        },
        {
          id: 6,
          name: "风险管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [{ id: 61, name: "风险率列表", path: "/" }]
        },
        {
          id: 7,
          name: "股票管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 71, name: "股票列表", path: "/" },
            { id: 72, name: "交易时间", path: "/" }
          ]
        },
        {
          id: 8,
          name: "管理员管理",
          path: "",
          icon: "el-icon-s-finance",
          childs: [
            { id: 81, name: "管理员列表", path: "/" },
            { id: 82, name: "操作日志列表", path: "/" }
          ]
        }
      ]
    };
  },
  methods: {}
};
</script>

