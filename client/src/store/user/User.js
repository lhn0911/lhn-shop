import { getAllProducts } from "@/services/user/ProductServices";
const product = {
  state: {
    products: [],
  },
  getters: {
    allProducts: (state) => state.products,
  },
  actions: {
    async fetchAllProducts({ commit }) {
      try {
        const products = await getAllProducts();
        commit("setProducts", products);
      } catch (error) {
        console.error("Error in fetchAllProducts action:", error);
      }
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
};

export default product;
