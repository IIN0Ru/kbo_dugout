import { useEffect, useRef } from 'react'

// 절제형 모션: 내용은 처음부터 보이고, 화면에 들어올 때 한 번만 살짝 떠오른다.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
