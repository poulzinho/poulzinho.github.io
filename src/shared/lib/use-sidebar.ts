import { useCallback, useRef, useState } from 'react'

export interface SidebarState {
  isOpen:     boolean
  isPinned:   boolean
  isExpanded: boolean   // alias for isPinned

  drawerRef:    React.RefObject<HTMLElement | null>
  backdropRef:  React.RefObject<HTMLDivElement | null>
  panelWrapRef: React.RefObject<HTMLDivElement | null>
  toggleRef:    React.RefObject<HTMLButtonElement | null>

  open():         void
  close():        void
  toggleMobile(): void
  togglePin():    void
}

export function useSidebar(): SidebarState {
  const [isOpen,   setIsOpen]   = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const drawerRef    = useRef<HTMLElement>(null)
  const backdropRef  = useRef<HTMLDivElement>(null)
  const panelWrapRef = useRef<HTMLDivElement>(null)
  const toggleRef    = useRef<HTMLButtonElement>(null)

  const open         = useCallback(() => setIsOpen(true), [])
  const close        = useCallback(() => setIsOpen(false), [])
  const toggleMobile = useCallback(() => setIsOpen(prev => !prev), [])
  const togglePin    = useCallback(() => setIsPinned(prev => !prev), [])

  return {
    isOpen, isPinned,
    isExpanded: isPinned,
    drawerRef, backdropRef, panelWrapRef, toggleRef,
    open, close, toggleMobile, togglePin,
  }
}
