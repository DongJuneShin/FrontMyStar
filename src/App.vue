<template>
  <div class="app-font">
<!--    <Login/>-->
    <router-view/>  <!-- 여기에 현재 경로에 맞는 컴포넌트가 뜹니다 -->
  </div>
</template>

<script>

import Login from "@/components/login/Login.vue";
export default {
  components: {Login},
  setup() {
    return {}
  }
}
</script>

<style>
.app-font {
  font-family: 'Ownglyph_corncorn-Rg', sans-serif;
}
</style>
