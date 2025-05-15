import SignUp from "@/components/login/SignUp.vue";
import Login from "@/components/login/Login.vue";
import {createRouter, createWebHistory} from "vue-router";
import mainLayout from "@/layouts/MainLayout.vue";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import NotFound from "@/components/etc/NotFound.vue";
import Schedule from "@/views/Schedule.vue";
import axios from "axios";

const routes = [
    {
        path : '/',
        name : 'Login',
        component : Login
    },
    {
        path : '/signUp',
        name : 'Signup',
        component : SignUp
    },
    {
        path : '/:pathMatch(.*)*',
        name : 'NotFound',
        component: NotFound
    },
    {
        path : '/',
        component: mainLayout,
        children : [
            {path : '', redirect : '/schedule'},
            {path : 'schedule', name : 'Schedule', component : Schedule},
            {path : 'profile', name : 'Profile', component: Profile},
        ]
    }
]

const router = createRouter({
    history: createWebHistory(), // 괄호 비워주세요!
    routes
});

router.beforeEach(async(to, from, next) => {
    const publicPages = ['/', '/signUp', '/login']; // 로그인 없이 접근 가능한 페이지
    const authRequired = !publicPages.includes(to.path);

    if (!authRequired) {
        return next();
    }

    try{
        await axios.get('http://localhost:8081/common/check',{
            withCredentials : true
        })
        next();
    }catch(e){
        alert('로그인이 필요합니다.')
        next('/')
    }
});

export default router;