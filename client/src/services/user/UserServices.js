import baseUrl from "@/api/index";

export async function createUser(user) {
  try {
    await baseUrl.post("/users", user);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
}

export async function getUserById(id) {
  try {
    const response = await baseUrl.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
}

export async function updateUser(updatedUser) {
  try {
    await baseUrl.put(`/users/${updatedUser.id}`, updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
}

export async function deleteUser(id) {
  try {
    await baseUrl.delete(`/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user");
  }
}

export async function getAllUsers() {
  try {
    const response = await baseUrl.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}
