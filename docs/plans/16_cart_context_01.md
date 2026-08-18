สร้างสองไฟล์แรกของ feature ตะกร้าสินค้า: type กับ context และตัวอ่าน/เขียน localStorage

บริบท: @src/features/cart @src/features/products/types.ts @src/app/providers.tsx
src/features/cart/ ยังเป็นโฟลเดอร์ว่าง สร้างไว้ตั้งแต่บทเรียน 05 ยังไม่มีไฟล์ใดเลย
โปรเจกต์นี้ยังไม่มีระบบตะกร้าเลย ไม่มี useCart ไม่มี reducer ไม่มี provider
alias @/ ชี้ไปที่ src/ ตั้งค่าไว้แล้วทั้งใน vite.config.ts และ tsconfig.app.json
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type
tsconfig.app.json ไม่ได้เปิด erasableSyntaxOnly ประกาศ enum ได้ตามปกติ
ไฟล์ที่ตะกร้าเก็บไม่ใช่ Product ทั้งก้อนจาก API แต่เป็นรูปทรงของเราเองที่ประกาศในงานนี้

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/features/cart/store/CartContext.tsx
- src/features/cart/store/cartStorage.ts
ชื่อไฟล์แรกลงท้ายด้วย .tsx จริงตามนี้ แม้ข้างในจะไม่มี JSX เลยก็ตาม

ข้อกำหนดทางเทคนิค:
- CartContext.tsx: import { createContext } from "react"; เป็นบรรทัดเดียวของไฟล์
  แล้ว export ตามลำดับนี้พอดี
  interface CartItem: id (number), title (string), price (number),
    quantity (number), image (string), originalPrice?: number
    ฟิลด์เดียวที่เป็น optional คือ originalPrice
  interface CartState: items: CartItem[]
  interface CartContextProps: cart: CartState,
    addToCart: (item: CartItem) => void,
    removeFromCart: (id: number) => void,
    updateQuantity: (id: number, quantity: number) => void,
    clearCart: () => void
  enum CartActionTypes ที่มีสี่สมาชิก ค่าเป็น string เท่ากับชื่อสมาชิกทุกตัว:
    ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART
  const CartContext = createContext<CartContextProps | undefined>(undefined)
    ห้ามใส่ค่า default เป็น object ห้ามใส่ {} และห้ามใส่ฟังก์ชันเปล่า
  ไฟล์นี้ห้ามมี component ห้ามมี provider และห้ามมี JSX
- cartStorage.ts: import { CartState } from "./CartContext";
  export const CART_STORAGE_KEY = "ecommerce-cart:v1";
    ต้องเป็นค่าคงที่ที่ export ออกไป ห้ามเขียน string นี้ซ้ำที่อื่นในไฟล์
  const EMPTY: CartState = { items: [] };  (ไม่ export)
  export function loadCartState(): CartState
    ทั้งตัวฟังก์ชันอยู่ใน try/catch โดย catch เขียนแบบไม่รับพารามิเตอร์ คือ catch {
    ใน try: อ่าน localStorage.getItem(CART_STORAGE_KEY) เก็บใน raw
      ถ้า !raw ให้ return EMPTY
      const parsed: unknown = JSON.parse(raw);
      ตรวจสามเงื่อนไขต่อกันด้วย && ก่อนจะเชื่อ: typeof parsed === "object",
        parsed !== null และ Array.isArray((parsed as CartState).items)
        ผ่านครบสามข้อจึง return parsed as CartState ไม่ผ่านให้ return EMPTY
    ใน catch: return EMPTY
  export function saveCartState(state: CartState): void
    ใน try เรียก localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    catch แบบไม่รับพารามิเตอร์เช่นกัน และข้างในว่าง มีแต่ comment บรรทัดเดียวว่า
      Storage full or unavailable — cart just won't persist.
    ห้ามมีคำสั่งอื่นใน catch นี้ ห้าม console.log ห้าม throw ต่อ
  ไฟล์นี้ห้าม import อะไรจาก react

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้าง cartReducer.ts, CartProvider.tsx หรือ useCart.ts ในรอบนี้
- ห้ามแก้ src/app/providers.tsx
- ห้ามแตะไฟล์ใด ๆ ใน src/pages, src/shared หรือ src/features/products
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์
- ยังไม่ต้องเอาสองไฟล์นี้ไปใช้ที่ไหน