สร้างคอมโพเนนต์แสดงผลสี่ตัว: StarReview, FeatureCard, CountdownTimer และ ImageZoom

บริบท: @src/shared/components/Button/Button.tsx @src/shared/components @src/styles
ใช้ Button เป็นแม่แบบของรูปทรงไฟล์เหมือนสองบทที่แล้ว
Font Awesome ครบทั้งห้า package ติดตั้งไว้แล้ว บทนี้ใช้ทั้งชุด free-solid และ free-regular
utility class ทุกตัวที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: flex, flex-center,
fs-14, fs-16, fs-18, fw-light, fw-medium, m-0, mt-0, mb-10, p-20,
pt-15, pb-15, pl-30, pr-30, gap-20
ตัวแปรอยู่ใน src/styles/_variables.scss: $orange01, $grey01, $grey02,
$primary-color, $light-blue
alias @/ ใช้ได้เฉพาะไฟล์ .ts และ .tsx ส่วนไฟล์ .scss ต้องอ้าง path แบบ relative

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/components/StarReview/StarReview.module.scss
- src/shared/components/StarReview/StarReview.tsx
- src/shared/components/FeatureCard/FeatureCard.module.scss
- src/shared/components/FeatureCard/FeatureCard.tsx
- src/shared/components/CountdownTimer/CountdownTimer.module.scss
- src/shared/components/CountdownTimer/CountdownTimer.tsx
- src/shared/components/ImageZoom/ImageZoom.module.scss
- src/shared/components/ImageZoom/ImageZoom.tsx

ข้อกำหนดทางเทคนิค:
- StarReview.module.scss: @use "../../../styles/variables";
  .star -> margin-right: 5px, color: variables.$orange01
- StarReview.tsx: prop เดียวคือ score: number ที่เป็นคะแนนสเกล 0 ถึง 10
  ใส่ comment ท้ายบรรทัดนั้นใน interface ว่า // Score between 0 and 10
    (นี่คือ contract ของคอมโพเนนต์ ซึ่งชื่อ prop บอกแทนไม่ได้ จึงเป็น comment ที่ควรมี)
  import ดาวสองแบบมาตั้งชื่อเล่นแยกกัน:
    faStar as solidStar จาก "@fortawesome/free-solid-svg-icons"
    faStar as regularStar จาก "@fortawesome/free-regular-svg-icons"
  คำนวณ const stars = Math.round(score / 2)
  สร้าง const fiveStars = [...Array(5)] แล้ว map เป็น FontAwesomeIcon ห้าตัว
    key={index}, className={styles.star}
    icon เป็น solidStar เมื่อ index < stars ไม่งั้นเป็น regularStar
  ครอบด้วย div className={`${styles.starReview} flex fs-16`}
- FeatureCard.module.scss: @use "../../../styles/variables";
  .featureCard -> align-items: center, background-color: variables.$grey01, gap: 12px
    nested .icon -> font-size: 32px, color: variables.$primary-color
    nested p -> color: variables.$grey02
- FeatureCard.tsx: props สามตัว icon: IconDefinition (import จาก
    "@fortawesome/free-solid-svg-icons"), title: string, description: string
  โครง: div className={`${styles.featureCard} flex p-20`}
    > div className={styles.icon} ที่มี FontAwesomeIcon icon={icon}
    > div ที่มี h4 className="mt-0 mb-10 fs-18" แสดง title
      และ p className="m-0 fs-14 fw-light" แสดง description
  ห้ามมี state และห้ามมี onClick
- CountdownTimer.module.scss: @use "../../../styles/variables";
  .countdownContainer -> background-color: variables.$light-blue,
    border: 1px dashed variables.$primary-color
- CountdownTimer.tsx: prop เดียวคือ targetDate: string
  useState เก็บ object ที่มีสี่ field เป็น number: days, hours, minutes, seconds
    ค่าเริ่มต้นเป็นศูนย์ทั้งสี่
    ระบุ type ของ state เป็น type literal ในวงเล็บมุมของ useState ตรง ๆ ห้ามประกาศ interface แยก
  ใน useEffect ประกาศฟังก์ชัน calculateTimeLeft ที่:
    หา difference = เวลาเป้าหมาย ลบ เวลาปัจจุบัน (ทั้งคู่ผ่าน getTime())
    ถ้า difference > 0 ให้ setTimeLeft ด้วยค่าที่คำนวณจาก difference:
      days   = Math.floor(difference / (1000 * 60 * 60 * 24))
      hours  = Math.floor((difference / (1000 * 60 * 60)) % 24)
      minutes = Math.floor((difference / (1000 * 60)) % 60)
      seconds = Math.floor((difference / 1000) % 60)
    ถ้าไม่ ให้ setTimeLeft เป็นศูนย์ทั้งสี่ค่า
  แล้วตั้ง const timer = setInterval(calculateTimeLeft, 1000)
  effect ต้อง return () => clearInterval(timer) และมี dependency array เป็น [targetDate]
  return div className={`${styles.countdownContainer} flex flex-center pt-15 pb-15
    pl-30 pr-30 fs-18 gap-20 fw-medium`} ข้างในเป็น span ของทั้งสี่ค่าคั่นด้วย :
  ห้ามเรียก calculateTimeLeft นอก interval และห้ามใช้ setTimeout
- ImageZoom.module.scss: ไม่ต้อง @use variables เพราะไม่ได้ใช้ตัวแปรเลย
  .imageContainer -> overflow: hidden
  .image -> transition: transform 0.5s ease-in-out
    nested &:hover -> transform: scale(1.05)
- ImageZoom.tsx: props สามตัว src: string, alt: string (บังคับ),
    className?: string
  โครง: div className={`${styles.imageContainer} ${className || ""}`}
    > img src alt className={styles.image}
  ห้ามใช้ onMouseEnter, onMouseLeave หรือ state ใด ๆ เอฟเฟกต์ซูมอยู่ใน SCSS ล้วน

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่ (ห้ามเสนอ dayjs, date-fns หรือไลบรารีนับถอยหลัง)
- ห้ามแก้ type ของ prop icon ใน src/shared/components/Button/Button.tsx ให้เหมือน FeatureCard
- ห้ามสร้าง index.ts หรือไฟล์ barrel
- ยังไม่ต้องเอาสี่ตัวนี้ไปใช้ในหน้าไหน