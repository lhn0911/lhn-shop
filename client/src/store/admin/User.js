import {
  getAllUsers,
  addUser,
  updateUser,
} from "@/services/admin/UserServices";

const user = {
  state: {
    users: [],
  },
  getters: {
    allUsers: (state) => state.users,
    activeUsers: (state) => state.users.filter((user) => user.status === true),
  },
  actions: {
    async fetchAllUsers({ commit }) {
      try {
        const users = await getAllUsers();
        commit("setUsers", users);
      } catch (error) {
        console.error("Error in fetchAllUsers action:", error);
      }
    },
    async addUser({ dispatch }, userData) {
      try {
        const newUser = await addUser(userData);
        await dispatch("fetchAllUsers");
        return newUser;
      } catch (error) {
        console.error("Error in addUser action:", error);
      }
    },
    async updateUser({ dispatch }, { userId, updatedData }) {
      try {
        const updatedUser = await updateUser(userId, updatedData);
        await dispatch("fetchAllUsers");
        return updatedUser;
      } catch (error) {
        console.error("Error in updateUser action:", error);
      }
    },
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
  },
};

export default user;
