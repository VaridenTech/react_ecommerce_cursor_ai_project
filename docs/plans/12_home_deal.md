เพิ่มโซนดีลประจำวันและตารางรูปโปรโมชันลงในหน้า Home ที่มีอยู่แล้ว

บริบท: @src/pages/Home/Home.tsx @src/pages/Home/Home.module.scss @src/features/products/queries.ts @src/shared/components/CountdownTimer/CountdownTimer.tsx @src/shared/components/ImageZoom/ImageZoom.tsx
src/pages/Home/Home.tsx เป็นหน้า Home ที่ทำงานได้แล้วและ commit ไปแล้ว
  ตอนนี้มีสี่ส่วนเรียงกัน: Banner, section FeatureCard, section หมวดหมู่, section แบนเนอร์ยาว
  มี query สองตัวคือ productQueries.categories() และ productQueries.byCategory(...)
src/pages/Home/Home.module.scss มี class .mainDealBox, .secondDealBox, .thirdDealBox
  ที่ยังไม่มีใครใช้ รอบนี้จะได้ใช้
src/shared/components/CountdownTimer/CountdownTimer.tsx รับ prop เดียวคือ targetDate: string
src/shared/components/ImageZoom/ImageZoom.tsx รับ src, alt และ className ที่ไม่บังคับ
productQueries.list รับ { page?, limit? } และคืน queryOptions ที่ใช้กับ useQuery ได้ตรง ๆ
รูปดีลอยู่ที่ public/images/deals/01.png ถึง 04.png เรียกใช้ด้วย path /images/deals/01.png
utility class ที่เพิ่มใหม่รอบนี้มีอยู่จริงใน src/styles/ แล้ว: pt-55, mb-20, m-0, mr-15,
  mr-5, fs-24, gap-25, flex, align-item-center, text-center

โครงสร้าง: แก้ไฟล์เดียวคือ src/pages/Home/Home.tsx ห้ามสร้างไฟล์ใหม่แม้แต่ไฟล์เดียว
และห้ามแก้ Home.module.scss

ข้อกำหนดทางเทคนิค:
- ขยาย import เดิมจาก "react" ให้เป็น import React, { useMemo, useState } from "react";
- ขยาย import จาก "@fortawesome/free-solid-svg-icons" ให้มีสามชื่อเรียงตามนี้:
  faTruck, faVolumeHigh, faBolt
- เพิ่ม import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  ไว้ต่อจากบรรทัด import ของ free-regular-svg-icons
- เพิ่ม import CountdownTimer from "@/shared/components/CountdownTimer/CountdownTimer";
  ไว้ต่อจากบรรทัด import Banner
  (ImageZoom import ไว้แล้วในรอบก่อน ห้าม import ซ้ำ)
- เพิ่ม useQuery ตัวที่สามไว้ก่อนบรรทัด const { data: categories }
  useQuery(productQueries.list({ limit: 5 })) destructure เป็น
  data: bestProductsData, isLoading: isBestProductsLoading, isError: isBestProductsError
- เพิ่ม const targetDate = useMemo(...) ไว้หลัง useQuery ตัวสุดท้ายและก่อน onProductClick
  ข้างใน: const date = new Date(); แล้ว date.setDate(date.getDate() + 1);
  พร้อม comment ท้ายบรรทัดนั้นว่า // Add 1 days
  แล้วเว้นบรรทัดว่าง แล้ว return date.toISOString();
  dependency array ต้องเป็น [] ห้ามเรียก new Date() นอก useMemo
- แทรก section ใหม่สองอันไว้ระหว่าง section ของ FeatureCard กับ section ของหมวดหมู่
  section แรก className="pt-55":
    div className="flex align-item-center mb-20" ที่มี
      h2 className="fs-24 m-0 mr-15" ข้างในเป็น FontAwesomeIcon icon={faBolt}
        className="mr-5" ตามด้วยข้อความ DEALS OF THE DAY
      CountdownTimer targetDate={targetDate}
    div className="flex gap-25" ที่ข้างในเป็น ternary ซ้อนสองชั้นเรียงตามนี้เท่านั้น:
      isBestProductsError ? <ErrorMessage />
      : isBestProductsLoading ? div className="text-center" ครอบ ClipLoader
        ที่มี size={40} aria-label="Loading Spinner" data-testid="loader"
      : <ProductsList products={bestProductsData?.products} onProductClick={onProductClick} />
  section ที่สอง className="pt-65":
    div className="flex gap-25" ที่มีสามคอลัมน์
      div className={styles.mainDealBox} ครอบ ImageZoom src="/images/deals/01.png" alt="deal 1"
      div className={styles.secondDealBox} ครอบ ImageZoom src="/images/deals/02.png"
        alt="deal 2" className="mb-20" แล้วตามด้วย ImageZoom src="/images/deals/03.png" alt="deal 3"
      div className={styles.thirdDealBox} ครอบ ImageZoom src="/images/deals/04.png" alt="deal 4"
  section ใหม่ทั้งสองต้องมีบรรทัดว่างหนึ่งบรรทัดคั่นจาก section ที่อยู่ก่อนหน้า
    และจาก section ที่อยู่ถัดไป ตามแบบเดิมของไฟล์ที่ทุกคู่ </section> กับ <section>
    คั่นด้วยบรรทัดว่างหนึ่งบรรทัด ส่วนข้างใน section ห้ามมีบรรทัดว่าง
- ห้ามแก้ของเดิมในไฟล์นี้นอกจากบรรทัด import ที่ระบุไว้ข้างบน
  โดยเฉพาะห้ามแตะ currentCategory, enabled, CategoryMenu, ternary ของ section หมวดหมู่
  และ section แบนเนอร์ยาวท้ายไฟล์

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์อื่นนอกจาก src/pages/Home/Home.tsx
- ห้ามแยก section ใหม่ออกเป็นคอมโพเนนต์ย่อยหรือไฟล์ใหม่
- ห้ามใช้ useEffect และห้ามใช้ setInterval ในไฟล์นี้ (นาฬิกาเป็นงานของ CountdownTimer)
- ห้ามตัดสาขา error หรือสาขา loading ของ section ใดออก