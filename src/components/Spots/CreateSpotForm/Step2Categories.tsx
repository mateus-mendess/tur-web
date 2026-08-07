import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { SearchableDropdown } from '#/components/UI/SearchableDropdown'
import { useDropdown } from '#/hooks/useDropdown'
import { useSpotCategories } from './useSpotCategories'
import { useAccessibilityTypes } from '#/hooks/api/useAccessibilityTypes'

interface Step2CategoriesProps {
  onBack: () => void
  onNext: () => void
}

export function Step2Categories({ onBack, onNext }: Step2CategoriesProps) {
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
  const accessMenu = useDropdown()

  const handleCategoryToggle = () => {
    categoryMenu.toggle()
    accessMenu.close()
  }

  const handleAccessToggle = () => {
    accessMenu.toggle()
    categoryMenu.close()
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
                className="flex-1 font-inter text-xs border border-black/30 px-2 py-1 rounded-none outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => { void handleAddCategory() }}
                disabled={isCreatingCategory}
                className="bg-black text-white px-2 py-1 border border-black font-bold hover:bg-tur-accent transition-colors cursor-pointer rounded-none shrink-0 disabled:opacity-50"
              >
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
          <div className="flex flex-wrap gap-1 mt-0.5">
            {categoriasWatch.map((cat) => (
              <span
                key={cat}
                className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
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
                  className="hover:text-tur-accent font-bold cursor-pointer"
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
        <SearchableDropdown
          options={accessibilityTypes.map((a) => a.name)}
          selectedValues={acessibilidadesWatch.map(
            (id) => accessibilityTypes.find((a) => a.id === id)?.name ?? String(id),
          )}
          isOpen={accessMenu.isOpen}
          onToggle={handleAccessToggle}
          onClose={accessMenu.close}
          onSelect={(name) => {
            const type = accessibilityTypes.find((a) => a.name === name)
            if (!type) return
            const next = acessibilidadesWatch.includes(type.id)
              ? acessibilidadesWatch.filter((id) => id !== type.id)
              : [...acessibilidadesWatch, type.id]
            setValue('acessibilidades', next)
          }}
          placeholder="Buscar acessibilidade..."
          triggerContent={
            <span className="truncate">
              {acessibilidadesWatch.length > 0
                ? `${acessibilidadesWatch.length} opção(ões) selecionada(s)`
                : 'Selecionar acessibilidade...'}
            </span>
          }
          triggerClassName="w-full font-inter text-xs px-3.5 py-2.5 rounded-none border border-black/30 bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2"
          popoverWidthClass="w-full"
          emptyMessage="Nenhuma opção encontrada"
        />
        {acessibilidadesWatch.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
              {acessibilidadesWatch.map((id) => {
                const name = accessibilityTypes.find((a) => a.id === id)?.name ?? String(id)
                return (
                  <span
                    key={id}
                    className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setValue(
                          'acessibilidades',
                          acessibilidadesWatch.filter((a) => a !== id),
                        )
                      }}
                      className="hover:text-tur-accent font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )
              })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-6 w-full">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="px-4"
        >
          Voltar
        </Button>
        <Button type="button" onClick={onNext} className="px-8">
          <span>Próximo</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
