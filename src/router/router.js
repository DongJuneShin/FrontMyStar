import SignUp from "@/components/login/SignUp.vue";
import Login from "@/components/login/Login.vue";
import {createRouter, createWebHistory} from "vue-router";
import mainLayout from "@/layouts/MainLayout.vue";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";

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
        path : '/',
        component: mainLayout,
        children : [
            {path : '', redirect : '/home'},
            {path : 'home', name : 'Home', component : Home},
            {path : 'profile', name : 'Profile', component: Profile}
        ]
    }
]

const router = createRouter({
    history: createWebHistory(), // 괄호 비워주세요!
    routes
});

export default router;