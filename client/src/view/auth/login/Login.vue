<template>
  <div class="container">
    <div class="login-box">
      <h1>Đăng Nhập</h1>

      <div class="input-group">
        <AiOutlineMail class="icon" />
        <input
          type="email"
          placeholder="Email hoặc Tên đăng nhập"
          v-model="email"
          class="input"
        />
      </div>

      <div class="input-group">
        <FaLock class="icon" />
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mật khẩu"
          v-model="password"
          class="input"
        />
        <button @click="togglePasswordVisibility" class="toggle-button">
          <AnFilledEye v-if="showPassword" />
          <AnFilledEyeInvisible v-else />
        </button>
      </div>

      <button @click="handleLogin" class="login-button">ĐĂNG NHẬP</button>

      <p>hoặc</p>

      <div class="social-buttons">
        <button class="facebook-button">
          <AkFacebookFill class="social-icon" /> Facebook
        </button>
        <button class="google-button">
          <CoBrandGoogle class="social-icon" /> Google
        </button>
      </div>

      <p class="register-text">
        Bạn chưa có tài khoản?
        <a href="/register">Đăng kí ngay!</a>
      </p>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h2>{{ modalContent }}</h2>
        <button @click="closeModal" class="close-button">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import bcrypt from "bcryptjs";
import baseURL from "@/api/index";
import {
  AkFacebookFill,
  CoBrandGoogle,
  AnFilledEyeInvisible,
  AnFilledEye,
} from "@kalimahapps/vue-icons";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isModalOpen = ref(false);
const modalContent = ref("");
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalContent.value = "";
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    modalContent.value = "Vui lòng điền đầy đủ thông tin.";
    isModalOpen.value = true;
    return;
  }

  try {
    const response = await baseURL.get("/users");
    const users = response.data;

    const user = users.find(
      (user) => user.email === email.value || user.username === email.value
    );

    if (!user) {
      modalContent.value = "Tài khoản không tồn tại.";
      isModalOpen.value = true;
      return;
    }

    const isPasswordValid = await bcrypt.compare(password.value, user.password);

    if (!isPasswordValid) {
      modalContent.value = "Mật khẩu không đúng.";
      isModalOpen.value = true;
      return;
    }

    if (user.role === true) {
      localStorage.setItem("admin", JSON.stringify(user));
      modalContent.value = "Chào mừng Admin!";
      isModalOpen.value = true;

      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } else {
      localStorage.setItem("currentUser", JSON.stringify(user));
      modalContent.value = "Đăng nhập thành công!";
      isModalOpen.value = true;

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  } catch (error) {
    console.error("Error during login:", error);
    modalContent.value = "Đã xảy ra lỗi. Vui lòng thử lại.";
    isModalOpen.value = true;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #3b82f6, #9333ea);
}

.login-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 300px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.icon {
  position: absolute;
  transform: translateY(-50%);
  color: gray;
  font-size: 20px;
  right: 10px;
}

.input {
  padding: 10px;
  width: 93%;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 16px;
}

.toggle-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: gray;
  cursor: pointer;
}

.login-button {
  background-color: #3b82f6;
  color: white;
  padding: 10px;
  border-radius: 5px;
  width: 93%;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #2563eb;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.facebook-button,
.google-button {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.facebook-button {
  background-color: #1877f2;
}

.google-button {
  background-color: #db4437;
}

.social-icon {
  margin-right: 5px;
}

.register-text a {
  color: #3b82f6;
  text-decoration: none;
}

.register-text a:hover {
  text-decoration: underline;
}

.modal {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.close-button {
  background-color: #3b82f6;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #2563eb;
}
</style>
