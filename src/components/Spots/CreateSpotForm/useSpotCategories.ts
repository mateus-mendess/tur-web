import { useState, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { SPOT_CATEGORIES } from '#/constants/spots'

export function useSpotCategories() {
  const { watch, setValue } = useFormContext<SpotFormData>()
  const categoriasWatch = watch('categorias')
  
  const [categoriesOptions, setCategoriesOptions] = useState<string[]>([...SPOT_CATEGORIES])
  const [newCategoryInput, setNewCategoryInput] = useState('')

  const handleAddCategory = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return

    if (!categoriesOptions.includes(trimmed)) {
      setCategoriesOptions((prev) => [...prev, trimmed])
    }
    if (!categoriasWatch.includes(trimmed)) {
      setValue('categorias', [...categoriasWatch, trimmed], {
        shouldValidate: true,
      })
    }
    setNewCategoryInput('')
  }, [categoriesOptions, categoriasWatch, newCategoryInput, setValue])

  return {
    categoriesOptions,
    categoriasWatch,
    newCategoryInput,
    setNewCategoryInput,
    handleAddCategory
  }
}
