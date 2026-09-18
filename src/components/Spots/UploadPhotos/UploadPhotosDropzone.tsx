import type { RefObject } from 'react'

export interface UploadPhotosDropzoneProps {
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
  onFileSelect: (files: File[]) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  isDisabled: boolean
  currentPhotoCount: number
}

export function UploadPhotosDropzone({
  onDragOver,
  onDrop,
  onClick,
  onFileSelect,
  fileInputRef,
  isDisabled,
  currentPhotoCount
}: UploadPhotosDropzoneProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
          Adicionar Novas Fotos
        </h4>
        <span className="text-tur-gray-700 font-inter text-xs font-medium">
          Atuais: {currentPhotoCount}/4
        </span>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        className={`mt-2 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8 transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed border-black/20 bg-black/5' : 'border-black/30 bg-transparent hover:bg-black/5 hover:border-black/50 cursor-pointer'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tur-dark mb-4">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="font-sans text-sm text-tur-dark font-medium mb-1 text-center">
          Solte seus arquivos aqui ou clique para buscar
        </p>
        <p className="font-inter text-xs text-tur-gray-500 text-center">
          Tamanho máximo por arquivo: 2 MB
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => onFileSelect(Array.from(e.target.files || []))}
        className="hidden"
      />
    </div>
  )
}
