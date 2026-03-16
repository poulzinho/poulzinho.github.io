import { useEffect } from 'react'
import gsap from 'gsap'
import { siGithub } from 'simple-icons'

// LinkedIn was removed from simple-icons; path sourced from their brand guidelines
const LINKEDIN_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
import { COLORS } from 'shared/lib/colors'
import { useSidebar } from 'shared/lib/use-sidebar'
import { useTheme } from 'shared/ui/theme/theme-context'
import { ThemeToggle } from 'shared/ui'

// ─── Icons ────────────────────────────────────────────────────────────────────

function SiIcon({ path }: { path: string }) {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
      <path d={path} />
    </svg>
  )
}

function ChevronIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'
      className={`h-4 w-4 transition-transform duration-[220ms] ${rotated ? 'rotate-180' : ''}`}>
      <path d='M9 18l6-6-6-6' />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='h-4 w-4'>
      <path d='M18 6 6 18M6 6l12 12' />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'github',   label: 'GitHub',   href: 'https://github.com/poulzinho',              path: siGithub.path,   external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/paul-gualotuna', path: LINKEDIN_PATH,   external: true },
]

// ─── Theme ────────────────────────────────────────────────────────────────────

const SUN = {
  rail:    'rgba(37,99,235,0.45)',
  panel:   'rgba(29,78,216,0.55)',
  text:    '#ffffff',
  muted:   'rgba(255,255,255,0.80)',
}
const MOON = {
  rail:    `${COLORS.waveDeep1}88`,
  panel:   `${COLORS.waveDeep2}99`,
  text:    '#ffffff',
  muted:   `${COLORS.moonLavender}cc`,
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { theme } = useTheme()
  const s = theme === 'light' ? SUN : MOON

  const {
    isOpen, isExpanded, isPinned,
    drawerRef, backdropRef, panelWrapRef, toggleRef,
    toggleMobile, close, togglePin,
  } = useSidebar()

  // Set initial mobile positions
  useEffect(() => {
    if (drawerRef.current)    gsap.set(drawerRef.current,   { x: '-100%' })
    if (backdropRef.current)  gsap.set(backdropRef.current, { opacity: 0, pointerEvents: 'none' })
    if (panelWrapRef.current) gsap.set(panelWrapRef.current, { width: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Desktop panel slide
  useEffect(() => {
    if (!panelWrapRef.current) return
    if (reducedMotion()) {
      gsap.set(panelWrapRef.current, { width: isExpanded ? 164 : 0 })
      return
    }
    gsap.to(panelWrapRef.current, {
      width: isExpanded ? 164 : 0,
      duration: 0.28,
      ease: isExpanded ? 'power2.out' : 'power2.in',
      overwrite: true,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  // Mobile drawer + backdrop
  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return
    if (reducedMotion()) {
      gsap.set(drawerRef.current,   { x: isOpen ? 0 : '-100%' })
      gsap.set(backdropRef.current, { opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' })
      return
    }
    if (isOpen) {
      gsap.to(drawerRef.current,   { x: 0, duration: 0.32, ease: 'power3.out', overwrite: true })
      gsap.to(backdropRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.28, overwrite: true })
    } else {
      gsap.to(drawerRef.current,   { x: '-100%', duration: 0.24, ease: 'power2.in', overwrite: true })
      gsap.to(backdropRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.20, overwrite: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Escape closes drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [close])

  // Focus trap (mobile)
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    const drawer = drawerRef.current
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    )
    focusable[0]?.focus()
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onTab)
    return () => document.removeEventListener('keydown', onTab)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <>
      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────── */}
      <aside
        aria-label='Site navigation'
        className='fixed inset-y-0 left-0 z-40 hidden md:flex'
      >
        {/* Rail */}
        <div
          className='flex h-full w-14 flex-col items-center rounded-r-2xl py-4'
          style={{ background: s.rail, backdropFilter: 'blur(12px)' }}
        >
          <button
            type='button'
            onClick={togglePin}
            aria-label={isPinned ? 'Collapse navigation' : 'Expand navigation'}
            className='mb-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/15'
            style={{ color: s.text }}
          >
            <ChevronIcon rotated={isPinned} />
          </button>

          <nav aria-label='Primary' className='flex flex-col items-center gap-1'>
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-label={item.label}
                className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/15'
                style={{ color: s.muted }}
              >
                <SiIcon path={item.path} />
              </a>
            ))}
          </nav>

          <div className='mt-auto'>
            <ThemeToggle />
          </div>
        </div>

        {/* Expandable labels panel */}
        <div ref={panelWrapRef} className='overflow-hidden' style={{ width: 0 }}>
          <div
            className='flex h-full w-[164px] flex-col py-4 pl-3 pr-4'
            style={{ background: s.panel, backdropFilter: 'blur(12px)' }}
          >
            <span
              className='mb-3 flex h-8 items-center truncate text-sm font-semibold tracking-wide'
              style={{ color: s.text }}
            >
              Paúl Gualotuña
            </span>
            <nav aria-label='Primary expanded' className='flex flex-col gap-1'>
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className='flex h-9 items-center rounded-lg px-2 text-sm transition-colors hover:bg-white/15'
                  style={{ color: s.muted }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* ── Mobile toggle button ──────────────────────────────────────────── */}
      <button
        ref={toggleRef}
        type='button'
        onClick={toggleMobile}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls='sidebar-drawer'
        className='fixed top-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full md:hidden'
        style={{ background: s.rail, backdropFilter: 'blur(12px)' }}
      >
        <span className='relative flex h-4 w-5 flex-col justify-between' aria-hidden='true'>
          <span
            className='block h-0.5 w-full origin-center rounded-full bg-white transition-transform duration-200'
            style={{ transform: isOpen ? 'translateY(8px) rotate(45deg)' : undefined }}
          />
          <span
            className='block h-0.5 w-full rounded-full bg-white transition-opacity duration-200'
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <span
            className='block h-0.5 w-full origin-center rounded-full bg-white transition-transform duration-200'
            style={{ transform: isOpen ? 'translateY(-8px) rotate(-45deg)' : undefined }}
          />
        </span>
      </button>

      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      <div
        ref={backdropRef}
        onClick={close}
        aria-hidden='true'
        className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden'
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <aside
        ref={drawerRef}
        id='sidebar-drawer'
        aria-label='Site navigation'
        aria-modal='true'
        className='fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col p-6 md:hidden'
        style={{ background: s.panel, backdropFilter: 'blur(12px)' }}
      >
        <div className='mb-8 flex items-center justify-between'>
          <span className='text-base font-semibold tracking-wide' style={{ color: s.text }}>
            Paúl Gualotuña
          </span>
          <button
            type='button'
            onClick={close}
            aria-label='Close navigation'
            className='flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/15'
            style={{ color: s.muted }}
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label='Primary' className='flex flex-col gap-1'>
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={close}
              className='flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-white/15'
              style={{ color: s.text }}
            >
              <span style={{ color: s.muted }}><SiIcon path={item.path} /></span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className='mt-auto flex items-center gap-3'>
          <ThemeToggle />
          <span className='text-sm' style={{ color: s.muted }}>Toggle theme</span>
        </div>
      </aside>
    </>
  )
}
