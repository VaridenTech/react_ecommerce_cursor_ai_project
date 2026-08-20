เขียน unit test ให้ logic ล้วน ๆ ของแอปห้าไฟล์

บริบท: @src/shared/utils/price.utils.test.ts @src/shared/utils/pagination.utils.ts @src/features/cart/store/cartReducer.ts @src/features/cart/store/cartStorage.ts @src/features/checkout/schema.ts @src/shared/api/client.ts @src/test/msw/handlers.ts
src/shared/utils/price.utils.test.ts คือไฟล์เทสต์ไฟล์เดียวที่มีอยู่ตอนนี้
  ให้ยึดสไตล์ของไฟล์นั้นทั้งหมด: import ไฟล์ที่ทดสอบด้วย relative path,
  describe ชื่อเดียวกับสิ่งที่ทดสอบ, it ตั้งชื่อเป็นประโยคภาษาอังกฤษต่อจากชื่อ describe
ชุดทดสอบตั้งค่าไว้แล้วในบทที่แล้ว: vitest + jsdom + globals: true
  ห้าม import describe, it, expect จาก "vitest" เพราะเป็น global อยู่แล้ว
setup ที่รันก่อนทุกไฟล์เทสต์ทำสามอย่างให้แล้ว อย่าทำซ้ำในไฟล์เทสต์
  1) เปิด MSW server ด้วย onUnhandledRequest: "error"
  2) afterEach เรียก server.resetHandlers() และ localStorage.clear()
  3) ลงทะเบียน matcher ของ jest-dom
MSW handler ตั้งต้นตอบ GET https://dummyjson.com/products/1 ด้วยสินค้า id 1
  อยู่แล้ว ไม่ต้องเพิ่ม handler สำหรับ happy path
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/utils/pagination.utils.test.ts
- src/features/cart/store/cartReducer.test.ts
- src/features/cart/store/cartStorage.test.ts
- src/features/checkout/schema.test.ts
- src/shared/api/client.test.ts
ห้ามแก้ src/shared/utils/price.utils.test.ts ที่มีอยู่แล้ว

ข้อกำหนดทางเทคนิค: ค่าที่คาดหวังทุกตัวระบุไว้ให้แล้ว ห้ามคำนวณเอง
  และห้ามเขียนนิพจน์ใด ๆ ไว้ฝั่งขวาของ matcher ต้องเป็นค่าตายตัวเท่านั้น:
- pagination.utils.test.ts: import { calculateOffset, calculateTotalPages }
    จาก "./pagination.utils" แล้วแยกเป็นสอง describe
  describe("calculateOffset") มีสอง it
    "returns 0 for the first page"          -> calculateOffset(1, 20) toBe 0
    "returns limit * (page - 1) for later pages" -> calculateOffset(3, 20) toBe 40
  describe("calculateTotalPages") มีสอง it
    "rounds up partial pages"  -> calculateTotalPages(101, 20) toBe 6
    "handles exact division"   -> calculateTotalPages(100, 20) toBe 5
- cartReducer.test.ts: import { CartActionTypes, CartItem, CartState }
    จาก "./CartContext" แล้ว import { cartReducer } จาก "./cartReducer"
  ประกาศ helper สองตัวก่อน describe (ทั้งคู่เป็น const arrow function)
    const item = (overrides: Partial<CartItem> = {}): CartItem => ({
      id: 1, title: "Widget", price: 10, quantity: 1, image: "/widget.png",
      ...overrides,
    });
    const stateWith = (...items: CartItem[]): CartState => ({ items });
  describe("cartReducer") มีห้า it ตามลำดับนี้ ทุกตัวเก็บผลไว้ในตัวแปรชื่อ next
    "adds a new item" — ยิง ADD_TO_CART payload item() ใส่ stateWith()
      แล้ว expect(next.items).toEqual([item()])
    "merges quantity when the item already exists" — state ตั้งต้น
      stateWith(item({ quantity: 2 })) ยิง ADD_TO_CART payload item({ quantity: 3 })
      แล้ว expect(next.items).toEqual([item({ quantity: 5 })])
    "removes an item" — state ตั้งต้น stateWith(item(), item({ id: 2 }))
      ยิง REMOVE_FROM_CART payload { id: 1 }
      แล้ว expect(next.items).toEqual([item({ id: 2 })])
    "updates quantity" — state ตั้งต้น stateWith(item())
      ยิง UPDATE_QUANTITY payload { id: 1, quantity: 7 }
      แล้ว expect(next.items[0]?.quantity).toBe(7)
    "clears the cart" — state ตั้งต้น stateWith(item(), item({ id: 2 }))
      ยิง CLEAR_CART (ไม่มี payload) แล้ว expect(next.items).toEqual([])
  ใช้ toEqual ไม่ใช่ toBe ทุกจุดที่เทียบ array หรือ object
  ไฟล์นี้ห้าม import อะไรจาก react, @testing-library หรือ msw
- cartStorage.test.ts: import { CartState } จาก "./CartContext" แล้ว
    import { CART_STORAGE_KEY, loadCartState, saveCartState } จาก "./cartStorage"
  const sample: CartState = { items: [{ id: 1, title: "Widget", price: 10,
    quantity: 2, image: "/w.png" }] };   (ใช้ /w.png ตามนี้ ไม่ใช่ /widget.png)
  describe("cartStorage") มีสี่ it ตามลำดับนี้
    "round-trips cart state" — saveCartState(sample)
      แล้ว expect(loadCartState()).toEqual(sample)
    "returns an empty cart when nothing is stored"
      -> expect(loadCartState()).toEqual({ items: [] })
    "returns an empty cart when stored JSON is corrupt" — เขียน "{not json"
      ลง localStorage ที่ CART_STORAGE_KEY ก่อน แล้ว expect เท่ากับ { items: [] }
    "returns an empty cart when the stored shape is wrong" — เขียน
      JSON.stringify({ items: "nope" }) ลงที่ key เดียวกัน แล้ว expect เท่ากับ
      { items: [] }
  ห้าม vi.mock localStorage ห้ามเขียน afterEach หรือ beforeEach ในไฟล์นี้
- schema.test.ts: import { checkoutAddressSchema } จาก "./schema"
  ใน describe("checkoutAddressSchema") ประกาศ const valid ก่อนทุก it
    { address: "1 Main St", email: "jane@example.com", phone: "0812345678" }
  มีสี่ it ตามลำดับนี้
    "accepts valid data" -> safeParse(valid).success toBe true
    "requires address"   -> safeParse({ ...valid, address: "" })
      success toBe false และ result.error?.issues[0]?.message
      toBe "Address is required"
    "rejects an invalid email" -> safeParse({ ...valid, email: "nope" })
      success toBe false และข้อความ toBe "Enter a valid email address"
    "requires phone" -> safeParse({ ...valid, phone: "" })
      success toBe false และข้อความ toBe "Phone number is required"
  ใช้ safeParse เท่านั้น ห้ามใช้ parse และห้ามใช้ try/catch
  ห้าม import consts.ts, react-hook-form หรือ @hookform/resolvers
- client.test.ts: import สามบรรทัด โดยมีบรรทัดว่างหนึ่งบรรทัดหลังบรรทัดแรก
    import { http, HttpResponse } from "msw";
    (บรรทัดว่าง)
    import { ApiError, apiClient } from "./client";
    import { server } from "@/test/msw/server";
  describe("apiClient") มีสาม it ทั้งหมดเป็น async
    "returns response data on success" — ไม่ต้องเตรียม handler
      const { data } = await apiClient.get("/products/1");
      expect(data.id).toBe(1);
    "normalizes server errors into ApiError with the server message"
      server.use(http.get("https://dummyjson.com/products/1", () =>
        HttpResponse.json({ message: "Product not found" }, { status: 404 })))
      const error = await apiClient.get("/products/1").catch((e) => e);
      expect(error).toBeInstanceOf(ApiError)
      expect(error.message).toBe("Product not found")
      expect(error.status).toBe(404)
    "falls back to a generic message when the server sends none"
      server.use(... HttpResponse.json({}, { status: 500 }))
      expect(error).toBeInstanceOf(ApiError)
      expect(error.message).toBe("Something went wrong. Please try again.")
  ใช้ท่า .catch((e) => e) เพื่อจับ error ออกมาเป็นค่า ห้ามใช้ rejects.toThrow
  ห้าม vi.mock axios และห้ามเรียก server.resetHandlers() ในไฟล์นี้

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์ต้นทางที่กำลังทดสอบแม้แต่บรรทัดเดียว: pagination.utils.ts,
  cartReducer.ts, cartStorage.ts, CartContext.tsx, schema.ts, client.ts
- ห้ามแก้ไฟล์ใน src/test/ ทั้งโฟลเดอร์ รวมทั้ง handlers.ts และ setup.ts
- ห้ามเขียนเทสต์ให้ component, hook หรือหน้าเพจใด ๆ (สองบทถัดไปจะทำ)
- ห้ามสร้างไฟล์ helper กลางสำหรับเทสต์ เช่น testUtils.ts หรือ factories.ts
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเพิ่ม snapshot test และห้ามเรียก expect(...).toMatchSnapshot()
- ห้ามใส่ it.skip, it.todo, it.only หรือ describe.only แม้แต่ที่เดียว