import { useEffect, useState } from 'react'

const usePath = () => {
  const [path, setPath] = useState(window.location.pathname)

  const updatePath = () => {
    setPath(window.location.pathname)
  }

  useEffect(() => {
    window.addEventListener('popstate', updatePath)
    return () => {
      window.removeEventListener('popstate', updatePath)
    }
  }, [])

  return path
}

export default usePath
