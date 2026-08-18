สร้างใบสรุปคำสั่งซื้อฝั่งขวาของหน้า Checkout: รายการสินค้าและกล่องยอดเงิน

บริบท: @src/features/cart/store/CartContext.tsx @src/features/cart/useCart.ts @src/shared/components/Button/Button.tsx @src/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox.tsx @src/styles/_utilities.scss
src/features/cart/store/CartContext.tsx export interface CartItem ที่มี
  id (number), title (string), price (number), quantity (number), image (string)
  และ originalPrice ที่เป็น optional
src/features/cart/useCart.ts export named useCart คืน
  { cart, addToCart, removeFromCart, updateQuantity, clearCart }
  โดย cart มีรูปร่าง { items: CartItem[] }
src/shared/components/Button/Button.tsx เป็น default export รับ children,
  className?: string, onClick?: () => void, isLoading?: boolean, disabled?: boolean
  ตอน isLoading เป็น true ปุ่มจะแสดง spinner แทน children ให้เอง
CheckoutDeliveryBox.tsx ที่เพิ่งสร้างคือรูปทรงมาตรฐานของกล่องบนหน้านี้
ยอดเงินทั้งหมดของหน้า Checkout ถูกคำนวณที่เดียวใน hook useCheckout ซึ่งจะเขียนใน
  บทถัดไป งานนี้ห้ามคำนวณยอดรวมของทั้งตะกร้าที่ไหนทั้งสิ้น
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว ห้ามสร้างใหม่และห้ามแก้ไฟล์ในนั้น:
  p-20, mb-5, mb-10, mb-15, mb-20, mr-10, flex, align-item-center, flex-grow,
  justify-between, width-full, fs-14, fs-16, fs-18, fs-20, fs-24, fw-bold,
  fw-medium, text-muted, text-primary
src/styles/_variables.scss มีตัวแปร $grey05 อยู่แล้ว

โครงสร้าง: สร้างหกไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/features/checkout/components/SummaryOrderItem/SummaryOrderItem.tsx
- src/features/checkout/components/SummaryOrderItem/SummaryOrderItem.module.scss
- src/features/checkout/components/SummaryOrder/SummaryOrder.tsx
- src/features/checkout/components/SummaryOrder/SummaryOrder.module.scss
- src/features/checkout/components/BillingSummary/BillingSummary.tsx
- src/features/checkout/components/BillingSummary/BillingSummary.module.scss

ข้อกำหนดทางเทคนิค:
- ทั้งสามไฟล์ .tsx ขึ้นต้นด้วย import React from "react"; ประกาศคอมโพเนนต์เป็น React.FC
  และปิดท้ายด้วย export default
- SummaryOrderItem.tsx: import React, แล้ว styles จาก ./SummaryOrderItem.module.scss,
  แล้ว import { CartItem } from "@/features/cart/store/CartContext";
  interface SummaryOrderItemProps มี field เดียวคือ item: CartItem
  ประกาศเป็น React.FC<SummaryOrderItemProps> ที่ destructure props เป็น ({ item })
  บรรทัดแรกในคอมโพเนนต์คือ
    const { title, price, quantity, id, image } = item;   (ลำดับตามนี้พอดี)
  JSX: div className={`flex align-item-center`} ที่มี key={id} ด้วย
    (เขียน className เป็น template literal และใส่ key ตามต้นฉบับจริง)
    img className={`${styles.image} mr-10`} src={image} alt={title}
    div className="flex-grow" ที่มี
      p className="fs-16 fw-medium mb-5" แสดง {title}
      p className="fs-14 text-muted" แสดง $ ติดกับ {price.toFixed(2)} แล้วเว้นวรรค
        ตามด้วยตัวอักษร X ตัวใหญ่ เว้นวรรค แล้ว {quantity}
    div className="fs-16 fw-bold text-primary" แสดง $ ติดกับ
      {(price * quantity).toFixed(2)}
  ห้ามเรียก useCart ในไฟล์นี้
- SummaryOrderItem.module.scss: มีแค่ .image { width: 60px; } ไม่มี @use ไม่มีอย่างอื่น
- SummaryOrder.tsx: import React, styles จาก ./SummaryOrder.module.scss,
  import { useCart } from "@/features/cart/useCart"; แล้ว SummaryOrderItem
  คอมโพเนนต์นี้ไม่มี props เลย ประกาศเป็น React.FC เปล่า ๆ ไม่ต้องมี interface
  บรรทัดแรกในคอมโพเนนต์คือ const { cart } = useCart();
  JSX: div className={`${styles.container} p-20`} ที่มี
    h3 className="fs-20 mb-5" ข้อความ Summary Order
    p className="fs-14 text-muted mb-15" ข้อความ
      For a better experience, verify your goods and choose your shipping option.
    hr className="mb-15"
    {cart.items.map((item) => ( ... ))} ที่ข้างในเป็น
      div className="mb-15" key={item.id} ครอบ SummaryOrderItem item={item}
      (ลำดับ attribute คือ className ก่อน key ตามนี้)
  ห้ามคำนวณยอดรวม ห้ามมี empty state ห้ามรับ props
- BillingSummary.tsx: import React, styles จาก ./BillingSummary.module.scss,
  แล้ว Button จาก "@/shared/components/Button/Button"
  interface BillingSummaryProps หกตัวตามลำดับนี้ ทุกตัวบังคับ ไม่มีตัวไหนเป็น optional
    subTotal: number, shipping: number, total: number,
    isLoading: boolean, isDisabled: boolean, onPlaceOrder: () => void
    (ชื่อ subTotal ใช้ T ตัวใหญ่ตามนี้)
  ตอน destructure props ให้ใส่ค่า default ให้สองตัวตามต้นฉบับจริง คือ
    isLoading = false และ isDisabled = false
  JSX: div className={`${styles.container} p-20`} ที่มี
    h3 className="fs-20 fw-bold mb-20" ข้อความ Billing Summary
    hr className="mb-20"
    div className="flex justify-between mb-10" ที่มี
      span className="fs-18 text-muted" ข้อความ Sub Total
      span className="fs-18 text-primary" แสดง $ ติดกับ {subTotal.toFixed(2)}
    div className="flex justify-between mb-10" ที่มี
      span className="fs-18 text-muted" ข้อความ Shipping
      span className="fs-18 fw-medium text-primary" แสดง $ ติดกับ
        {shipping.toFixed(2)}
    hr className="mb-20"
    div className="flex justify-between mb-20" ที่มี
      span className="fs-24 fw-bold" ข้อความ Total
      span className="fs-24 fw-bold text-primary" แสดง $ ติดกับ {total.toFixed(2)}
    บรรทัดว่างหนึ่งบรรทัด
    Button className="width-full" onClick={onPlaceOrder} isLoading={isLoading}
      disabled={isDisabled} ที่มี children เป็นข้อความ Place Order
  ห้าม import useCart ห้าม import consts.ts ห้ามคำนวณ subTotal, shipping หรือ total
    ในไฟล์นี้ ตัวเลขทั้งสามมาจาก props เท่านั้น
  ห้ามใส่ ?? หรือ || ให้ตัวเลขทั้งสาม และห้ามเช็คว่ามันเป็น undefined
- SummaryOrder.module.scss และ BillingSummary.module.scss มีเนื้อเหมือนกันทุกตัวอักษร
    @use "../../../../styles/variables";
    .container { background-color: variables.$grey05; }

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์ใด ๆ ใน src/features/cart
- ห้ามแก้สี่คอมโพเนนต์ที่สร้างไปในรอบที่แล้ว
- ห้ามแก้ src/styles/ แม้แต่บรรทัดเดียว
- ห้ามแตะ src/pages ทั้งโฟลเดอร์
- ห้ามสร้าง useCheckout.ts หรือ api.ts
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์
- ยังไม่ต้องเอาคอมโพเนนต์พวกนี้ไป render ที่ไหน