import axios from 'axios'

// 환경 변수에서 baseURL 가져오기
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api