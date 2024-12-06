<template>
  <div class="category-management">
    <!-- Search bar and filters -->
    <div class="search-filter">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm danh mục..."
      />
      <select v-model="categoryFilter">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <button class="add-category-button" @click="showAddCategoryModal = true">
        Thêm danh mục
      </button>
    </div>

    <!-- Category table -->
    <div class="category-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in paginatedCategory" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>{{ formatDate(category.created_at) }}</td>
            <td>
              <button @click="editCategory(category)" class="edit-btn">
                Sửa
              </button>
              <button
                @click="confirmDeleteCategory(category)"
                class="delete-btn"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddCategoryModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục" }}</h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label for="category-name">Tên danh mục</label>
            <input
              id="category-name"
              type="text"
              v-model="categoryForm.name"
              placeholder="Tên danh mục"
              required
            />
          </div>
          <div class="form-group">
            <label for="category-description">Mô tả</label>
            <textarea
              id="category-description"
              v-model="categoryForm.description"
              placeholder="Mô tả"
              rows="4"
            ></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">
              {{ editingCategory ? "Cập nhật" : "Thêm" }}
            </button>
            <button type="button" @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
        <div class="modal-actions">
          <button @click="deleteSelectedCategory">Xác nhận</button>
          <button @click="cancelDelete">Hủy</button>
        </div>
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
const showAddCategoryModal = ref(false);
const showConfirmModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const editingCategory = ref(null);
const selectedCategory = ref(null);

const categoryForm = ref({
  name: "",
  description: "",
});

// Lấy danh sách danh mục
const categories = computed(() => store.getters.allCategory || []);

onMounted(async () => {
  await store.dispatch("fetchAllCategory");
});

const filteredCategory = computed(() => {
  const categoryList = store.getters.allCategory || [];
  return categoryList.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesFilter =
      !categoryFilter.value || category.id === categoryFilter.value;
    return matchesSearch && matchesFilter;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredCategory.value.length / itemsPerPage)
);
const paginatedCategory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCategory.value.slice(start, start + itemsPerPage);
});

function setPage(page) {
  currentPage.value = page;
}

function closeModal() {
  showAddCategoryModal.value = false;
  editingCategory.value = null;
  categoryForm.value = { name: "", description: "" };
}

async function saveCategory() {
  const currentDate = new Date().toISOString();

  if (editingCategory.value) {
    await store.dispatch("updateCategory", {
      categoryId: editingCategory.value.id,
      updatedData: { ...categoryForm.value },
    });
  } else {
    await store.dispatch("addCategory", {
      ...categoryForm.value,
      created_at: currentDate,
    });
  }
  closeModal();
}

function editCategory(category) {
  editingCategory.value = category;
  categoryForm.value = { ...category };
  showAddCategoryModal.value = true;
}

function confirmDeleteCategory(category) {
  selectedCategory.value = category;
  showConfirmModal.value = true;
}

async function deleteSelectedCategory() {
  if (selectedCategory.value) {
    await store.dispatch("deleteCategory", selectedCategory.value.id);
  }
  showConfirmModal.value = false;
  selectedCategory.value = null;
}

function cancelDelete() {
  showConfirmModal.value = false;
  selectedCategory.value = null;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
</script>

<style scoped>
.category-management {
  padding: 20px;
}

.search-filter {
  display: flex;
  gap: 10px;
}

.search-filter input {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  width: 30%;
}

.search-filter select {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
}

.add-category-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.category-table {
  margin-top: 20px;
}

.category-table table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th,
.category-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
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
}

.delete-btn {
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

.pagination button.active {
  background-color: #007bff;
  color: white;
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
.form-group textarea {
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
</style>
