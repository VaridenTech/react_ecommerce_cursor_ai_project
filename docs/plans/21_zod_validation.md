สร้างชั้นข้อมูลที่เหลือของ feature checkout: type ของตัวเลือกจัดส่ง/ชำระเงิน และรายการตัวเลือกจริง

บริบท: @src/features/checkout/schema.ts @src/features/products/types.ts @src/features/cart/store/CartContext.tsx
src/features/checkout/schema.ts เพิ่งถูกเขียนด้วยมือและ commit แล้ว ข้างในมี
  checkoutAddressSchema และ type CheckoutAddressFormData ที่มาจาก z.infer ของ schema นั้น
  type ของ "ที่อยู่จัดส่ง" จึงมีอยู่ครบแล้ว ห้ามประกาศซ้ำที่ไหนอีก
โฟลเดอร์ src/features/checkout/ ตอนนี้มีไฟล์เดียวคือ schema.ts
zod, react-hook-form และ @hookform/resolvers ถูกติดตั้งแล้วก่อนเปิดแชทนี้ (zod เป็นเวอร์ชัน 4)
alias @/ ชี้ไปที่ src/ ตั้งค่าไว้แล้วทั้งใน vite.config.ts และ tsconfig.app.json
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type
รายการตัวเลือกจัดส่งและชำระเงินเป็นค่าคงที่ที่เราเขียนเองในโค้ด ไม่ได้มาจาก API
ราคาเป็น USD เหมือนราคาสินค้าจาก dummyjson

โครงสร้าง: สร้างสองไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/features/checkout/types.ts
- src/features/checkout/consts.ts

ข้อกำหนดทางเทคนิค:
- types.ts: ห้ามมีบรรทัด import เลยแม้แต่บรรทัดเดียว export interface สองตัวตามลำดับนี้
  interface DeliveryOption: id (number), name (string), description (string),
    price (number), estimatedTime (string)
    เรียง field ตามลำดับนี้พอดี และห้ามมี field ไหนเป็น optional
  interface PaymentOption: id (number), name (string), description (string)
    ห้ามมี price ห้ามมี estimatedTime
  ห้ามประกาศ type ของที่อยู่ ห้าม import หรือ re-export อะไรจาก schema.ts
- consts.ts: บรรทัดแรกของไฟล์คือ
    import { DeliveryOption, PaymentOption } from "./types";
    ใช้ path แบบ ./types ไม่ใช่ @/features/checkout/types
  export const deliveryOptions: DeliveryOption[] มีสองสมาชิกเรียงตามนี้
    id: 1, name: "Standard Delivery", description: "Approx 5 to 7 Days",
      estimatedTime: "5-7 Days", price: 5.99
    id: 2, name: "Express Delivery", description: "Approx 1 - 2 Days",
      estimatedTime: "1-2 Days", price: 15.99
    ลำดับ field ในแต่ละ object คือ id, name, description, estimatedTime, price
      (สลับกับลำดับใน interface จริงตามนี้)
  export const paymentOptions: PaymentOption[] มีสองสมาชิกเรียงตามนี้
    id: 3, name: "Cash on Delivery",
      description: "Pay cash when your order is delivered."
    id: 4, name: "Bank Transfer",
      description: "Pay directly from your bank account."
    ค่า id ของ paymentOptions เริ่มที่ 3 จริงตามนี้ ห้ามเริ่มใหม่ที่ 1
  ข้อความทุกก้อนสะกดตามนี้เป๊ะ รวมถึงเว้นวรรครอบขีดใน "Approx 1 - 2 Days"
    และจุดท้ายประโยคของ description ฝั่ง payment ทั้งสองตัว
  ราคาเป็น number ไม่ใช่ string และไม่ต้องมีสัญลักษณ์สกุลเงิน
  ห้ามใส่ as const ห้ามใช้ enum ห้าม export ค่าคงที่อื่นเพิ่ม
- ทั้งสองไฟล์ห้ามมี comment แม้แต่บรรทัดเดียว

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่ สามตัวที่ต้องใช้ติดตั้งไปแล้ว
- ห้ามแก้ src/features/checkout/schema.ts แม้แต่บรรทัดเดียว
- ห้ามสร้าง api.ts, useCheckout.ts, คอมโพเนนต์ หรือไฟล์ .module.scss ใด ๆ
- ห้ามแตะ src/pages, src/shared, src/app หรือ src/features/cart
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์ (schema.ts จะมีเทสต์ในบทเรียน 31)
- ยังไม่ต้องเอาสองไฟล์นี้ไปใช้ที่ไหน