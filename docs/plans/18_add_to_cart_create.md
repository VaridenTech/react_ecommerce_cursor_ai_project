สร้างสองคอมโพเนนต์ของฟีเจอร์ตะกร้า: modal ยืนยันการเพิ่มสินค้า และไอคอนตะกร้าพร้อมตัวเลขจำนวน

บริบท: @src/features/cart/useCart.ts @src/features/cart/store/CartContext.tsx @src/shared/components/Modal/Modal.tsx @src/shared/components/Button/Button.tsx @src/features/products/components/ProductCard/ProductCard.tsx @src/styles
ใช้ ProductCard เป็นแม่แบบของรูปทรงไฟล์: React.FC + interface props + default export
src/features/cart/useCart.ts export named useCart ที่คืน
  { cart, addToCart, removeFromCart, updateQuantity, clearCart }
  โดย cart มีรูปร่าง { items: CartItem[] } และ CartItem มี id, title, price,
  quantity, image และ originalPrice ที่เป็น optional
src/shared/components/Modal/Modal.tsx เป็น default export รับสาม props เท่านั้น:
  isOpen (boolean), onRequestClose (() => void) และ children
src/shared/components/Button/Button.tsx เป็น default export รับ children
  เป็น React.ReactNode และรับ onClick?: () => void
ติดตั้ง Font Awesome ครบทั้งห้า package ไว้แล้วตั้งแต่บทเรียน 10
ตัวแปรอยู่ใน src/styles/_variables.scss: $red01, $white
utility class ทุกตัวที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: relative, pointer,
  inline-block, text-center, fw-bold, fs-12, fs-20, mb-10, mb-20
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative
  ไฟล์ .scss ในโฟลเดอร์นี้ลึกสี่ชั้นจาก src ให้เขียน @use "../../../../styles/variables";

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/features/cart/components/AddToCartModalContent/AddToCartModalContent.tsx
- src/features/cart/components/CartSummary/CartSummary.module.scss
- src/features/cart/components/CartSummary/CartSummary.tsx
AddToCartModalContent ต้องไม่มีไฟล์ .module.scss

ข้อกำหนดทางเทคนิค:
- AddToCartModalContent.tsx: import React แล้ว Button แล้ว Modal ตามลำดับนี้
  interface AddToCartModalContentProps: isOpen: boolean, onClose: () => void
  ตัวคอมโพเนนต์ประกาศเป็น React.FC ที่ destructure ({ isOpen, onClose })
    แล้วเขียนเป็น arrow function ที่ return ทันทีด้วยวงเล็บ คือลงท้ายว่า }) => (
    ห้ามมีปีกกา ห้ามมีคำว่า return ในไฟล์นี้
  JSX: Modal isOpen={isOpen} onRequestClose={onClose} ครอบ
    div className="text-center" ที่มี
      h3 className="fs-20 fw-bold mb-10" ข้อความ Product Added to Cart
      p className="mb-20" ข้อความ The product has been successfully added to your cart!
      div className="inline-block" ครอบ Button onClick={onClose} children ข้อความ Close
  ห้ามเรียก useCart ห้ามมี state ห้าม import react-modal ตรง ๆ
  ห้ามรับ prop ที่บอกว่าสินค้าชิ้นไหนถูกเพิ่ม
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
- CartSummary.module.scss: @use "../../../../styles/variables";
  .cartCount -> position: absolute, top: -12px, right: -12px,
    background-color: variables.$red01, color: variables.$white,
    border-radius: 50%, padding: 3px 6px, min-width: 18px
  ไฟล์นี้มี class เดียว
- CartSummary.tsx: บรรทัด import ห้าบรรทัด ตามลำดับนี้พอดี
    import React, { useMemo } from "react";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
    import styles from "./CartSummary.module.scss";
    import { useCart } from "@/features/cart/useCart";
  interface CartSummaryProps: onIconClick: () => void  (prop เดียว)
  ในคอมโพเนนต์: const { cart } = useCart();  แล้ว
    const totalItems = useMemo(...) ที่ callback เขียนเป็น arrow แบบย่อบรรทัดเดียว
      (ไม่มีปีกกา ไม่มีคำว่า return) ตามนี้ทุกตัวอักษร
      () => cart.items.reduce((sum, item) => sum + item.quantity, 0)
      ตั้งชื่อตัวสะสมว่า sum (ไม่ใช่ total หรือ acc) ค่าเริ่มต้นเป็น 0
      และมี dependency array เป็น [cart.items]
      ห้ามใช้ cart.items.length และห้ามนับจำนวนแถว
  JSX: div className="relative" onClick={onIconClick} ที่มี
    FontAwesomeIcon className="pointer fs-20" icon={faCartShopping}
    {totalItems > 0 && ...} span ที่ className ต่อ styles.cartCount กับ
      "fs-12 fw-bold text-center" และมี aria-label="Cart item count"
      แสดงค่า totalItems
  ห้ามใช้ useNavigate ห้าม import useProductRoute และห้ามมี URL string ในไฟล์นี้
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์เดิมแม้แต่ไฟล์เดียว โดยเฉพาะ Header.tsx, Product.tsx,
  ProductDetailInfo.tsx, Modal.tsx และ Button.tsx
- ห้ามแก้ไฟล์ใด ๆ ใน src/features/cart/store/ หรือ useCart.ts
- ห้ามสร้าง CartTable หรือหน้า Cart (เป็นงานของบทถัดไป)
- ห้ามสร้าง AddToCartModalContent.module.scss
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์
- ยังไม่ต้องเอาสองตัวนี้ไปใช้ในหน้าไหน