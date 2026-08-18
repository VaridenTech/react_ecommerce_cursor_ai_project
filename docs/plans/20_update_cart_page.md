สร้างตารางรายการสินค้าในตะกร้า แล้วเขียนหน้า Cart ทับ stub เดิม

บริบท: @src/pages/Cart/Cart.tsx @src/features/cart/useCart.ts @src/features/cart/store/CartContext.tsx @src/features/cart/components/CartSummary/CartSummary.tsx @src/pages/Category/components/CategoryBanner/CategoryBanner.tsx @src/shared/components/Button/Button.tsx @src/shared/hooks/useProductRoute.tsx @src/styles/_components.scss
src/pages/Cart/Cart.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว ให้เขียนทับทั้งไฟล์
src/features/cart/useCart.ts export named useCart คืน
  { cart, addToCart, removeFromCart, updateQuantity, clearCart }
  cart มีรูปร่าง { items: CartItem[] }
  removeFromCart มี signature (id: number) => void
  updateQuantity มี signature (id: number, quantity: number) => void
CartItem มีฟิลด์ id (number), title (string), price (number), quantity (number),
  image (string) และ originalPrice ที่เป็น optional (number | undefined)
src/pages/Category/components/CategoryBanner/CategoryBanner.tsx เป็น default export
  รับ prop name?: string | null
src/shared/components/Button/Button.tsx เป็น default export รับ children
  เป็น React.ReactNode และ onClick?: () => void
src/shared/hooks/useProductRoute.tsx เป็น default export (นามสกุล .tsx จริงตามนี้)
  คืน goToProductDetails, goToCartSummary, goToCheckout, goToOrderSuccess
  ไฟล์นี้เป็นที่เดียวในโปรเจกต์ที่ได้รับอนุญาตให้มี URL string ของการ navigate
src/styles/_components.scss มี global class เหล่านี้อยู่แล้วตั้งแต่บทเรียน 04
  ให้ใช้ตามชื่อนี้เป๊ะ ห้ามเปลี่ยนชื่อและห้ามสร้างใหม่:
  table, table-image, table-discount, table-original-price, table-actions,
  table-quantity, table-total
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, pointer,
  inline-block, text-center, text-right, text-muted, fw-bold, fs-18, fs-24, fs-32,
  mr-5, mt-5, mt-15, mt-50, mb-40, pt-20, pt-30, pr-20, pb-30, pb-60

โครงสร้าง: แตะสองไฟล์นี้เท่านั้น
- src/features/cart/components/CartTable/CartTable.tsx (สร้างใหม่ ไม่มีไฟล์ .module.scss)
- src/pages/Cart/Cart.tsx (เขียนทับ stub ทั้งไฟล์)

ข้อกำหนดทางเทคนิค:
- ทั้งสองไฟล์ประกาศคอมโพเนนต์เป็น React.FC พร้อม interface ของ props ไว้บนสุด
  (ไฟล์ที่ไม่มี props ก็ไม่ต้องมี interface) และปิดท้ายไฟล์ด้วย export default
  รูปทรงเดียวกับคอมโพเนนต์อื่นทั้งหมดในโปรเจกต์ตั้งแต่บทเรียน 12
- CartTable.tsx: import React แล้ว useCart จาก "@/features/cart/useCart"
  interface CartTableProps สองตัว:
    onRemoveItem: (id: number) => void
    onUpdateQuantity: (id: number, quantity: number) => void
  ในคอมโพเนนต์ดึงเฉพาะ const { cart } = useCart();
    ห้ามดึง removeFromCart หรือ updateQuantity จาก useCart ในไฟล์นี้
  JSX: div ครอบ table className="table" ที่มี
    thead -> tr ที่มี th หกช่องตามลำดับนี้พอดี
      Action, Image, Product Name, Price, Quantity, Total
    tbody ที่วน cart.items.map((item) => ...) render tr key={item.id} ที่มี td หกช่อง
      1) button className="table-actions pointer" onClick เรียก onRemoveItem(item.id)
         เนื้อในปุ่มเป็นอักขระ × (multiplication sign ตัวเดียว ไม่ใช่ตัวอักษร x)
      2) img src={item.image || "/placeholder.png"} alt={item.title}
         className="table-image"
      3) {item.title}
      4) span className="fw-bold mr-5 fs-18" แสดง $ ติดกับ item.price.toFixed(2)
         แล้ว {item.originalPrice && ...} ที่ครอบด้วย fragment ว่าง มีสามอย่างเรียงกัน
           span className="table-original-price" แสดง $ ติดกับ
             item.originalPrice.toFixed(2)
           br
           span className="table-discount mt-5 inline-block fw-bold" แสดงข้อความ
             You Save: $ ติดกับ (item.originalPrice - item.price).toFixed(2)
      5) div className="table-quantity" ที่มีสามอย่างเรียงกัน
           button onClick เรียก onUpdateQuantity(item.id, item.quantity - 1)
             และมี disabled={item.quantity <= 1}
             เนื้อในปุ่มเขียนเป็น HTML entity &lt; ไม่ใช่เครื่องหมายน้อยกว่าดิบ ๆ
           span แสดง {item.quantity}
           button onClick เรียก onUpdateQuantity(item.id, item.quantity + 1)
             ไม่มี disabled
             เนื้อในปุ่มเขียนเป็น HTML entity &gt;
      6) แสดง $ ติดกับ (item.price * item.quantity).toFixed(2)
  ห้ามมี state ห้ามมี useMemo ห้ามคำนวณยอดรวมของทั้งตารางในไฟล์นี้
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
- Cart.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React, { useMemo } from "react";
    import { useCart } from "@/features/cart/useCart";
    import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
    import CartTable from "@/features/cart/components/CartTable/CartTable";
    import Button from "@/shared/components/Button/Button";
    import useProductRoute from "@/shared/hooks/useProductRoute";
  ในคอมโพเนนต์ Cart ที่ประกาศเป็น React.FC เรียงตามนี้
    const { cart, removeFromCart, updateQuantity } = useCart();
    const { goToCheckout } = useProductRoute();
    const calculateTotalPrice = useMemo(...) ที่ return ผลของ cart.items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2) โดยมี dependency array เป็น [cart.items]
      ชื่อตัวแปรคือ calculateTotalPrice ตามนี้ ห้ามเปลี่ยน
    const onCheckout = () => { goToCheckout(); };
    early return เมื่อ cart.items.length === 0 คืน fragment ว่างที่มี
      CategoryBanner name="Cart"
      div className="container text-center mt-50 pb-60" ที่มี
        h2 className="fs-32 fw-bold mb-40" ข้อความ Your Cart is Empty
        p className="text-muted fs-24" ข้อความ
          You haven't added any items to your cart yet.
  JSX หลัก: fragment ว่างที่มี
    CategoryBanner name="Cart"
    div className="container pt-30 pb-30" ที่มี
      CartTable onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity}
        ส่งฟังก์ชันจาก store เข้าไปตรง ๆ ห้ามห่อด้วย arrow function
      div className="table-total pr-20 pt-20 text-right" ที่มี
        h3 ข้อความ Total Price: $ ติดกับ {calculateTotalPrice}
        div className="inline-block mt-15" ครอบ Button onClick={onCheckout}
          children ข้อความ Checkout
  ห้ามใช้ useState ห้ามใช้ useEffect ห้ามยิง API และห้ามใช้ TanStack Query
  ห้ามใส่ข้อความยืนยันก่อนลบสินค้า และห้ามใส่ปุ่ม Clear Cart
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้าง CartTable.module.scss หรือ Cart.module.scss
- ห้ามแก้ไฟล์ใน src/features/cart/store/, useCart.ts, CartSummary,
  AddToCartModalContent, Header.tsx, Product.tsx, CategoryBanner หรือ router.tsx
- ห้ามแก้ src/styles/ แม้แต่บรรทัดเดียว class ที่ต้องใช้มีครบแล้ว
- ห้ามเพิ่ม action ใหม่ใน reducer และห้ามแก้กติกาจำนวนสินค้าใน store
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์ (หน้านี้จะมี integration test ในบทเรียน 33)