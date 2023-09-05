import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  children?: React.ReactNode
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return createPortal(children, document.querySelector<HTMLDivElement>('#myportal')!)
}

export default Portal
