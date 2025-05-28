<template>
    <div class="row">
      <div class="col-12 col-md-8">
        <FullCalendar :options="calendarOptions" />
      </div>
      <div class="col-12 col-md-4">
        <h5 class="mb-3">📅 스케줄 등록</h5>
        <form @submit.prevent="">
          <div class="mb-3">
            <label class="form-label">작성자</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">제목</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">내용</label>
            <textarea class="form-control" rows="7"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">시작일</label>
            <input type="date" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">완료일</label>
            <input type="date" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">일정 추가</button>
        </form>
      </div>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import {onMounted} from "vue";
import {getUserFromToken} from "@/utils/auth.js";
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        locale: koLocale,
        events: [
          { title: 'event 1', date: '2025-05-03' },
          { title: 'event 2', date: '2025-05-27' }
        ]
      }
    }
  },
  mounted() {
    // 컴포넌트가 마운트된 후 토큰에서 사용자 정보 가져와 작성자 자동 세팅
    const user = getUserFromToken()
    console.log("user : ",user)
    if (user && user.name) {
      this.form.writer = user.name  // 토큰 payload에 작성자 이름 필드명에 맞게 바꾸세요
    }
  },
  methods: {
    handleDateClick: function(arg) {
      alert('date click! ' + arg.dateStr)
    }
  }
}
</script>

<style>
a{
  color : black;
}
</style>
<!--
<style scoped>
.col-md-8{
  ::v-deep(.fc) {
    color: black !important;
  }
}
</style>-->
