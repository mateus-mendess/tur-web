import { Button } from '#/components/UI/Button'
import { OtpInput } from '#/components/UI/OtpInput'

interface SignUpVerificationViewProps {
  onVerifyOtp: (e: React.FormEvent) => Promise<void>
  otpValue: string
  setOtpValue: (v: string) => void
  registeredEmail: string
  buttonStatus: 'idle' | 'loading' | 'success' | 'error'
}

export function SignUpVerificationView({
  onVerifyOtp,
  otpValue,
  setOtpValue,
  registeredEmail,
  buttonStatus
}: SignUpVerificationViewProps) {
  return (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="verification-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Verifique seu e-mail
        </h2>
      </div>

      <form
        onSubmit={onVerifyOtp}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        <div className="flex flex-col gap-6 text-center pt-4">
          
          <div>
            <h4 className="font-sans text-xl font-semibold text-primary mb-2">
              Quase lá!
            </h4>
            <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
              Enviamos um código de 6 dígitos para o e-mail<br />
              <span className="font-semibold text-primary">{registeredEmail}</span>
            </p>
          </div>

          <div className="py-4 w-full flex justify-center">
             <OtpInput 
                length={6} 
                value={otpValue} 
                onChange={setOtpValue} 
                disabled={buttonStatus === 'loading' || buttonStatus === 'success'}
             />
          </div>

          <p className="font-sans text-sm text-black/60">
            Não recebeu o e-mail?{' '}
            <button 
               type="button" 
               className="font-semibold text-primary underline underline-offset-[3px] hover:text-black"
               onClick={() => {
                 setOtpValue('')
                 // Add re-send mock if needed
               }}
            >
              Reenviar código
            </button>
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-auto pb-4">
          <Button
            type="submit"
            disabled={otpValue.length < 6}
            className="w-[180px] transition-all duration-300"
            isLoading={buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Verificar e Entrar
          </Button>
        </div>
      </form>
    </>
  )
}
