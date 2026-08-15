สร้าง type ของสินค้า ฟังก์ชันคำนวณการแบ่งหน้า และฟังก์ชันเรียก API ของ dummyjson

บริบท: @src/shared/api/client.ts @src/shared/types/generic.type.ts @src/features/products @src/shared/utils
src/shared/api/client.ts export apiClient (axios instance ที่ตั้ง baseURL ไว้แล้ว) และ class ApiError
baseURL ชี้ไปที่ https://dummyjson.com แล้ว ทุก path ในงานนี้จึงเขียนแบบสั้น เช่น /products
src/shared/types/generic.type.ts มี interface Pagination ที่มีสามฟิลด์ total, skip, limit
src/features/products/ และ src/shared/utils/ ยังเป็นโฟลเดอร์ว่างทั้งคู่
alias @/ ชี้ไปที่ src/ ตั้งค่าไว้แล้วทั้งใน vite.config.ts และ tsconfig.app.json
โปรเจกต์นี้ไม่ได้เปิด verbatimModuleSyntax ให้ใช้ import แบบธรรมดา ไม่ต้องใช้ import type

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/features/products/types.ts
- src/shared/utils/pagination.utils.ts
- src/features/products/api.ts

ข้อกำหนดทางเทคนิค:
- types.ts: import { Pagination } from "@/shared/types/generic.type";
  แล้ว export interface ตามลำดับนี้ ห้ามเพิ่มหรือลดฟิลด์
  ProductDimensions: width, height, depth ทั้งหมดเป็น number
  ProductReview: rating (number), comment, date, reviewerName, reviewerEmail (string ทั้งสี่)
  ProductMeta: createdAt, updatedAt, barcode, qrCode เป็น string ทั้งหมด
  Product เรียงฟิลด์ตามนี้เป๊ะ:
    id: number, title: string, description: string, category: string, price: number,
    discountPercentage?: number, rating: number, stock: number, tags: string[],
    brand: string, sku: string, weight: number, dimensions: ProductDimensions,
    warrantyInformation: string, shippingInformation: string, availabilityStatus: string,
    reviews: ProductReview[], returnPolicy: string, minimumOrderQuantity: number,
    meta: ProductMeta, images: string[], thumbnail: string
    ฟิลด์เดียวที่เป็น optional คือ discountPercentage นอกนั้นบังคับทั้งหมด
  Category: slug, name, url เป็น string ทั้งสาม
  FetchProductsResponse extends Pagination แล้วเพิ่ม products: Product[]
- pagination.utils.ts: export function สองตัว ไม่มี default export
  calculateOffset(page: number, limit: number): number คืน (page - 1) * limit
  calculateTotalPages(total: number, limit: number): number คืน Math.ceil(total / limit)
- api.ts: บรรทัด import สามบรรทัด ตามลำดับนี้
    import { apiClient } from "@/shared/api/client";
    import { Category, FetchProductsResponse, Product } from "@/features/products/types";
    import { calculateOffset } from "@/shared/utils/pagination.utils";
  export interface ProductListParams { page?: number; limit?: number }
  export interface CategoryProductsParams extends ProductListParams { category: string }
  ทุกฟังก์ชันเป็น async function ที่ประกาศ return type ชัดเจน และจบด้วย return data
  โดย destructure ผลจาก axios ด้วย const { data } = await apiClient.get<T>(...)
  getProducts({ page = 1, limit = 20 }: ProductListParams = {}): Promise<FetchProductsResponse>
    GET /products พร้อม params { skip: calculateOffset(page, limit), limit }
  getProductsByCategory({ category, page = 1, limit = 20 }: CategoryProductsParams): Promise<FetchProductsResponse>
    GET /products/category/${category} พร้อม params ชุดเดียวกับข้างบน
  getCategories(): Promise<Category[]>  GET /products/categories ไม่มี params
  getProduct(id: string | number): Promise<Product>  GET /products/${id} ไม่มี params
  ห้ามใส่ try/catch ห้าม log error และห้ามแปลง error เอง
  ห้ามให้ฟังก์ชันไหนรับพารามิเตอร์ชื่อ skip การแปลง page เป็น skip เกิดขึ้นในไฟล์นี้เท่านั้น

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ src/shared/api/client.ts หรือ src/shared/types/generic.type.ts
- ห้ามสร้าง queries.ts, custom hook หรือ index.ts/ไฟล์ barrel ใด ๆ
- ห้ามสร้าง price.utils.ts หรือ util อื่นที่ไม่ได้สั่ง
- ยังไม่ต้องเอาฟังก์ชันเหล่านี้ไปใช้ในหน้าไหน