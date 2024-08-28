'use client'

import * as React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CoverProvider } from "@/contexts/CoverContext"

import { config } from '@/lib/config';

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiProvider config={config}>
      <CoverProvider>
        <QueryClientProvider client={queryClient}>
          {mounted && children}
        </QueryClientProvider>
      </CoverProvider>
    </WagmiProvider>
  )
}
