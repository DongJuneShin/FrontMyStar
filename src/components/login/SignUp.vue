<template>
  <div class="container">
    <div class="row justify-content-center align-items-center text-center" style="height: 100vh;">
      <div class="col-8 col-md-6 d-flex flex-column align-items-center">
        <img class="myPuppy img-fluid" src="/assets/image/signUpPuppy.png" alt="강아지사진" />
        <div class="input-box d-flex align-items-center">
          <select v-model="selectTelecom" class="form-select me-2" style="width: 90px;" :disabled="isDisabled">
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
            <option value="ETC">알뜰폰</option>
          </select>
          <input type="text" class="form-control me-2 same-width-input" v-model="phoneNumber" placeholder="전화번호 입력" :disabled="isDisabled" />
          <button class="btn btn-outline-secondary" @click="requestCertification" style="white-space: nowrap;" :disabled="isDisabled">{{certifiValue}}</button>
        </div>
        <div v-if="certificateClick" class="certify-box d-flex align-items-center mt-2">
          <div class="text-danger fw-bold me-2 timer-text">{{ formattedTime }}</div>
          <input type="text" class="form-control me-2 same-width-input" placeholder="인증번호 입력" v-model="certifiNumber"/>
          <button class="btn btn-outline-secondary" @click="certificateNumber" style="white-space: nowrap;">인증확인</button>
        </div>
        <div v-if="certificateComplate" class="certify-box d-flex align-items-center mt-2">
          <div class=" fw-bold me-2 timer-text">닉네임</div>
          <input type="text" class="form-control me-2 same-width-input" v-model="nickname" placeholder="닉네임을 입력해주세요."/>
          <button class="btn btn-outline-secondary" @click="dupleNickname" style="white-space: nowrap;">중복확인</button>
        </div>
        <div v-if="certificateComplate" class="certify-box d-flex align-items-center mt-2">
          <span :class="nicknameDuple ? 'text-primary' : 'text-danger'">{{nicknameCheckResult}}</span>
        </div>
        <div v-if="nicknameDuple" class="certify-box d-flex align-items-center mt-2">
          <div class=" fw-bold me-2 timer-text">비밀번호</div>
          <input type="password" class="form-control me-2 same-width-input" placeholder="비밀번호를 입력해주세요." v-model="password"/>
        </div>
        <div v-if="nicknameDuple" class="certify-box d-flex align-items-center mt-2">
          <div class=" fw-bold me-2 timer-text">비밀번호 확인</div>
          <input type="password" class="form-control me-2 same-width-input" placeholder="비밀번호를 재확인해주세요." v-model="retryPassword"/>
        </div>
        <div v-if="nicknameDuple" class="certify-box d-flex align-items-center mt-2">
          <span :class="passwordTextCheck ? 'text-primary' : 'text-danger'">{{passwordText}}</span>
        </div>
        <div v-if="passwordTextCheck" class="text-danger certify-box d-flex align-items-center mt-2">
          <button type="button" class="btn btn-light mt-3 w-100" @click="signUp">회원가입</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref, watch} from "vue";
import axios from "axios";
import {validationPhoneNumber} from "@/utils/validation.js";
export default {
  setup() {
    const loading = ref(false)
    const selectTelecom = ref('SKT')          //셀렉트태그 value
    const phoneNumber = ref('')               //전화번호 입력 input 값
    const certificateClick = ref(false)       //인증요청 버튼 클릭 시
    const timer = ref(300)                     //5분
    const showTimer = ref(false);              //타이머 표시 여부
    const certifiValue = ref('인증요청')        //인증번호 버튼명
    const certifiNumber = ref('')              //인증번호
    const isDisabled = ref(false)             //사용여부
    const certificateComplate = ref(false)    //인증성공유무
    const nicknameCheck = ref(false)          //닉네임체크버튼 클릭유무
    const nicknameDuple = ref(false)          //닉네임 중복일시
    const passwordCheck = ref(false)          //비밀번호 체크
    const nickname = ref('')
    const nicknameCheckResult = ref('')
    const password = ref('')
    const retryPassword = ref('')
    const passwordCompare = ref(false)
    const passwordText = ref('')
    const passwordTextCheck = ref(false)

    let intervalId = null;  //인증시간 변수

    const signUp = async () => {

      const data = {
        phoneNumber : phoneNumber.value,
        nickname : nickname.value,
        password : password.value
      }

      try{
        const response = await axios.post("http://localhost:8081/sign/signUp", data)

        if(response.data["successAt"] === '200'){
          alert("회원가입이 완료되었습니다.")
          window.location = "/"
        }else{
          alert("회원가입 중 에러가 발생하였습니다.")
        }
      }catch(e){
        console.log("회원가입 에러발생 : ",e.message)
      }
    }

    /* 비밀번화와 비밀번호 확인 추적 watch */
    watch([password, retryPassword], ([newPass, newRetryPass]) => {
      if(newPass !== null && newPass !== '' && newRetryPass !== null && newRetryPass !== ''){
        if(newPass === newRetryPass){
          passwordText.value = '비밀번호와 비밀번호 확인이 일치합니다.'
          passwordTextCheck.value = true
        }else{
          passwordText.value = '비밀번호와 비밀번호 확인이 일치 하지 않습니다.'
          passwordTextCheck.value = false
        }
      }else{
        passwordText.value = '비밀번호와 비밀번호 확인을 입력해주세요.'
        passwordTextCheck.value = false
      }
    })

    /* 닉네임 중복 확인 */
    const dupleNickname = async () => {

      const data = {
        nickname : nickname.value
      }

      try{
        const response = await axios.post('http://localhost:8081/sign/dupleNickName',data)

        if(response.data["successAt"] === '100'){
          nicknameCheckResult.value = " '" + nickname.value + "' 은(는) 사용중인 닉네임입니다."
          nicknameDuple.value = false
          return false
        }else{
          nicknameCheckResult.value = " '" + nickname.value + "' 은(는) 사용가능한 닉네임입니다."
          nicknameDuple.value = true
        }
      }catch(e){
        console.log("닉네임 중복 로직 에러 : ",e.message)
      }
    }


    /* 타이머표시 computed */
    const formattedTime = computed(() => {
      const minutes = Math.floor(timer.value / 60).toString().padStart(2, "0")
      const seconds = (timer.value % 60).toString().padStart(2, "0")
      return `${minutes}:${seconds}`
    })

    const startTimer = () => {
      if(intervalId){
        clearInterval(intervalId)
      }

      timer.value = 300

      intervalId = setInterval(() => {
        if(timer.value > 0){
          timer.value--;
        }else{
          clearInterval(intervalId)
          showTimer.value = false
          alert("인증번호 입력시간이 초과 되었습니다. 다시 요청 바랍니다.")
          certifiValue.value = '인증요청'
          certificateClick.value = false
          timer.value = 300
        }
      },1000)

    }

    /* 인증번호 발송 */
    const requestCertification = async() => {
      loading.value = true

      if(!validationPhoneNumber(phoneNumber.value)){
        alert("핸드폰번호를 확인해주시기 바랍니다.")
        return false
      }

      try{
        const data = {
          telecom : selectTelecom.value,
          phoneNumber : phoneNumber.value
        }

        certificateClick.value = true
        certifiValue.value = '인증재요청'

        const response = await axios.post('http://localhost:8081/sign/selectCertifiNumber',data)
        startTimer()

        if(response.data["successAt"] === '200'){
          alert("고객님의 핸드폰으로 인증번호가 발송되었습니다.")
        }


      }catch (e){
        console.log('에러발생 : ',e.message)
      }finally {
        loading.value = false
      }
    }

    const certificateNumber = async() => {

        if(certifiNumber.value === ''){
          alert("인증번호를 입력해주시기 바랍니다.")
          return false
        }else{
          try{
            const data = {
              certifiNumber : certifiNumber.value
            }

            const response = await axios.post('http://localhost:8081/sign/certifiNumber' , data)

            if(response.data['successAt'] === '200'){
              alert("인증완료 되었습니다.")
              certificateClick.value = false
              certifiNumber.value = ''
              certifiValue.value = '인증완료'
              isDisabled.value = true

              clearInterval(intervalId)
              timer.value = 300

              certificateComplate.value = true
            }else{
              alert("인증번호를 다시 확인해주시기 바랍니다.")
              return false
            }
          }catch(e){
            console.log('에러발생 : ',e.message)
          }
        }
    }

    return{
      requestCertification,
      selectTelecom,
      phoneNumber,
      certificateClick,
      formattedTime,
      certifiValue,
      certificateNumber,
      certifiNumber,
      isDisabled,
      certificateComplate,
      nicknameCheck,
      passwordCheck,
      passwordCompare,
      dupleNickname,
      nicknameCheckResult,
      nickname,
      nicknameDuple,
      retryPassword,
      password,
      passwordText,
      passwordTextCheck,
      signUp
    }
  }
}
</script>

<style scoped>
.myPuppy {
  width: 100%;
  max-width: 300px; /* 이미지는 최대 300px로 설정, 화면 크기에 따라 줄어듬 */
  height: auto;
}

.input-box {
  width: 100%;
  max-width: 400px; /* 입력 폼 최대 400px로 설정 */
  display: flex;
  justify-content: space-between; /* 요소들 간의 간격을 고르게 분배 */
  align-items: center; /* 세로로 정렬 */
}

.separator hr {
  border: none;
  border-top: 1px solid #ccc;
}

.certify-box {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.same-width-input {
  flex: 1;
  min-width: 50px;
}

/* 공통 타이머 텍스트 */
.timer-text {
  width: 90px;
  text-align: center;
}

a {
  color: #0095f6;
  font-size: 14px;
}

span {
  font-size: 14px;
}

/* 반응형: 모바일 화면에서는 폼 크기 및 이미지 크기 줄어듬 */
@media (max-width: 768px) {
  .myPuppy {
    max-width: 80%; /* 모바일에서 이미지를 80%로 줄임 */
  }

  .input-box,
  .certify-box {
    max-width: 90%;
    flex-direction: column;
    gap: 10px;
  }

  .input-box select,
  .input-box input,
  .input-box button,
  .certify-box input,
  .certify-box button {
    width: 100%;
    max-width: none;
  }

  .certify-box {
    width: 100%;
    max-width: 400px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .timer-text {
    width: 100%;
    text-align: left;
  }
}



</style>
