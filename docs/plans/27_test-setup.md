ตั้งค่า Vitest และวางเซิร์ฟเวอร์ปลอมของ MSW สำหรับชุดทดสอบของโปรเจกต์

บริบท: @vite.config.ts @package.json @src/features/products/types.ts @.env @tsconfig.app.json
devDependencies ติดตั้งครบแล้วในเครื่อง ไม่ต้องติดตั้งอะไรเพิ่ม:
  vitest, jsdom, @testing-library/react, @testing-library/jest-dom,
  @testing-library/user-event, msw, @types/node
msw ที่ติดตั้งไว้คือ 2.15.0 ให้เขียนด้วยไวยากรณ์ของ msw v2 เท่านั้น
  คือ http.get / http.post ที่คืน HttpResponse.json(...)
  ห้ามใช้ rest.get และห้ามใช้ resolver แบบ (req, res, ctx) => res(ctx.json(...))
  ซึ่งเป็นของ v1 ทั้งคู่ และห้ามแก้เวอร์ชันของ msw ใน package.json ไม่ว่ากรณีใด
vite.config.ts ตอนนี้มี plugins: [react()], resolve.alias ที่ชี้ @ ไปที่ ./src
  และ block legacy: { inconsistentCjsInterop: true } ที่มี comment ภาษาอังกฤษ
  เจ็ดบรรทัดอยู่เหนือมัน ยังไม่มี block test และยังไม่มีบรรทัด triple-slash ใด ๆ
package.json ตอนนี้มี scripts เจ็ดตัว: dev, build, lint, format, format:check,
  typecheck, preview
.env มี VITE_API_BASE_URL=https://dummyjson.com บรรทัดเดียว
src/features/products/types.ts export interface Product, Category และ
  FetchProductsResponse (ตัวหลัง extends Pagination ที่มี total, skip, limit)
tsconfig.app.json ตั้ง typeRoots เป็น ["./node_modules/@types", "./src/shared/types"]
  ซึ่งทำให้ใส่ "types": ["vitest/globals"] ใน tsconfig ไม่ได้ (พังด้วย TS2688)
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type

โครงสร้าง: แก้ไฟล์เดิมสองไฟล์และสร้างไฟล์ใหม่สี่ไฟล์ ไม่มากไม่น้อยกว่านี้
- vite.config.ts (แก้ไฟล์เดิม)
- package.json (แก้ไฟล์เดิม)
- src/test/msw/fixtures.ts (สร้างใหม่)
- src/test/msw/handlers.ts (สร้างใหม่)
- src/test/msw/server.ts (สร้างใหม่)
- src/test/setup.ts (สร้างใหม่)

ข้อกำหนดทางเทคนิค:
- vite.config.ts: แก้สองจุดเท่านั้น
    เพิ่ม /// <reference types="vitest/config" /> เป็นบรรทัดแรกสุดของไฟล์
      เหนือบรรทัด import ทุกบรรทัด
    เพิ่ม key test ต่อท้าย legacy ใน object เดียวกัน มีสี่ field ตามลำดับนี้
      environment: "jsdom"
      globals: true
      setupFiles: "./src/test/setup.ts"   (string เดี่ยว ไม่ใช่ array)
      env: { VITE_API_BASE_URL: "https://dummyjson.com" }
        โดยมี comment บรรทัดเดียวเหนือ env ว่า
        MSW handlers hardcode the host, so tests must not depend on .env
    ห้ามแตะ plugins ห้ามแตะ resolve.alias ห้ามแตะ legacy
    ห้ามลบหรือย่อ comment ภาษาอังกฤษที่อยู่เหนือ legacy
- package.json: เพิ่มสองบรรทัดต่อท้าย scripts เท่านั้น
    "test": "vitest run"
    "test:watch": "vitest"
  ห้ามแตะ dependencies ห้ามแตะ devDependencies ห้ามรัน npm install
  ห้ามเพิ่ม script อื่น เช่น test:coverage หรือ test:ui
- src/test/msw/fixtures.ts: import Category, FetchProductsResponse, Product
    จาก "@/features/products/types" (เรียงชื่อตามตัวอักษรในวงเล็บปีกกา)
  export function makeProduct(overrides: Partial<Product> = {}): Product
    คืน object ที่ครบทุก field ของ Product แล้วปิดท้ายด้วย ...overrides
    ค่าตั้งต้นให้ใช้สินค้าชิ้นแรกของ dummyjson: id 1,
      title "Essence Mascara Lash Princess", description "A popular mascara.",
      category "beauty", price 9.99, discountPercentage 7.17, rating 4.94,
      stock 5, tags ["beauty", "mascara"], brand "Essence", sku "RCH45Q1A",
      weight 2, dimensions { width: 23.17, height: 14.43, depth: 28.01 },
      warrantyInformation "1 month warranty", shippingInformation "Ships in 1 month",
      availabilityStatus "Low Stock",
      reviews มีสมาชิกเดียว { rating: 5, comment: "Very happy with my purchase!",
        date: "2024-05-23T08:56:21.618Z", reviewerName: "John Doe",
        reviewerEmail: "john@x.dummyjson.com" },
      returnPolicy "30 days return policy", minimumOrderQuantity 24,
      meta { createdAt และ updatedAt เป็น "2024-05-23T08:56:21.618Z",
        barcode "9164035109868",
        qrCode "https://assets.dummyjson.com/public/qr-code.png" },
      images มีสมาชิกเดียวคือ
        "https://cdn.dummyjson.com/products/images/beauty/1.png",
      thumbnail "https://cdn.dummyjson.com/products/images/beauty/1-thumb.png"
  export function makeProductsResponse(count: number,
      overrides: Partial<FetchProductsResponse> = {}): FetchProductsResponse
    products สร้างด้วย Array.from({ length: count }, (_, i) =>
      makeProduct({ id: i + 1, title: `Product ${i + 1}` }))
    total: 100, skip: 0, limit: count แล้วปิดท้ายด้วย ...overrides
  export const categories: Category[] สามตัวตามลำดับนี้พอดี
    beauty / Beauty, fragrances / Fragrances, furniture / Furniture
    โดย url เป็น "https://dummyjson.com/products/category/<slug>"
  ไฟล์นี้ห้าม import อะไรจาก msw และห้ามประกาศ interface ของตัวเอง
- src/test/msw/handlers.ts: import { http, HttpResponse } from "msw";
    แล้ว import categories, makeProduct, makeProductsResponse จาก "./fixtures"
  const BASE = "https://dummyjson.com";  (ไม่ export)
  export const handlers = [...] มีห้าตัวเรียงตามลำดับนี้พอดี ห้ามสลับ
    1) http.get(`${BASE}/products/categories`) คืน HttpResponse.json(categories)
    2) http.get(`${BASE}/products/category/:slug`) รับ ({ request, params })
       อ่าน limit และ skip จาก new URL(request.url).searchParams
         โดยมี default เป็น 20 และ 0 ผ่าน ?? แล้วครอบด้วย Number(...)
       คืน makeProductsResponse(limit, { skip, limit, products })
         โดย products สร้างเองด้วย Array.from({ length: limit }, (_, i) =>
           makeProduct({ id: skip + i + 1,
             title: `${String(params.slug)} product ${skip + i + 1}`,
             category: String(params.slug) }))
    3) http.get(`${BASE}/products/:id`) คืน makeProduct({ id: Number(params.id) })
    4) http.get(`${BASE}/products`) อ่าน limit/skip แบบเดียวกับข้อ 2
       คืน makeProductsResponse(limit, { skip, limit })
    5) http.post(`${BASE}/carts/add`) เป็น resolver แบบ async
       อ่าน body ด้วย (await request.json()) as Record<string, unknown>
       คืน HttpResponse.json({ id: 1, ...body }, { status: 201 })
  ลำดับสำคัญ: /products/categories ต้องมาก่อน /products/:id เสมอ
  ไฟล์นี้ห้าม import อะไรจาก @testing-library และห้ามมี expect
- src/test/msw/server.ts: สามบรรทัดโค้ดพอดี (มีบรรทัดว่างคั่นก่อน export)
    import { setupServer } from "msw/node";
    import { handlers } from "./handlers";
    export const server = setupServer(...handlers);
  ห้าม import จาก msw/browser และห้ามเรียก server.listen() ในไฟล์นี้
- src/test/setup.ts:
    บรรทัดแรกเป็น /// <reference types="vitest/globals" />
    ตามด้วย comment สามบรรทัดที่อธิบายว่าทำไมต้องใช้ directive แทน tsconfig:
      Triple-slash directive here (not tsconfig types) because tsconfig.app.json's custom
      typeRoots breaks "types": ["vitest/globals"] resolution (TS2688); ambient globals
      propagate program-wide from this file.
    import "@testing-library/jest-dom/vitest";
    import { server } from "./msw/server";
    beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
    afterEach(() => { server.resetHandlers(); localStorage.clear(); });
    afterAll(() => server.close());
  ห้าม import ไฟล์เทสต์ใด ๆ ห้ามมี describe/it และห้าม mock axios

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่ และห้ามแก้เวอร์ชันของอะไรที่ติดตั้งไว้แล้ว
- ห้ามสร้าง src/test/utils.tsx หรือ src/test/renderRoute.tsx ในรอบนี้
- ห้ามเขียนไฟล์ *.test.ts หรือ *.test.tsx แม้แต่ไฟล์เดียว
- ห้ามแตะ src/app, src/pages, src/features หรือ src/shared
- ห้ามแตะ .env, tsconfig ใด ๆ หรือ eslint.config.js
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเพิ่ม setupFiles ตัวที่สอง และห้ามตั้ง coverage