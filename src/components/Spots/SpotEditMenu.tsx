import { useEffect, useRef } from 'react'
import { EditIcon, MapPinIcon, ImageIcon, TrashIcon } from '#/components/UI/Icons'
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
        className="group flex items-center gap-3 text-lg font-normal text-black/80 hover:text-secondary transition-colors cursor-pointer bg-transparent border-none p-0"
        title="Opções de Edição"
      >
        <EditIcon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
        <span className="text-black group-hover:text-secondary transition-colors">Editar</span>
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
          className="w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Editar imagens
        </button>
        <button
          onClick={() => {
            editMenu.close()
            onEditInfo()
          }}
          className="w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer flex items-center gap-2"
        >
          <EditIcon className="w-4 h-4" />
          Editar informações
        </button>
        <button
          onClick={() => {
            editMenu.close()
            onEditAddress()
          }}
          className="w-full px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left bg-transparent border-none font-medium cursor-pointer flex items-center gap-2"
        >
          <MapPinIcon className="w-4 h-4" />
          Editar localização
        </button>
        <hr className="my-1 border-black/5" />
        <button
          onClick={() => {
            editMenu.close()
            onDelete()
          }}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left bg-transparent border-none font-medium cursor-pointer flex items-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Excluir ponto
        </button>
      </div>
    </div>
  )
}
