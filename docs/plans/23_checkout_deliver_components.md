สร้างคอมโพเนนต์ตัวเลือกจัดส่งและตัวเลือกชำระเงิน พร้อมกล่องที่วนลูปแสดงมัน

บริบท: @src/shared/components/RadioInput/RadioInput.tsx @src/features/checkout/types.ts @src/features/checkout/consts.ts @src/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox.tsx @src/styles/_utilities.scss @src/styles/_variables.scss
src/shared/components/RadioInput/RadioInput.tsx เป็น default export รับ props
  id: string, name: string, checked: boolean, onChange: () => void,
  label: React.ReactNode และ className?: string
  onChange ไม่รับพารามิเตอร์ใด ๆ และ label รับ JSX ได้ทั้งก้อน
src/features/checkout/types.ts export interface DeliveryOption
  (id, name, description, price, estimatedTime) และ interface PaymentOption
  (id, name, description) — ชื่อ type ทั้งสองตัวชนกับชื่อคอมโพเนนต์ที่จะสร้างในงานนี้พอดี
src/features/checkout/consts.ts export deliveryOptions และ paymentOptions
  งานนี้ห้าม import สองตัวนั้น รายการจะถูกส่งเข้ามาเป็น prop จากหน้าเพจในบทถัดไป
CheckoutAddressBox.tsx คือกล่องใบแรกของหน้า Checkout ที่สร้างไปแล้ว
  ให้ทำตามรูปทรงเดียวกัน: div ที่มี styles.container กับ p-20, h3, hr แล้วเนื้อใน
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว ห้ามสร้างใหม่และห้ามแก้ไฟล์ในนั้น:
  p-20, pb-10, mb-20, mb-10, mr-5, ml-5, fs-20, fw-medium, text-muted
src/styles/_variables.scss มีตัวแปร $grey05 อยู่แล้ว

โครงสร้าง: สร้างหกไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/features/checkout/components/DeliveryOption/DeliveryOption.tsx
- src/features/checkout/components/PaymentOption/PaymentOption.tsx
- src/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox.tsx
- src/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox.module.scss
- src/features/checkout/components/CheckoutPaymentBox/CheckoutPaymentBox.tsx
- src/features/checkout/components/CheckoutPaymentBox/CheckoutPaymentBox.module.scss
DeliveryOption กับ PaymentOption ไม่มีไฟล์ .module.scss

ข้อกำหนดทางเทคนิค:
- DeliveryOption.tsx: import React from "react"; แล้ว
    import RadioInput from "@/shared/components/RadioInput/RadioInput";
  interface DeliveryOptionProps: id (number), name (string), description (string),
    selected (boolean), onSelect: (id: number) => void
  ประกาศเป็น React.FC<DeliveryOptionProps> ที่ destructure props ทั้งห้าตัวตามลำดับ
    ที่ประกาศไว้ใน interface พอดี คือ id, name, description, selected, onSelect
  return RadioInput ตัวเดียวไม่มี div ครอบ โดยส่ง props ตามลำดับนี้
    id={`delivery-option-${id}`}  (template literal ตามนี้)
    name="deliveryOption"
    checked={selected}
    onChange={() => onSelect(id)}
    label={ ... } ที่เป็น fragment ว่างครอบสองอย่าง
      span className="mr-5" แสดง {name} แล้วตามด้วยอักขระ | ติดท้าย span นั้นทันที
        ในบรรทัดเดียวกัน
      span className="ml-5" แสดง {description}
  ห้ามส่ง className ให้ RadioInput ห้ามแสดง price ในไฟล์นี้
- PaymentOption.tsx: โครงเดียวกับ DeliveryOption ทุกประการ ต่างกันสี่จุดนี้เท่านั้น
    1) ชื่อคอมโพเนนต์และ interface เป็น PaymentOption / PaymentOptionProps
    2) id={`payment-option-${id}`}
    3) name="paymentOption"
    4) label เป็น fragment ว่างที่มีสามอย่างเรียงกัน
         span className="fw-medium" แสดง {name}
         br
         span className="text-muted" แสดง {description}
  นอกจากสี่ข้อนี้ ต้องเหมือนกันทุกตัวอักษร รวมถึงชื่อ prop, ลำดับ prop ที่ส่งให้ RadioInput
  และลำดับตอน destructure ซึ่งเป็น id, name, description, selected, onSelect เหมือนกัน
- CheckoutDeliveryBox.tsx: ไฟล์นี้ไม่มีบรรทัด import React (ตามต้นฉบับจริง)
  บรรทัด import สามบรรทัดตามลำดับนี้
    import styles from "./CheckoutDeliveryBox.module.scss";
    import { DeliveryOption as TDeliveryOption } from "@/features/checkout/types";
    import DeliveryOption from
      "@/features/checkout/components/DeliveryOption/DeliveryOption";
  interface ของไฟล์นี้ชื่อ CheckoutDeliveryBox เฉย ๆ ไม่มีคำว่า Props ต่อท้าย
    (ตามต้นฉบับจริง อย่าแก้ให้)
    มีสี่ field: title (string), selectedDeliveryId (number),
    deliveryOptions (TDeliveryOption[]), onSelectOption: (id: number) => void
  ประกาศเป็น React.FC<CheckoutDeliveryBox> ที่ destructure ตามลำดับนี้
    title, deliveryOptions, selectedDeliveryId, onSelectOption
    (ลำดับตอน destructure ไม่ตรงกับลำดับใน interface จริงตามนี้)
  JSX: div className={`${styles.container} p-20`} ที่มี
    h3 className="fs-20 pb-10" แสดง {title}
    hr className="mb-20"
    บรรทัดว่างหนึ่งบรรทัด
    {deliveryOptions.map(({ id, name, description }) => ( ... ))} ที่ destructure
      สามตัวนี้ในพารามิเตอร์ ไม่ใช่รับ option ทั้งก้อน
      ข้างในเป็น div key={id} className="mb-10" ครอบ DeliveryOption ที่ส่ง
        id={id} name={name} description={description}
        selected={id === selectedDeliveryId}
        onSelect={onSelectOption}   (ส่งฟังก์ชันตรง ๆ ห้ามห่อด้วย arrow function)
  ห้าม import consts.ts ห้ามมี state ห้ามคำนวณราคาใด ๆ
- CheckoutPaymentBox.tsx: โครงเดียวกับ CheckoutDeliveryBox ต่างกันสี่จุดนี้เท่านั้น
    1) ชื่อคอมโพเนนต์เป็น CheckoutPaymentBox และ interface ชื่อ CheckoutPaymentBoxProps
       (ตัวนี้มีคำว่า Props ต่อท้ายจริงตามนี้ ต่างจากไฟล์ delivery)
    2) import type เป็น { PaymentOption as TPaymentOption } และ import คอมโพเนนต์
       PaymentOption
    3) ชื่อ prop เป็น selectedPaymentId และ paymentOptions
    4) styles มาจาก ./CheckoutPaymentBox.module.scss
  ลำดับ destructure คือ title, paymentOptions, selectedPaymentId, onSelectOption
- ไฟล์ .module.scss ทั้งสองไฟล์มีเนื้อเหมือนกันทุกตัวอักษร
    @use "../../../../styles/variables";
    .container { background-color: variables.$grey05; }
  ห้ามใส่กฎอื่นเพิ่ม

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ RadioInput.tsx หรือไฟล์ใด ๆ ใน src/shared
- ห้ามแก้ types.ts, consts.ts, schema.ts หรือคอมโพเนนต์ที่อยู่ของบทที่แล้ว
- ห้ามแก้ src/styles/ แม้แต่บรรทัดเดียว
- ห้ามแตะ src/pages ทั้งโฟลเดอร์ โดยเฉพาะ Checkout.tsx ที่ยังเป็น stub
- ห้ามสร้าง SummaryOrder, SummaryOrderItem หรือ BillingSummary ในรอบนี้
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์
- ยังไม่ต้องเอาคอมโพเนนต์พวกนี้ไป render ที่ไหน