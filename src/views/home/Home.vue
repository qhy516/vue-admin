<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Header from "../../components/header/Header.vue";
import Aside from "../../components/aside/Aside.vue";
export default {
  components: {
    Header,
    Aside
  }
};
</script>

<style>
/*定义滚动条样式（高宽及背景）*/
::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
   height: 8px;
  background: #ffffff;
}
/*定义滚动条轨道（凹槽）样式*/
::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); 较少使用 */
  border-radius: 3px;
}
/*定义滑块 样式*/
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  height: 100px; /* 滚动条滑块长度 */
  background-color: rgb(97, 94, 94);
}
.el-header {
  background-color: #4f94cd;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  /* text-align: center; */
  /* line-height: 200px; */
  height: 950px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
  height: 950px;
}
</style>