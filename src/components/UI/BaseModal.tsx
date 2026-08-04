import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidthClass?: string
  ariaLabel?: string
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'max-w-[920px]',
  ariaLabel = 'Modal dialog',
}: BaseModalProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          onClose()
        }
      }}
    >
      <Dialog.Portal>
        {/* Overlay controlado via css para manter animações originais (in e out) */}
        <Dialog.Overlay className="fixed inset-0 bg-black/65 z-[1000] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 pointer-events-none">
          <Dialog.Content
            aria-label={ariaLabel}
            className={`pointer-events-auto relative w-full ${maxWidthClass} data-[state=open]:animate-scale-up data-[state=closed]:animate-scale-down outline-none`}
            onClick={(e) => e.stopPropagation()}
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
              }
            }}
          >
            {/* Close Button padronizado para todos os modais */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute -right-12 top-0 max-md:right-4 max-md:top-4 bg-transparent border-none p-0 flex items-center justify-center cursor-pointer text-white hover:text-tur-accent max-md:text-tur-dark transition-colors duration-200 z-10"
                aria-label="Fechar modal"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </Dialog.Close>

            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
