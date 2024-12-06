<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
        >
          <component :is="link.icon" class="nav-icon" />
          {{ link.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="header">
        <div class="header-content">
          <div class="header-left">
            <button class="menu-button" @click="toggleSidebar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="menu-icon"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div class="header-title">
              <h1>{{ currentPageTitle }}</h1>
              <p>Chào mừng Admin</p>
            </div>
          </div>

          <div class="header-right">
            <button class="notification-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="notification-icon"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div class="admin-info">
              <img
                :src="admin?.avatar || 'https://via.placeholder.com/150'"
                alt="Avatar"
                class="admin-avatar"
              />
              <span class="admin-name">{{ admin?.username }}</span>
              <button @click="logout" class="logout-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="logout-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Modal Cảnh Báo -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <div>
            <h2>Cảnh báo</h2>
            <p>Bạn không có quyền truy cập vào trang quản lý này.</p>
            <button @click="router.push('/login')">Đăng nhập</button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="main-area">
        <!-- Dashboard Stats - Only shown on main admin page -->
        <div v-if="isMainDashboard" class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div class="stat-info">
              <h3>Tổng người dùng</h3>
              <p>2,453</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon product-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="stat-info">
              <h3>Sản phẩm</h3>
              <p>1,234</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon order-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div class="stat-info">
              <h3>Đơn hàng</h3>
              <p>642</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="stat-info">
              <h3>Doanh thu</h3>
              <p>$12,634</p>
            </div>
          </div>
        </div>
        <div v-if="showModal" class="modal-overlay">
          <div class="modal">
            <div class="modal-content">
              <div class="modal-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2>Cảnh báo</h2>
              <p>
                Bạn chưa đăng nhập, Vui lòng đăng nhập để truy cập trang quản
                lý.
              </p>
              <button @click="router.push('/login')">
                <span>Đăng nhập</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Router View -->
        <div class="content-area">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(true);
const admin = ref(null);
const showModal = ref(false);

const fetchAdminData = () => {
  const adminData = localStorage.getItem("admin");
  if (adminData) {
    admin.value = JSON.parse(adminData);
  }
};

const navLinks = ref([
  { name: "Quản lý người dùng", path: "/admin/users", icon: "UserIcon" },
  {
    name: "Quản lý sản phẩm",
    path: "/admin/products",
    icon: "ShoppingBagIcon",
  },
  { name: "Quản lý danh mục", path: "/admin/category", icon: "FolderIcon" },
  { name: "Quản lý đơn hàng", path: "/admin/oders", icon: "ShoppingCartIcon" },
  { name: "Báo cáo & Thống kê", path: "/admin/reports", icon: "ChartBarIcon" },
  { name: "Cài đặt", path: "/admin/settings", icon: "CogIcon" },
]);

const isMainDashboard = computed(() => {
  return route.path === "/admin" || route.path === "/admin/";
});

const currentPageTitle = computed(() => {
  const currentLink = navLinks.value.find((link) => route.path === link.path);
  return currentLink ? currentLink.name : "Dashboard";
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
  console.log("Logging out...");
  localStorage.removeItem("admin");
  router.push("/login");
};

onMounted(() => {
  fetchAdminData();

  if (!admin.value || !admin.value.role) {
    showModal.value = true;
  }
});
</script>


<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}
.admin-info {
  display: flex;
  align-items: center;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.admin-name {
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  color: white;
  transition: width 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar-nav {
  padding: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  background-color: #f3f4f6;
}

/* Header Styles */
.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-button {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.375rem;
}

.menu-button:hover {
  background-color: #f3f4f6;
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.header-title {
  margin-left: 1rem;
}

.header-title h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.header-title p {
  font-size: 0.875rem;
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-button {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.375rem;
}

.notification-icon {
  width: 1.5rem;
  height: 1.5rem;
  stroke: #6b7280;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #dc2626;
}

.logout-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  stroke: currentColor;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 100%;
  animation: slideIn 0.3s ease-out;
}

.modal-content {
  padding: 2rem;
  text-align: center;
}

.modal-icon {
  margin: 0 auto 1.5rem;
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  animation: bounce 1s ease infinite;
}

.modal-icon svg {
  width: 100%;
  height: 100%;
}

.modal h2 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.modal p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.modal button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;
}

.modal button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal button:active {
  transform: translateY(0);
}

.modal button svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
}

.modal button:hover svg {
  transform: translateX(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.25rem);
  }
}

/* Main Area Styles */
.main-area {
  padding: 2rem;
}

/* Stats Grid Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  padding: 0.75rem;
  border-radius: 0.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
  fill: none;
  stroke-width: 2;
}

.user-icon {
  background-color: #2563eb;
}

.product-icon {
  background-color: #10b981;
}

.order-icon {
  background-color: #f59e0b;
}

.revenue-icon {
  background-color: #8b5cf6;
}

.stat-info {
  margin-left: 1rem;
}

.stat-info h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-info p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* Content Area Styles */
.content-area {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    padding: 1rem;
  }
}
</style>