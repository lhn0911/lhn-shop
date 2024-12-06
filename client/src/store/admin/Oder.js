import {
  getAlloder,
  createOder,
  updateOder,
  deleteOder,
} from "@/services/admin/OderServices";

const oder = {
  state: {
    oder: [],
  },
  getters: {
    allOder: (state) => state.oder,
    getOderById: (state) => (id) => state.oder.find((order) => order.id === id),
  },
  actions: {
    async fetchAlloder({ commit }) {
      try {
        const oderData = await getAlloder();
        console.log(oderData); // Xem dữ liệu nhận được
        commit("setOder", oderData);
      } catch (error) {
        console.error("Error in fetchAllOder action:", error);
      }
    },

    async addOder({ dispatch }, oderData) {
      try {
        const newOder = await createOder(oderData);
        await dispatch("fetchAllOder");
        return newOder;
      } catch (error) {
        console.error("Error in addOder action:", error);
      }
    },
    async updateOder({ dispatch }, { orderId, updatedData }) {
      try {
        const updatedOder = await updateOder(orderId, updatedData);
        await dispatch("fetchAllOder");
        return updatedOder;
      } catch (error) {
        console.error("Error in updateOder action:", error);
      }
    },
    async deleteOder({ dispatch }, orderId) {
      try {
        await deleteOder(orderId);
        await dispatch("fetchAllOder");
      } catch (error) {
        console.error("Error in deleteOder action:", error);
      }
    },
  },
  mutations: {
    setOder(state, oderData) {
      state.oder = oderData;
    },
  },
};

export default oder;
