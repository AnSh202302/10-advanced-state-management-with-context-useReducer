import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CardContext = createContext({
  items: [],
  addItemCard: () => {},
  updateCartItemQuantity: () => {},
});

function shoppingCardReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  return state;
}
export default function CardContextProvider({ children }) {
  const [shoppingCardState, shoppingCardDispacth] = useReducer(
    shoppingCardReducer,
    {
      items: [],
    }
  );
  function handleAddItemToCart(id) {
    shoppingCardDispacth({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCardDispacth({
      type: "UPDATE_ITEM",
      payload: { productId, amount },
    });
  }

  const cardCxt = {
    items: shoppingCardState.items,
    addItemCard: handleAddItemToCart,
    updateCartItemQuantity: handleUpdateCartItemQuantity,
  };
  return (
    <CardContext.Provider value={cardCxt}>{children}</CardContext.Provider>
  );
}
