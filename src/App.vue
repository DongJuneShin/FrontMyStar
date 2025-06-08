<template>
  <div class="app-font">
    <router-view/>  <!-- 여기에 현재 경로에 맞는 컴포넌트가 뜹니다 -->
  </div>
</template>

<script>

import Login from "@/components/login/Login.vue";
import {getUserFromToken} from "@/utils/auth.js";
import {useUserStore} from "@/stores/user.js";
export default {
  components: {Login},

  mounted() {
    const userStore = useUserStore()
    userStore.fetchUser()  // ✅ 이 한 줄로 백엔드에서 사용자 정보 가져옴
  }
}
</script>

<style>
.app-font {
  font-family: 'Ownglyph_corncorn-Rg', sans-serif;
}
</style>
