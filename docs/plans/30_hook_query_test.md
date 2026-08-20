เขียนเทสต์ให้ query factories และ hook useCheckout ด้วย renderHook

บริบท: @src/features/products/queries.ts @src/features/checkout/useCheckout.ts @src/features/cart/store/CartProvider.tsx @src/features/cart/useCart.ts @src/test/utils.tsx @src/test/msw/handlers.ts @src/shared/utils/price.utils.test.ts
โปรเจกต์มีเทสต์อยู่แล้วหกไฟล์จากบทที่แล้ว ทั้งหมดเป็น unit test ของ pure function
  ให้ยึดสไตล์เดิม: describe ชื่อเดียวกับสิ่งที่ทดสอบ, it ตั้งชื่อเป็นประโยคภาษาอังกฤษ,
  ไม่ import describe/it/expect เพราะเปิด globals: true ไว้แล้ว
src/features/products/queries.ts export productKeys และ productQueries
  ที่มีสี่จาน: list(params), byCategory(params), categories(), detail(id)
  ทุกจานคืนผลของ queryOptions() ไม่ใช่ custom hook
src/features/checkout/useCheckout.ts เป็น default export (import แบบไม่มีปีกกา)
  return object ที่มี checkoutAddress, deliveryOptions, paymentOptions,
    selectedDeliveryOptionId, selectedPaymentOptionId, billingSummary,
    isPlaceOrderLoading, storeCheckoutAddress, onSelectDeliveryOption,
    onSelectPaymentOption, onPlaceOrder
  ข้างในเรียก useCart (ต้องการ CartProvider), useMutation (ต้องการ
    QueryClientProvider) และ useProductRoute ที่ห่อ useNavigate (ต้องการ router)
  mutationFn จะ throw new Error("Delivery Address is Missing") ทันที
    ถ้ายังไม่เคยเรียก storeCheckoutAddress
  onSuccess ของ mutation เรียก clearCart() แล้ว goToOrderSuccess()
src/test/utils.tsx export createTestQueryClient() และ createQueryWrapper()
  ทั้งคู่สร้าง QueryClient ก้อนใหม่ทุกครั้งที่ถูกเรียก และตั้ง retry: false
MSW handler ตั้งต้นมีอยู่แล้ว ไม่ต้องเพิ่มหรือแก้ handler ใด ๆ ในงานนี้
  GET /products?limit=N คืนสินค้า N ชิ้น ชื่อ "Product 1" ถึง "Product N"
  GET /products/category/:slug?limit=20&skip=20 คืนสินค้าที่ชื่อขึ้นต้นด้วย slug
    ตามด้วยคำว่า product แล้วตามด้วยลำดับที่เริ่มจาก skip + 1
    เช่น slug beauty กับ skip 20 จะได้ชิ้นแรกชื่อ "beauty product 21"
    และค่า skip ใน response จะเท่ากับ skip ที่ส่งไป
  GET /products/categories คืน slug สามตัวเรียงว่า beauty, fragrances, furniture
  GET /products/:id คืนสินค้าที่มี id ตามที่ขอ
  POST /carts/add ตอบ 201 เสมอ
setup.ts เปิด/ปิด MSW และล้าง localStorage ให้แล้วทุกเทสต์ ห้ามทำซ้ำในไฟล์เทสต์
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type

โครงสร้าง: สร้างสองไฟล์นี้ ไม่มากไม่น้อยกว่านี้
- src/features/products/queries.test.tsx
- src/features/checkout/useCheckout.test.tsx
ทั้งคู่นามสกุล .tsx จริงตามนี้

ข้อกำหนดทางเทคนิค: ทุกเทสต์ต้องรอจนงาน async เสร็จก่อน assert ข้อมูล
  ห้าม assert สถานะ loading หรือ pending เป็นข้อสรุปของเทสต์ตัวไหนทั้งสิ้น:
- queries.test.tsx: import สี่บรรทัด ตามลำดับนี้
    import { renderHook, waitFor } from "@testing-library/react";
    import { useQuery } from "@tanstack/react-query";
    import { productQueries } from "./queries";
    import { createQueryWrapper } from "@/test/utils";
  describe("productQueries") มีสี่ it ทั้งหมดเป็น async
    ทุกตัวเรียก renderHook(() => useQuery(...), { wrapper: createQueryWrapper() })
      โดยเรียก createQueryWrapper() ใหม่ในทุก it ห้ามสร้างครั้งเดียวไว้ข้างนอก
    ทุกตัวเปิดด้วยบรรทัด
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      ต้องเป็น isSuccess เท่านั้น ห้ามใช้ isLoading, isPending หรือ isFetching
      และห้ามลืม await หน้า waitFor
    "list fetches products with the given limit"
      -> productQueries.list({ limit: 5 })
      -> expect(result.current.data?.products).toHaveLength(5)
    "byCategory fetches products for a category and page"
      -> productQueries.byCategory({ category: "beauty", page: 2, limit: 20 })
      -> expect(result.current.data?.skip).toBe(20)
      -> expect(result.current.data?.products[0]?.title).toBe("beauty product 21")
    "categories fetches the category list"
      -> productQueries.categories()
      -> expect(result.current.data?.map((c) => c.slug)).toEqual(
           ["beauty", "fragrances", "furniture"])
    "detail fetches a single product"
      -> productQueries.detail(7)  (ส่งเลขตรง ๆ ไม่ใช่ string)
      -> expect(result.current.data?.id).toBe(7)
  ห้าม mock src/features/products/api.ts ห้าม import apiClient
  ห้ามเรียก server.use(...) ในไฟล์นี้
- useCheckout.test.tsx: import เก้าบรรทัด ตามลำดับนี้
    import { ReactNode } from "react";
    import { act, renderHook, waitFor } from "@testing-library/react";
    import { QueryClientProvider } from "@tanstack/react-query";
    import { MemoryRouter } from "react-router";
    import useCheckout from "./useCheckout";
    import { CartProvider } from "@/features/cart/store/CartProvider";
    import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
    import { useCart } from "@/features/cart/useCart";
    import { createTestQueryClient } from "@/test/utils";
  ประกาศ function wrapper({ children }: { children: ReactNode }) ก่อน describe
    (เป็น function declaration ไม่ใช่ const arrow function)
    คืน JSX ซ้อนสามชั้นตามลำดับนี้พอดี
      MemoryRouter ที่ initialEntries={["/checkout"]}
        ครอบ QueryClientProvider ที่ client={createTestQueryClient()}
          ครอบ CartProvider ครอบ {children}
  ทั้งสอง it เตรียมตะกร้าเหมือนกันด้วย localStorage.setItem ก่อน renderHook
    key เป็น CART_STORAGE_KEY ค่าเป็น JSON.stringify ของ
    { items: [{ id: 1, title: "Widget", price: 10, quantity: 2,
      image: "/w.png" }] }
    เขียนซ้ำเต็ม ๆ ในทั้งสอง it ห้ามแยกเป็นฟังก์ชัน helper และห้ามใช้ beforeEach
  ทั้งสอง it เรียก renderHook(() => ({ checkout: useCheckout(), cart: useCart() }),
    { wrapper }) เพื่อให้ hook สองตัวรันใน component เดียวกัน
  describe("useCheckout") มีสอง it ทั้งคู่เป็น async
    "clears the cart after a successful order"
      assert ค่าตั้งต้นสองบรรทัดก่อน
        expect(result.current.cart.cart.items).toHaveLength(1)
        expect(result.current.checkout.billingSummary.subtotal).toBe(20)
      act(...) เรียก storeCheckoutAddress({ address: "1 Main St",
        email: "jane@example.com", phone: "0812345678" })
      act(...) อีกก้อนแยกกัน เรียก onPlaceOrder()
      ปิดท้ายด้วย
        await waitFor(() =>
          expect(result.current.cart.cart.items).toHaveLength(0));
    "errors and keeps the cart when no address is set"
      act(...) เรียก onPlaceOrder() โดยไม่เรียก storeCheckoutAddress ก่อน
      await waitFor(() =>
        expect(result.current.checkout.isPlaceOrderLoading).toBe(false));
      แล้ว expect(result.current.cart.cart.items).toHaveLength(1)
  ห้าม vi.mock useCart, useNavigate, useProductRoute หรือ api ใด ๆ
  ห้าม import consts.ts และห้ามอ้าง deliveryOptions หรือ paymentOptions
  ห้าม assert billingSummary.shipping หรือ billingSummary.total ในไฟล์นี้

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์ต้นทางที่กำลังทดสอบ: queries.ts, api.ts, useCheckout.ts,
  useCart.ts, CartProvider.tsx, useProductRoute.ts
- ห้ามแก้ไฟล์ใน src/test/ ทั้งโฟลเดอร์ และห้ามแก้เทสต์หกไฟล์จากบทที่แล้ว
- ห้ามเขียนเทสต์ให้หน้าเพจหรือ component ใด ๆ (บทหน้าจะทำ)
- ห้ามใช้ fireEvent และห้าม import @testing-library/user-event ในบทนี้
- ห้ามใส่ it.skip, it.todo, it.only หรือ describe.only แม้แต่ที่เดียว
- ห้ามใช้ setTimeout, vi.useFakeTimers หรือ await new Promise(...) เพื่อรอ
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ