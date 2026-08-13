import { isRouteErrorResponse, useRouteError } from 'react-router'
import ErrorMessage from '@/shared/components/ErrorMessage/ErrorMessage'

function RouteErrorFallback() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong. Please reload the page.'

  return (
    <div className="container pt-60 pb-60">
      <ErrorMessage message={message} />
    </div>
  )
}

export default RouteErrorFallback
