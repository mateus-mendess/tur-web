import type { ReactNode } from 'react'

export interface SplitModalLayoutProps {
  leftNumberOrIcon?: ReactNode
  title: string
  description: string
  subDescription?: string
  children: ReactNode
  footer: ReactNode
  leftFooter?: ReactNode
}

export function SplitModalLayout({
  leftNumberOrIcon,
  title,
  description,
  subDescription,
  children,
  footer,
  leftFooter,
}: SplitModalLayoutProps) {
  return (
    <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[600px]">
      {/* COLUNA DA ESQUERDA (INSTRUÇÕES E PASSO A PASSO) */}
      <div className="relative bg-white p-[45px_40px] max-md:p-[32px_24px] flex flex-col justify-between after:content-[''] after:absolute after:right-0 after:top-[10%] after:bottom-[10%] after:w-px after:bg-black/20 max-md:after:hidden">
        <div>
          {/* Grand Step Number OR Icon */}
          {leftNumberOrIcon && (
            <div className="font-dm-sans text-[72px] font-extralight text-tur-gray-400/80 leading-none select-none tracking-tighter mb-4">
              {leftNumberOrIcon}
            </div>
          )}

          <div>
            <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
              {title}
            </h3>
            <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
              {description}
            </p>
            {subDescription && (
              <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                {subDescription}
              </p>
            )}
          </div>
        </div>
        
        {leftFooter && (
          <div className="mt-auto pt-4 flex items-center justify-between h-11">
            {leftFooter}
          </div>
        )}
      </div>

      {/* COLUNA DA DIREITA (FORMULÁRIO) */}
      <div className="relative bg-white p-[45px_40px] max-md:p-[32px_24px] flex flex-col justify-between">
        <div className="absolute top-6 right-8 max-md:hidden">
          <img
            src="/assets/images/selo-img.png"
            alt="Selo postal"
            className="w-[90px] h-auto object-contain drop-shadow-sm opacity-90 grayscale-[0.2]"
          />
        </div>

        <div className="flex flex-col gap-5 flex-1 justify-between mt-[115px] max-md:mt-6">
          <div className="flex-1">
            {children}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between h-11">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}
