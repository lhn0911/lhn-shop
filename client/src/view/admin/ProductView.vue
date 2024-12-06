<template>
  <div class="product-management">
    <div class="search-filter">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        v-model="searchQuery"
      />
      <select v-model="categoryFilter">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in category" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <select v-model="stockFilter">
        <option value="">Tất cả trạng thái</option>
        <option value="instock">Còn hàng</option>
        <option value="outstock">Hết hàng</option>
      </select>
      <button class="add-product-button" @click="showAddProductModal = true">
        Thêm sản phẩm
      </button>
    </div>

    <div class="product-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Danh mục</th>
            <th>Thời gian</th>
            <th>Ngày sửa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td class="image-cell">
              <img
                :src="product.img || 'https://via.placeholder.com/40'"
                :alt="product.name"
                class="product-image"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>
              <span :class="product.stock > 0 ? 'instock' : 'outstock'">
                {{ product.stock }}
              </span>
            </td>
            <td>{{ getCategoryName(product.categoryId) }}</td>
            <td>{{ formatDate(product.created_at) }}</td>
            <td>
              {{
                product.updated_at
                  ? formatDate(product.updated_at)
                  : "Chưa có chỉnh sửa"
              }}
            </td>
            <td style="display: flex">
              <button class="edit-btn" @click="editProduct(product)">
                Sửa
              </button>
              <button class="delete-btn" @click="confirmDeleteProduct(product)">
                Xóa
              </button>
            </td>
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

    <div v-if="showAddProductModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm" }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label for="product-name">Tên sản phẩm</label>
            <input
              id="product-name"
              type="text"
              v-model="productForm.name"
              placeholder="Tên sản phẩm"
              required
            />
          </div>
          <div class="form-group">
            <label for="product-description">Mô tả</label>
            <textarea
              id="product-description"
              v-model="productForm.description"
              placeholder="Mô tả"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="product-price">Giá</label>
            <input
              id="product-price"
              type="number"
              v-model="productForm.price"
              required
              min="0"
            />
          </div>
          <div class="form-group">
            <label for="product-stock">Số lượng tồn</label>
            <input
              id="product-stock"
              type="number"
              v-model="productForm.stock"
              required
              min="0"
            />
          </div>
          <div class="form-group">
            <label for="product-category">Danh mục</label>
            <select
              id="product-category"
              v-model="productForm.categoryId"
              required
            >
              <option value="" disabled>Chọn danh mục</option>
              <option v-for="cat in category" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="product-img">Link hình ảnh</label>
            <input
              id="product-img"
              type="text"
              v-model="productForm.img"
              placeholder="Link hình ảnh"
            />
          </div>
          <div class="modal-actions">
            <button type="submit">
              {{ editingProduct ? "Cập nhật" : "Thêm" }}
            </button>
            <button type="button" @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
        <button @click="deleteSelectedProduct">Xác nhận</button>
        <button @click="cancelDelete">Hủy</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const searchQuery = ref("");
const categoryFilter = ref("");
const stockFilter = ref("");
const showAddProductModal = ref(false);
const showConfirmModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const editingProduct = ref(null);
const selectedProduct = ref(null);

const productForm = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: "",
  img: "https://via.placeholder.com/150",
});

const category = computed(() => store.getters.allCategory || []);

onMounted(async () => {
  await store.dispatch("fetchAllProducts");
  await store.dispatch("fetchAllCategory");
});

const filteredProducts = computed(() => {
  const products = store.getters.allProducts || [];
  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (!categoryFilter.value || product.categoryId === categoryFilter.value) &&
      (!stockFilter.value ||
        (stockFilter.value === "instock"
          ? product.stock > 0
          : product.stock === 0))
    );
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

function setPage(page) {
  currentPage.value = page;
}

function closeModal() {
  showAddProductModal.value = false;
  editingProduct.value = null;
  productForm.value = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    img: "https://via.placeholder.com/150",
  };
}

async function saveProduct() {
  const now = new Date().toISOString();

  if (editingProduct.value) {
    await store.dispatch("updateProduct", {
      productId: editingProduct.value.id,
      updatedData: {
        ...productForm.value,
        updated_at: now,
      },
    });
  } else {
    await store.dispatch("addProduct", {
      ...productForm.value,
      created_at: now,
      updated_at: "",
    });
  }
  closeModal();
}

function editProduct(product) {
  editingProduct.value = product;
  productForm.value = { ...product };
  showAddProductModal.value = true;
}

function confirmDeleteProduct(product) {
  selectedProduct.value = product;
  showConfirmModal.value = true;
}

async function deleteSelectedProduct() {
  await store.dispatch("deleteProduct", selectedProduct.value.id);
  showConfirmModal.value = false;
  selectedProduct.value = null;
}

function cancelDelete() {
  showConfirmModal.value = false;
  selectedProduct.value = null;
}

function getCategoryName(categoryId) {
  const cat = category.value.find((cat) => cat.id === categoryId);
  return cat ? cat.name : "Không có danh mục";
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatDate(date) {
  if (!date) return "Chưa có chỉnh sửa";

  const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formattedDate;
}
</script>

<style>
.product-management {
  padding: 20px;
}

.search-filter {
  display: flex;
  gap: 10px;
}
.search-filter input {
  width: 40%;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}
.search-filter select {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
}
.add-product-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.product-table {
  margin-top: 20px;
}

.product-table table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.image-cell {
  width: 60px;
  height: 60px;
  padding: 5px !important;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.product-table tr:hover {
  background-color: #f5f5f5;
}

.edit-btn,
.delete-btn {
  padding: 4px 8px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

.instock {
  color: #4caf50;
  font-weight: 500;
}

.outstock {
  color: #f44336;
  font-weight: 500;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

.modal h3 {
  margin: 0 0 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.modal button[type="button"] {
  background-color: #f44336;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
}
</style>

