สร้างคอมโพเนนต์สี่ตัวของหน้ารายละเอียดสินค้า: ProductImageGallery, ProductDetailInfo, RatingBreakdown และ ReviewCard

บริบท: @src/features/products/components/ProductCard/ProductCard.tsx @src/features/products/types.ts @src/shared/components/StarReview/StarReview.tsx @src/shared/components/Button/Button.tsx @src/styles
ใช้ ProductCard เป็นแม่แบบของรูปทรงไฟล์: React.FC + interface props + default export
src/features/products/types.ts export interface ProductReview
  ที่มี rating (number), comment, date, reviewerName, reviewerEmail (string)
src/shared/components/StarReview/StarReview.tsx เป็น default export รับ prop เดียวคือ score: number
src/shared/components/Button/Button.tsx เป็น default export รับ children เป็น React.ReactNode
  และรับ icon?: IconProp, onClick?: () => void
ติดตั้ง react-loading-skeleton, dayjs และ Font Awesome ครบทั้งห้า package ไว้แล้ว
ตัวแปรอยู่ใน src/styles/_variables.scss: $orange01, $grey03, $grey04, $white
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: flex, flex-center,
  align-item-center, width-full, text-center, text-muted, text-primary,
  text-line-through, bg-grey05, fw-bold, fw-medium, fs-14, fs-18, fs-32, fs-40,
  lh-1-5, lh-1-75, gap-5, gap-15, p-20, mb-5, mb-10, mb-20, mb-30,
  mt-0, mt-10, ml-5, ml-10, mr-5, mr-10, pl-15, pt-25, pb-25
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative
  ไฟล์ .scss ในโฟลเดอร์นี้ลึกสี่ชั้นจาก src ให้เขียน @use "../../../../styles/variables";

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/features/products/components/ProductImageGallery/ProductImageGallery.module.scss
- src/features/products/components/ProductImageGallery/ProductImageGallery.tsx
- src/features/products/components/ProductDetailInfo/ProductDetailInfo.tsx
- src/features/products/components/RatingBreakdown/RatingBreakdown.module.scss
- src/features/products/components/RatingBreakdown/RatingBreakdown.tsx
- src/features/products/components/ReviewCard/ReviewCard.module.scss
- src/features/products/components/ReviewCard/ReviewCard.tsx
ProductDetailInfo ต้องไม่มีไฟล์ .module.scss

ข้อกำหนดทางเทคนิค:
- ProductImageGallery.module.scss: ไม่ต้อง @use variables
  .productImageGallery -> display: flex, flex-direction: column, align-items: center
    nested .thumbnailList -> display: flex, flex-wrap: wrap, gap: 10px
      nested .thumbnail -> width: 80px, height: 80px, cursor: pointer,
        border: 2px solid transparent, transition: border-color 0.3s ease
        nested img -> width: 100%, height: 100%, object-fit: cover
        nested &.active -> border-color: #000
          พร้อม comment ท้ายบรรทัดว่า // Highlight for the selected thumbnail
        nested &:hover -> border-color: #ccc
- ProductImageGallery.tsx: import React, { useState }, Skeleton จาก "react-loading-skeleton"
    และ styles จาก "./ProductImageGallery.module.scss"
  props สองตัว: images: string[] และ defaultImage?: string
  state: selectedImage เป็น useState<string>(defaultImage || images[0])
    และ isImageLoaded เป็น useState(false)
  ฟังก์ชัน handleImageClick(image: string) ที่ setIsImageLoaded(false)
    ก่อน setSelectedImage(image) เสมอ ห้ามสลับลำดับสองบรรทัดนี้
  JSX: div className={styles.productImageGallery} ที่มีสองส่วน
    ส่วนบน div className="width-full text-center" ที่มี
      {!isImageLoaded && ...} div className="mb-30" ครอบ Skeleton height={400}
      img src={selectedImage} alt="Selected image"
        style display เป็น "inline-block" เมื่อโหลดแล้ว ไม่งั้นเป็น "none"
        onLoad ที่เขียนเป็น arrow function แบบย่อบรรทัดเดียว () => setIsImageLoaded(true)
          (ไม่ใช่แบบมีปีกกาอย่างที่ ProductCard เขียนไว้ในบทเรียน 18 — สองไฟล์นี้เขียนคนละท่า
           และ Prettier เก็บไว้ตามที่คนเขียนวางทั้งคู่)
    ส่วนล่าง div className={styles.thumbnailList} ที่วน images.map((image, index) => ...)
      render div key={index} className ที่ต่อ styles.thumbnail กับ styles.active
        เมื่อ selectedImage === image และ onClick ที่เรียก handleImageClick(image)
        ข้างในเป็น img src={image} alt ที่เป็นข้อความ Thumbnail ตามด้วย index + 1
  เว้นบรรทัดว่างหนึ่งบรรทัดคั่นระหว่างส่วนบนกับ comment ของส่วนล่าง
    ที่อื่นใน JSX ห้ามมีบรรทัดว่าง
  ใส่ comment ได้สองจุดเท่านั้น: บรรทัดเหนือส่วนบนว่า Large Displayed Image
    และบรรทัดเหนือส่วนล่างว่า Image Thumbnails
- ProductDetailInfo.tsx: import React, faCartPlus จาก "@fortawesome/free-solid-svg-icons",
    StarReview และ Button จาก shared/components
  interface ProductDetailInfoProps เรียงตามนี้พอดี: title: string, brand: string,
    rating: number, reviewsCount: number, price: number, originalPrice: number,
    discountPercentage: number | undefined, description: string,
    sku: string | undefined, stock: number, availabilityStatus: string,
    shippingInfo: string, warrantyInfo: string, onButtonClick: () => void
    สังเกตว่า discountPercentage กับ sku เขียนเป็น union กับ undefined ไม่ใช่ใส่ ?
  JSX เรียงตามนี้ใน div เดียว:
    h2 className="fs-32 mb-10" แสดง title
    p className="fs-18 text-muted mb-20 mt-0" แสดง brand ตรง ๆ
      ห้ามใส่ fallback ห้ามใส่ ?? หรือ || ห้ามซ่อนด้วยเงื่อนไข
    div className="flex align-item-center mb-20" ที่มี StarReview score={rating}
      และ span className="text-muted ml-5" แสดง {reviewsCount} Reviews
    div className="flex align-item-center mb-20" ที่มี
      p className="fs-32 fw-medium mr-10" แสดง $ เว้นวรรค แล้ว price.toFixed(2)
      {originalPrice && ...} span className="fs-14 text-muted text-line-through"
        แสดง $ ติดกับ originalPrice.toFixed(2)
      {discountPercentage && ...} span className="fs-18 fw-medium ml-10 text-primary"
        แสดง {discountPercentage}% Off
    p className="text-muted" แสดง description
    div className="pt-25 pb-25" ครอบ Button icon={faCartPlus} onClick={onButtonClick}
      ที่มี children เป็นข้อความ Add To Cart
    div ที่มี h4 ข้อความ Product Info: และ ul className="pl-15 lh-1-75 mt-10" ที่มี
      {sku && ...} li className="text-muted" แสดง SKU: {sku}
      li className="text-muted" แสดง Quantity: {stock} left
      {availabilityStatus && ...} li className="text-muted" แสดง Stock Status: {availabilityStatus}
    div ที่มี h4 ข้อความ Delivery Details: และ ul className="pl-15 lh-1-75 mt-10" ที่มี
      li className="text-muted" แสดง shippingInfo และอีก li แสดง warrantyInfo
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลยแม้แต่บรรทัดเดียว ทุก div ต่อกันติด
  ห้ามมี state ห้ามมี useEffect และห้าม import อะไรที่เกี่ยวกับตะกร้า
- RatingBreakdown.module.scss: @use "../../../../styles/variables";
  .starIcon -> color: variables.$orange01
  .bar -> position: relative, flex-grow: 1, height: 9px,
    background-color: variables.$grey03, border-radius: 4px, overflow: hidden
    nested .fill -> height: 100%, border-radius: 4px
  .greenBar -> background-color: #28a745  // Green for 4 and 5 stars
  .orangeBar -> background-color: #ffc107  // Orange for 3 stars
  .redBar -> background-color: #dc3545  // Red for 1 and 2 stars
  .defaultBar -> background-color: #ced4da  // Default gray
  ทั้งสี่ค่านี้เป็น hex ตรง ๆ ตามต้นฉบับ ห้ามย้ายไปไว้ใน _variables.scss
  และทั้งสี่บรรทัดต้องมี comment ท้ายบรรทัดตามที่เขียนไว้ข้างบนนี้ทุกตัวอักษร
- RatingBreakdown.tsx: import React, FontAwesomeIcon, faStar จาก free-solid-svg-icons
    และ styles จาก "./RatingBreakdown.module.scss"
  prop เดียวคือ reviews: { rating: number }[]
    ใส่ comment ท้ายบรรทัดนั้นว่า // Only need the `rating` property
  const totalReviews = reviews.length;
  const ratingCounts = Array(5).fill(0).map((_, index) => { ... }) ที่แต่ละรอบ
    const stars = 5 - index; พร้อม comment ท้ายบรรทัดว่า // Descending from 5 to 1
    const count = reviews.filter((review) => Math.round(review.rating / 2) === stars).length;
    เว้นบรรทัดว่างหนึ่งบรรทัด
    const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  ห้ามรับคะแนนเฉลี่ยเป็น prop และห้ามคำนวณ count จากค่าอื่นนอกจาก array reviews
  ฟังก์ชัน getBarStyleClass(stars: number) เป็น switch ที่ 5 กับ 4 คืน styles.greenBar,
    3 คืน styles.orangeBar, 2 กับ 1 คืน styles.redBar, default คืน styles.defaultBar
    ทุกบรรทัด return ในนั้นมี comment ท้ายบรรทัดตามลำดับนี้: // Class for green,
    // Class for orange, // Class for red และ // Default class
  JSX: div ครอบ ratingCounts.map(({ stars, count, percentage }) => ...)
    div key={stars} className="flex align-item-center gap-15 mb-10" ที่มี
      div className="fw-bold flex align-item-center gap-5" ที่มี span แสดง stars
        และ FontAwesomeIcon icon={faStar} className={styles.starIcon}
      div className={styles.bar} ครอบ div ที่ className ต่อ styles.fill
        กับผลของ getBarStyleClass(stars) และ style width เป็นเปอร์เซ็นต์จาก percentage
      div className="text-muted" แสดง count
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
  นอกจาก comment ท้ายบรรทัดที่ระบุไว้ข้างบน ใส่ comment บรรทัดเดี่ยวได้อีกสองจุด:
    เหนือ ratingCounts ว่า Compute counts for each rating (1-5 stars)
    และเหนือ getBarStyleClass ว่า Helper function to determine bar style class based on stars
- ReviewCard.module.scss: @use "../../../../styles/variables";
  .reviewCard -> border: 1px solid variables.$grey04
  .avatar -> width: 70px, height: 70px, background-color: variables.$white
- ReviewCard.tsx: import React แล้ว dayjs จาก "dayjs" แล้วเว้นบรรทัดว่างหนึ่งบรรทัด
    แล้ว styles จาก "./ReviewCard.module.scss" แล้ว StarReview
  props สี่ตัว: name: string, date: string, review: string, rating: number
  JSX: div className ที่ต่อ styles.reviewCard กับ "p-20 bg-grey05"
    ครอบ div className="flex align-item-center gap-15" ที่มี
      div className ที่ต่อ styles.avatar กับ "flex-center font-bold flex fs-40"
        แสดง name[0]
      div ที่มี
        div className="flex align-item-center mb-5" ที่มี
          span className="fw-bold fs-18 mr-5" แสดง name
          span className="text-muted fs-14" แสดง dayjs(date).format("DD MMMM YYYY")
        StarReview score={rating}
        p className="fs-14 text-muted lh-1-5 mt-10" แสดง review
  เว้นบรรทัดว่างหนึ่งบรรทัดสามจุด: ก่อน div ตัวที่สอง (ตัวที่ครอบข้อมูลผู้ใช้),
    ก่อน comment Rating และก่อน comment Review Text ที่อื่นใน JSX ห้ามมีบรรทัดว่าง
  ใส่ comment ได้สี่จุดตามต้นฉบับ: User Initial Avatar, User Information, Rating, Review Text

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ ProductCard, StarReview, Button, types.ts, queries.ts หรือ api.ts
- ห้ามแตะ src/pages ทั้งโฟลเดอร์
- ห้ามสร้าง ReviewSection หรือ index.ts/ไฟล์ barrel ใด ๆ
- ห้ามสร้างไฟล์ .module.scss ให้ ProductDetailInfo
- ยังไม่ต้องเอาสี่ตัวนี้ไปใช้ในหน้าไหน