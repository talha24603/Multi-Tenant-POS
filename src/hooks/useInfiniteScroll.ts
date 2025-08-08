import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  ref: React.RefObject<HTMLDivElement | null>
  isIntersecting: boolean
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    console.log('Intersection observer triggered:', entry.isIntersecting, 'isLoading:', isLoading)
    setIsIntersecting(entry.isIntersecting)
  }, [isLoading])

  useEffect(() => {
    if (!enabled || !ref.current) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [handleIntersection, threshold, rootMargin, enabled])

  return { ref, isIntersecting, isLoading, setIsLoading }
} 