import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { Label } from '#/components/UI/Label'
import { SearchableDropdown } from '#/components/UI/SearchableDropdown'
import { useDropdown } from '#/hooks/useDropdown'
import { useSpotCategories } from './useSpotCategories'
import { useAccessibilityTypes } from '#/hooks/api/useAccessibilityTypes'

export function Step2Categories() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SpotFormData>()

  const {
    categoriesOptions,
    categoriasWatch,
    getCategoryName,
    getCategoryIdByName,
    newCategoryInput,
    setNewCategoryInput,
    handleAddCategory,
    isCategoriesLoading,
    isCreatingCategory,
  } = useSpotCategories()

  const { data: accessibilityTypes = [] } = useAccessibilityTypes()
  const acessibilidadesWatch = watch('acessibilidades') // number[]

  const categoryMenu = useDropdown()

  const handleCategoryToggle = () => {
    categoryMenu.toggle()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label required>Categoria(s)</Label>
        <SearchableDropdown
          options={isCategoriesLoading ? ['Carregando...'] : categoriesOptions}
          selectedValues={categoriasWatch.map((uuid) => getCategoryName(uuid))}
          isOpen={categoryMenu.isOpen}
          onToggle={handleCategoryToggle}
          onClose={categoryMenu.close}
          onSelect={(name) => {
            const id = getCategoryIdByName(name)
            if (!id) return
            const next = categoriasWatch.includes(id)
              ? categoriasWatch.filter((c) => c !== id)
              : [...categoriasWatch, id]
            setValue('categorias', next, { shouldValidate: true })
          }}
          placeholder="Buscar categoria..."
          triggerContent={
            <span className="truncate">
              {categoriasWatch.length > 0
                ? `${categoriasWatch.length} categoria(s) selecionada(s)`
                : 'Selecionar categorias...'}
            </span>
          }
          triggerClassName={`w-full font-inter text-xs px-3.5 py-2.5 rounded-none border bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2 ${errors.categorias ? 'border-tur-red' : 'border-black/30'}`}
          popoverWidthClass="w-full"
          emptyMessage="Nenhuma categoria encontrada"
          footerContent={
            <div className="border-t border-black/10 pt-2 flex items-center gap-1.5 mt-0.5">
              <input
                type="text"
                placeholder="Nova categoria..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                className="flex-1 font-inter text-xs border border-black/30 px-2 h-[30px] rounded-none outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => { void handleAddCategory() }}
                disabled={isCreatingCategory}
                className="bg-black text-white w-[40px] h-[30px] border border-black hover:bg-tur-accent transition-colors cursor-pointer rounded-none shrink-0 flex items-center justify-center disabled:opacity-50"
              >
                {isCreatingCategory ? (
                   <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>
            </div>
          }
        />
        {errors.categorias && (
          <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
            {errors.categorias.message}
          </span>
        )}
        {categoriasWatch.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            {categoriasWatch
              .filter((cat) => {
                const name = getCategoryName(cat);
                return name && name.trim() !== '' && name !== cat;
              })
              .map((cat) => (
              <span
                key={cat}
                className="font-sans text-xs bg-surface border border-black/10 text-primary px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-sm"
              >
                <span>{getCategoryName(cat)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setValue(
                      'categorias',
                      categoriasWatch.filter((c) => c !== cat),
                      { shouldValidate: true },
                    )
                  }}
                  className="hover:text-tur-red opacity-60 hover:opacity-100 cursor-pointer font-bold transition-all"
                  aria-label={`Remover ${getCategoryName(cat)}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-4">
        <Label>Acessibilidade</Label>
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 mt-2">
          {accessibilityTypes.map((type) => {
            const isSelected = acessibilidadesWatch.includes(type.id)
            return (
              <label
                key={type.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-black/30 group-hover:border-black/60 bg-transparent'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-surface"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-sans text-xs text-primary leading-tight select-none">
                  {type.name}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => {
                    const next = isSelected
                      ? acessibilidadesWatch.filter((id) => id !== type.id)
                      : [...acessibilidadesWatch, type.id]
                    setValue('acessibilidades', next)
                  }}
                />
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
