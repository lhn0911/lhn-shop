<template>
  <div>
    <Header />

    <div class="container">
      <div class="product-card" v-if="product">
        <div class="product-content">
          <div class="product-image">
            <img :src="product.img" :alt="product.name" />
          </div>
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-category">
              Danh mục: <span>{{ categoryName }}</span>
            </div>
            <div class="product-rating">
              <span class="stars">★★★★☆</span>
              <span class="sold">Đã bán: {{ product.soldCount || 0 }}</span>
            </div>
            <div class="product-price">
              {{ formatCurrency(product.price) }}
            </div>
            <div class="product-stock">
              Số lượng còn lại: {{ product.stock }}
            </div>
            <div class="quantity-control">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                v-model="quantity"
                @change="updateQuantity"
                min="1"
                :max="product.stock"
              />
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="quantity-btn"
              >
                +
              </button>
            </div>
            <div class="action-buttons">
              <button
                class="add-to-cart"
                @click="addToCart"
                :disabled="!product.stock"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
              <button
                class="buy-now"
                @click="buyNow"
                :disabled="!product.stock"
              >
                MUA NGAY
              </button>
              <button
                :class="{ liked: liked }"
                @click="handleFavorite"
                class="favorite-btn"
              >
                <HeartFilled />
              </button>
            </div>
            <div class="policy">
              <PhoneFilled /> Đổi trả cực dễ chỉ cần số điện thoại
            </div>
            <div class="policy">
              <FiRefreshCcw /> 7 ngày đổi trả vì bất kỳ lý do gì
            </div>
          </div>
        </div>
      </div>
      <div v-else class="loading">Đang tải thông tin sản phẩm...</div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const quantity = ref(1);
const liked = ref(false);
const product = ref(null);

const categoryName = computed(() => {
  if (!product.value?.categoryId) return "";
  const category = store.getters.getCategoryById(product.value.categoryId);
  return category?.name || "";
});

const fetchProduct = async () => {
  const productId = parseInt(route.params.id);
  if (!store.getters.allProducts.length) {
    await store.dispatch("fetchAllProducts");
  }
  if (!store.getters.allCategory.length) {
    await store.dispatch("fetchAllCategory");
  }

  product.value = store.getters.getProductById(productId);
  if (!product.value) {
    router.push("/404");
  }
};

onMounted(fetchProduct);

const handleFavorite = async () => {
  liked.value = !liked.value;
  // Implement favorite logic here
};

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const updateQuantity = (event) => {
  const value = parseInt(event.target.value) || 1;
  quantity.value = Math.min(Math.max(1, value), product.value.stock);
};

const addToCart = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    router.push("/login");
    return;
  }

  try {
    await store.dispatch("addCartItem", {
      ...product.value,
      quantity: quantity.value,
      userId: currentUser.id,
    });
    alert("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
  }
};

const buyNow = () => {
  addToCart();
  router.push("/cart");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
</script>
  
  <style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.product-card {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 2rem;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: bold;
}

.product-description {
  color: #4a5568;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sold {
  color: #4a5568;
}

.product-price {
  font-size: 1.5rem;
  color: #e53e3e;
  font-weight: bold;
}

.product-stock {
  color: #4a5568;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-control button {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  border: 1px solid #e2e8f0;
  padding: 0.25rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.add-to-cart,
.buy-now {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  color: #fff;
  border: none;
  cursor: pointer;
}

.add-to-cart {
  background-color: #e53e3e;
}

.buy-now {
  background-color: #3182ce;
}

.liked {
  color: #e53e3e;
}

.policy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}
</style>