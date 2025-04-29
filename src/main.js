import './assets/font/font.css'
import { createApp } from 'vue'
import App from './App.vue'
import '/public/libs/bootstrap/css/bootstrap.min.css'
import '/public/libs/bootstrap/js/bootstrap.bundle.min.js'
import router from "@/router/router.js";

createApp(App)
    .use(router) // Vue Router 사용
    .mount('#app')
