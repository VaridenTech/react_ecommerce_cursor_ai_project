สร้าง helper สองตัวสำหรับเทสต์: QueryClient ฉบับเทสต์ และตัว render ทั้งแอป

บริบท: @src/app/router.tsx @src/app/providers.tsx @src/app/queryClient.ts @src/features/cart/store/CartProvider.tsx @src/test/utils.tsx
src/app/router.tsx export const routes: RouteObject[] และ
  export const router = createBrowserRouter(routes) โดย routes มีชั้นนอกหนึ่งชั้น
  ที่เป็น MainLayout พร้อม errorElement แล้วมี children หกเส้น:
  /, /categories, /products/:id, /cart, /checkout, /order/success
src/app/queryClient.ts export const queryClient ที่ตั้ง staleTime 60 * 1000
  และ retry 1 — ตัวนี้ใช้ในแอปจริงเท่านั้น ห้ามเอามาใช้ในเทสต์
src/app/providers.tsx export function AppProviders ที่ซ้อน QueryClientProvider
  ครอบ CartProvider ครอบ {children} และมี ReactQueryDevtools อยู่นอก CartProvider
src/features/cart/store/CartProvider.tsx export const CartProvider เป็น
  React.FC<{ children: React.ReactNode }> ที่ lazy init state จาก localStorage
โปรเจกต์ใช้ react-router v8: createMemoryRouter import จาก "react-router"
  ส่วน RouterProvider import จาก "react-router/dom" (คนละ entry point กัน
  ดูตัวอย่างได้ที่ src/app/App.tsx ที่ import RouterProvider แบบนี้อยู่แล้ว)
โฟลเดอร์ src/test/ มีอยู่แล้วและมี msw/ กับ setup.ts อยู่ข้างใน
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./

โครงสร้าง: สร้างสองไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/test/utils.tsx
- src/test/renderRoute.tsx
ทั้งสองไฟล์นามสกุล .tsx จริงตามนี้ เพราะข้างในมี JSX

ข้อกำหนดทางเทคนิค:
- utils.tsx: import สองบรรทัด ตามลำดับนี้
    import { ReactNode } from "react";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  export function createTestQueryClient()
    return new QueryClient({ defaultOptions: { queries: { retry: false } } });
    ห้ามใส่ staleTime ห้ามใส่ gcTime ห้ามปิด logger
    ห้ามเก็บ client ไว้ในตัวแปรระดับโมดูล ต้องสร้างใหม่ทุกครั้งที่ถูกเรียก
  export function createQueryWrapper()
    ข้างในเรียก createTestQueryClient() เก็บใน queryClient
    แล้ว return function Wrapper({ children }: { children: ReactNode }) ที่คืน
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ต้องเป็น named function ชื่อ Wrapper ไม่ใช่ arrow function ไม่มีชื่อ
  ไฟล์นี้ห้าม import queryClient ตัวจริงจาก @/app/queryClient
- renderRoute.tsx: import เจ็ดบรรทัด ตามลำดับนี้
    import { QueryClientProvider } from "@tanstack/react-query";
    import { render } from "@testing-library/react";
    import { createMemoryRouter } from "react-router";
    import { RouterProvider } from "react-router/dom";
    import { createTestQueryClient } from "./utils";
    import { routes } from "@/app/router";
    import { CartProvider } from "@/features/cart/store/CartProvider";
  export function renderRoute(initialPath: string)
    สร้าง const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
    แล้ว return { router, ...render(<JSX>) } โดย JSX ซ้อนสามชั้นตามลำดับนี้
      QueryClientProvider ที่ client={createTestQueryClient()}
        ครอบ CartProvider
          ครอบ <RouterProvider router={router} />
  ห้ามใช้ AppProviders และห้าม import providers.tsx
  ห้ามประกาศ route ของตัวเอง ต้องใช้ array routes ตัวจริงเท่านั้น
  ห้ามรับ argument ตัวที่สอง ห้ามมี option object
  ห้ามใส่ ReactQueryDevtools

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์ใน src/test/msw/ หรือ src/test/setup.ts แม้แต่บรรทัดเดียว
- ห้ามแก้ vite.config.ts หรือ package.json ในรอบนี้
- ห้ามแตะ src/app/router.tsx, src/app/providers.tsx หรือ src/app/queryClient.ts
- ห้ามเขียนไฟล์ *.test.ts หรือ *.test.tsx แม้แต่ไฟล์เดียว
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามสร้าง helper ตัวอื่นเพิ่ม เช่น renderWithProviders หรือ createCartWrapper