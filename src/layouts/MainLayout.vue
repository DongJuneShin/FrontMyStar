<template>
  <div class="d-flex vh-100">
    <!-- 왼쪽 수직 메뉴바 -->
    <aside class="p-3" style="width: 220px;">
      <img class="myPuppy img-fluid" src="/assets/image/loginPuppy2.png" alt="강아지사진" />
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/home" class="nav-link text-black">🏠 홈</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/profile" class="nav-link text-black">👤 프로필</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/board" class="nav-link text-black">📝 게시판</router-link>
        </li>
      </ul>
    </aside>

    <!-- 오른쪽 콘텐츠 영역 -->
    <main class="flex-grow-1 bg-light p-4 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  }
};
</script>

<style scoped>
/* 필요시 스타일 커스터마이징 */
</style>