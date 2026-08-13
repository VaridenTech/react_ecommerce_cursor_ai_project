สร้าง Header, Footer และ hook รวมเส้นทางของแอป แล้วเติมสองตัวแรกเข้า MainLayout

บริบท: @src/app/layouts/MainLayout @src/shared/components @src/shared/hooks @src/styles
ติดตั้ง Font Awesome ครบทั้งห้า package ไว้แล้ว
MainLayout ตอนนี้ render แค่ Outlet ในแท็ก main ยังไม่มี Header, Footer และยังไม่มีไฟล์ .module.scss
src/shared/hooks/ ยังเป็นโฟลเดอร์ว่าง ส่วน src/shared/components/ มีแค่ ErrorMessage จากบทที่แล้ว
utility class ทุกตัวที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, flex, space-between,
align-item-center, gap-20, list-none, nav-link, m-0, p-0, mr-10, mb-10, mb-20, mb-25,
fw-bold, fs-14, fs-24, fs-32, pt-25, pb-25, pt-60, pb-60
ตัวแปรสีอยู่ใน src/styles/_variables.scss เช่น $black02 และ $white
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/hooks/useProductRoute.tsx
- src/shared/components/Header/Header.tsx
- src/shared/components/Footer/Footer.tsx
- src/shared/components/Footer/Footer.module.scss
- src/app/layouts/MainLayout/MainLayout.module.scss
และแก้ src/app/layouts/MainLayout/MainLayout.tsx ให้เติม Header กับ Footer เข้าไป

ข้อกำหนดทางเทคนิค:
- useProductRoute: default export ชื่อ useProductRoute ที่เรียก useNavigate จาก "react-router"
  คืน object ที่มีสี่ฟังก์ชัน:
    goToProductDetails(id: number) -> /products/{id}
    goToCartSummary()              -> /cart
    goToCheckout()                 -> /checkout
    goToOrderSuccess()             -> /order/success
  บทนี้ยังไม่มีใครเรียกใช้ hook นี้ สร้างไว้เฉย ๆ ห้ามไปเสียบใน Header
- Header: default export ไม่รับ prop
  โครงคือ header className="pt-25 pb-25" > div className="container"
  > div className="flex space-between align-item-center"
  ซ้าย: Link to="/" className="nav-link fw-bold fs-24" ข้อความ My Store
  ขวา: แท็ก nav ครอบ ul className="flex gap-20 m-0 p-0 list-none" มีสอง li
    Link to="/" className="nav-link" ข้อความ Home
    Link to="/categories" className="nav-link" ข้อความ Products
  ลิงก์ทุกจุดใช้ Link จาก "react-router" ห้ามใช้แท็ก a และห้ามใช้ div ที่มี onClick
- Footer.module.scss: ขึ้นต้นด้วย @use "../../../styles/variables";
  แล้วประกาศ class .footer ที่มี background-color: variables.$black02
  color: variables.$white และ nested rule ให้แท็ก p มี line-height: 2
- Footer: default export ที่ import styles from "./Footer.module.scss"
  แท็กนอกสุดคือ footer className={`pt-60 pb-60 ${styles.footer}`} ครอบ div className="container"
  ครอบ div className="flex space-between" ที่มีสามคอลัมน์เรียงตามนี้:
  1) h2 className="fs-32 fw-bold text-white mb-25" ข้อความ My Store
     ตามด้วยสาม div ที่ขึ้นต้นด้วย FontAwesomeIcon className="mr-10" แล้วตามด้วยข้อความ:
       faMapMarkerAlt + "Bangkok Thailand 10150"      (div className="fs-14 mb-20")
       faPhone        + "Call Us: 123-456-7898"        (div className="fs-14 mb-20")
       faEnvelope     + "Email Us: admin@mystore.com"  (div className="fs-14")
     ไอคอนทั้งสามตัว import จาก "@fortawesome/free-solid-svg-icons"
  2) h3 className="fs-24 fw-bold text-white mb-25" ข้อความ Categories
     ตามด้วย ul className="list-none p-0 m-0" ที่มี li className="mb-10" ห้ารายการ:
     Beauty, Fragrances, Furniture, Groceries, Laptops
  3) h3 className="fs-24 fw-bold text-white mb-25" ข้อความ Pages
     ตามด้วย ul className="list-none p-0 m-0" ที่มี li className="mb-10" สามรายการ:
     Home, Products, Cart
  รายการในสองคอลัมน์หลังเป็นข้อความเปล่า ยังไม่ต้องทำเป็นลิงก์
- MainLayout.module.scss: class .container เป็น flex column ที่ min-height: 100vh
  และ class .main ที่ flex-grow: 1
- MainLayout.tsx: div className={styles.container} ครอบ Header, แท็ก main className={styles.main}
  ที่มี Outlet อยู่ข้างใน และ Footer เรียงตามลำดับนี้
  import Header กับ Footer ด้วย alias @/

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ยังไม่ต้องทำไอคอนตะกร้า badge จำนวนสินค้า หรือ CartSummary ใด ๆ ใน Header
- ห้ามสร้าง Header.module.scss
- ห้ามแก้ router.tsx, App.tsx, main.tsx และไฟล์ใน src/pages/