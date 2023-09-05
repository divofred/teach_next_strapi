import { useEffect, useState } from 'react'

export const WIDTH_MOBILE = 320
export const WIDTH_TABLET = 768
export const WIDTH_DESKTOP = 1025
export const WIDTH_DESKTOP_LIMIT = 1440
const isBrowser = typeof window !== 'undefined'

/** проверка разрешений экрана */
const checkViewport = () => ({
  isDesktop: isBrowser ? window.innerWidth > WIDTH_DESKTOP : false,
  isMobile: isBrowser ? window.innerWidth < WIDTH_TABLET : false,
  isTablet: isBrowser
    ? window.innerWidth < WIDTH_DESKTOP && window.innerWidth >= WIDTH_TABLET
    : false,
})

/** хук получения разрешения экрана */
const useCheckViewport = (): any => {
  /** разрешения экрана */
  const [viewports, setViewports] = useState(checkViewport)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      /** функция обновляющая данные при ресайзе окна */
      const handleWindowResize = () => setViewports(checkViewport)

      window.addEventListener('resize', handleWindowResize)
      window.addEventListener('orientationchange', handleWindowResize)
      window.addEventListener('load', handleWindowResize)
      window.addEventListener('reload', handleWindowResize)

      return () => {
        window.removeEventListener('resize', handleWindowResize)
        window.removeEventListener('orientationchange', handleWindowResize)
        window.removeEventListener('load', handleWindowResize)
        window.removeEventListener('reload', handleWindowResize)
      }
    }
  }, [viewports])

  return viewports
}

export default useCheckViewport
