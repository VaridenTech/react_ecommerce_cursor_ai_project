สร้างคอมโพเนนต์กลาง Modal และ Pagination โดยห่อไลบรารี react-modal และ react-paginate

บริบท: @src/shared/components/Button/Button.tsx @src/shared/components @src/styles
ใช้ Button เป็นแม่แบบของรูปทรงไฟล์เหมือนบทที่แล้ว
ติดตั้ง react-modal, react-paginate และ @types/react-modal (ตัวหลังเป็น devDependency) ไว้แล้ว
vite.config.ts เปิด legacy.inconsistentCjsInterop ไว้แล้ว ทั้งสองไลบรารีจึง default import ได้ตามปกติ
Font Awesome ครบทั้งห้า package ติดตั้งไว้ตั้งแต่บทที่ทำ Header/Footer
utility class ที่งานนี้ใช้มีอยู่จริงใน src/styles/ แล้ว: flex, gap-10, fs-20

โครงสร้าง: สร้างไฟล์ตามนี้ ไม่มากไม่น้อยกว่านี้
- src/shared/components/Modal/Modal.module.scss
- src/shared/components/Modal/Modal.tsx
- src/shared/components/Pagination/Pagination.module.scss
- src/shared/components/Pagination/Pagination.tsx

ข้อกำหนดทางเทคนิค:
- Modal.module.scss: มี class เดียวชื่อ .closeButton
  position: absolute, top: 5px, right: 5px, background: none, border: none, cursor: pointer
  ไฟล์นี้ไม่ต้อง @use variables เพราะไม่ได้ใช้ตัวแปรสีเลย
- Modal.tsx: import ตัวไลบรารีเป็นชื่อ ReactModal จาก "react-modal"
  ประกาศ object ชื่อ customStyles ที่ระดับ module (นอกคอมโพเนนต์) มีแค่ key content:
    top: "50%", left: "50%", right: "auto", bottom: "auto",
    transform: "translate(-50%, -50%)"
  interface ModalProps: isOpen: boolean, onRequestClose: () => void,
    children: React.ReactNode
  default export ชื่อ Modal เป็น React.FC ที่ return ReactModal พร้อม prop
    isOpen, onRequestClose, style={customStyles} และ ariaHideApp={false}
  ห้ามเรียก ReactModal.setAppElement ในไฟล์นี้ โปรเจกต์นี้เลือกปิด ariaHideApp แทน
  ข้างใน ReactModal มีสองอย่างเรียงตามนี้:
    1) button onClick={onRequestClose} className={styles.closeButton}
       aria-label="Close Modal" ข้างในเป็น FontAwesomeIcon icon={faTimes} className="fs-20"
       โดย import faTimes จาก "@fortawesome/free-solid-svg-icons"
    2) div ที่ครอบ {children}
  ห้ามมี state ภายใน ทั้ง isOpen และ onRequestClose มาจากคนเรียกเท่านั้น
- Pagination.module.scss: เขียนเป็น selector ลูกใต้ .pagination ทั้งหมด
  .pagination -> display: flex, justify-content: center, list-style: none, padding: 0
  .pagination li -> margin: 0 5px
  .pagination li a -> padding: 8px 12px, border: 1px solid #ddd, border-radius: 4px,
    text-decoration: none, cursor: pointer
  .pagination li.active a -> background-color: #007bff, color: white, border-color: #007bff
  .pagination li.previous a และ .pagination li.next a -> font-weight: bold
  .pagination li.disabled a -> color: #ccc, cursor: not-allowed
  ใช้ค่าสีตามนี้ตรง ๆ ไม่ต้องแทนด้วยตัวแปรจาก _variables.scss
- Pagination.tsx: ห้ามเขียนตรรกะแบ่งหน้าเอง ต้อง render ReactPaginate จาก "react-paginate"
    เท่านั้น ห้ามมี map, ห้ามมี Array.from, ห้ามสร้างปุ่มเลขหน้าเอง
  interface PaginationProps มีสามตัว: currentPage: number, totalPages: number,
    onPageChange: (page: number) => void — ทั้งหมดนับหน้าจากหนึ่ง
  ส่งให้ ReactPaginate ตามนี้:
    previousLabel={"Previous"} nextLabel={"Next"} breakLabel={"..."}
    pageCount={totalPages}
    forcePage={currentPage - 1}
    pageRangeDisplayed={5}
    onPageChange={(data) => onPageChange(data.selected + 1)}
    containerClassName={`${styles.pagination} flex gap-10`}
    activeClassName={styles.active}
    previousClassName={styles.previous}
    nextClassName={styles.next}
    disabledClassName={styles.disabled}
  ใส่ comment สั้น ๆ ได้สองจุดเท่านั้น: ตรง forcePage และตรง onPageChange
    เพื่อบอกว่าไลบรารีนับหน้าจากศูนย์ ห้ามใส่ comment ที่อื่น

ขอบเขต:
- ห้ามติดตั้ง dependency ใหม่
- ห้ามแก้ vite.config.ts, package.json หรือไฟล์ใด ๆ นอกสี่ไฟล์ข้างบน
- ห้ามสร้าง index.ts หรือไฟล์ barrel
- ยังไม่ต้องเอา Modal หรือ Pagination ไปใช้ในหน้าไหน และยังไม่ต้องเขียนฟังก์ชันคำนวณ
  จำนวนหน้า (จะทำในบทของ pagination utils)