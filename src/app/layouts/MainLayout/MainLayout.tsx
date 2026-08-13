import { Outlet } from 'react-router'
import Header from '@/shared/components/Header/Header'
import Footer from '@/shared/components/Footer/Footer'
import styles from './MainLayout.module.scss'

function MainLayout() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
