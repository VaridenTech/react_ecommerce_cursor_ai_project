ประกอบหน้า Product detail เวอร์ชันแรก โดยที่ปุ่ม Add To Cart ยังไม่ต่อกับอะไร

บริบท: @src/pages/Product/Product.tsx @src/features/products/components @src/features/products/queries.ts @src/features/products/types.ts @src/shared/utils/price.utils.ts @src/pages/Category/components/CategoryBanner/CategoryBanner.tsx @src/pages/Home/Home.tsx
src/pages/Product/Product.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว ให้เขียนทับทั้งไฟล์
src/features/products/components มีคอมโพเนนต์ที่เพิ่งสร้างเสร็จและ commit แล้ว:
  ProductImageGallery รับ images: string[] และ defaultImage?: string
  ProductDetailInfo รับ props สิบสี่ตัวตามที่ประกาศไว้ในไฟล์ ให้เปิดอ่าน signature จริง
  RatingBreakdown รับ reviews: { rating: number }[]
  ReviewCard รับ name, date, review (string) และ rating (number)
src/features/products/queries.ts export productQueries ที่มีจาน detail(id: string | number)
  คืน queryOptions ใช้กับ useQuery ได้ตรง ๆ
src/features/products/types.ts export interface ProductReview
src/shared/utils/price.utils.ts export calculateOriginalPrice(price, discountPercentage?)
src/pages/Category/components/CategoryBanner/CategoryBanner.tsx รับ prop name?: string | null
src/pages/Home/Home.tsx ใช้เป็นแม่แบบของสไตล์การเขียนได้ แต่หน้านี้จัดการ loading/error
  คนละแบบกับหน้า Home ตามที่ระบุข้างล่าง
route /products/:id ตั้งไว้แล้วใน router.tsx ชื่อ param คือ id
โปรเจกต์นี้ยังไม่มีฟีเจอร์ตะกร้าสินค้าเลย ไม่มี useCart ไม่มี CartContext ไม่มี modal ของตะกร้า
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, flex, width-50,
  text-center, text-muted, fw-bold, fs-24, fs-40, pt-15, pt-60, pb-30, pr-10, pr-40,
  pl-10, mb-10, mb-15, mb-30, mb-35, ml-15, my-20

โครงสร้าง: แตะสองไฟล์นี้เท่านั้น
- src/pages/Product/components/ReviewSection.tsx (สร้างใหม่ วางในโฟลเดอร์ components ตรง ๆ
  ไม่ต้องสร้างโฟลเดอร์ ReviewSection ซ้อนอีกชั้น และไม่มีไฟล์ .module.scss)
- src/pages/Product/Product.tsx (เขียนทับ stub ทั้งไฟล์)

ข้อกำหนดทางเทคนิค:
- ReviewSection.tsx: import React, ProductReview จาก "@/features/products/types",
    StarReview, RatingBreakdown, ReviewCard เรียงตามลำดับนี้
  props สองตัว: rating: number และ reviews: ProductReview[]
  JSX: div className="flex" ที่มีสองครึ่ง
    div className="width-50" ครอบ div className="pr-40" ที่มี
      div className="flex pt-15" ที่มี span className="fs-40 fw-bold" แสดง rating ตรง ๆ
        และ div className="ml-15" ที่มี div className="mb-10" ครอบ StarReview score={rating}
        กับ p className="text-muted" แสดง Based on {reviews.length} Reviews
      hr className="my-20"
      RatingBreakdown reviews={reviews}
    div className="width-50" ที่วน reviews.map(({ reviewerName, date, comment, rating }, index) => ...)
      render div key={index} className="mb-15" ครอบ ReviewCard
        name={reviewerName} date={date} review={comment} rating={rating}
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
- Product.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React from "react";
    import ClipLoader from "react-spinners/ClipLoader";
    import { useParams } from "react-router";
    import { useQuery } from "@tanstack/react-query";
    import ReviewSection from "./components/ReviewSection";
    import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
    import ProductImageGallery from "@/features/products/components/ProductImageGallery/ProductImageGallery";
    import { calculateOriginalPrice } from "@/shared/utils/price.utils";
    import ProductDetailInfo from "@/features/products/components/ProductDetailInfo/ProductDetailInfo";
    import { productQueries } from "@/features/products/queries";
    import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";
  ในคอมโพเนนต์ Product: React.FC ตามลำดับนี้
    const { id } = useParams<{ id: string }>();
    useQuery ที่ spread ...productQueries.detail(id ?? "") แล้วเติม enabled: !!id
      destructure เป็น data: productDetail, isLoading, isError
    const onAddToCart = () => { ... } ที่มีแต่ comment บรรทัดเดียวข้างใน
      เขียน comment ว่า TODO: the cart doesn't exist yet — we wire this up in lesson 23
      ห้ามมีคำสั่งอื่นในฟังก์ชันนี้แม้แต่บรรทัดเดียว
    if (isLoading) return div className="text-center mb-30" ครอบ ClipLoader
      ที่มี size={40} aria-label="Loading Spinner" data-testid="loader"
    if (isError || !productDetail) return div className="container" ครอบ ErrorMessage
      message="We couldn't load this product. Please try again."
    destructure จาก productDetail ตามลำดับนี้: title, images, description, brand,
      reviews, rating, price, discountPercentage, sku, stock, availabilityStatus,
      shippingInformation, warrantyInformation
    const originalPrice = calculateOriginalPrice(price, discountPercentage);
  JSX: return div ตัวเดียว (ไม่ใช่ fragment) ที่มี
    CategoryBanner name={title}
    section className="pt-60" ครอบ div className="container" ที่มี
      div className="flex mb-35" ที่มีสองครึ่ง
        div className="width-50" ครอบ div className="pr-10" ครอบ
          ProductImageGallery images={images} (ไม่ต้องส่ง defaultImage)
        div className="width-50" ครอบ div className="pl-10" ครอบ ProductDetailInfo
          ที่ส่ง title, brand, rating, reviewsCount={reviews.length}, price,
          originalPrice, discountPercentage, description, sku, stock,
          availabilityStatus, shippingInfo={shippingInformation},
          warrantyInfo={warrantyInformation}, onButtonClick={onAddToCart}
      div className="pb-30" ที่มี h3 className="fs-24" ข้อความ Reviews
        และ ReviewSection rating={rating} reviews={reviews}
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย ส่วนนอก JSX ให้เว้นบรรทัดว่างหนึ่งบรรทัดคั่น
    ระหว่าง useQuery กับ onAddToCart, ระหว่าง onAddToCart กับ if ก้อนแรก,
    ระหว่าง if สองก้อน, ระหว่าง if ก้อนที่สองกับการ destructure และก่อน return
  ห้ามใช้ useState ในไฟล์นี้ ห้ามใช้ useEffect ห้ามเขียน queryKey เอง

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้างฟีเจอร์ตะกร้า: ห้ามสร้าง CartContext, CartProvider, useCart, cartReducer,
  AddToCartModalContent หรือไฟล์ใด ๆ ใน src/features/cart
- ห้ามเพิ่ม modal, ห้ามเพิ่ม state ของ modal, ห้ามใช้ localStorage
- ห้ามแก้ ProductDetailInfo, ProductImageGallery, RatingBreakdown, ReviewCard,
  CategoryBanner, Home.tsx, Category.tsx, router.tsx หรือ queries.ts
- ห้ามสร้าง Product.module.scss หรือ ReviewSection.module.scss
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามเขียนเทสต์