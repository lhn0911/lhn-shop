import baseUrl from "@/api/index";

export async function getAllProducts() {
  try {
    const response = await baseUrl.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
}
export async function addProduct(productData) {
  try {
    const response = await baseUrl.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Error adding product");
  }
}

export async function updateProduct(productId, updatedData) {
  try {
    const response = await baseUrl.put(`/products/${productId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await baseUrl.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Error deleting product");
  }
}
