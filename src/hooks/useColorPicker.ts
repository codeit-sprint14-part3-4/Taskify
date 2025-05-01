// hooks/useColorPicker.ts
import { useState } from 'react'

const COLORS = [
  { id: 1, color: '#7AC555' },
  { id: 2, color: '#760DDE' },
  { id: 3, color: '#FFA500' },
  { id: 4, color: '#76A5EA' },
  { id: 5, color: '#E876EA' },
] as const

type ColorType = (typeof COLORS)[number]

export const useColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null)

  const handleColorSelect = (color: ColorType) => {
    setSelectedColor(color)
  }

  return {
    selectedColor,
    handleColorSelect,
    COLORS,
  }
}
