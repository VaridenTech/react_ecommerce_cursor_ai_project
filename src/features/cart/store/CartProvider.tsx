import React, { useEffect, useReducer } from 'react'
import { CartActionTypes, CartContext, type CartItem } from './CartContext'
import { cartReducer } from './cartReducer'
import { loadCartState, saveCartState } from './cartStorage'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCartState)

  useEffect(() => {
    saveCartState(cart)
  }, [cart])

  function addToCart(item: CartItem) {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: item })
  }

  function removeFromCart(id: number) {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: { id } })
  }

  function updateQuantity(id: number, quantity: number) {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, quantity },
    })
  }

  function clearCart() {
    dispatch({ type: CartActionTypes.CLEAR_CART })
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
