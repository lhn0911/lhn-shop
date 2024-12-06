import baseUrl from "@/api/index";

export async function getAllCategory() {
  try {
    const response = await baseUrl.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Error fetching category");
  }
}

export async function addCategory(categoryData) {
  try {
    const response = await baseUrl.post("/category", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Error adding category");
  }
}

export async function updateCategory(categoryId, updatedData) {
  try {
    const response = await baseUrl.put(`/category/${categoryId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Error updating category");
  }
}

export async function deleteCategory(categoryId) {
  try {
    const response = await baseUrl.delete(`/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category");
  }
}
