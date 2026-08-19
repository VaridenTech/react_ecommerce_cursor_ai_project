เขียนหน้า Checkout ทับ stub เดิม โดยประกอบคอมโพเนนต์ที่มีอยู่แล้วเข้ากับ hook useCheckout

บริบท: @src/features/checkout/useCheckout.ts @src/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox.tsx @src/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox.tsx @src/features/checkout/components/CheckoutPaymentBox/CheckoutPaymentBox.tsx @src/features/checkout/components/SummaryOrder/SummaryOrder.tsx @src/features/checkout/components/BillingSummary/BillingSummary.tsx @src/pages/Category/components/CategoryBanner/CategoryBanner.tsx @src/pages/Cart/Cart.tsx
src/pages/Checkout/Checkout.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว ให้เขียนทับทั้งไฟล์
src/features/checkout/useCheckout.ts เป็น default export คืน object ที่มีสิบเอ็ดคีย์
  ให้อ่านชื่อคีย์จากไฟล์จริง อย่าเดา โดยเฉพาะ billingSummary ที่เป็น object
  { subtotal, shipping, total } — subtotal ใช้ t ตัวเล็ก
  ในขณะที่ BillingSummary รับ prop ชื่อ subTotal ใช้ T ตัวใหญ่ ทั้งสองชื่อถูกต้องตามไฟล์จริง
  ห้ามแก้ไฟล์ทั้งสองให้ชื่อตรงกัน
useCheckout จัดการทั้ง state, การคำนวณยอดเงิน, การยิง API และการล้างตะกร้าไว้ครบแล้ว
  หน้าเพจนี้จึงห้ามมี logic ใด ๆ ทั้งสิ้น
CategoryBanner เป็น default export รับ prop name?: string | null
  ใช้เป็นแถบหัวเพจแบบเดียวกับหน้า Cart ในบทเรียน 24
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, flex, gap-20,
  pt-50, mb-20, mb-30

โครงสร้าง: เขียนทับไฟล์เดิมหนึ่งไฟล์และสร้างไฟล์ใหม่หนึ่งไฟล์ ไม่มากไม่น้อยกว่านี้
- src/pages/Checkout/Checkout.tsx (เขียนทับ stub ทั้งไฟล์)
- src/pages/Checkout/Checkout.module.scss (สร้างใหม่)

ข้อกำหนดทางเทคนิค:
- Checkout.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React from "react";
    import styles from "./Checkout.module.scss";
    import useCheckout from "@/features/checkout/useCheckout";
    import CategoryBanner from
      "@/pages/Category/components/CategoryBanner/CategoryBanner";
    import CheckoutAddressBox from "@/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox";
    import CheckoutDeliveryBox from "@/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox";
    import CheckoutPaymentBox from "@/features/checkout/components/CheckoutPaymentBox/CheckoutPaymentBox";
    import SummaryOrder from "@/features/checkout/components/SummaryOrder/SummaryOrder";
    import BillingSummary from "@/features/checkout/components/BillingSummary/BillingSummary";
  ประกาศเป็น const Checkout: React.FC = () => { ... } แล้ว export default
  บรรทัดแรกในคอมโพเนนต์คือการ destructure จาก useCheckout() ตามลำดับนี้พอดี
    storeCheckoutAddress, checkoutAddress, deliveryOptions, paymentOptions,
    selectedPaymentOptionId, onSelectDeliveryOption, onSelectPaymentOption,
    onPlaceOrder, selectedDeliveryOptionId,
    billingSummary: { subtotal, shipping, total },
    isPlaceOrderLoading
    (ลำดับนี้ไม่เรียงสวยตามต้นฉบับจริง ให้ตามนี้ ห้ามจัดเรียงใหม่)
  JSX: fragment ว่างตัวนอกสุด ที่มีสองอย่าง
    CategoryBanner name="Checkout"
    div className="container pt-50 mb-30" ครอบ div className="flex gap-20" ที่มีสองคอลัมน์
      คอลัมน์ซ้าย: div className={styles.addressBox} ที่มี
        div className="mb-20" ครอบ CheckoutAddressBox ที่ส่ง
          title="Shipping Address" checkoutAddress={checkoutAddress}
          onUpdateAddress={storeCheckoutAddress}
        div className="mb-20" ครอบ CheckoutDeliveryBox ที่ส่ง
          title="Delivery Options" deliveryOptions={deliveryOptions}
          onSelectOption={onSelectDeliveryOption}
          selectedDeliveryId={selectedDeliveryOptionId}
        CheckoutPaymentBox (ไม่มี div ครอบ ไม่มี mb-20) ที่ส่ง
          title="Payment Options" paymentOptions={paymentOptions}
          onSelectOption={onSelectPaymentOption}
          selectedPaymentId={selectedPaymentOptionId}
      คอลัมน์ขวา: div className={styles.summaryBox} ที่มี
        div className="mb-20" ครอบ SummaryOrder (ไม่มี prop ใด ๆ)
        บรรทัดว่างหนึ่งบรรทัด
        BillingSummary ที่ส่ง subTotal={subtotal} shipping={shipping}
          total={total} isLoading={isPlaceOrderLoading}
          isDisabled={!checkoutAddress} onPlaceOrder={onPlaceOrder}
  ห้ามใช้ useState ห้ามใช้ useEffect ห้ามใช้ useMemo ในไฟล์นี้
  ห้าม import useCart หรือเรียก clearCart ที่นี่ ห้าม import consts.ts
  ห้ามยิง API เอง ห้ามใช้ useMutation หรือ useQuery
  ห้ามใส่ guard กรณีตะกร้าว่าง และห้าม redirect ไปหน้าไหน
  ห้ามใส่ข้อความยืนยันก่อนกด Place Order
- Checkout.module.scss: สอง class เท่านั้น ไม่มี @use
    .addressBox { width: 60%; }
    .summaryBox { width: 40%; }

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ useCheckout.ts, api.ts, schema.ts, types.ts หรือ consts.ts แม้แต่บรรทัดเดียว
- ห้ามแก้คอมโพเนนต์ห้าตัวใน src/features/checkout/components
- ห้ามแก้ไฟล์ใด ๆ ใน src/features/cart, src/shared หรือ src/styles
- ห้ามแก้ router.tsx, Header.tsx, Cart.tsx หรือ OrderSuccess.tsx
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์ (หน้านี้จะมี integration test ในบทเรียน 33)