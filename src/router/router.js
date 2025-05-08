import SignUp from "@/components/login/SignUp.vue";
import Login from "@/components/login/Login.vue";
import {createRouter, createWebHistory} from "vue-router";
import mainLayout from "@/layouts/MainLayout.vue";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import NotFound from "@/components/etc/NotFound.vue";

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
            {path : '', redirect : '/home'},
            {path : 'home', name : 'Home', component : Home},
            {path : 'profile', name : 'Profile', component: Profile},

        ]
    }
]

const router = createRouter({
    history: createWebHistory(), // 괄호 비워주세요!
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/signUp', '/login']; // 로그인 없이 접근 가능한 페이지
    const authRequired = !publicPages.includes(to.path);
    const token = localStorage.getItem('token'); // JWT 저장된 위치에 따라 다를 수 있음

    if (authRequired && !token) {
        alert('로그인이 필요합니다.');
        return next('/');
    }

    next(); // 통과
});

export default router;