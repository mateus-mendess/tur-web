import { TrashIcon, SpinnerIcon } from '#/components/UI/Icons'

export type UnifiedItem = 
  | { type: 'existing'; id: string; url: string; name: string; status: string }
  | { type: 'new'; index: number; file: File; status: string; error?: string }

export interface UploadPhotosListProps {
  unifiedItems: UnifiedItem[]
  progressLength: number
  isAnyActionPending: boolean
  deletingPhotoId: string | null
  onDeletePhoto: (id: string) => void
  onRemoveSelectedFile: (index: number) => void
}

export function UploadPhotosList({
  unifiedItems,
  progressLength,
  isAnyActionPending,
  deletingPhotoId,
  onDeletePhoto,
  onRemoveSelectedFile
}: UploadPhotosListProps) {
  if (unifiedItems.length === 0) return null

  return (
    <div className="mt-2 space-y-3">
      <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
        Uploads
      </h4>
      <ul className="space-y-3">
        {unifiedItems.map((item) => {
          const isExisting = item.type === 'existing'
          const file = isExisting ? null : item.file
          const status = isExisting ? 'success' : item.status
          const error = isExisting ? null : item.error
          
          const objectUrl = isExisting ? item.url : (file ? URL.createObjectURL(file) : '')
          const name = isExisting ? item.name : (file ? file.name : '')

          return (
            <li key={isExisting ? item.id : `new-${item.index}`} className="flex flex-col border border-black/10 rounded-sm p-3 bg-white">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-12 h-12 shrink-0 bg-tur-gray-100 border border-black/10 flex items-center justify-center overflow-hidden rounded-sm">
                  <img 
                    src={objectUrl} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                    onLoad={(e) => {
                      if (!isExisting && (e.target as HTMLImageElement).src.startsWith('blob:')) {
                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                      }
                    }} 
                  />
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-tur-dark font-medium truncate">
                    {name}
                  </p>
                  <p className="font-inter text-xs text-tur-gray-500 mt-0.5">
                    {isExisting || !file ? '—' : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>
                </div>
                
                {/* Actions / Status */}
                <div className="shrink-0 pl-2">
                  {isExisting && (
                     <button 
                        type="button" 
                        onClick={() => onDeletePhoto(item.id)} 
                        disabled={isAnyActionPending && deletingPhotoId !== item.id}
                        className="p-2 text-tur-gray-500 hover:text-red-600 transition-colors bg-tur-gray-100 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm cursor-pointer disabled:opacity-50" 
                        aria-label="Excluir foto"
                     >
                        {deletingPhotoId === item.id ? <SpinnerIcon className="w-4 h-4" /> : <TrashIcon className="w-4 h-4" />}
                     </button>
                  )}

                  {!isExisting && status === 'waiting' && progressLength === 0 && (
                     <button type="button" onClick={() => onRemoveSelectedFile(item.index)} className="p-2 text-tur-gray-500 hover:text-red-600 transition-colors bg-tur-gray-100 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm cursor-pointer" aria-label="Remover">
                        <TrashIcon className="w-4 h-4" />
                     </button>
                  )}
                  {!isExisting && status === 'waiting' && progressLength > 0 && (
                    <span className="font-inter text-xs text-tur-gray-500 font-semibold uppercase tracking-wider">Aguardando</span>
                  )}
                  {!isExisting && status === 'success' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                  {!isExisting && status === 'error' && (
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {!isExisting && status === 'uploading' && (
                <div className="w-full h-1 bg-tur-gray-200 mt-4 rounded-full overflow-hidden">
                   <div className="h-full bg-tur-accent animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
                </div>
              )}
              
              {/* Error Message */}
              {!isExisting && error && (
                <p className="font-inter text-xs text-red-600 mt-3 border-t border-red-100 pt-2">
                  <strong className="font-semibold">Erro:</strong> {error}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
