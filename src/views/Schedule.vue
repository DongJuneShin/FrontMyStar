<template>
  <div class="row">
    <div class="col-12 col-md-8">
      <FullCalendar ref="calendar" :options="calendarOptions" />
    </div>
    <div class="col-12 col-md-4">
      <h5 class="mb-3">📅 스케줄 등록</h5>
      <form @submit.prevent="addSchedule">
        <div class="mb-3">
          <label class="form-label">작성자</label>
          <input type="text" v-model="form.writer" class="form-control" required readonly />
        </div>
        <div class="mb-3">
          <label class="form-label">제목</label>
          <input type="text" v-model="form.title" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">내용</label>
          <textarea class="form-control" v-model="form.content" rows="7"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">시작일</label>
          <input type="date" v-model="form.startDate" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">완료일</label>
          <input type="date" v-model="form.endDate" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">저장하기</button>
        <button v-if="selectedEventId" type="button" class="btn btn-danger w-100 mt-2" @click="deleteSchedule">
          삭제하기
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'
import { useUserStore } from '@/stores/user.js'
import api from '@/lib/axios.js'

export default {
  components: { FullCalendar },
  data() {
    return {
      form: {
        writer: '',
        title: '',
        content: '',
        startDate: '',
        endDate: ''
      },
      selectedEventId : null,
      calendarEvents: [], // 전체 이벤트 배열 관리
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: koLocale,
        dateClick: this.handleDateClick,
        datesSet: this.onDateSet,
        events: [],
        eventClick: this.handleEventClick
      },
      currentYearMonth: ''
    }
  },
  mounted() {
    const userStore = useUserStore()
    userStore.fetchUser().then(() => {
      if (userStore.user?.nickname) {
        this.form.writer = userStore.user.nickname
      }
    }).catch(e => {
      console.error('사용자 정보 로딩 실패:', e)
    })

    this.selectSchduleList()
  },
  methods: {
    onDateSet(info) {
      const currentDate = info.start
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      this.currentYearMonth = `${year}-${month.toString().padStart(2, '0')}`
      this.selectSchduleList()
    },
    async selectSchduleList() {
      try {
        const response = await api.get('/schedule/selectScheduleList', {
          params: { yearMonth: this.currentYearMonth }
        })

        const schedules = response.data.data

        const events = schedules.map(item => ({
          id: item.no,
          title: item.title,
          start: item.startDate,
          end: item.endDate || item.startDate,
          extendedProps: {
            writer: item.writer,
            content: item.content
          }
        }))
        this.calendarEvents = events

        const calendarApi = this.$refs.calendar.getApi()
        calendarApi.removeAllEvents()
        this.calendarEvents.forEach(event => calendarApi.addEvent(event))
      } catch (e) {
        alert('스케쥴리스트 가져오기 중 에러발생 : ' + e)
      }
    },
    async addSchedule() {
      // 필수 입력 체크
      if (!this.form.title) {
        alert('제목은 필수값 입니다.')
        return
      }
      if (!this.form.startDate) {
        alert('시작일은 필수값 입니다.')
        return
      }
      if (!this.form.endDate) {
        alert('종료일은 필수값 입니다.')
        return
      }

      const userStore = useUserStore()
      const payload = {
        writer: userStore.user.username,
        title: this.form.title,
        content: this.form.content,
        startDate: this.form.startDate,
        endDate: this.form.endDate
      }

      try {
        const response = await api.post('/schedule/insertSchdule', payload)

        if (response.data.successAt === '200') {
          const newEvent = {
            id: response.data.newScheduleId || Date.now(), // 서버에서 새 일정 ID를 줘야 함
            title: this.form.title,
            start: this.form.startDate,
            end: this.form.endDate,
            extendedProps: {
              content: this.form.content,
              writer: payload.writer
            }
          }

          // 기존 이벤트 배열에 추가
          this.calendarEvents.push(newEvent)

          // FullCalendar 이벤트 갱신
          const calendarApi = this.$refs.calendar.getApi()
          calendarApi.removeAllEvents()
          this.calendarEvents.forEach(event => calendarApi.addEvent(event))

          // 폼 초기화
          this.form.title = ''
          this.form.content = ''
          this.form.startDate = ''
          this.form.endDate = ''
        } else {
          alert('일정 등록에 실패했습니다.')
        }
      } catch (error) {
        alert('통신 오류 관리자에게 문의 바랍니다.')
      }
    },
    handleEventClick(info){
      const event = info.event
      console.log("event : ",event)
      const {title, start, end, extendedProps, id} = event
      this.form.title = title
      this.form.content = extendedProps.content
      this.form.startDate = start.toISOString().slice(0, 10) // yyyy-MM-dd
      this.form.endDate = end ? end.toISOString().slice(0, 10) : this.form.startDate
      this.form.writer = extendedProps.writer

      this.selectedEventId = id // ✅ 선택된 이벤트 ID 저장
    },
    async deleteSchedule(){
      if(!this.selectedEventId) return

      const confirmed = confirm("정말 삭제하시겠습니까?")
      if(!confirmed) return

      try{
        const response = await api.post("/schedule/deleteSchedule", {
          no : this.selectedEventId
        })

        if (response.data.successAt !== '200') {
          alert("삭제에 실패하였습니다.")
          return false
        }else{
          // ✅ 삭제 후 일정 목록 다시 조회
          await this.selectSchduleList()

          // ✅ 상태 및 폼 초기화
          this.selectedEventId = null
          this.form.title = ''
          this.form.content = ''
          this.form.startDate = ''
          this.form.endDate = ''
          this.form.writer = ''
        }

      }catch(e){
        alert("삭제 중 오류가 발생하였습니다.")
      }
    }
  }
}
</script>

<style>
a {
  color: black;
}
/* 추가된 부분 */
.fc-day-sun a {
  color: red;
  font-weight: bold;
}

.fc-day-sat a {
  color: blue;
  font-weight: bold;
}
</style>
