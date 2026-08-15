สร้างคอมโพเนนต์รายการสินค้าและ utility คำนวณราคาก่อนลด แล้วต่อ CSS ของ react-loading-skeleton

บริบท: @src/features/products/types.ts @src/shared/components/StarReview/StarReview.tsx @src/shared/utils/pagination.utils.ts @src/main.tsx @src/styles
src/features/products/types.ts export interface Product และ Category
  Product มีฟิลด์ที่งานนี้ใช้: id (number), title (string), brand (string),
  thumbnail (string), price (number), discountPercentage (number ที่เป็น optional),
  rating (number), reviews (array ของ ProductReview)
  Category มีสามฟิลด์: slug, name, url เป็น string ทั้งหมด
src/shared/components/StarReview/StarReview.tsx เป็น default export รับ prop เดียวคือ
  score: number ที่เป็นคะแนนสเกล 0 ถึง 10
src/shared/utils/pagination.utils.ts มีอยู่แล้ว ห้ามแตะ ไฟล์ใหม่ของงานนี้อยู่โฟลเดอร์เดียวกัน
ติดตั้ง react-loading-skeleton ไว้แล้ว ยังไม่ได้ import CSS ของมันที่ไหนเลย
โฟลเดอร์ src/features/products/components/ ยังไม่มี ให้สร้างขึ้นใหม่
utility class ทุกตัวที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: flex, flex-column,
  align-item-center, block, pointer, text-right, text-muted, text-primary,
  text-line-through, fw-bold, fw-medium, fs-12, fs-14, fs-18, fs-20,
  nav-link, mt-0, mb-5, mb-10, mb-15, mb-20, ml-5, ml-10, pt-15, pb-15
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/utils/price.utils.ts
- src/features/products/components/ProductCard/ProductCard.tsx
- src/features/products/components/ProductsList/ProductsList.tsx
- src/features/products/components/CategoryMenu/CategoryMenu.module.scss
- src/features/products/components/CategoryMenu/CategoryMenu.tsx
และแก้ src/main.tsx หนึ่งบรรทัด
ProductCard และ ProductsList ต้องไม่มีไฟล์ .module.scss

ข้อกำหนดทางเทคนิค:
- price.utils.ts: ไม่มี import เลย มี export เดียวคือ arrow function ชื่อ
  calculateOriginalPrice ที่รับ (price: number, discountPercentage?: number)
  และประกาศ return type เป็น number
  ขึ้นต้นไฟล์ด้วย JSDoc สี่บรรทัดนี้ ลอกตามนี้ทุกตัวอักษร:
    Calculate the original price before the discount.
    @param {number} price - The discounted price of the product.
    @param {number | undefined} discountPercentage - The discount percentage (optional).
    @returns {string} - The original price as a formatted string.
  ไส้ในมีสองคำสั่งเท่านั้น:
    guard clause: ถ้า !discountPercentage หรือ discountPercentage <= 0
      หรือ discountPercentage >= 100 ให้ return price
      พร้อม comment ท้ายบรรทัดว่า // If no discount or invalid discount, return the current price
    บรรทัดสุดท้าย: return price / (1 - discountPercentage / 100)
  ห้ามปัดเศษ ห้ามใช้ toFixed, Math.round, Number(), parseFloat หรือ Intl.NumberFormat
  ห้ามคืน string ไม่ว่ากรณีใด แม้ JSDoc จะเขียนไว้แบบนั้น (บรรทัดนั้นลอกตามต้นฉบับ)
- ProductCard.tsx: import React, { useState } from "react"
    import Skeleton from "react-loading-skeleton"
    import StarReview จาก "@/shared/components/StarReview/StarReview"
  interface ProductCardProps เรียงตามนี้พอดี: productId: number, image: string,
    title: string, description: string, price: number, originalPrice?: number,
    discount?: number, rating: number, reviewsCount: number,
    skeletonHeight?: number, onProductClick: (id: number) => void
    ใส่ comment ท้ายบรรทัด rating ว่า // Rating out of 10
  destructure props ตามลำดับนี้ (ต่างจากลำดับใน interface โดยตั้งใจ): image, title,
    description, price, originalPrice, discount, rating, reviewsCount,
    skeletonHeight = 240, productId, onProductClick
  state เดียว: const [isImageLoaded, setIsImageLoaded] = useState(false)
  โครง JSX:
    div นอกสุด className={`flex flex-column`} (เขียนเป็น template literal ตามนี้)
      และ onClick={() => onProductClick(productId)}
    > div className="image-container" ที่มี
        {!isImageLoaded && <Skeleton height={skeletonHeight} />}
        img src={image} alt={title} style={{ display: isImageLoaded ? "block" : "none" }}
          onLoad ที่เรียก setIsImageLoaded(true)
    > div className={`pt-15 pb-15`} (template literal เช่นกัน) ที่มี
        h4 className="fs-18 mb-5 mt-0" แสดง title
        p className="fs-14 text-muted mb-10 mt-0" แสดง description
        div className="flex align-item-center mb-15" ที่มี StarReview score={rating}
          และ span className="fs-12 text-muted ml-5" แสดง ({reviewsCount}) ในวงเล็บ
        p className="fs-20 mb-5" แสดง ${price.toFixed(2)} โดย $ เป็นตัวอักษรธรรมดา
        div className="flex align-item-center" ที่มีสองบล็อกแบบมีเงื่อนไข:
          {originalPrice && ...} span className="fs-14 text-muted text-line-through"
            แสดง $ ตามด้วย originalPrice.toFixed(2)
          {discount && ...} span className="fs-14 fw-medium ml-10 text-primary"
            แสดง {discount}% Off
  เว้นบรรทัดว่างหนึ่งบรรทัดคั่นระหว่าง div ของรูปกับ div ที่ครอบข้อความ
    ที่อื่นใน JSX ห้ามมีบรรทัดว่าง
  ห้าม import Product, ห้าม import useNavigate และห้ามสร้างไฟล์ .module.scss ให้ไฟล์นี้
- ProductsList.tsx: import React, Product จาก "@/features/products/types",
    ProductCard จาก "@/features/products/components/ProductCard/ProductCard"
    และ calculateOriginalPrice จาก "@/shared/utils/price.utils"
  interface ProductsListProps: products: Product[] | undefined
    และ onProductClick: (id: number) => void
  return fragment ว่าง แล้วข้างในเป็น products?.map(...) ที่ destructure ใน parameter
    ของ map ตามลำดับนี้: thumbnail, id, title, brand, price, discountPercentage,
    rating, reviews
  แต่ละรอบ render div key={id} className="mb-15 pointer" ครอบ ProductCard ที่ส่ง props
    productId={id}, image={thumbnail}, title={title}, description={brand},
    price={price}, originalPrice={calculateOriginalPrice(price, discountPercentage)},
    discount={discountPercentage}, rating={rating},
    reviewsCount={reviews.length}, onProductClick={onProductClick}
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
  ห้ามส่ง skeletonHeight และห้ามใส่ fallback ให้ brand ไม่ว่าจะเป็น "" หรือ "-"
- CategoryMenu.module.scss: มี class เดียวคือ .categoryMenu ที่ตั้ง width: 16%
    ไม่ต้อง @use variables เพราะไม่ได้ใช้ตัวแปรเลย
- CategoryMenu.tsx: import React, styles จาก "./CategoryMenu.module.scss"
    และ Category จาก "@/features/products/types" เรียงสามบรรทัดตามลำดับนี้
  interface CategoryMenuProps: categories: Category[],
    activeCategory: string | undefined, onCategoryClick: (category: Category) => void
  return div className={`${styles.categoryMenu} text-right`}
    ข้างในวน categories.map((cat) => ...) render span key={cat.slug}
    className เป็น template literal ว่า `nav-link block mb-20 pointer ` ต่อด้วย
      activeCategory === cat.slug ? "fw-bold text-primary" : ""
    onClick={() => onCategoryClick(cat)} และแสดง {cat.name}
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
  ห้ามมี useState, useEffect หรือ state ภายในใด ๆ
- main.tsx: เพิ่มบรรทัด import "react-loading-skeleton/dist/skeleton.css";
    ไว้ใต้บรรทัด import "./styles/main.scss"; พอดี และเหนือบรรทัด import App
  ห้ามแก้บรรทัดอื่นในไฟล์นี้แม้แต่ตัวอักษรเดียว

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ types.ts, api.ts, queries.ts, StarReview หรือคอมโพเนนต์ใน shared/components
- ห้ามแก้ pagination.utils.ts
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามสร้างไฟล์ .module.scss ให้ ProductCard หรือ ProductsList
- ห้ามเรียก useQuery หรือ productQueries ในไฟล์ไหนของงานนี้
- ยังไม่ต้องเอาคอมโพเนนต์เหล่านี้ไปใช้ในหน้าไหน