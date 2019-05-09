<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="210px">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <transition>
          <router-view></router-view>
        </transition>
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
  height: 680px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
  height: 680px;
}
</style>