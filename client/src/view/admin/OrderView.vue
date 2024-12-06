<template>
  <div class="order-management">
    <div class="search-filter">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm đơn hàng..."
      />
      <button class="add-order-button" @click="showAddOrderModal = true">
        Thêm đơn hàng
      </button>
    </div>

    <div class="order-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ formatCurrency(order.totalAmount) }}</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ translateStatus(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button @click="editOrder(order)" class="edit-btn">Sửa</button>
              <button @click="confirmDeleteOrder(order)" class="delete-btn">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!paginatedOrders.length" class="no-data">
        Không có đơn hàng nào
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <!-- Modal thêm/sửa đơn hàng -->
    <div v-if="showAddOrderModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingOrder ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới" }}</h3>
        <form @submit.prevent="saveOrder">
          <div class="form-group">
            <label for="customerName">Tên khách hàng</label>
            <input
              id="customerName"
              type="text"
              v-model="orderForm.customerName"
              required
            />
          </div>
          <div class="form-group">
            <label for="totalAmount">Tổng tiền</label>
            <input
              id="totalAmount"
              type="number"
              v-model="orderForm.totalAmount"
              min="0"
              required
            />
          </div>
          <div class="form-group">
            <label for="status">Trạng thái</label>
            <select id="status" v-model="orderForm.status" required>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="submit-btn">
              {{ editingOrder ? "Cập nhật" : "Thêm mới" }}
            </button>
            <button type="button" class="cancel-btn" @click="closeModal">
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showConfirmModal" class="modal">
      <div class="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa đơn hàng này không?</p>
        <div class="modal-actions">
          <button @click="deleteSelectedOrder" class="submit-btn">
            Xác nhận
          </button>
          <button @click="cancelDelete" class="cancel-btn">Hủy bỏ</button>
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
const showAddOrderModal = ref(false);
const showConfirmModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const editingOrder = ref(null);
const selectedOrder = ref(null);

const orderForm = ref({
  customerName: "",
  totalAmount: 0,
  status: "pending",
});

// Lấy dữ liệu đơn hàng từ store
const orders = computed(() => store.state.orders || []);

onMounted(async () => {
  await store.dispatch("fetchAlloder");
});

// Lọc đơn hàng theo search query
const filteredOrders = computed(() => {
  const allOrders = store.getters.allOder || [];
  return allOrders.filter((order) => {
    const matchesSearch = order.userId
      .toString()
      .includes(searchQuery.value.toLowerCase()); // Ensure userId is compared as a string
    const matchesFilter = true; // Add any additional filter conditions if needed
    return matchesSearch && matchesFilter;
  });
});

// Tính tổng số trang
const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage)
);

// Lấy đơn hàng cho trang hiện tại
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

// Các hàm xử lý
function setPage(page) {
  currentPage.value = page;
}

function closeModal() {
  showAddOrderModal.value = false;
  editingOrder.value = null;
  orderForm.value = {
    customerName: "",
    totalAmount: 0,
    status: "pending",
  };
}

async function saveOrder() {
  const orderData = {
    ...orderForm.value,
    createdAt: editingOrder.value
      ? editingOrder.value.createdAt
      : new Date().toISOString(),
  };

  if (editingOrder.value) {
    await store.dispatch("updateOrder", {
      orderId: editingOrder.value.id,
      orderData,
    });
  } else {
    await store.dispatch("createOrder", orderData);
  }

  closeModal();
}

function editOrder(order) {
  editingOrder.value = order;
  orderForm.value = {
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    status: order.status,
  };
  showAddOrderModal.value = true;
}

function confirmDeleteOrder(order) {
  selectedOrder.value = order;
  showConfirmModal.value = true;
}

async function deleteSelectedOrder() {
  if (selectedOrder.value) {
    await store.dispatch("deleteOrder", selectedOrder.value.id);
    showConfirmModal.value = false;
    selectedOrder.value = null;
  }
}

function cancelDelete() {
  showConfirmModal.value = false;
  selectedOrder.value = null;
}

// Các hàm tiện ích
function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function translateStatus(status) {
  const statusMap = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  return `status-${status}`;
}
</script>
<style scoped>
.order-management {
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

.add-order-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.order-table {
  margin-top: 20px;
}

.order-table table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
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

.form-group input {
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
