สร้างคอมโพเนนต์กลาง Input และ RadioInput โดยทำตามรูปแบบของ Button ที่มีอยู่แล้ว

บริบท: @src/shared/components/Button/Button.tsx @src/shared/components/Button/Button.module.scss @src/shared/components @src/styles
ใช้ Button เป็นแม่แบบของบทนี้: interface ของ props อยู่บนสุดของไฟล์
ประกาศคอมโพเนนต์เป็น React.FC พร้อมค่า default ของ prop ที่ไม่บังคับตอน destructure
ผสม class จาก .module.scss กับ utility class ไว้ใน template literal เดียว
และปิดท้ายไฟล์ด้วย export default
src/shared/components/ ตอนนี้มี ErrorMessage, Header, Footer และ Button
utility class ทุกตัวที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: flex, align-item-start,
inline-block, mb-5, mt-5, mt-3, mr-10, fs-12
ตัวแปรสีอยู่ใน src/styles/_variables.scss: $primary-color, $grey02, $grey04, $red01
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/components/Input/Input.module.scss
- src/shared/components/Input/Input.tsx
- src/shared/components/RadioInput/RadioInput.tsx

ข้อกำหนดทางเทคนิค:
- Input.module.scss: ขึ้นต้นด้วย @use "../../../styles/variables";
  .inputWrapper -> position: relative
  .input -> width: 100%, padding: 12px 15px, border: 1px solid variables.$grey04,
    outline: none, transition: border-color 0.3s
    nested &::placeholder -> color: variables.$grey02
    nested &:focus -> border-color: variables.$primary-color
  .error -> color: variables.$red01
- Input.tsx: interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>
  แล้วเพิ่มสองตัวของเราเอง: label?: string และ error?: string
  ห้ามประกาศ placeholder, type, name, value หรือ onChange เองใน interface
  ห่อคอมโพเนนต์ด้วย forwardRef<HTMLInputElement, InputProps>
  destructure เป็น ({ label, error, ...props }, ref)
  โครงที่ return:
    div className={styles.inputWrapper}
      ถ้ามี label ให้ render label className="mb-5 inline-block" แสดงค่า label
      input ที่มี ref={ref} className={styles.input} และ spread {...props}
      ถ้ามี error ให้ render p className={`${styles.error} fs-12 mt-5`} แสดงค่า error
  ตั้ง Input.displayName = "Input" แล้ว export default Input
- RadioInput.tsx: default export ชื่อ RadioInput ประกาศเป็น React.FC
  props: id: string, name: string, checked: boolean, onChange: () => void,
    label: React.ReactNode (ไม่ใช่ string), className?: string ที่ default เป็น ""
  ห้ามมี state ภายในไฟล์นี้ ค่า checked และ onChange มาจากคนเรียกเท่านั้น
  โครงที่ return:
    div className={`flex align-item-start ${className}`}
      input className="mr-10 mt-3" type="radio" พร้อม id, name, checked, onChange
      label htmlFor={id} แสดงค่า label

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามสร้าง RadioInput.module.scss — ตัวนี้ใช้ utility class ล้วน
  (เป็นข้อยกเว้นของกติกา "หนึ่ง component คู่กับหนึ่ง .module.scss" ในไฟล์ rules)
- ห้ามแก้ไฟล์ในโฟลเดอร์ src/shared/components/Button/
- ห้ามสร้าง index.ts หรือไฟล์ barrel ใด ๆ
- ยังไม่ต้องเอา Input หรือ RadioInput ไปใช้ในหน้าไหน