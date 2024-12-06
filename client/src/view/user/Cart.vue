<template>
  <div>
    <Header />
    <div class="cart-container">
      <h2 class="cart-title">Giỏ hàng của bạn</h2>

      <div v-if="!cartItems.length" class="empty-cart">
        <p>Giỏ hàng của bạn đang trống</p>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
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

        <div class="cart-summary">
          <div class="summary-row">
            <span>Tổng số sản phẩm:</span>
            <span>{{ totalItems }} sản phẩm</span>
          </div>
          <div class="summary-row total">
            <span>Tổng tiền:</span>
            <span>{{ formatPrice(cartTotalPrice) }}đ</span>
          </div>
          <button
            @click="checkout"
            class="checkout-btn"
            :disabled="!cartItems.length"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
  
  <script setup>
import Footer from "@/components/Footer/Footer.vue";
import Header from "@/components/Header/Header.vue";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

onMounted(() => {
  if (currentUser?.id) {
    store.dispatch("fetchCartByUserId", currentUser.id);
  }
});

const cartItems = computed(() => store.getters.allCartItems);
const cartTotalPrice = computed(() => store.getters.cartTotalPrice);
const totalItems = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

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

const checkout = () => {
  alert("Chức năng thanh toán đang được phát triển!");
};
</script>
  
  <style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.cart-items {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.cart-summary {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #e53935;
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 100px 1fr;
  }

  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
  