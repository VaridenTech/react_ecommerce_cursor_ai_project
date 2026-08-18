ประกอบ CartProvider, hook useCart แล้วเสียบ provider เข้ากับแอป

บริบท: @src/features/cart/store/CartContext.tsx @src/features/cart/store/cartReducer.ts @src/features/cart/store/cartStorage.ts @src/app/providers.tsx
src/features/cart/store/CartContext.tsx export CartItem, CartState, CartContextProps,
  enum CartActionTypes และ const CartContext ที่มี default เป็น undefined
src/features/cart/store/cartReducer.ts export type CartAction และ const cartReducer
  ที่มี signature (state: CartState, action: CartAction) => CartState
src/features/cart/store/cartStorage.ts export CART_STORAGE_KEY,
  loadCartState(): CartState และ saveCartState(state: CartState): void
src/app/providers.tsx ตอนนี้ export function AppProviders แบบ named export
  ข้างในมี QueryClientProvider ครอบ {children} และ ReactQueryDevtools
  ที่อยู่ใต้เงื่อนไข import.meta.env.DEV
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./ ตามที่ไฟล์เดิมทำอยู่

โครงสร้าง: สร้างสองไฟล์นี้และแก้ไฟล์เดิมหนึ่งไฟล์ ไม่มากไม่น้อยกว่านี้
- src/features/cart/store/CartProvider.tsx (สร้างใหม่)
- src/features/cart/useCart.ts (สร้างใหม่ วางที่รากของ feature ไม่ใช่ใน store/
  และนามสกุลเป็น .ts ไม่ใช่ .tsx)
- src/app/providers.tsx (แก้ไฟล์เดิม)

ข้อกำหนดทางเทคนิค:
- CartProvider.tsx: บรรทัด import สี่บรรทัด ตามลำดับนี้
    import React, { useEffect, useReducer } from "react";
    import { CartActionTypes, CartContext, CartItem } from "./CartContext";
    import { cartReducer } from "./cartReducer";
    import { loadCartState, saveCartState } from "./cartStorage";
  export const CartProvider ประกาศเป็น React.FC<{ children: React.ReactNode }>
    ที่ destructure { children } (named export ไม่ใช่ default export)
  บรรทัดแรกในตัว component ต้องเป็น
    const [cart, dispatch] = useReducer(cartReducer, undefined, loadCartState);
    สามอาร์กิวเมนต์เท่านั้น ห้ามเขียนเป็น useReducer(cartReducer, loadCartState())
  useEffect ที่เรียก saveCartState(cart) โดยมี dependency array เป็น [cart]
  แล้วประกาศฟังก์ชันสี่ตัว แต่ละตัวมีแค่ dispatch หนึ่งคำสั่ง เรียงตามนี้
    addToCart(item: CartItem) -> dispatch type ADD_TO_CART payload: item
    removeFromCart(id: number) -> dispatch type REMOVE_FROM_CART payload: { id }
    updateQuantity(id: number, quantity: number) -> dispatch type UPDATE_QUANTITY
      payload: { id, quantity }
    clearCart() -> dispatch type CLEAR_CART ไม่มี payload
  return CartContext.Provider ที่ value เป็น object literal เขียนสด ๆ ตรงนั้น
    { cart, addToCart, removeFromCart, updateQuantity, clearCart } ครอบ {children}
  ห้ามห่อ value ด้วย useMemo และห้ามห่อฟังก์ชันสี่ตัวด้วย useCallback
  ห้าม export dispatch หรือ CartAction ออกไปนอกไฟล์นี้
  ห้ามอ้าง localStorage ตรง ๆ ในไฟล์นี้ ต้องผ่าน cartStorage เท่านั้น
  JSX ในไฟล์นี้ห้ามมีบรรทัดว่างคั่น
- useCart.ts: import { useContext } from "react"; แล้ว
    import { CartContext } from "./store/CartContext";
  export const useCart = () => { ... } (named export ไม่ใช่ default)
    เรียก useContext(CartContext) เก็บใน context
    ถ้า !context ให้ throw new Error("useCart must be used within a CartProvider");
    แล้ว return context
  ห้ามใส่ generic หรือ return type ให้ useCart เอง ปล่อยให้ TypeScript อนุมาน
  ห้าม re-export CartContext หรือ type ใด ๆ ออกจากไฟล์นี้
- providers.tsx: แก้สองจุดเท่านั้น
    เพิ่มบรรทัด import { CartProvider } from "@/features/cart/store/CartProvider";
      ต่อท้ายบรรทัด import ของ queryClient เป็นบรรทัด import สุดท้ายของไฟล์
    เปลี่ยน {children} เป็น <CartProvider>{children}</CartProvider>
  ห้ามขยับบรรทัด ReactQueryDevtools ห้ามย้ายมันเข้าไปใน CartProvider
  ห้ามแตะ queryClient ห้ามเพิ่ม provider ตัวอื่น

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ CartContext.tsx, cartReducer.ts หรือ cartStorage.ts แม้แต่บรรทัดเดียว
- ห้ามสร้าง component ของตะกร้า: ห้ามสร้าง CartSummary, CartTable,
  AddToCartModalContent หรือไฟล์ใด ๆ ใน src/features/cart/components
- ห้ามแตะ src/pages ทั้งโฟลเดอร์ และห้ามแตะ Header
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์
- ยังไม่ต้องต่อปุ่ม Add To Cart กับอะไรทั้งสิ้น