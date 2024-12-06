import { createRouter, createWebHistory } from "vue-router";
import Login from "@/view/auth/login/Login.vue";
import Register from "@/view/auth/register/Register.vue";
import HomeView from "@/view/user/HomeView.vue";
import UserView from "@/view/admin/UserView.vue";
import ProductView from "@/view/admin/ProductView.vue";
import CategoryView from "@/view/admin/CategoryView.vue";
import OrderView from "@/view/admin/OrderView.vue";
import DashView from "@/view/admin/DashView.vue";
import ProductDetail from "@/view/user/ProductDetail.vue";
import Cart from "@/view/user/Cart.vue";
import Oder from "@/view/user/Oder.vue";
const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/product/:id",
    component: ProductDetail,
    name: "ProductDetail",
  },
  {
    path: "/oder",
    component: Oder,
  },
  {
    path: "/cart",
    component: Cart,
  },
  {
    path: "/admin",
    component: DashView,
    children: [
      {
        path: "users",
        component: UserView,
        name: "admin-users",
      },
      {
        path: "products",
        component: ProductView,
        name: "admin-products",
      },
      {
        path: "category",
        component: CategoryView,
        name: "admin-categories",
      },
      {
        path: "oders",
        component: OrderView,
        name: "admin-orders",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
