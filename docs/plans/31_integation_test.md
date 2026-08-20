เขียน integration test ระดับทั้งหน้าให้ Cart, Home, Category และ Checkout

บริบท: @src/pages/Cart/Cart.test.tsx @src/test/renderRoute.tsx @src/test/msw/handlers.ts @src/pages/Cart/Cart.tsx @src/pages/Home/Home.tsx @src/pages/Category/Category.tsx @src/pages/Checkout/Checkout.tsx @src/features/cart/components/CartTable/CartTable.tsx
src/pages/Cart/Cart.test.tsx มีอยู่แล้ว มี import สี่บรรทัด ฟังก์ชัน seedCart
  และ describe("Cart page") ที่มี it เดียวชื่อ "updates quantity and total"
  ให้ใช้ helper กับสไตล์ของไฟล์นั้นต่อ ห้ามประกาศ seedCart ตัวที่สอง
src/test/renderRoute.tsx export function renderRoute(initialPath: string)
  ที่คืน { router, ...ผลของ render } โดย router คือ createMemoryRouter
  ที่สร้างจาก routes ตัวจริงของแอป และห่อด้วย QueryClientProvider + CartProvider
setup.ts ล้าง localStorage ให้ทุกเทสต์แล้ว เทสต์ที่ไม่ seed จึงเจอตะกร้าว่างเสมอ
MSW handler ตั้งต้นมีอยู่แล้ว ไม่ต้องเพิ่มหรือแก้ handler ใด ๆ ในงานนี้
  GET /products?limit=5 คืนสินค้าชื่อ "Product 1" ถึง "Product 5"
  GET /products/category/:slug คืนสินค้าชื่อ "<slug> product <ลำดับ>"
    โดยลำดับเริ่มจาก skip + 1 และ response มี total เป็น 100 เสมอ
  GET /products/categories คืน slug สามตัว: beauty, fragrances, furniture
  POST /carts/add ตอบ 201 เสมอ
ข้อความบนจอที่ต้องใช้ค้นหา ทั้งหมดมีอยู่จริงในโค้ดแล้ว ห้ามแก้ไฟล์ต้นทาง
  หน้า Cart ตอนว่าง: "Your Cart is Empty"
  หน้า Cart ตอนมีของ: "Total Price: $" ตามด้วยยอดที่ toFixed(2)
  ปุ่มใน CartTable มีเนื้อในเป็น × สำหรับลบ, < สำหรับลด, > สำหรับเพิ่ม
  หน้า Checkout: ช่องกรอกมี placeholder "Enter Address", "Enter Email",
    "Enter Phone Number" ปุ่มบันทึกที่อยู่ชื่อ "Submit" ปุ่มสั่งซื้อชื่อ "Place Order"
  หน้า Order Success: "Order Placed Successfully!"
CategoryMenu แสดงชื่อหมวดเป็น <span> ที่คลิกได้ ส่วน Footer มีคำว่า Fragrances
  เป็น <li> ประดับที่คลิกไม่ได้ ทั้งสองอยู่บนจอพร้อมกันเพราะ render ทั้งแอป
Pagination ของ react-paginate แสดงเลขหน้าเป็นข้อความ "1", "2", ...
alias @/ ชี้ไปที่ src/ ส่วนไฟล์ในโฟลเดอร์เดียวกันให้ใช้ ./

โครงสร้าง: แก้ไฟล์เดิมหนึ่งไฟล์และสร้างไฟล์ใหม่สามไฟล์ ไม่มากไม่น้อยกว่านี้
- src/pages/Cart/Cart.test.tsx (แก้ไฟล์เดิม เติมสอง it)
- src/pages/Home/Home.test.tsx (สร้างใหม่)
- src/pages/Category/Category.test.tsx (สร้างใหม่)
- src/pages/Checkout/Checkout.test.tsx (สร้างใหม่)

ข้อกำหนดทางเทคนิค: ทุก element ต้องหาด้วยสิ่งที่ผู้ใช้รับรู้เท่านั้น
  คือ role, ข้อความบนจอ หรือ placeholder ห้ามใช้ getByTestId, ห้ามใช้
  container.querySelector, ห้ามค้นด้วยชื่อ class และห้ามอ้าง data-testid
  แม้ในโค้ดต้นทางจะมี data-testid อยู่ก็ตาม:
- Cart.test.tsx: เติมสอง it เข้าไปใน describe("Cart page") เดิม
  ให้ลำดับใน describe หลังแก้เสร็จเป็นสามเคสเรียงแบบนี้พอดี
    1) "shows the empty state when there are no items"  (แทรก *เหนือ* เคสเดิม)
    2) "updates quantity and total"                     (เคสเดิม ห้ามแตะ)
    3) "removes an item"                                (ต่อ *ใต้* เคสเดิม)
  เคส 1: async แต่ไม่ต้อง userEvent.setup() และไม่ต้อง seedCart()
    renderRoute("/cart");
    expect(await screen.findByText("Your Cart is Empty")).toBeInTheDocument();
  เคส 3: async เริ่มด้วย const user = userEvent.setup(); แล้ว seedCart();
    แล้ว renderRoute("/cart");
    await user.click(await screen.findByRole("button", { name: "×" }));
    expect(await screen.findByText("Your Cart is Empty")).toBeInTheDocument();
    (สังเกตว่าเคสนี้ใช้ findByRole ไม่ใช่ getByRole เพราะยังไม่มีประตูรอมาก่อน)
  ห้ามแก้ import สี่บรรทัดเดิม ห้ามแก้ seedCart และห้ามแตะเคสที่ 2 แม้แต่ตัวอักษรเดียว
- Home.test.tsx: import สองบรรทัด
    import { screen } from "@testing-library/react";
    import { renderRoute } from "@/test/renderRoute";
  describe("Home page") มี it เดียวชื่อ
    "renders deal products and category products from the API" แบบ async
    renderRoute("/");
    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("beauty product 1")).toBeInTheDocument();
  ห้าม import userEvent ในไฟล์นี้ ห้าม assert เรื่อง spinner หรือสถานะ loading
- Category.test.tsx: import สามบรรทัด (screen, userEvent, renderRoute)
  describe("Category page") มี it เดียวชื่อ
    "switches category and pages through results" แบบ async
    const user = userEvent.setup(); แล้ว renderRoute("/categories");
    expect(await screen.findByText("beauty product 1")).toBeInTheDocument();
    ใส่ comment สองบรรทัดเหนือการคลิกครั้งแรก ข้อความตามนี้พอดี
      The Footer also lists "Fragrances" as a static (non-interactive) <li>;
      scope to the clickable CategoryMenu <span> to avoid ambiguity.
    await user.click(screen.getByText("Fragrances", { selector: "span" }));
    expect(await screen.findByText("fragrances product 1")).toBeInTheDocument();
    await user.click(screen.getByText("2"));
    expect(await screen.findByText("fragrances product 21")).toBeInTheDocument();
  ห้ามแก้ปัญหาข้อความซ้ำด้วย getAllByText แล้วเลือก index
  ห้ามเพิ่ม handler ของ MSW และห้ามเรียก server.use(...)
- Checkout.test.tsx: import สี่บรรทัด
    import { screen, waitFor } from "@testing-library/react";
    import userEvent from "@testing-library/user-event";
    import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
    import { renderRoute } from "@/test/renderRoute";
  describe("Checkout page") มี it เดียวชื่อ
    "places an order and navigates to the success page" แบบ async
    const user = userEvent.setup();
    เตรียมตะกร้าด้วย localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(
      { items: [{ id: 1, title: "Widget", price: 10, quantity: 2,
        image: "/w.png" }] }))
      เขียนเต็ม ๆ ในไฟล์นี้ ห้าม import seedCart จาก Cart.test.tsx
    const { router } = renderRoute("/checkout");
    พิมพ์สามช่องด้วย user.type และ getByPlaceholderText ตามลำดับ
      "Enter Address" -> "1 Main St"
      "Enter Email" -> "jane@example.com"
      "Enter Phone Number" -> "0812345678"
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: /place order/i }));
      (ตัวหลังใช้ regex แบบ case-insensitive ตามนี้ ไม่ใช่ string)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/order/success"));
    expect(screen.getByText("Order Placed Successfully!")).toBeInTheDocument();
  ห้าม assert ตัวเลขยอดเงินใด ๆ ในไฟล์นี้
  ห้าม import consts.ts และห้ามอ้าง deliveryOptions หรือ paymentOptions

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ไฟล์ต้นทางแม้แต่บรรทัดเดียว รวมทั้ง Cart.tsx, CartTable.tsx,
  Home.tsx, Category.tsx, Checkout.tsx, OrderSuccess.tsx และ Footer.tsx
- ห้ามแก้ไฟล์ใน src/test/ ทั้งโฟลเดอร์ และห้ามแก้เทสต์แปดไฟล์จากสองบทที่แล้ว
- ห้ามเพิ่ม data-testid ให้ไฟล์ไหนทั้งสิ้น และห้ามใช้ data-testid ที่มีอยู่แล้ว
- ห้ามใช้ fireEvent
- ห้ามใช้ setTimeout, vi.useFakeTimers หรือ await new Promise(...) เพื่อรอ
- ห้ามใส่ it.skip, it.todo, it.only หรือ describe.only แม้แต่ที่เดียว
- ห้ามเขียนเทสต์ให้หน้า Product หรือ Header ในงานนี้
- ห้ามสร้าง index.ts, ไฟล์ helper กลาง หรือไฟล์ barrel ใด ๆ