import {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/admin/CategoryServices";

const category = {
  state: {
    category: [],
  },
  getters: {
    allCategory: (state) => state.category,
    getCategoryById: (state) => (id) =>
      state.category.find((cat) => cat.id === id),
  },
  actions: {
    async fetchAllCategory({ commit }) {
      try {
        const categoryData = await getAllCategory();
        commit("setCategory", categoryData);
      } catch (error) {
        console.error("Error in fetchAllCategory action:", error);
      }
    },
    async addCategory({ dispatch }, categoryData) {
      try {
        const newCategory = await addCategory(categoryData);
        await dispatch("fetchAllCategory");
        return newCategory; // Return the new category created
      } catch (error) {
        console.error("Error in addCategory action:", error);
      }
    },
    async updateCategory({ dispatch }, { categoryId, updatedData }) {
      try {
        const updatedCategory = await updateCategory(categoryId, updatedData);
        await dispatch("fetchAllCategory");
        return updatedCategory; // Return the updated category object
      } catch (error) {
        console.error("Error in updateCategory action:", error);
      }
    },
    async deleteCategory({ dispatch }, categoryId) {
      try {
        await deleteCategory(categoryId);
        await dispatch("fetchAllCategory");
      } catch (error) {
        console.error("Error in deleteCategory action:", error);
      }
    },
  },
  mutations: {
    setCategory(state, categoryData) {
      state.category = categoryData; // Set the state with the fetched categories
    },
  },
};

export default category;
