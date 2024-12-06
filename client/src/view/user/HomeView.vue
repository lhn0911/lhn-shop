<template>
  <div class="home-view">
    <Header />
    <main class="main-content">
      <Slider />
      <section class="features-section">
        <div class="feature-card" v-for="feature in features" :key="feature.id">
          <div class="feature-icon"><i :class="feature.icon"></i></div>
          <div class="feature-content">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>
      <div class="content-wrapper">
        <aside class="sidebar">
          <div class="categories-box">
            <h2>Danh Mục Sản Phẩm</h2>
            <ul class="category-list">
              <li>
                <button
                  class="category-item"
                  :class="{ active: selectedCategory === null }"
                  @click="selectCategory(null)"
                >
                  Tất cả sản phẩm
                </button>
              </li>
              <li v-for="category in categories" :key="category.id">
                <button
                  class="category-item"
                  :class="{ active: selectedCategory === category.id }"
                  @click="selectCategory(category.id)"
                >
                  {{ category.name }}
                </button>
              </li>
            </ul>
          </div>
          <div class="featured-box">
            <h2>Sản Phẩm Nổi Bật</h2>
            <div class="featured-products">
              <div
                v-for="product in featuredProducts"
                :key="product.id"
                class="featured-product"
                @click="navigateToProductDetail(product.id)"
              >
                <img :src="product.img" :alt="product.name" />
                <div class="featured-product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="price">{{ product.price }} VND</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <section class="products-section">
          <div class="products-header">
            <h2>Tất cả sản phẩm</h2>
            <div class="search-box">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm sản phẩm..."
                @input="handleSearch"
              />
              <button class="search-button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div v-if="filteredProducts.length === 0" class="no-products">
            Không tìm thấy sản phẩm phù hợp
          </div>
          <div v-else class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
            >
              <div
                class="product-image"
                :style="{ backgroundImage: `url(${product.img})` }"
              >
                <div class="product-overlay">
                  <div class="button-group">
                    <button
                      class="action-button details-btn"
                      @click="navigateToProductDetail(product.id)"
                    >
                      Chi tiết
                    </button>
                    <button
                      class="action-button cart-btn"
                      @click.stop="addCartItem(product)"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <div class="product-footer">
                  <span class="price">{{ formatPrice(product.price) }} đ</span>
                  <div class="like-section">
                    <button
                      class="like-button"
                      @click="toggleLike(product)"
                      :class="{ liked: isLiked(product.id) }"
                    >
                      <AkHeart />
                    </button>
                    <span class="like-count">{{
                      product.score_like || 0
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section class="news-section">
        <h2>Tin Tức & Kiến Thức</h2>
        <div class="news-grid">
          <article
            class="news-card"
            v-for="news in newsArticles"
            :key="news.id"
          >
            <img :src="news.image" alt="News" />
            <div class="news-content">
              <h3>{{ news.title }}</h3>
              <p>{{ news.summary }}</p>
              <a :href="news.link" class="read-more">Đọc tiếp →</a>
            </div>
          </article>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { AkHeart } from "@kalimahapps/vue-icons";
import Header from "@/components/Header/Header.vue";
import Slider from "@/components/Slider/Slider.vue";
import Footer from "@/components/Footer/Footer.vue";
const likedProducts = ref(new Set());

const store = useStore();
const router = useRouter();
const searchQuery = ref("");
const selectedCategory = ref(null);

onMounted(async () => {
  try {
    await store.dispatch("fetchAllCategory");
    await store.dispatch("fetchAllProducts");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const categories = computed(() => store.getters.allCategory || []);
const products = computed(() => store.getters.allProducts || []);
const featuredProducts = computed(() =>
  products.value.filter((product) => product.featured)
);
const newsArticles = computed(() => store.getters.allNewsArticles || []);

const filteredProducts = computed(() => {
  let result = products.value;

  if (selectedCategory.value) {
    result = result.filter(
      (product) => product.categoryId === selectedCategory.value
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  return result;
});

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
};

const handleSearch = () => {};

const navigateToProductDetail = (productId) => {
  router.push({ name: "ProductDetail", params: { id: productId } });
};

const addCartItem = async (product) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.id) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
    router.push("/login");
    return;
  }

  const cartProduct = {
    name: product.name,
    quantity: 1,
    price: product.price,
    img: product.img,
    status: true,
  };

  try {
    await store.dispatch("addCartItem", {
      userId: currentUser.id,
      product: cartProduct,
    });
    alert("Sản phẩm đã được thêm vào giỏ hàng thành công!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
  }
};
const isLiked = (productId) => {
  return likedProducts.value.has(productId);
};

const toggleLike = async (product) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thích sản phẩm");
      router.push("/login");
      return;
    }

    const isCurrentlyLiked = likedProducts.value.has(product.id);
    const newLikeCount = isCurrentlyLiked
      ? (product.score_like || 0) - 1
      : (product.score_like || 0) + 1;

    // Update local state
    if (isCurrentlyLiked) {
      likedProducts.value.delete(product.id);
    } else {
      likedProducts.value.add(product.id);
    }

    // Update product in store
    await store.dispatch("updateProductLikes", {
      productId: product.id,
      likes: newLikeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    alert("Có lỗi xảy ra khi thực hiện thao tác này");
  }
};
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};
</script>

<style scoped>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variables */
:root {
  --primary-color: #1a73e8;
  --secondary-color: #4285f4;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #e0e0e0;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Main Content */
.main-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #eba472;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 40px 0;
}

.feature-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Content Layout */
.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.categories-box,
.featured-box {
  background: rgb(198 120 67);

  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.categories-box h2,
.featured-box h2 {
  margin-bottom: 16px;
  font-size: 1.25rem;
  color: var(--text-color);
}

.category-list {
  list-style: none;
}

.category-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  text-align: left;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
  font-size: 0.95rem;
}

.category-item:hover,
.category-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Products Section */
.products-section {
  background-color: #fcd7a1;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
}

.like-button:hover {
  transform: scale(1.1);
}

.like-button i {
  font-size: 1.2rem;
  color: #ccc;
  transition: color 0.3s;
}

.like-button.liked i {
  color: #e53935;
}

.like-count {
  font-size: 0.9rem;
  color: #666;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  width: 100%;
}

.search-box input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
}

.search-button {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
}

.search-button:hover {
  background: var(--secondary-color);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 250px;
  width: 100%;
  background-size: cover;
  background-position: center;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: var(--transition);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  width: 160px;
  font-size: 0.95rem;
}

.details-btn {
  background: white;
  color: var(--text-color);
}

.cart-btn {
  background: var(--primary-color);
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.product-info p {
  margin: 8px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.product-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #e53935;
  font-weight: 600;
  font-size: 1.1rem;
}

/* No Products Message */
.no-products {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

/* News Section */
.news-section {
  margin-top: 40px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.news-card {
  background: rgb(198 120 67);

  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.news-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 16px;
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-top: 12px;
}

/* Buttons */
.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  background: var(--secondary-color);
}
</style>
