ประกอบหน้า Category: เมนูหมวดหมู่ รายการสินค้า และแถบแบ่งหน้า

บริบท: @src/pages/Category/Category.tsx @src/pages/Home/Home.tsx @src/features/products/queries.ts @src/features/products/types.ts @src/features/products/components @src/shared/components/Pagination/Pagination.tsx @src/shared/utils/pagination.utils.ts @src/shared/hooks/useProductRoute.tsx
src/pages/Category/Category.tsx ตอนนี้เป็น stub ที่ return h1 อย่างเดียว ให้เขียนทับทั้งไฟล์
src/pages/Home/Home.tsx เป็นหน้าที่เสร็จแล้ว ใช้เป็นแม่แบบของสไตล์การเขียนได้
  ทั้งลำดับ import การ destructure useQuery และ ternary error/loading/data
  แต่ห้ามลอกวิธีส่ง onCategoryClick ของหน้า Home มาใช้ที่นี่ (ดูข้อกำหนดข้างล่าง)
src/features/products/queries.ts export productQueries
  byCategory รับ { category, page?, limit? } และตั้ง placeholderData ไว้แล้วในตัวมันเอง
  categories() ไม่รับพารามิเตอร์
src/features/products/types.ts export interface Category ที่มี slug, name, url
src/shared/components/Pagination/Pagination.tsx เป็น default export รับสาม props
  ที่นับหน้าจากหนึ่งทั้งหมด: currentPage: number, totalPages: number,
  onPageChange: (page: number) => void
src/shared/utils/pagination.utils.ts export calculateTotalPages(total, limit) ที่ปัดขึ้นให้แล้ว
src/shared/hooks/useProductRoute.tsx เป็น default export คืน object ที่มี goToProductDetails(id: number)
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: container, flex, gap-25,
  text-center, bg-grey01, fs-32, pt-30, pb-30, pt-60, pb-60, mb-30,
  category-list-container, category-list-box
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx

โครงสร้าง: สร้างและแก้ไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/pages/Category/components/CategoryBanner/CategoryBanner.tsx (สร้างใหม่)
- src/pages/Category/Category.tsx (เขียนทับ stub ทั้งไฟล์)
ทั้งสองไฟล์ต้องไม่มีไฟล์ .module.scss คู่กัน

ข้อกำหนดทางเทคนิค:
- CategoryBanner.tsx: import React ตัวเดียว
  interface CategoryBannerProps มี field เดียวคือ name?: string | null
  return div className="bg-grey01 pt-30 pb-30" ครอบ
    h2 className="fs-32 text-center" ที่แสดง name ถ้ามี ไม่งั้นแสดงข้อความ Category
    เขียนเงื่อนไขเป็น ternary ว่า name ? name : "Category"
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย
  ห้าม import Category จาก types และห้ามมี state
- Category.tsx: บรรทัด import เรียงตามลำดับนี้พอดี
    import React, { useState } from "react";
    import ClipLoader from "react-spinners/ClipLoader";
    import { useQuery } from "@tanstack/react-query";
    import CategoryBanner from "./components/CategoryBanner/CategoryBanner";
    import CategoryMenu from "@/features/products/components/CategoryMenu/CategoryMenu";
    import ProductsList from "@/features/products/components/ProductsList/ProductsList";
    import Pagination from "@/shared/components/Pagination/Pagination";
    import { calculateTotalPages } from "@/shared/utils/pagination.utils";
    import useProductRoute from "@/shared/hooks/useProductRoute";
    import { productQueries } from "@/features/products/queries";
    import { Category as CategoryType } from "@/features/products/types";
    import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";
  ประกาศ const PAGE_LIMIT = 20; ไว้นอกคอมโพเนนต์
  ในคอมโพเนนต์ Category: React.FC เรียงตามลำดับนี้
    useState<CategoryType | null>(null) ชื่อ selectedCategory / setSelectedCategory
    useState(1) ชื่อ page / setPage
    const { goToProductDetails } = useProductRoute();
    const { data: categories } = useQuery(productQueries.categories());
    const currentCategory = selectedCategory ?? categories?.[0] ?? null;
    useQuery ที่ spread ...productQueries.byCategory({ category: currentCategory?.slug ?? "",
      page, limit: PAGE_LIMIT }) แล้วเติม enabled: currentCategory !== null
      destructure เป็น { data, isLoading, isError } ชื่อธรรมดา ไม่ต้อง rename
    const totalPages = data ? calculateTotalPages(data.total, PAGE_LIMIT) : 0;
    const onCategoryClick = (category: CategoryType) => { ... } ที่ทำสองอย่างตามลำดับ:
      setSelectedCategory(category); แล้ว setPage(1);
    const onProductClick = (productId: number) => { goToProductDetails(productId); };
  JSX: return fragment ว่าง ที่มีของสองชิ้นเรียงกัน
    <CategoryBanner name={currentCategory?.name} />
    div className="container pt-60 pb-60" ครอบ section ครอบ div className="flex gap-25" ที่มี
      CategoryMenu activeCategory={currentCategory?.slug} categories={categories || []}
        onCategoryClick={onCategoryClick}
      div className="category-list-container" ที่ข้างในเป็น ternary ซ้อนสองชั้น
        เรียงตามนี้เท่านั้น: isError ? <ErrorMessage />
        : isLoading ? div className="text-center" ครอบ ClipLoader
          ที่มี size={40} aria-label="Loading Spinner" data-testid="loader"
        : fragment ว่างที่มีสองชิ้น
            div className="category-list-box mb-30" ครอบ ProductsList
              products={data?.products} onProductClick={onProductClick}
            {totalPages > 0 && ...} ครอบ Pagination currentPage={page}
              totalPages={totalPages} onPageChange={setPage}
  JSX ของไฟล์นี้ห้ามมีบรรทัดว่างคั่นเลย ส่วนนอก JSX ให้เว้นบรรทัดว่างหนึ่งบรรทัด
    หลังแต่ละกลุ่มนี้: หลังบรรทัด useProductRoute, หลัง currentCategory,
    หลัง useQuery ก้อนที่สอง, หลัง totalPages, หลัง onCategoryClick
    และหลัง onProductClick (คือบรรทัดก่อน return)
  เก็บ page ไว้ใน useState เท่านั้น ห้ามใช้ useSearchParams ห้ามแตะ URL
    และห้ามซิงก์ page หรือหมวดที่เลือกเข้ากับ query string
  ห้ามเก็บ totalPages ลง useState ต้องคำนวณสดทุก render
  ห้ามใช้ useEffect ห้ามเขียน queryKey เอง ห้ามเรียก fetch หรือ axios
  ห้ามตัดสาขา error หรือสาขา loading ออก

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ queries.ts, api.ts, types.ts, pagination.utils.ts
- ห้ามแก้ CategoryMenu, ProductsList, ProductCard, Pagination หรือ Home.tsx
- ห้ามแก้ router.tsx หรือ Header
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ห้ามสร้าง Category.module.scss หรือ CategoryBanner.module.scss