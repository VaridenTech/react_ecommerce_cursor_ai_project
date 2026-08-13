import { useNavigate } from 'react-router'

function useProductRoute() {
  const navigate = useNavigate()

  return {
    goToProductDetails: (id: number) => navigate(`/products/${id}`),
    goToCartSummary: () => navigate('/cart'),
    goToCheckout: () => navigate('/checkout'),
    goToOrderSuccess: () => navigate('/order/success'),
  }
}

export default useProductRoute
