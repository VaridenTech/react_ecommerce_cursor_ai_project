ประกอบหน้า Home เวอร์ชันโครงหน้า: แบนเนอร์ carousel แถวจุดขาย และรายการสินค้าตามหมวดหมู่

บริบท: @src/pages/Home/Home.tsx @src/features/products/queries.ts @src/features/products/types.ts @src/features/products/components @src/shared/components @src/shared/hooks/useProductRoute.tsx @src/styles
src/pages/Home/Home.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว ให้เขียนทับทั้งไฟล์
src/features/products/queries.ts export productQueries ที่มีสี่จาน: list, byCategory,
  categories, detail ทุกจานคืนผลของ queryOptions ใช้กับ useQuery ได้ตรง ๆ
  byCategory รับ { category, page?, limit? } และมี placeholderData ตั้งไว้แล้ว
src/features/products/types.ts export interface Category ที่มี slug, name, url
src/features/products/components มี CategoryMenu กับ ProductsList จากบทที่แล้ว
  CategoryMenu รับ categories: Category[], activeCategory: string | undefined,
    onCategoryClick: (category: Category) => void
  ProductsList รับ products: Product[] | undefined, onProductClick: (id: number) => void
src/shared/components มี FeatureCard (icon: IconDefinition, title, description),
  ImageZoom (src, alt, className?) และ ErrorMessage (message?)
src/shared/hooks/useProductRoute.tsx เป็น default export คืน object ที่มี goToProductDetails(id: number)
ติดตั้ง swiper, react-spinners, @tanstack/react-query และ Font Awesome ครบแล้ว
รูปภาพอยู่ที่ public/images/banners/01.png ถึง 03.png และ public/images/deals/01.png ถึง 04.png
  เรียกใช้ในโค้ดด้วย path ที่ขึ้นต้นด้วย /images/ ไม่มีคำว่า public นำหน้า
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, flex, gap-25,
  align-item-center, text-center, pt-35, pt-65, pt-60, pb-30, mb-20,
  category-list-container, category-list-box
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative

โครงสร้าง: แตะสามไฟล์นี้เท่านั้น
- src/pages/Home/components/Banner/Banner.tsx (สร้างใหม่)
- src/pages/Home/Home.module.scss (สร้างใหม่)
- src/pages/Home/Home.tsx (เขียนทับ stub ทั้งไฟล์)

ข้อกำหนดทางเทคนิค:
- Banner.tsx: import React, แล้ว { Swiper, SwiperSlide } from "swiper/react",
    แล้ว { Navigation, Pagination, Autoplay } from "swiper/modules",
    แล้วเว้นบรรทัดว่างหนึ่งบรรทัด แล้ว import "swiper/swiper-bundle.css";
    Pagination ตัวนี้คือของ swiper ห้าม import Pagination ของเราจาก shared/components
  ประกาศ const banners ข้างในคอมโพเนนต์ เป็น array สองสมาชิก แต่ละตัวมี
    id (1 และ 2), image ("/images/banners/01.png" และ "/images/banners/02.png")
    และ alt ("Banner 1" และ "Banner 2")
  return div className="banner-container" ครอบ Swiper ที่ตั้ง props ตามนี้พอดี:
    modules={[Navigation, Pagination, Autoplay]}, spaceBetween={30}, slidesPerView={1},
    navigation, pagination={{ clickable: true }},
    autoplay={{ delay: 3000, disableOnInteraction: false }}, loop
  ข้างในวน banners.map render SwiperSlide key={banner.id} ที่มี img src และ alt
  คอมโพเนนต์นี้ไม่รับ prop ใด ๆ และห้ามมี state
- Home.module.scss: ไม่ต้อง @use variables มีห้า class ตามลำดับนี้
    .featureCardBox -> gap: 24px และ nested selector "> div" ที่ตั้ง width: 25%
    .mainDealBox -> width: 42%
    .secondDealBox -> width: 33%
    .thirdDealBox -> width: 25%
    .categoryMenu -> width: 16%
  สามตัวกลางจะยังไม่มีใครใช้ในรอบนี้ นั่นถูกแล้ว รอบถัดไปจะใช้
- Home.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React, { useState } from "react";
    import { faTruck, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
    import { faClock, faCreditCard } from "@fortawesome/free-regular-svg-icons";
    import ClipLoader from "react-spinners/ClipLoader";
    import { useQuery } from "@tanstack/react-query";
    import styles from "./Home.module.scss";
    import Banner from "./components/Banner/Banner";
    import ImageZoom from "@/shared/components/ImageZoom/ImageZoom";
    import CategoryMenu from "@/features/products/components/CategoryMenu/CategoryMenu";
    import ProductsList from "@/features/products/components/ProductsList/ProductsList";
    import FeatureCard from "@/shared/components/FeatureCard/FeatureCard";
    import useProductRoute from "@/shared/hooks/useProductRoute";
    import { productQueries } from "@/features/products/queries";
    import { Category as CategoryType } from "@/features/products/types";
    import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";
  ประกาศ const PRODUCTS_LIST_LIMIT = 12; ไว้นอกคอมโพเนนต์
  ในคอมโพเนนต์ Home: React.FC ตามลำดับนี้
    useState<CategoryType | null>(null) ชื่อ selectedCategory / setSelectedCategory
    const { goToProductDetails } = useProductRoute();
    const { data: categories } = useQuery(productQueries.categories());
    const currentCategory = selectedCategory ?? categories?.[0] ?? null;
    useQuery ที่ spread ...productQueries.byCategory({ category: currentCategory?.slug ?? "",
      limit: PRODUCTS_LIST_LIMIT }) แล้วเติม enabled: currentCategory !== null
      destructure เป็น data: categoryProducts, isLoading: isCategoryProductsLoading,
      isError: isCategoryProductsError
    const onProductClick = (productId: number) => { goToProductDetails(productId); };
  JSX: return fragment ว่าง ครอบ div className="container" ที่มีของเรียงตามนี้
    <Banner />
    section className={`${styles.featureCardBox} pt-35 flex`} มี FeatureCard สี่ใบ
      faTruck / "Free Shipping" / "Free Shipping World Wide"
      faClock / "24 X 7 service" / "Online service for 24 X 7"
      faVolumeHigh / "Festival offer" / "New online special festival offer"
      faCreditCard / "Online payment" / "New online special festival offer"
    section className="pt-65" ที่มี div className="flex gap-25" ครอบ
      CategoryMenu activeCategory={currentCategory?.slug} categories={categories || []}
        onCategoryClick={setSelectedCategory}
      div className="category-list-container category-list-box" ที่ข้างในเป็น
        ternary ซ้อนสองชั้นเรียงตามนี้เท่านั้น: isCategoryProductsError ? <ErrorMessage />
        : isCategoryProductsLoading ? div className="text-center" ครอบ ClipLoader
          ที่มี size={40} aria-label="Loading Spinner" data-testid="loader"
        : <ProductsList products={categoryProducts?.products} onProductClick={onProductClick} />
    section className="pt-60 pb-30" ที่มี ImageZoom src="/images/banners/03.png"
      alt="banner long" className="mb-20 " (สังเกตช่องว่างท้ายค่า ให้คงไว้ตามนี้)
  เว้นบรรทัดว่างหนึ่งบรรทัดคั่นระหว่างแท็กปิด </section> กับแท็กเปิด <section>
    ตัวถัดไปทุกคู่ ส่วนที่อื่นใน JSX ห้ามมีบรรทัดว่าง
    รวมถึงระหว่าง <Banner /> กับ section แรกที่ต้องติดกัน
  ห้ามใช้ useEffect ห้ามเขียน queryKey เอง ห้ามเรียก fetch หรือ axios
  ห้ามใส่ retry, staleTime หรือ gcTime ที่ระดับ useQuery
  ห้ามตัดสาขา error หรือสาขา loading ออกไม่ว่ากรณีใด

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ queries.ts, api.ts, types.ts, CategoryMenu, ProductsList, ProductCard
  หรือคอมโพเนนต์ใด ๆ ใน shared/components
- ห้ามแตะ src/pages/Category, src/pages/Product หรือหน้า stub อื่น
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ยังไม่ต้องทำโซนดีล ไม่ต้องมี CountdownTimer ไม่ต้องมี useMemo
  และไม่ต้องยิง productQueries.list ในรอบนี้