<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Đăng Ký</h1>

      <div class="input-group">
        <BsPersonFill class="icon" />
        <input type="text" placeholder="Tên đăng nhập" v-model="username" />
      </div>

      <div class="input-group">
        <CaEmail class="icon" />
        <input type="email" placeholder="Email" v-model="email" />
      </div>

      <div class="input-group">
        <BxLockOpenAlt class="icon" />
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mật khẩu"
          v-model="password"
        />
        <i @click="togglePasswordVisibility" class="icon-eye">
          <AnFilledEye v-if="showPassword" />
          <AnFilledEyeInvisible v-else />
        </i>
      </div>

      <div class="input-group">
        <BxLockOpenAlt class="icon" />
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Nhập lại mật khẩu"
          v-model="confirmPassword"
        />
        <i @click="toggleConfirmPasswordVisibility" class="icon-eye">
          <AnFilledEye v-if="showConfirmPassword" />
          <AnFilledEyeInvisible v-else />
        </i>
      </div>

      <button @click="handleRegister">ĐĂNG KÝ</button>

      <p>hoặc</p>

      <div class="social-buttons">
        <button class="facebook-button">
          <AkFacebookFill class="social-icon" /> Facebook
        </button>
        <button class="google-button">
          <CoBrandGoogle class="social-icon" /> Google
        </button>
      </div>

      <p>
        Bạn đã có tài khoản?
        <a href="/login">Đăng nhập ngay!</a>
      </p>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <p>{{ modalMessage }}</p>
          <button @click="closeModal">Đóng</button>
        </div>
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
  BsPersonFill,
  CaEmail,
  AnFilledEyeInvisible,
  AnFilledEye,
  AkFacebookFill,
  CoBrandGoogle,
  BxLockOpenAlt,
} from "@kalimahapps/vue-icons";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showModal = ref(false);
const modalMessage = ref("");
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const closeModal = () => {
  showModal.value = false;
  modalMessage.value = "";
};

const handleRegister = async () => {
  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    modalMessage.value = "Vui lòng điền đầy đủ các thông tin.";
    showModal.value = true;
    return;
  }

  if (username.value.length < 6) {
    modalMessage.value = "Tên đăng nhập phải có ít nhất 6 ký tự.";
    showModal.value = true;
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email.value)) {
    modalMessage.value = "Vui lòng nhập đúng định dạng email.";
    showModal.value = true;
    return;
  }

  if (password.value !== confirmPassword.value) {
    modalMessage.value = "Mật khẩu nhập lại không khớp.";
    showModal.value = true;
    return;
  }

  try {
    const response = await baseURL.get("/users");
    const users = response.data;

    const isUsernameTaken = users.some(
      (user) => user.username === username.value
    );
    const isEmailTaken = users.some((user) => user.email === email.value);

    if (isUsernameTaken) {
      modalMessage.value = "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
      showModal.value = true;
      return;
    }

    if (isEmailTaken) {
      modalMessage.value = "Email đã được đăng ký. Vui lòng chọn email khác.";
      showModal.value = true;
      return;
    }

    const hashedPassword = await bcrypt.hash(password.value, 10);

    // Tạo ID ngẫu nhiên từ 3 đến 4 chữ số
    const randomId = Math.floor(100 + Math.random() * 9000); // Tạo số từ 100 đến 9999

    const newUser = {
      id: randomId,
      username: username.value,
      email: email.value,
      fullname: "",
      status: true,
      password: hashedPassword,
      role: false,
      avatar: "",
      phone: "",
      address: "",
      created_at: new Date().toISOString().split(".")[0] + "Z",
      updated_at: new Date().toISOString().split(".")[0] + "Z",
    };

    await baseURL.post("/users", newUser);

    modalMessage.value = "Đăng ký thành công!";
    showModal.value = true;
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Error during registration:", error);
    modalMessage.value = "Đã xảy ra lỗi. Vui lòng thử lại.";
    showModal.value = true;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #3b82f6, #9333ea);
}

.register-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 85%;
  max-width: 350px;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: gray;
}

.icon-eye {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  cursor: pointer;
  color: gray;
}

input {
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #0056b3;
}

p {
  color: gray;
  margin-top: 20px;
}

.social-buttons {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  gap: 10px;
}

.facebook-button,
.google-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.facebook-button {
  background-color: #3b5998;
}

.google-button {
  background-color: #db4437;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}
</style>
