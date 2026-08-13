import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import styles from './Footer.module.scss'

function Footer() {
  return (
    <footer className={`pt-60 pb-60 ${styles.footer}`}>
      <div className="container">
        <div className="flex space-between">
          <div>
            <h2 className="fs-32 fw-bold text-white mb-25">My Store</h2>
            <div className="fs-14 mb-20">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-10" />
              Bangkok Thailand 10150
            </div>
            <div className="fs-14 mb-20">
              <FontAwesomeIcon icon={faPhone} className="mr-10" />
              Call Us: 123-456-7898
            </div>
            <div className="fs-14">
              <FontAwesomeIcon icon={faEnvelope} className="mr-10" />
              Email Us: admin@mystore.com
            </div>
          </div>
          <div>
            <h3 className="fs-24 fw-bold text-white mb-25">Categories</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-10">Beauty</li>
              <li className="mb-10">Fragrances</li>
              <li className="mb-10">Furniture</li>
              <li className="mb-10">Groceries</li>
              <li className="mb-10">Laptops</li>
            </ul>
          </div>
          <div>
            <h3 className="fs-24 fw-bold text-white mb-25">Pages</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-10">Home</li>
              <li className="mb-10">Products</li>
              <li className="mb-10">Cart</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
