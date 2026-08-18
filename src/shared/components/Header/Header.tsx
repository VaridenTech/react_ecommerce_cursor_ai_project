import { Link } from 'react-router'
import CartSummary from '@/features/cart/components/CartSummary/CartSummary'
import useProductRoute from '@/shared/hooks/useProductRoute'

function Header() {
  const { goToCartSummary } = useProductRoute()

  return (
    <header className="pt-25 pb-25">
      <div className="container">
        <div className="flex space-between align-item-center">
          <Link to="/" className="nav-link fw-bold fs-24">
            My Store
          </Link>
          <nav>
            <ul className="flex gap-20 m-0 p-0 list-none">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="nav-link">
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <CartSummary onIconClick={goToCartSummary} />
        </div>
      </div>
    </header>
  )
}

export default Header
