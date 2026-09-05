import type { BrandConfig } from '@shared/schemas'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { brandVariables } from '../lib/palette'

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
      // The palette the business chose, in the form the stylesheet reads. This
      // used to set the three hexes straight onto variables that nothing
      // consumed, so the colour fields the data contract marks required had no
      // effect on any published site.
      for (const [name, value] of Object.entries(brandVariables(config.colors))) {
        document.documentElement.style.setProperty(name, value)
      }
      // The document title is per route and set by Layout from routeMeta.
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
