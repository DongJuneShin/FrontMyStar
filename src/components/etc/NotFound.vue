<template>
  <div class="not-found">
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지는 존재하지 않거나 이동되었어요.</p>
    <RouterLink to="/">홈으로 돌아가기</RouterLink>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
.not-found h1 {
  font-size: 3rem;
  color: #ff5555;
}
.not-found p {
  margin-top: 20px;
  font-size: 1.2rem;
}
</style>