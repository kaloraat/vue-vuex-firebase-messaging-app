import Vue from "vue";
import Router from "vue-router";

import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Register from "@/pages/Register";
import auth from "firebase/auth";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "chat",
            component: Chat,
            beforeEnter: (to, from, next) => {
                if (!firebase.auth().currentUser) {
                    next("/login");
                } else {
                    next();
                }
            }
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/register",
            name: "register",
            component: Register
        }
    ],
    mode: "history"
});
