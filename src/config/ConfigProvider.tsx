import type { BrandConfig } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'

interface ConfigContextValue {
  config: BrandConfig | null
  isLoading: boolean
  error: Error | null
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [appliedColors, setAppliedColors] = useState(false)
  
  const { data: config, isLoading, error } = useQuery<BrandConfig>({
    queryKey: ['config'],
    queryFn: () => api.config.get(),
  })
  
  useEffect(() => {
    if (config && !appliedColors) {
      // Apply theme colors to CSS variables
      document.documentElement.style.setProperty('--brand-primary', config.colors.primary)
      document.documentElement.style.setProperty('--brand-secondary', config.colors.secondary)
      document.documentElement.style.setProperty('--brand-accent', config.colors.accent)
      
      // Update document title
      if (config.name) {
        document.title = `${config.name} - ${config.tagline || 'Clinical Testing for Longevity'}`
      }
      
      setAppliedColors(true)
    }
  }, [config, appliedColors])
  
  return (
    <ConfigContext.Provider value={{ config: config || null, isLoading, error: error as Error | null }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
