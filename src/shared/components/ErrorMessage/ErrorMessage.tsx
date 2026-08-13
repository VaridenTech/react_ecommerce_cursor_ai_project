type ErrorMessageProps = {
  message?: string
}

function ErrorMessage({
  message = 'Something went wrong. Please try again.',
}: ErrorMessageProps) {
  return (
    <div role="alert" className="text-center pt-30 pb-30">
      <p className="fs-18 text-muted">{message}</p>
    </div>
  )
}

export default ErrorMessage
