<template>
  <header class="header">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ptit-k5.appspot.com/o/Screenshot_2024-10-17_083915-removebg-preview.png?alt=media&token=f9b3ff25-4a68-412b-a0c0-cf502b61052b"
          alt="Logo"
          class="logo-img"
        />
      </div>

      <!-- Navigation Menu -->
      <nav>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-item">Trang chủ</router-link></li>
          <li><router-link to="#" class="nav-item">Giới thiệu</router-link></li>
          <li><router-link to="#" class="nav-item">Tin tức</router-link></li>
          <li>
            <router-link to="/contact" class="nav-item">Liên hệ</router-link>
          </li>
          <li>
            <router-link to="/favorite" class="nav-item">Yêu thích</router-link>
          </li>
        </ul>
      </nav>

      <!-- User Info & Cart -->
      <div class="user-cart">
        <div v-if="currentUser" class="user-info">
          <!-- User Dropdown -->
          <div class="user-dropdown" @click="toggleDropdown">
            <span class="user-name">{{ currentUser.username }}</span>
            <img
              :src="currentUser.avatar"
              alt="User Avatar"
              class="user-avatar"
            />
            <div v-if="dropdownVisible" class="dropdown-menu">
              <a href="/profile" class="dropdown-item">Thông tin cá nhân</a>
              <button @click="handleLogout" class="dropdown-item">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Login / Register Buttons -->
          <router-link to="/auth/login">
            <button class="btn-login">Đăng nhập</button>
          </router-link>
          <router-link to="/auth/register">
            <button class="btn-register">Đăng ký</button>
          </router-link>
        </div>

        <!-- Cart Icon -->
        <router-link to="/cart" class="cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="cart-svg"
          >
            <path
              d="M6 2h12l1 9h-14l1-9z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              d="M1 1h3l1 9h12l1-9h3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
            <path
              d="M4 11l1 10h12l1-10"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Khởi tạo biến để lưu thông tin user từ localStorage
const currentUser = ref(null);
const dropdownVisible = ref(false);

// Lấy thông tin user khi component được mount
onMounted(() => {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    currentUser.value = JSON.parse(userData);
  }
});

// Toggle hiển thị dropdown
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

// Hàm đăng xuất
const handleLogout = () => {
  localStorage.removeItem("currentUser");
  window.location.reload(); // Reload trang sau khi đăng xuất
};
</script>

<style scoped>
/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.header {
  background-color: #8b4513;
  color: white;
  padding: 0.5rem;
}

.container {
  max-width: 1200px;
  max-height: 55px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-img {
  height: 90px;
  width: auto;
  object-fit: cover;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-item {
  font-size: 16px;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #fbbf24;
}

.user-cart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  position: relative;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  font-size: 16px;
  margin-right: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dropdown-menu {
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  color: black;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 160px;
  z-index: 10;
}

.dropdown-item {
  display: block;
  padding: 8px;
  text-decoration: none;
  color: black;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.btn-login,
.btn-register {
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-login {
  background-color: white;
  color: #f97316;
}

.btn-login:hover {
  background-color: #fbbf24;
  transform: scale(1.05);
}

.btn-register {
  background-color: #f97316;
  color: white;
}

.btn-register:hover {
  background-color: #fbbf24;
  transform: scale(1.05);
}

.cart-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.cart-svg {
  width: 30px;
  height: 30px;
  color: white;
  transition: transform 0.3s ease;
}

.cart-icon:hover .cart-svg {
  transform: scale(1.1);
}
</style>
