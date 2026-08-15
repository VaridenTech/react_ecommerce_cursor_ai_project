สร้าง API client กลางของแอปด้วย axios พร้อม error class ของชั้น API

บริบท: @src/shared/api @.env @src/shared/components/ErrorMessage/ErrorMessage.tsx
src/shared/api/ ยังเป็นโฟลเดอร์ว่าง ยังไม่มีไฟล์ไหนในโปรเจกต์ยิง request ออกไปเลย
ติดตั้ง axios ไว้แล้ว
ไฟล์ .env ที่ root มี VITE_API_BASE_URL=https://dummyjson.com อยู่แล้ว
alias @/ ชี้ไปที่ src/ ตั้งค่าไว้แล้วทั้งใน vite.config.ts และ tsconfig.app.json

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/api/client.ts

ข้อกำหนดทางเทคนิค:
- บรรทัด import บนสุดต้องเป็น import axios from "axios"; เท่านั้น
  ห้าม import type อื่นของ axios มาในรอบนี้ เพราะยังไม่มีอะไรใช้มัน
- export class ApiError extends Error
  ประกาศ field readonly status?: number; ไว้บนสุดของ class
  constructor(message: string, status?: number)
  ในตัว constructor เรียก super(message) แล้วตั้ง this.name = "ApiError"
  จากนั้น this.status = status
  ห้ามเพิ่ม field หรือ method อื่นนอกเหนือจากนี้
- export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
  ห้ามใส่ option อื่นใน axios.create เช่น timeout, headers หรือ withCredentials
  ห้ามพิมพ์ URL ของ dummyjson ลงในไฟล์นี้ตรง ๆ
- ห้ามใส่ interceptor ใด ๆ ในรอบนี้ ทั้ง request และ response
- ห้ามมี try/catch ในไฟล์นี้
- ห้ามมี default export ไฟล์นี้ export แบบ named ทั้งหมด

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ .env, vite.config.ts, tsconfig หรือไฟล์อื่นนอกจากที่ระบุ
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ยังไม่ต้องสร้าง type ของสินค้า ฟังก์ชันเรียก API หรือเอา apiClient ไปใช้ในหน้าไหน