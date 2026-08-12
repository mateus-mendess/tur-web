import { useEffect, useRef } from 'react'
import { EditIcon } from '#/components/UI/Icons'
import { useDropdown } from '#/hooks/useDropdown'

interface SpotEditMenuProps {
  onEditPhotos: () => void
  onEditInfo: () => void
  onEditAddress: () => void
  onDelete: () => void
}

export function SpotEditMenu({
  onEditPhotos,
  onEditInfo,
  onEditAddress,
  onDelete,
}: SpotEditMenuProps) {
  const editMenu = useDropdown()
  const editMenuRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target as Node)
      ) {
        editMenu.close()
      }
    }
    if (editMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editMenu.isOpen, editMenu])

  return (
    <div className="relative" ref={editMenuRef}>
      <button
        type="button"
        onClick={() => editMenu.toggle()}
        className="p-2.5 rounded-none bg-tur-dark/5 text-tur-dark hover:bg-tur-dark hover:text-white transition-colors cursor-pointer self-start"
        title="Opções de Edição"
      >
        <EditIcon className="w-6 h-6" />
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.1)] py-1.5 z-50 border border-black/5 flex flex-col font-inter transition-all duration-200 ease-out origin-top ${
          editMenu.isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            editMenu.close()
            onEditPhotos()
          }}
          className="block w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer"
        >
          Editar imagens
        </button>
        <button
          onClick={() => {
            editMenu.close()
            onEditInfo()
          }}
          className="block w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer"
        >
          Editar informações
        </button>
        <button
          onClick={() => {
            editMenu.close()
            onEditAddress()
          }}
          className="block w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer"
        >
          Editar localização
        </button>
        <button
          onClick={() => {
            editMenu.close()
            onDelete()
          }}
          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left bg-transparent border-none font-medium cursor-pointer"
        >
          Excluir ponto
        </button>
      </div>
    </div>
  )
}
