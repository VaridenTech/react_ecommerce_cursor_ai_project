สร้างฟังก์ชันยิงคำสั่งซื้อขึ้น API แล้วเขียนหน้า Order Success ทับ stub เดิม

บริบท: @src/shared/api/client.ts @src/features/products/api.ts @src/features/checkout/schema.ts @src/pages/Order/OrderSuccess.tsx
src/shared/api/client.ts export apiClient ที่เป็น axios instance และ class ApiError
  โดยมี response interceptor แปลงทุกความล้มเหลวเป็น ApiError ให้แล้วตั้งแต่บทเรียน 15
  ชั้น api จึงไม่ต้องมี try/catch เอง
src/features/products/api.ts คือรูปทรงมาตรฐานของไฟล์ api ในโปรเจกต์นี้ ให้ทำตามนั้น
  ต่างกันตรงที่งานนี้เป็น POST ครั้งแรกของโปรเจกต์
src/features/checkout/schema.ts export type CheckoutAddressFormData
src/pages/Order/OrderSuccess.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว
  route /order/success ชี้มาที่ไฟล์นี้อยู่แล้วตั้งแต่บทเรียน 09
Font Awesome ติดตั้งไว้แล้วตั้งแต่บทเรียน 10 ใช้ @fortawesome/react-fontawesome
  และ @fortawesome/free-solid-svg-icons ได้เลย
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว ห้ามสร้างใหม่:
  bg-grey01, pt-45, pb-45, text-center, text-uppercase, fw-bold, mb-15, mb-20,
  fs-18, fs-28, fs-72, text-muted, text-primary

โครงสร้าง: สร้างไฟล์ใหม่หนึ่งไฟล์และเขียนทับไฟล์เดิมหนึ่งไฟล์ ไม่มากไม่น้อยกว่านี้
- src/features/checkout/api.ts (สร้างใหม่)
- src/pages/Order/OrderSuccess.tsx (เขียนทับ stub ทั้งไฟล์)

ข้อกำหนดทางเทคนิค:
- api.ts: บรรทัด import สองบรรทัดตามลำดับนี้
    import { apiClient } from "@/shared/api/client";
    import { CheckoutAddressFormData } from "@/features/checkout/schema";
  export interface PlaceOrderPayload สามตัวตามลำดับนี้
    userId: number
    products: { id: number; quantity: number }[]
    address: CheckoutAddressFormData
  export interface PlaceOrderResponse ที่มี field เดียวคือ id: number
    ห้ามประกาศ field อื่นแม้ dummyjson จะตอบกลับมามากกว่านี้
  export async function placeOrder(payload: PlaceOrderPayload):
    Promise<PlaceOrderResponse>
    ข้างในเรียก apiClient.post<PlaceOrderResponse>("/carts/add", payload)
    แล้ว destructure { data } ออกมา return data
    ต้องใส่ generic ให้ .post ตามนี้ และต้องเป็น function declaration ไม่ใช่ arrow function
  ห้ามมี try/catch ห้ามมี console.log ห้าม import อะไรจาก react หรือ @tanstack/react-query
  ห้ามใส่ baseURL หรือ header เพิ่ม (client.ts จัดการแล้ว)
- OrderSuccess.tsx: บรรทัด import สองบรรทัดตามลำดับนี้ และไม่มีบรรทัด import React
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
  ประกาศเป็น const OrderSuccess: React.FC = () => { ... } แล้ว export default
  JSX: div ตัวนอกสุด (ไม่ใช่ fragment) ที่มี div ตัวเดียวข้างในคือ
    div className="bg-grey01 pt-45 pb-45 text-center" ที่มีสามอย่างเรียงกัน
      FontAwesomeIcon icon={faCircleCheck} className="fs-72 text-primary mb-20"
      h2 className="fs-28 mb-15 text-uppercase fw-bold" ข้อความ
        Order Placed Successfully!
      p className="fs-18 text-muted" ข้อความ
        Your order has been successfully placed and is on its way.
  ห้ามเรียก useCart ห้ามล้างตะกร้าในหน้านี้ ห้ามยิง API ห้ามมี state
  ห้ามใส่ปุ่มกลับหน้าแรกหรือลิงก์ใด ๆ
  ห้ามสร้าง OrderSuccess.module.scss

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้าง useCheckout.ts, Checkout.tsx หรือ Checkout.module.scss ในรอบนี้
- ห้ามแก้ src/app/router.tsx (route ทั้งสองเส้นมีอยู่แล้ว)
- ห้ามแก้ไฟล์ใด ๆ ใน src/features/cart หรือ src/features/checkout/components
- ห้ามแก้ src/styles/ แม้แต่บรรทัดเดียว
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์ (api ตัวนี้จะถูก mock ในบทเรียน 32 และ 33)
- ยังไม่ต้องเรียก placeOrder จากที่ไหน