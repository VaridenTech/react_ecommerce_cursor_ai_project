ต่อ queryOptions ของสินค้าลงในไฟล์ queries.ts ที่มี productKeys อยู่แล้ว และต่อสาย ESLint plugin ของ TanStack Query

บริบท: @src/features/products/queries.ts @src/features/products/api.ts @src/app/queryClient.ts @eslint.config.js
src/features/products/queries.ts มี productKeys ที่เขียนเสร็จและ commit แล้ว ใช้เป็นแหล่งเดียวของ query key
src/features/products/api.ts export ฟังก์ชัน getProducts, getProductsByCategory, getCategories, getProduct
และ export interface ProductListParams, CategoryProductsParams
ติดตั้ง @tanstack/react-query 5 ไว้แล้วตั้งแต่บทเรียน 11 และ QueryClientProvider ครอบแอปอยู่แล้ว
src/app/queryClient.ts ตั้ง default ไว้ที่ staleTime: 60 * 1000 และ retry: 1
ติดตั้ง @tanstack/eslint-plugin-query เป็น devDependency ไว้แล้ว ยังไม่ได้ต่อเข้า config
eslint.config.js เป็น flat config ที่เขียนเองตั้งแต่บทเรียน 03

โครงสร้าง: แก้สองไฟล์นี้เท่านั้น ไม่สร้างไฟล์ใหม่แม้แต่ไฟล์เดียว
- src/features/products/queries.ts (เพิ่มของต่อท้าย ห้ามแก้ productKeys)
- eslint.config.js (เพิ่มสองบรรทัด)

ข้อกำหนดทางเทคนิค:
- queries.ts: เพิ่ม import { keepPreviousData, queryOptions } from "@tanstack/react-query";
  ไว้เป็นบรรทัดแรกสุดของไฟล์ เหนือ import เดิมจาก "./api"
- ขยาย import เดิมจาก "./api" ให้มีหกชื่อ เรียงตามลำดับนี้พอดี:
  CategoryProductsParams, ProductListParams, getCategories, getProduct,
  getProducts, getProductsByCategory
- ต่อท้ายไฟล์ด้วย export const productQueries = { ... } ที่มีสี่จานตามลำดับนี้
  ทุกจานคืนผลของ queryOptions({ ... }) และหยิบ queryKey จาก productKeys เท่านั้น
  list: (params: ProductListParams = {}) -> queryKey: productKeys.list(params),
    queryFn: () => getProducts(params)
  byCategory: (params: CategoryProductsParams) -> queryKey: productKeys.byCategory(params),
    queryFn: () => getProductsByCategory(params),
    placeholderData: keepPreviousData
  categories: () -> queryKey: productKeys.categories(),
    queryFn: getCategories (ส่งฟังก์ชันตรง ๆ ไม่ต้องห่อ arrow function),
    staleTime: 5 * 60 * 1000
  detail: (id: string | number) -> queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id)
  ห้ามใส่ option อื่นนอกจากที่ระบุ เช่น retry, gcTime, refetchOnWindowFocus หรือ enabled
  ห้ามเขียน queryKey เป็น array สด ๆ ต้องเรียกผ่าน productKeys ทุกจุด
  ห้ามเรียก useQuery ในไฟล์นี้ และห้ามสร้าง custom hook เช่น useProducts
- eslint.config.js: เพิ่ม import pluginQuery from "@tanstack/eslint-plugin-query";
  ไว้ต่อจากบรรทัด import importX และก่อนบรรทัด import prettierConfig
  แล้วเพิ่ม ...pluginQuery.configs["flat/recommended"] เป็นสมาชิกตัวที่สามของ extends
  ต่อจาก ...tseslint.configs.recommended
  ห้ามแก้บรรทัดอื่นในไฟล์นี้ ทั้ง ignores, files, languageOptions, plugins และ rules

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ productKeys แม้แต่ตัวอักษรเดียว
- ห้ามแก้ api.ts, types.ts, queryClient.ts, providers.tsx หรือหน้าเพจใด ๆ
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ยังไม่ต้องเอา productQueries ไปใช้ในหน้าไหน