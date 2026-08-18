import { CartActionTypes, type CartItem, type CartState } from './CartContext'

export type CartAction =
  | { type: typeof CartActionTypes.ADD_TO_CART; payload: CartItem }
  | { type: typeof CartActionTypes.REMOVE_FROM_CART; payload: { id: number } }
  | {
      type: typeof CartActionTypes.UPDATE_QUANTITY
      payload: { id: number; quantity: number }
    }
  | { type: typeof CartActionTypes.CLEAR_CART }

export const cartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART: {
      const {
        id,
        title,
        price,
        quantity = 1,
        image,
        originalPrice,
      } = action.payload

      const existingItem = state.items.find((item) => item.id === id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { id, title, price, quantity, image, originalPrice },
        ],
      }
    }
    case CartActionTypes.REMOVE_FROM_CART: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }
    case CartActionTypes.UPDATE_QUANTITY: {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    }
    case CartActionTypes.CLEAR_CART: {
      return { ...state, items: [] }
    }
    default:
      return state
  }
}
