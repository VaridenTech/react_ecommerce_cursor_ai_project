ต่อปุ่ม Add To Cart เข้ากับตะกร้า และเติมไอคอนตะกร้าบน Header

บริบท: @src/pages/Product/Product.tsx @src/shared/components/Header/Header.tsx @src/features/cart/components/AddToCartModalContent/AddToCartModalContent.tsx @src/features/cart/components/CartSummary/CartSummary.tsx @src/features/cart/useCart.ts @src/shared/hooks/useProductRoute.tsx @src/shared/utils/price.utils.ts
สองไฟล์แรกคือไฟล์ที่ต้องแก้ อ่านของเดิมให้ครบก่อนแก้ ห้ามเขียนใหม่ทั้งไฟล์
src/features/cart/useCart.ts export named useCart คืน
  { cart, addToCart, removeFromCart, updateQuantity, clearCart }
  addToCart รับ CartItem หนึ่งตัวที่มีฟิลด์ id, title, price, quantity, image
  และ originalPrice (optional)
src/features/cart/components/CartSummary/CartSummary.tsx เป็น default export
  รับ prop เดียวคือ onIconClick: () => void
src/features/cart/components/AddToCartModalContent/AddToCartModalContent.tsx
  เป็น default export รับ isOpen: boolean และ onClose: () => void
src/shared/hooks/useProductRoute.tsx เป็น default export (นามสกุล .tsx จริงตามนี้)
  คืนฟังก์ชันสี่ตัว: goToProductDetails, goToCartSummary, goToCheckout, goToOrderSuccess
  ไฟล์นี้เป็นที่เดียวในโปรเจกต์ที่ได้รับอนุญาตให้มี URL string ของการ navigate
src/shared/utils/price.utils.ts export calculateOriginalPrice(price, discountPercentage?)
  คืน number — Product.tsx import มันไว้แล้วตั้งแต่เดิม ไม่ต้องเพิ่มบรรทัด import
Product.tsx ตอนนี้มี onAddToCart เป็นฟังก์ชันว่างที่มีแต่ comment TODO บรรทัดเดียว
Header.tsx ตอนนี้มีโลโก้กับเมนูสองรายการ ยังไม่มีอะไรที่มุมขวาและยังไม่เรียก hook ใด ๆ

โครงสร้าง: แก้เฉพาะสองไฟล์นี้ ห้ามสร้างไฟล์ใหม่แม้แต่ไฟล์เดียว
- src/pages/Product/Product.tsx (แก้สามกลุ่มตามข้างล่าง นอกนั้นห้ามแตะ)
- src/shared/components/Header/Header.tsx (แก้สามจุดตามข้างล่าง นอกนั้นห้ามแตะ)

ข้อกำหนดทางเทคนิค:
- Product.tsx จุดที่ 1 (import): เปลี่ยนบรรทัดแรกเป็น
    import React, { useState } from "react";
  แล้วแทรกสองบรรทัดนี้ต่อจากบรรทัด import ของ ProductDetailInfo
  และก่อนบรรทัด import ของ productQueries ตามลำดับนี้
    import AddToCartModalContent from "@/features/cart/components/AddToCartModalContent/AddToCartModalContent";
    import { useCart } from "@/features/cart/useCart";
  ห้ามเรียงบรรทัด import เดิมใหม่ ห้ามย้าย ห้ามลบ
- Product.tsx จุดที่ 2 (state และ hook):
    เพิ่ม const [isModalOpen, setIsModalOpen] = useState(false); เป็นบรรทัดแรกสุด
      ในตัวคอมโพเนนต์ เหนือบรรทัด useParams
    เพิ่ม const { addToCart } = useCart(); ต่อท้ายบล็อก useQuery ทันที
      โดยไม่มีบรรทัดว่างคั่นระหว่างสองบรรทัดนั้น
    เว้นบรรทัดว่างหนึ่งบรรทัด แล้วประกาศสองบรรทัดนี้ติดกัน
      const onOpenModal = () => setIsModalOpen(true);
      const onCloseModal = () => setIsModalOpen(false);
      ทั้งคู่เขียนเป็น arrow แบบย่อบรรทัดเดียว ห้ามใส่ปีกกา
    ใน JSX ก่อนแท็กปิด div นอกสุด ให้เว้นบรรทัดว่างหนึ่งบรรทัดหลัง /section
      แล้วใส่ AddToCartModalContent isOpen={isModalOpen} onClose={onCloseModal}
      บรรทัดว่างบรรทัดนี้เป็นบรรทัดว่างเดียวที่อนุญาตใน JSX ของไฟล์นี้
- Product.tsx จุดที่ 3 (ไส้ใน onAddToCart): ลบ comment TODO ทิ้ง แล้วเขียนเป็น
    if (productDetail) { ... } ที่ข้างในเรียก addToCart({ ... }) ด้วยฟิลด์ตามลำดับนี้
      id: productDetail.id
      title: productDetail.title
      price: productDetail.price
      quantity: 1
      image: productDetail.thumbnail
      originalPrice: calculateOriginalPrice(productDetail.price,
        productDetail.discountPercentage)
    แล้วเรียก onOpenModal(); เป็นบรรทัดสุดท้ายใน if
  ห้ามแตะส่วนอื่นของ Product.tsx เลย: ห้ามแก้ useQuery, ห้ามแก้ early return
  สองก้อน, ห้ามแก้การ destructure productDetail, ห้ามแก้ props ที่ส่งให้
  ProductDetailInfo และห้ามแก้ ReviewSection
- Header.tsx จุดที่ 1 (import): เพิ่มสองบรรทัดต่อจาก import ของ react-router
    import CartSummary from "@/features/cart/components/CartSummary/CartSummary";
    import useProductRoute from "@/shared/hooks/useProductRoute";
- Header.tsx จุดที่ 2: บรรทัดแรกในตัวคอมโพเนนต์เป็น
    const { goToCartSummary } = useProductRoute();
  แล้วเว้นบรรทัดว่างหนึ่งบรรทัดก่อน return
- Header.tsx จุดที่ 3 (JSX): หลังแท็กปิด /nav ให้เว้นบรรทัดว่างหนึ่งบรรทัด
    แล้วใส่ CartSummary onIconClick={goToCartSummary} เป็น element สุดท้าย
    ในกล่อง flex space-between align-item-center
    ส่ง goToCartSummary เข้าไปตรง ๆ ห้ามห่อด้วย arrow function
  ห้ามแตะโลโก้ ห้ามแตะ ul ของเมนู ห้ามเปลี่ยน className ใด ๆ ที่มีอยู่

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้างไฟล์ใหม่ ห้ามสร้าง Header.module.scss หรือ Product.module.scss
- ห้ามสร้าง context, provider, reducer หรือ hook ของตะกร้าเพิ่ม
  ต้อง import useCart ตัวที่มีอยู่แล้วเท่านั้น
- ห้ามใช้ useNavigate หรือ Link ในการไปหน้า /cart และห้ามเขียน string "/cart"
  ในไฟล์ใดก็ตาม การนำทางทุกเส้นต้องผ่าน useProductRoute
- ห้ามแก้ ProductDetailInfo, CartSummary, AddToCartModalContent, Modal, Button,
  useCart, useProductRoute, router.tsx หรือ providers.tsx
- ห้ามเขียนเทสต์