<template>
  <div class="user-management">
    <div class="search-filter">
      <div class="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          v-model="searchQuery"
        />
      </div>
      <div class="filter-options">
        <select v-model="roleFilter">
          <option value="user">Tất cả người dùng</option>
          <option value="admin">Chỉ admin</option>
        </select>
        <select v-model="statusFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>
      <button class="add-user-button" @click="showAddUserModal = true">
        Thêm người dùng
      </button>
    </div>

    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Ảnh</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <img
                :src="user.avatar || 'https://via.placeholder.com/40'"
                :alt="user.username"
                class="user-avatar"
              />
            </td>
            <td>
              <button
                class="role-badge"
                :class="user.role ? 'admin' : 'user'"
                @click="handleRoleChange(user)"
              >
                {{ user.role ? "Admin" : "User" }}
              </button>
            </td>
            <td>
              <button
                class="status-badge"
                :class="user.status ? 'active' : 'inactive'"
                @click="handleStatusChange(user)"
              >
                {{ user.status ? "Hoạt động" : "Không hoạt động" }}
              </button>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <div v-if="showAddUserModal" class="modal">
      <div class="modal-content">
        <h3>Thêm người dùng mới</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Tên người dùng:</label>
            <input type="text" v-model="userForm.username" required />
            <span v-if="usernameExists" class="error-message"
              >Tên người dùng đã tồn tại</span
            >
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="userForm.email" required />
            <span v-if="emailExists" class="error-message"
              >Email đã tồn tại</span
            >
          </div>
          <div class="form-group">
            <label>Mật khẩu:</label>
            <input type="password" v-model="userForm.password" required />
          </div>
          <div class="form-group">
            <label>Vai trò:</label>
            <select v-model="userForm.role">
              <option :value="false">Người dùng</option>
              <option :value="true">Quản trị viên</option>
            </select>
          </div>
          <div class="form-group">
            <label>Trạng thái:</label>
            <select v-model="userForm.status">
              <option :value="true">Hoạt động</option>
              <option :value="false">Không hoạt động</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Thêm</button>
            <button type="button" @click="closeModal" class="cancel-btn">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <p>{{ confirmMessage }}</p>
        <div class="modal-actions">
          <button
            v-if="!isWarningModal"
            @click="confirmAction"
            class="save-btn"
          >
            Xác nhận
          </button>
          <button @click="cancelAction" class="cancel-btn">
            {{ isWarningModal ? "Đóng" : "Hủy" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const searchQuery = ref("");
const roleFilter = ref("user");
const statusFilter = ref("");
const showAddUserModal = ref(false);
const showConfirmModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 4;
const modalTitle = ref("");
const isWarningModal = ref(false);
const userForm = ref({
  username: "",
  fullname: "",
  email: "",
  password: "",
  role: false,
  status: true,
  avatar: "https://via.placeholder.com/150",
  phone: "",
  address: "",
  created_at: new Date().toISOString().split(".")[0] + "Z",
  updated_at: new Date().toISOString().split(".")[0] + "Z",
});
const pendingAction = ref(null);
const confirmMessage = ref("");
const usernameExists = ref(false);
const emailExists = ref(false);

onMounted(async () => {
  await store.dispatch("fetchAllUsers");
});

watch(
  userForm.value,
  async (newValue) => {
    usernameExists.value = await store.dispatch("checkUserExists", {
      username: newValue.username,
    });
    emailExists.value = await store.dispatch("checkUserExists", {
      email: newValue.email,
    });
  },
  { deep: true }
);

const filteredUsers = computed(() => {
  const users = store.getters.allUsers || [];
  return users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesRole = roleFilter.value === "admin" ? user.role : !user.role;

    const matchesStatus =
      !statusFilter.value ||
      (statusFilter.value === "active" ? user.status : !user.status);

    return matchesSearch && matchesRole && matchesStatus;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

function setPage(page) {
  currentPage.value = page;
}

function showWarningModal(message) {
  modalTitle.value = "Cảnh báo";
  confirmMessage.value = message;
  isWarningModal.value = true;
  showConfirmModal.value = true;
}

function showConfirmationModal(message, action) {
  modalTitle.value = "Xác nhận thay đổi";
  confirmMessage.value = message;
  isWarningModal.value = false;
  pendingAction.value = action;
  showConfirmModal.value = true;
}

function handleRoleChange(user) {
  if (user.role) {
    showWarningModal("Không thể thay đổi quyền của Admin");
    return;
  }

  showConfirmationModal(
    "Bạn có chắc chắn muốn thay đổi vai trò của người dùng này?",
    async () => {
      try {
        await store.dispatch("updateUser", {
          userId: user.id,
          updatedData: { ...user, role: !user.role },
        });
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    }
  );
}

function handleStatusChange(user) {
  const loggedInAdmin = JSON.parse(localStorage.getItem("admin"));

  if (!loggedInAdmin) {
    console.error("Không tìm thấy thông tin admin đã đăng nhập");
    return;
  }

  if (user.role && user.id !== loggedInAdmin.id) {
    showWarningModal("Bạn không thể thay đổi trạng thái của Admin khác");
    return;
  }

  if (user.id === loggedInAdmin.id) {
    showConfirmationModal(
      "Bạn có chắc chắn muốn thay đổi trạng thái tài khoản của chính mình?",
      async () => {
        try {
          await store.dispatch("updateUser", {
            userId: user.id,
            updatedData: { ...user, status: !user.status },
          });
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái người dùng:", error);
        }
      }
    );
    return;
  }

  showConfirmationModal(
    "Bạn có chắc chắn muốn thay đổi trạng thái của người dùng này?",
    async () => {
      try {
        await store.dispatch("updateUser", {
          userId: user.id,
          updatedData: { ...user, status: !user.status },
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái người dùng:", error);
      }
    }
  );
}

function closeModal() {
  showAddUserModal.value = false;
  userForm.value = {
    username: "",
    email: "",
    password: "",
    role: false,
    status: true,
    avatar: "https://via.placeholder.com/150",
  };
  usernameExists.value = false;
  emailExists.value = false;
}

async function saveUser() {
  if (usernameExists.value || emailExists.value) {
    return;
  }

  try {
    await store.dispatch("addUser", userForm.value);
    closeModal();
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

function confirmAction() {
  if (pendingAction.value) {
    pendingAction.value();
  }
  showConfirmModal.value = false;
  pendingAction.value = null;
  isWarningModal.value = false;
}

function cancelAction() {
  showConfirmModal.value = false;
  pendingAction.value = null;
  isWarningModal.value = false;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.user-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.search-filter {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.filter-options {
  display: flex;
  gap: 12px;
}

.filter-options select {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
}

.user-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.role-badge.admin {
  background-color: #818cf8;
  color: white;
}

.role-badge.user {
  background-color: #93c5fd;
  color: #1e40af;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.status-badge.active {
  background-color: #86efac;
  color: #166534;
}

.status-badge.inactive {
  background-color: #fca5a5;
  color: #991b1b;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}
.add-user-button {
  background-color: #4caf50; /* Màu xanh lá cây */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-user-button:hover {
  background-color: #45a049; /* Màu xanh lá cây đậm hơn */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
