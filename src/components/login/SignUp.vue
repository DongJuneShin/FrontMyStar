<template>
  <div class="container">
    <div class="row justify-content-center align-items-center text-center" style="height: 100vh;">
      <div class="col-8 col-md-6 d-flex flex-column align-items-center">
        <img class="myPuppy img-fluid" src="/assets/image/loginPuppy2.png" alt="강아지사진" />
        <div class="input-box d-flex align-items-center">
          <select v-model="selectTelecom" class="form-select me-2" style="width: 100px;">
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
            <option value="ETC">알뜰폰</option>
          </select>
          <input type="text" class="form-control me-2" v-model="phoneNumber" placeholder="전화번호 입력" style="flex: 1; min-width: 50px;" />
          <button class="btn btn-outline-secondary" @click="requestCertification" style="white-space: nowrap;">인증요청</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import {validationPhoneNumber} from "@/utils/validation.js";
export default {
  setup() {
    const loading = ref(false)
    const selectTelecom = ref('SKT')
    const phoneNumber = ref('')

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

        const response = await axios.post('http://localhost:8081/sign/certifiNumber',data)

        alert(response.data["successAt"])

      }catch (e){
        console.log('에러발생 : ',e.message)
      }finally {
        loading.value = false
      }
    }

    return{
      requestCertification,
      selectTelecom,
      phoneNumber
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
    flex-direction: column; /* 모바일에서는 세로로 정렬되도록 */
    gap: 10px; /* 요소들 사이에 간격을 추가 */
  }

  .input-box select,
  .input-box input,
  .input-box button {
    width: 100%; /* 각 요소가 화면 크기에 맞게 100%로 늘어나도록 설정 */
    max-width: none; /* max-width 제한 제거 */
  }
}

</style>
