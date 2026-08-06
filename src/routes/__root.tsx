import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'

import appCss from '#/styles.css?url'
import { queryClient } from '#/lib/queryClient'
import { AuthProvider, useAuth } from '#/contexts/AuthContext'
import { LoginModal } from '#/components/Auth/LoginModal'
import { SignUpModal } from '#/components/Auth/SignUpModal'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tur. | Descubra o Brasil',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function AppModals() {
  const { isLoginOpen, isSignUpOpen, closeModals, handleLogin, handleSignUp, openLogin, openSignUp } = useAuth()
  
  return (
    <>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeModals} 
        onLogin={handleLogin}
        onSwitchToSignUp={openSignUp}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeModals} 
        onSignUp={handleSignUp}
        onSwitchToLogin={openLogin}
      />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <AppModals />
          </AuthProvider>
        </QueryClientProvider>
        <Toaster richColors position="top-right" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
