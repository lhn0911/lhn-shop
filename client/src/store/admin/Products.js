import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/services/admin/ProductServices";

const product = {
  state: {
    products: [],
  },
  getters: {
    allProducts: (state) => state.products,
    activeProducts: (state) =>
      state.products.filter((product) => product.stock > 0),
    getProductById: (state) => (id) =>
      state.products.find((product) => product.id === id),
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
    async addProduct({ dispatch }, productData) {
      try {
        const newProduct = await addProduct(productData);
        await dispatch("fetchAllProducts");
        return newProduct;
      } catch (error) {
        console.error("Error in addProduct action:", error);
      }
    },
    async updateProduct({ dispatch }, { productId, updatedData }) {
      try {
        const updatedProduct = await updateProduct(productId, updatedData);
        await dispatch("fetchAllProducts");
        return updatedProduct;
      } catch (error) {
        console.error("Error in updateProduct action:", error);
      }
    },
    async deleteProduct({ dispatch }, productId) {
      try {
        await deleteProduct(productId);
        await dispatch("fetchAllProducts");
      } catch (error) {
        console.error("Error in deleteProduct action:", error);
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
