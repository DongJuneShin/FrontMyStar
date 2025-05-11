<template>
  <div class="container">
    <div class="row justify-content-center align-items-center text-center" style="height: 100vh;">
      <div class="col-8 col-md-6 d-flex flex-column align-items-center">
        <img class="myPuppy img-fluid" src="/assets/image/loginPuppy2.png" alt="강아지사진" />
        <div class="input-box">
          <input type="text" v-model="loginId" ref="phoneInput" class="form-control mt-3" placeholder="핸드폰번호를 입력해주세요" />
          <input type="password" v-model="loginPw" ref="passwordInput" class="form-control mt-3" placeholder="비밀번호를 입력해주세요." />
          <button type="button" @click="loginButton" class="btn btn-light mt-3 w-100">로그인</button>
          <div class="separator my-4 d-flex align-items-center text-muted">
            <hr class="flex-grow-1" />
            <span class="mx-2">또는</span>
            <hr class="flex-grow-1" />
          </div>
          <div>
            <a href="#" class="text-decoration-none d-block mb-2" style="color: #6c757d;">비밀번호를 잊으셨나요?</a>
            <span>계정이 없으신가요?<router-link to="/signUp" class="text-decoration-none fw-bold" style="color: #343a40;">가입하기</router-link></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {validationPhoneNumber} from "@/utils/validation.js";
import {validationPassword} from "@/utils/validation.js";
import axios from "axios";
import {useRouter} from "vue-router";


export default {
  setup() {
    const loginId = ref('')
    const loginPw = ref('')
    const phoneInput = ref(null)
    const pwInput = ref(null)
    const router = useRouter()

    const loginButton = async() => {
      if (loginId.value === '') {
        alert("핸드폰번호 입력해주세요.");
        phoneInput.value?.focus();
        return false;
      }

      if (loginPw.value === '') {
        alert("비밀번호를 입력해주세요.");
        pwInput.value?.focus();
        return false;
      }

      if(!validationPhoneNumber(loginId.value)){
        alert("핸드폰번호를 확인해주시기 바랍니다.");
        phoneInput.value?.focus();
        return false;
      }

      try{

        const data = {
          phoneInput : loginId.value,
          loginPw : loginPw.value
        }

        const response = await axios.post("http://localhost:8081/sign/login",data,{
          withCredentials : true
        })

        if(response.data["successAt"] === "200"){
          await router.push('/home')
        }else{
          alert(response.data["message"])
          return false
        }
      }catch(e){
        console.log("로그인 중 에러 발생 : ",e.message)
      }
    };

    return {
      loginButton,
      loginId,
      loginPw,
      phoneInput,
      pwInput
    };
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
  max-width: 300px; /* 입력 폼도 최대 300px로 설정 */
}

.separator hr {
  border: none;
  border-top: 1px solid #ccc;
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

  .input-box {
    max-width: 90%; /* 모바일에서 입력 폼을 90%로 줄임 */
  }
}
</style>
