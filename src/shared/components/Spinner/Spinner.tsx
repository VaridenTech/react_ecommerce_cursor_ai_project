import { ClipLoader } from 'react-spinners'
import styles from './Spinner.module.scss'

type SpinnerProps = {
  loading?: boolean
  size?: number
  color?: string
}

function Spinner({
  loading = true,
  size = 40,
  color = '#0d6efd',
}: SpinnerProps) {
  return (
    <div className={styles.wrap} role="status">
      <ClipLoader loading={loading} size={size} color={color} />
    </div>
  )
}

export default Spinner
