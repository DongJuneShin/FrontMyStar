import { defineStore } from 'pinia'
import axios from "axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        setUser(userInfo) {
            this.user = userInfo
        },
        async fetchUser(){
            try{
                const res = await axios.get('http://localhost:8081/common/myUser', { withCredentials: true })
                this.user = res.data  // 예: { username: '홍길동', nickname: '길동이' }
                console.log("this.user : ",this.user)
            }catch(e){
                console.log('사용자 정보 가져오기 실패 : ',e.message)
            }
        }
    },

})