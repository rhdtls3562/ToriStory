'use client'

import { useEffect } from 'react'

interface Props {
  theme: string
}

export default function ThemeProvider({ theme }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}
