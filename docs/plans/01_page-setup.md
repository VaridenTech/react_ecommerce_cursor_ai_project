สร้างเราเตอร์ หน้าเปล่าทั้งหกหน้า และ component แสดงข้อความ error ของแอป

บริบท: @src/app @src/pages @src/shared/components @src/main.tsx
ติดตั้ง react-router 8 ไว้แล้ว
src/app/, src/pages/ และ src/shared/components/ ยังเป็นโฟลเดอร์ว่าง
ส่วน src/main.tsx render placeholder App จาก ./App และ import ./styles/main.scss อยู่
alias @/ ชี้ไปที่ src/ ตั้งค่าไว้แล้วทั้งใน vite.config.ts และ tsconfig.app.json

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/app/router.tsx
- src/app/RouteErrorFallback.tsx
- src/app/layouts/MainLayout/MainLayout.tsx
- src/app/App.tsx
- src/shared/components/ErrorMessage/ErrorMessage.tsx
- src/pages/Home/Home.tsx
- src/pages/Category/Category.tsx
- src/pages/Product/Product.tsx
- src/pages/Cart/Cart.tsx
- src/pages/Checkout/Checkout.tsx
- src/pages/Order/OrderSuccess.tsx
และแก้ src/main.tsx ให้ render App ตัวใหม่ จากนั้นลบ src/App.tsx เดิมทิ้ง (ย้ายมาเป็น src/app/App.tsx แล้ว)

ข้อกำหนดทางเทคนิค:
- router.tsx: export const routes: RouteObject[] และ export const router = createBrowserRouter(routes)
  โดย import createBrowserRouter กับ RouteObject จาก "react-router"
- routes มี route แม่หนึ่งตัว element เป็น MainLayout และ errorElement เป็น RouteErrorFallback
  ไม่ต้องใส่ path ให้ route แม่
- children ของ route แม่ เรียงตามลำดับนี้:
  "/"               -> Home
  "/categories"     -> Category
  "/products/:id"   -> Product
  "/cart"           -> Cart
  "/checkout"       -> Checkout
  "/order/success"  -> OrderSuccess
- MainLayout: default export ที่ render Outlet ของ react-router ไว้ในแท็ก main
- ErrorMessage: default export รับ prop message ที่เป็น string และไม่บังคับ
  ค่า default ของ message คือ "Something went wrong. Please try again."
  render div ที่มี role="alert" และ className="text-center pt-30 pb-30"
  ข้างในเป็นแท็ก p ที่มี className="fs-18 text-muted" แสดงค่า message
- RouteErrorFallback: default export ที่ใช้ useRouteError() กับ isRouteErrorResponse()
  ถ้าเป็น route error response ให้ message เป็น `${error.status} ${error.statusText}`
  ถ้าไม่ใช่ ให้ message เป็น "Something went wrong. Please reload the page."
  แล้ว render ErrorMessage พร้อม prop message ครอบด้วย div className="container pt-60 pb-60"
- หน้าทั้งหกเป็น stub: default export ที่ return แท็ก h1 ชื่อหน้าเท่านั้น ยังไม่ต้องมี state หรือข้อมูล
- App.tsx: default export ที่ return RouterProvider พร้อม prop router={router}
  โดย import RouterProvider จาก "react-router/dom"
- src/main.tsx: render App จาก "./app/App" และคงบรรทัด import "./styles/main.scss" ไว้
- import ไฟล์ที่อยู่คนละโฟลเดอร์ใช้ alias @/ ไฟล์ที่อยู่โฟลเดอร์เดียวกันใช้ ./ ได้

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ยังไม่ต้องสร้าง Header, Footer, QueryClientProvider หรือไฟล์ .module.scss ใด ๆ
- ห้ามแก้ไฟล์อื่นนอกจากที่ระบุไว้ข้างบน