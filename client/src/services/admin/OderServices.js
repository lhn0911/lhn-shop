import baseUrl from "@/api/index";

export async function getAlloder() {
  try {
    const response = await baseUrl.get("/oders");
    return response.data;
  } catch (error) {
    console.error("Không lấy được đơn hàng", error);
  }
}

export async function createOder(orderData) {
  try {
    const response = await baseUrl.post("/oders", orderData);
    return response.data;
  } catch (error) {
    console.error("Không thể tạo đơn hàng mới", error);
  }
}

export async function updateOder(orderId, updatedData) {
  try {
    const response = await baseUrl.patch(`/oders/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Không thể cập nhật đơn hàng", error);
  }
}

export async function deleteOder(orderId) {
  try {
    const response = await baseUrl.delete(`/oders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Không thể xóa đơn hàng", error);
  }
}
