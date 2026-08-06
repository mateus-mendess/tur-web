import { useState, useMemo, useEffect } from 'react'

export type DropdownVariant = 'default' | 'compact'

export interface SearchableDropdownProps {
  options: readonly string[]
  selectedValues: string[]
  onSelect: (option: string) => void
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  placeholder?: string
  triggerContent: React.ReactNode
  triggerClassName?: string
  popoverWidthClass?: string
  emptyMessage?: string
  variant?: DropdownVariant
  footerContent?: React.ReactNode
}

const variantStyles = {
  default: {
    popover: 'mt-2 p-3 gap-3',
    input: 'p-2',
    searchIcon: 'right-2.5',
    optionButton: 'px-2.5 py-2 gap-2.5',
    optionDot: 'w-2.5 h-2.5',
    emptyText: 'py-2',
  },
  compact: {
    popover: 'mt-1 p-2.5 gap-1.5',
    input: 'p-1.5',
    searchIcon: 'right-2',
    optionButton: 'px-2 py-1 gap-2',
    optionDot: 'w-2 h-2',
    emptyText: 'py-1.5',
  },
}

export function SearchableDropdown({
  options,
  selectedValues,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  placeholder = 'Buscar...',
  triggerContent,
  triggerClassName = '',
  popoverWidthClass = 'w-72',
  emptyMessage = 'Nenhuma opção encontrada',
  variant = 'default',
  footerContent,
}: SearchableDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [options, searchQuery])

  const styles = variantStyles[variant]

  return (
    <div className="relative">
      <button type="button" onClick={onToggle} className={triggerClassName}>
        {triggerContent}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-20" onClick={onClose} />}

      {/* Popover */}
      <div
        className={`absolute left-0 top-full bg-white border border-black shadow-2xl z-30 flex flex-col rounded-none transition-all duration-200 ease-out transform origin-top-left ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } ${popoverWidthClass} ${styles.popover}`}
      >
        {/* Input de Busca */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full font-inter text-xs border border-black/30 pr-7 rounded-none outline-none focus:border-black ${styles.input}`}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`absolute top-1/2 -translate-y-1/2 text-tur-gray-500 pointer-events-none ${styles.searchIcon}`}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Lista de Opções */}
        <div className="max-h-44 overflow-y-auto flex flex-col gap-1 pr-1">
          {filteredOptions.map((opt) => {
            const isSelected = selectedValues.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={`text-left font-inter text-xs transition-colors flex items-center rounded-none hover:bg-black/5 text-tur-dark cursor-pointer ${styles.optionButton}`}
              >
                <span
                  className={`rounded-full transition-all shrink-0 ${styles.optionDot} ${
                    isSelected
                      ? 'bg-tur-accent'
                      : 'border border-black/30 bg-transparent'
                  }`}
                />
                <span
                  className={
                    isSelected
                      ? 'font-semibold text-tur-accent'
                      : 'font-normal text-tur-dark'
                  }
                >
                  {opt}
                </span>
              </button>
            )
          })}

          {filteredOptions.length === 0 && (
            <div
              className={`font-inter text-xs text-tur-gray-500 text-center ${styles.emptyText}`}
            >
              {emptyMessage}
            </div>
          )}
        </div>

        {/* Rodapé customizado opcional */}
        {footerContent}
      </div>
    </div>
  )
}
