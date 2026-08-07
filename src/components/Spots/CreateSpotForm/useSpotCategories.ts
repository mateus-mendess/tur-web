import { useState, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { useCategories } from '#/hooks/api/useCategories'
import { useCreateCategory } from '#/hooks/api/useCreateCategory'

/**
 * Hook que gerencia a lógica de categorias no formulário de criação de ponto.
 *
 * - Lista categorias via GET /categories (useCategories)
 * - Cria nova categoria via POST /categories antes de adicioná-la ao form (useCreateCategory)
 * - O form armazena UUIDs (categorias[]); exibição usa o nome do mapa id→name
 */
export function useSpotCategories() {
  const { watch, setValue } = useFormContext<SpotFormData>()
  const categoriasWatch = watch('categorias') // string[] de UUIDs

  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useCategories()
  const createCategoryMutation = useCreateCategory()

  const [newCategoryInput, setNewCategoryInput] = useState('')

  /**
   * Opções para o SearchableDropdown — cada item tem value (UUID) e label (nome).
   */
  const categoriesOptions = categoriesData.map((c) => c.name)

  /**
   * Mapa de UUID → nome para exibição nos badges de categorias selecionadas.
   */
  const categoryNameMap = new Map(categoriesData.map((c) => [c.id, c.name]))

  /**
   * Resolve o nome de exibição de uma categoria pelo UUID.
   * Retorna o UUID como fallback se o nome não for encontrado.
   */
  const getCategoryName = useCallback(
    (id: string) => categoryNameMap.get(id) ?? id,
    [categoriesData],
  )

  /**
   * Encontra o UUID de uma categoria pelo nome (para toggle no dropdown).
   */
  const getCategoryIdByName = useCallback(
    (name: string) => categoriesData.find((c) => c.name === name)?.id,
    [categoriesData],
  )

  /**
   * Cria uma nova categoria via POST /categories e adiciona seu UUID ao form.
   * Aguarda o UUID retornado pelo backend antes de incluir em categoriesIds.
   */
  const handleAddCategory = useCallback(async () => {
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return

    try {
      const newCategory = await createCategoryMutation.mutateAsync(trimmed)
      // Adiciona o UUID retornado pelo backend ao form
      if (!categoriasWatch.includes(newCategory.id)) {
        setValue('categorias', [...categoriasWatch, newCategory.id], {
          shouldValidate: true,
        })
      }
      setNewCategoryInput('')
    } catch {
      // Erro já tratado via toast no useCreateCategory
    }
  }, [newCategoryInput, categoriasWatch, setValue, createCategoryMutation])

  return {
    categoriesOptions,
    categoriesData,
    categoriasWatch,
    getCategoryName,
    getCategoryIdByName,
    newCategoryInput,
    setNewCategoryInput,
    handleAddCategory,
    isCategoriesLoading,
    isCreatingCategory: createCategoryMutation.isPending,
  }
}
