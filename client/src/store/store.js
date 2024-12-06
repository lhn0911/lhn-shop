import { createStore } from "vuex";
import user from "./admin/User";
import product from "./admin/Products";
import category from "./admin/Category";
import store from "./user/Cart";
import oder from "./admin/Oder";
export default createStore({
  modules: {
    user,
    product,
    category,
    store,
    oder,
  },
});
