import baseUrl from "@/api/index";

export async function getAllUsers() {
  try {
    const response = await baseUrl.get("/users");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

export async function addUser(userData) {
  try {
    const response = await baseUrl.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Error adding user");
  }
}

export async function updateUser(userId, updatedData) {
  try {
    const response = await baseUrl.put(`/users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
}
