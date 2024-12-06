import {
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart,
} from "@/services/user/CartServices";

const cart = {
  state: {
    cartItems: [],
    cartId: null,
  },

  getters: {
    allCartItems: (state) => state.cartItems,
    cartTotalPrice: (state) =>
      state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
  },

  actions: {
    async fetchCartByUserId({ commit }, userId) {
      try {
        const cartData = await getCartByUserId(userId);
        if (cartData && cartData.length > 0) {
          // Đảm bảo mỗi sản phẩm có id duy nhất
          const cartItems = cartData[0].products.map((product, index) => ({
            ...product,
            id: product.id || `${cartData[0].id}_${index}`, // Tạo id duy nhất nếu không có
          }));

          commit("setCart", {
            cartItems,
            cartId: cartData[0].id,
          });
        } else {
          commit("setCart", { cartItems: [], cartId: null });
        }
      } catch (error) {
        console.error("Error fetching user cart:", error);
      }
    },

    async addCartItem({ commit, state }, product) {
      try {
        const existingItem = state.cartItems.find(
          (item) => item.id === product.id
        );

        let updatedCartItems;
        if (existingItem) {
          updatedCartItems = state.cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          const newProduct = {
            ...product,
            id: `${state.cartId}_${state.cartItems.length}`,
            quantity: 1,
          };
          updatedCartItems = [...state.cartItems, newProduct];
        }

        if (state.cartId) {
          await updateCart(state.cartId, { products: updatedCartItems });
        } else {
          const newCart = {
            userId: product.userId,
            products: updatedCartItems,
          };
          const createdCart = await createCart(newCart);
          commit("setCart", {
            cartItems: updatedCartItems,
            cartId: createdCart.id,
          });
        }

        commit("setCartItems", updatedCartItems);
      } catch (error) {
        console.error("Error in addCartItem action:", error);
      }
    },

    async updateCartItemQuantity({ commit, state }, { productId, quantity }) {
      try {
        if (quantity < 1) return;

        // Tạo bản sao mới của mảng cartItems
        const updatedCartItems = state.cartItems.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: quantity };
          }
          return { ...item }; // Tạo bản sao mới cho các item khác
        });

        await updateCart(state.cartId, {
          products: updatedCartItems.map(({ id, ...item }) => item), // Loại bỏ id khi gửi lên server
        });

        commit("setCartItems", updatedCartItems);
      } catch (error) {
        console.error("Error in updateCartItemQuantity action:", error);
      }
    },

    async removeCartItem({ commit, state }, productId) {
      try {
        const updatedCartItems = state.cartItems.filter(
          (item) => item.id !== productId
        );

        await updateCart(state.cartId, {
          products: updatedCartItems.map(({ id, ...item }) => item), // Loại bỏ id khi gửi lên server
        });

        commit("setCartItems", updatedCartItems);
      } catch (error) {
        console.error("Error in removeCartItem action:", error);
      }
    },

    async clearCart({ commit, state }) {
      try {
        await deleteCart(state.cartId);
        commit("setCart", { cartItems: [], cartId: null });
      } catch (error) {
        console.error("Error in clearCart action:", error);
      }
    },
  },

  mutations: {
    setCart(state, { cartItems, cartId }) {
      state.cartItems = cartItems;
      state.cartId = cartId;
    },
    setCartItems(state, cartItems) {
      state.cartItems = cartItems;
    },
  },
};

export default cart;
