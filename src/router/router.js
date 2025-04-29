import SignUp from "@/components/login/SignUp.vue";
import Login from "@/components/login/Login.vue";
import {createRouter, createWebHistory} from "vue-router";

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
    }
]

const router = createRouter({
    history: createWebHistory(), // 괄호 비워주세요!
    routes
});

export default router;