ตั้งค่า TanStack Query: สร้าง queryClient กับ AppProviders แล้วเอาไปห่อ RouterProvider ใน App.tsx

บริบท: @src/app/App.tsx @src/app/router.tsx @src/app
ติดตั้ง @tanstack/react-query และ @tanstack/react-query-devtools (ตัวหลังเป็น devDependency) ไว้แล้ว
src/app/App.tsx ตอนนี้ return RouterProvider พร้อม prop router={router} เท่านั้น
โปรเจกต์นี้เป็น Vite ใช้ import.meta.env.DEV ได้เลย

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/app/queryClient.ts
- src/app/providers.tsx
และแก้ src/app/App.tsx ให้ AppProviders ห่อ RouterProvider

ข้อกำหนดทางเทคนิค:
- queryClient.ts: export const queryClient = new QueryClient({ ... }) ที่ระดับ module
  สร้างนอก component เท่านั้น ห้ามสร้างข้างใน function หรือใน useState/useMemo
  defaultOptions.queries ตั้งสองค่า: staleTime: 60 * 1000 และ retry: 1
  เขียน 60 * 1000 แบบนี้ ไม่ต้องแปลงเป็น 60000
  ไฟล์นี้เป็น .ts ไม่มี JSX
- providers.tsx: export function AppProviders (named export ไม่ใช่ default)
  รับ prop children: ReactNode โดย import ReactNode จาก "react"
  return QueryClientProvider ที่มี prop client={queryClient} ครอบ {children}
  ถัดจาก {children} ให้ render ReactQueryDevtools initialIsOpen={false}
  ภายใต้เงื่อนไข import.meta.env.DEV (ห้ามใช้ process.env.NODE_ENV)
  import queryClient จาก "./queryClient"
- App.tsx: ให้ AppProviders ครอบ RouterProvider
  RouterProvider ยัง import จาก "react-router/dom" และยังใช้ router ตัวเดิมจาก "./router"
  ห้ามเปลี่ยนชื่อ export หรือย้ายไฟล์ใด ๆ

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ยังไม่ต้องสร้าง CartProvider, ThemeProvider หรือ provider อื่นใด
- ยังไม่ต้องเขียน useQuery, queryOptions หรือฟังก์ชันเรียก API ใด ๆ
- ห้ามสร้างไฟล์ .module.scss
- ห้ามแก้ไฟล์อื่นนอกจากที่ระบุไว้ข้างบน