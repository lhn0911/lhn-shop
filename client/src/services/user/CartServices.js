import baseUrl from "@/api/index";

export async function getCartByUserId(userId) {
  try {
    const response = await baseUrl.get(`/cart?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Error fetching cart");
  }
}

export async function createCart(cart) {
  try {
    await baseUrl.post("/cart", cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Error creating cart");
  }
}

export async function updateCart(cartId, updatedCart) {
  try {
    await baseUrl.patch(`/cart/${cartId}`, updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new Error("Error updating cart");
  }
}

export async function deleteCart(cartId) {
  try {
    await baseUrl.delete(`/cart/${cartId}`);
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw new Error("Error deleting cart");
  }
}
export async function addLike(productId, likes) {
  try {
    const response = await baseUrl.patch(`/products/${productId}`, {
      score_like: likes,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding like:", error);
    throw new Error("Error adding like");
  }
}
