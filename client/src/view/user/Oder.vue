<template>
  <div class="checkout-container">
    <h1 class="page-title">Đặt hàng</h1>

    <!-- Cart Information -->
    <div class="cart-section">
      <h2 class="section-title">Sản phẩm trong giỏ hàng</h2>
      <div v-if="!cartItems.length" class="empty-cart">
        <p>Giỏ hàng của bạn đang trống</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.img" :alt="item.name" />
            <span class="status-badge" :class="{ 'in-stock': item.status }">
              {{ item.status ? "Còn hàng" : "Hết hàng" }}
            </span>
          </div>

          <div class="item-details">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-price">{{ formatPrice(item.price) }}đ</p>

            <div class="quantity-controls">
              <button
                @click="updateQuantity(item, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item, item.quantity + 1)"
                class="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <div class="item-actions">
            <p class="item-subtotal">
              Tổng: {{ formatPrice(item.price * item.quantity) }}đ
            </p>
            <button @click="removeItem(item)" class="remove-btn">Xóa</button>
          </div>
        </div>
      </div>

      <div class="cart-total">
        <p>
          Tổng tiền: <span>{{ formatPrice(cartTotalPrice) }}đ</span>
        </p>
      </div>
    </div>

    <!-- Order Form -->
    <form @submit.prevent="submitOrder" class="order-form">
      <h2 class="section-title">Thông tin giao hàng</h2>

      <div class="form-grid">
        <div class="form-group">
          <label>Họ tên</label>
          <input v-model="orderInfo.fullName" type="text" required />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input v-model="orderInfo.phone" type="tel" required />
        </div>

        <div class="form-group">
          <label>Tỉnh/Thành phố</label>
          <select
            v-model="orderInfo.province"
            @change="onProvinceChange"
            required
          >
            <option value="">Chọn tỉnh/thành phố</option>
            <option
              v-for="province in provinces"
              :key="province.code"
              :value="province.code"
            >
              {{ province.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Quận/Huyện</label>
          <select
            v-model="orderInfo.district"
            @change="onDistrictChange"
            required
          >
            <option value="">Chọn quận/huyện</option>
            <option
              v-for="district in districts"
              :key="district.code"
              :value="district.code"
            >
              {{ district.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Phường/Xã</label>
          <select v-model="orderInfo.ward" required>
            <option value="">Chọn phường/xã</option>
            <option v-for="ward in wards" :key="ward.code" :value="ward.code">
              {{ ward.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Địa chỉ chi tiết</label>
          <input v-model="orderInfo.address" type="text" required />
        </div>
      </div>

      <div class="form-group full-width">
        <label>Ghi chú</label>
        <textarea v-model="orderInfo.note" rows="3"></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button">Đặt hàng</button>
      </div>
    </form>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-provinces";

const store = useStore();
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const orderInfo = ref({
  fullName: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  note: "",
});

const cartItems = computed(() => store.getters.allCartItems);
const cartTotalPrice = computed(() => store.getters.cartTotalPrice);

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  await store.dispatch("updateCartItemQuantity", {
    productId: item.id,
    quantity: newQuantity,
  });
};

const removeItem = async (item) => {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    await store.dispatch("removeCartItem", item.id);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

onMounted(async () => {
  provinces.value = getProvinces();
  await store.dispatch("fetchCartByUserId", currentUser.id);
});

const onProvinceChange = () => {
  orderInfo.value.district = "";
  orderInfo.value.ward = "";
  districts.value = getDistrictsByProvinceCode(orderInfo.value.province);
};

const onDistrictChange = () => {
  orderInfo.value.ward = "";
  wards.value = getWardsByDistrictCode(orderInfo.value.district);
};
</script>
  
  <style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #444;
}

/* Cart Section Styles */
.cart-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.item-image {
  position: relative;
}

.item-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.status-badge {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #dc3545;
  color: white;
}

.status-badge.in-stock {
  background: #28a745;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-name {
  font-size: 18px;
  margin: 0;
}

.item-price {
  font-size: 16px;
  color: #e53935;
  font-weight: bold;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 40px;
  text-align: center;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.item-subtotal {
  font-weight: bold;
  color: #e53935;
  margin: 0;
}

.remove-btn {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Order Form Styles */
.order-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-button {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
  