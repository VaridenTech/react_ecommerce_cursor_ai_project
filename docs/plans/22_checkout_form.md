สร้างฟอร์มที่อยู่จัดส่งด้วย react-hook-form + zod แล้วห่อด้วยกล่องที่แสดงที่อยู่ที่ submit แล้ว

บริบท: @src/features/checkout/schema.ts @src/shared/components/Input/Input.tsx @src/shared/components/Button/Button.tsx @src/styles/_utilities.scss @src/styles/_variables.scss
src/features/checkout/schema.ts export const checkoutAddressSchema (zod object ที่มี
  address, email, phone) และ export type CheckoutAddressFormData ที่มาจาก z.infer
  ข้อความ error ทุกก้อนอยู่ใน schema แล้ว ห้ามเขียนเงื่อนไข validate ซ้ำในคอมโพเนนต์
zod เป็นเวอร์ชัน 4 ส่วน react-hook-form และ @hookform/resolvers ติดตั้งแล้วในบทเรียนที่แล้ว
src/shared/components/Input/Input.tsx เป็น default export ที่ห่อด้วย forwardRef
  props extends React.InputHTMLAttributes<HTMLInputElement> แล้วเพิ่ม
  label?: string และ error?: string
  ref ที่ส่งเข้าไปจะไปถึงแท็ก input จริง และ error ที่ส่งเข้าไปจะแสดงเป็นข้อความสีแดงใต้ช่อง
src/shared/components/Button/Button.tsx เป็น default export รับ children: React.ReactNode
  และ type?: "button" | "reset" | "submit" โดยค่า default ของ type คือ "button"
src/features/checkout/ ตอนนี้มีสามไฟล์: schema.ts, types.ts, consts.ts และยังไม่มีโฟลเดอร์
  components เลย
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว ห้ามสร้างใหม่และห้ามแก้ไฟล์ในนั้น:
  mb-15, mb-20, p-20, pb-10, flex, gap-15, width-50, fs-20, fw-bold, lh-1-5
src/styles/_variables.scss มีตัวแปร $grey05 อยู่แล้ว

โครงสร้าง: สร้างสามไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/features/checkout/components/CheckoutAddressForm/CheckoutAddressForm.tsx
  (ไม่มีไฟล์ .module.scss คู่กัน)
- src/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox.tsx
- src/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox.module.scss

ข้อกำหนดทางเทคนิค:
- ทั้งสองไฟล์ .tsx ขึ้นต้นด้วย import React from "react"; ประกาศคอมโพเนนต์เป็น React.FC
  พร้อม interface ของ props ไว้เหนือคอมโพเนนต์ และปิดท้ายไฟล์ด้วย export default
  รูปทรงเดียวกับคอมโพเนนต์อื่นทั้งหมดในโปรเจกต์ตั้งแต่บทเรียน 12
- CheckoutAddressForm.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React from "react";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { checkoutAddressSchema, CheckoutAddressFormData } from
      "@/features/checkout/schema";
    import Input from "@/shared/components/Input/Input";
    import Button from "@/shared/components/Button/Button";
  ใต้บรรทัด import ให้มีบรรทัดนี้พอดีหนึ่งบรรทัด
    export type { CheckoutAddressFormData };
  interface CheckoutAddressFormProps มี field เดียว
    onSubmit: (data: CheckoutAddressFormData) => void
  ในคอมโพเนนต์ ดึงของจาก useForm สามอย่างพอดี คือ register, handleSubmit
    และ formState: { errors } โดยเรียกเป็น
    useForm<CheckoutAddressFormData>({ resolver: zodResolver(checkoutAddressSchema) })
    ต้องใส่ generic ตัวนี้ให้ useForm ห้ามปล่อยว่าง
  const onFormSubmit = (data: CheckoutAddressFormData) => { onSubmit({ ...data }); };
  นอก JSX ให้มีบรรทัดว่างคั่นสองจุดพอดี คือหลังปีกกาปิดของบล็อก useForm ก่อน const onFormSubmit
    และหลัง onFormSubmit ก่อน return ( — Prettier ไม่เพิ่มและไม่ลบบรรทัดว่างพวกนี้ให้
  JSX: form ที่มี onSubmit={handleSubmit(onFormSubmit)} ข้างในเรียงตามนี้
    div className="mb-15" ครอบ Input ที่มี label="Address" type="text"
      placeholder="Enter Address" แล้ว {...register("address")}
      แล้ว error={errors.address?.message} ตามลำดับ prop นี้พอดี
    บรรทัดว่างหนึ่งบรรทัด
    div className="flex gap-15 mb-15" ที่มี div className="width-50" สองอัน
      อันแรกครอบ Input label="Email" type="email" placeholder="Enter Email"
        {...register("email")} error={errors.email?.message}
      อันที่สองครอบ Input label="Phone Number" type="text"
        placeholder="Enter Phone Number" {...register("phone")}
        error={errors.phone?.message}
    บรรทัดว่างหนึ่งบรรทัด
    Button type="submit" ที่มี children เป็นข้อความ Submit
  ห้ามใช้ useState ห้ามใช้ Controller ห้ามใส่ value หรือ onChange ให้ Input เอง
  ห้ามเรียก e.preventDefault() ห้ามเรียก safeParse หรือ parse เอง
  ห้ามใส่ defaultValues ห้ามใส่ mode ให้ useForm
  ห้ามใช้แท็ก input ดิบ ๆ ต้องใช้คอมโพเนนต์ Input เท่านั้น
- CheckoutAddressBox.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React from "react";
    import styles from "./CheckoutAddressBox.module.scss";
    import CheckoutAddressForm, { CheckoutAddressFormData } from
      "@/features/checkout/components/CheckoutAddressForm/CheckoutAddressForm";
    บรรทัดที่สามนี้ import type มาจากตัวคอมโพเนนต์ ไม่ใช่จาก schema.ts ตามนี้จริง
  interface CheckoutAddressBoxProps สามตัวตามลำดับนี้
    title: string
    checkoutAddress: CheckoutAddressFormData | null
    onUpdateAddress: (data: CheckoutAddressFormData) => void
  const onSubmitAddress = (data: CheckoutAddressFormData) => { onUpdateAddress(data); };
  นอก JSX ให้มีบรรทัดว่างหนึ่งบรรทัดหลัง onSubmitAddress ก่อน return (
  JSX: div className={`${styles.container} p-20`} ที่มี
    h3 className="fs-20 pb-10" แสดง {title}
    hr className="mb-20"
    {checkoutAddress && ( ... )} ที่ครอบ p className="lh-1-5 mb-20" ซึ่งข้างในมี
      span className="fw-bold" ข้อความ Address แล้วตามด้วย " : " แล้ว
        {checkoutAddress.address}
      br
      span className="fw-bold" ข้อความ email (ตัวเล็กตามนี้) แล้ว " : " แล้ว
        {checkoutAddress.email}
      br
      span className="fw-bold" ข้อความ phone (ตัวเล็กตามนี้) แล้ว " : " แล้ว
        {checkoutAddress.phone}
    บรรทัดว่างหนึ่งบรรทัด
    CheckoutAddressForm onSubmit={onSubmitAddress}
  ห้ามมี useState ห้ามมีปุ่ม Edit ห้ามซ่อนฟอร์มหลัง submit
  ห้าม import zod, react-hook-form หรือ schema.ts ในไฟล์นี้
- CheckoutAddressBox.module.scss: สองส่วนเท่านั้น
    @use "../../../../styles/variables";
    .container { background-color: variables.$grey05; }
  ห้ามใส่ padding, border, radius หรือกฎอื่นใดเพิ่ม

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ schema.ts, types.ts หรือ consts.ts
- ห้ามแก้ Input.tsx, Button.tsx หรือไฟล์ใด ๆ ใน src/shared
- ห้ามแก้ src/styles/ แม้แต่บรรทัดเดียว
- ห้ามแตะ src/pages ทั้งโฟลเดอร์ โดยเฉพาะ Checkout.tsx ที่ยังเป็น stub
- ห้ามสร้าง CheckoutAddressForm.module.scss
- ห้ามสร้างคอมโพเนนต์อื่นของหน้า Checkout (Delivery, Payment, Summary, Billing)
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์ (ฟอร์มนี้จะถูกกรอกจริงใน integration test บทเรียน 33)