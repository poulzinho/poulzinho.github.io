import React from 'react'
import ferrisImg from 'shared/assets/images/ferris.png'
import javaEEImg from 'shared/assets/images/javaee.png'
import {
  siAngular,
  siDotnet,
  siExpress,
  siHtml5,
  siJavascript,
  siNestjs,
  siNodedotjs,
  siPython,
  siReact,
  siRust,
  siSolid,
  siStencil,
  siTypescript,
} from 'simple-icons'

// Helper: canonical brand hex from simple-icons (stored without #)
const hex = (icon: { hex: string }) => `#${icon.hex}`

// ─── Custom SVG paths for icons not in simple-icons ──────────────────────────

// Java Duke cup (community mark)
const JAVA_PATH =
  'M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.653 3.007-5.688 0 0-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0 0 .07-.063.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0 0 .553.457 3.393.639'

// SQL — clean geometric database cylinder drawn with explicit arcs (viewBox 0 0 24 24)
const SQL_PATH =
  'M12 2C8.13 2 5 3.34 5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5c0-1.66-3.13-3-7-3zm0 2c3.31 0 5 1.12 5 1s-1.69 1-5 1-5-1.12-5-1 1.69-1 5-1zm5 14c0 .88-1.69 1-5 1s-5-.12-5-1v-2.23C8.61 15.58 10.22 16 12 16s3.39-.42 5-1.23V18zm0-5c0 .88-1.69 1-5 1s-5-.12-5-1v-2.23C8.61 10.58 10.22 11 12 11s3.39-.42 5-1.23V13zm0-5c0 .88-1.69 1-5 1S7 8.88 7 8V5.77C8.61 5.58 10.22 6 12 6s3.39-.42 5-1.23V8z'

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single SVG path with its own fill — used for multi-colour logos */
export interface SvgPathDef {
  d: string
  fill: string
}

export interface IconDef {
  /** Accessible name — rendered sr-only + used as <title> tooltip */
  label: string
  /**
   * Single-path icons: provide svgPath + fg.
   * Multi-path icons (e.g. C#): provide svgPaths with per-path fills.
   * Fully custom SVG content: provide svgNode (viewBox must also be set).
   * viewBox defaults to "0 0 24 24"; override for non-standard sources.
   */
  svgPath?: string
  svgPaths?: SvgPathDef[]
  svgNode?: React.ReactNode
  /** External image URL — renders an <img> instead of <svg>. */
  imgSrc?: string
  viewBox?: string
  /** Per-icon size override (Tailwind classes). Takes precedence over grid-level iconSize. */
  iconSize?: string
  /** Per-icon tile padding override (Tailwind classes). Takes precedence over grid-level tilePadding. */
  tilePadding?: string
  /** Background fill — the brand colour */
  bg: string
  /** Icon fill — white or dark depending on bg (ignored when svgPaths / svgNode is set) */
  fg?: string
  /** Dim the tile (past-era skills) */
  muted?: boolean
}

export interface FrameworkGroup {
  group: string
  items: IconDef[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const LANGUAGE_ICONS: IconDef[] = [
  {
    label: 'JavaScript',
    svgPath: siJavascript.path,
    bg: hex(siJavascript), // #F7DF1E
    fg: '#323330',
  },
  {
    label: 'TypeScript',
    svgPath: siTypescript.path,
    bg: hex(siTypescript), // #3178C6
    fg: '#ffffff',
  },
  {
    label: 'SQL',
    svgPath: SQL_PATH,
    bg: '#336791', // classic PostgreSQL/SQL blue — universally read as "SQL"
    fg: '#ffffff',
  },
  {
    label: 'HTML5',
    svgPath: siHtml5.path,
    bg: hex(siHtml5), // #E34F26 — official HTML5 orange
    fg: '#ffffff',
  },
  {
    label: 'Python',
    svgPath: siPython.path,
    bg: hex(siPython), // #3776AB
    fg: '#ffd343', // Python yellow for contrast
  },
  {
    label: 'Rust',
    svgPath: siRust.path,
    bg: '#CE422B', // community orange — canonical is black, too dark as a tile
    fg: '#ffffff',
  },
  {
    label: 'Java',
    svgPath: JAVA_PATH,
    bg: '#f89820',
    fg: '#ffffff',
    muted: true,
  },
  {
    // Source: https://github.com/devicons/devicon/blob/master/icons/csharp/csharp-original.svg
    label: 'C#',
    viewBox: '0 0 128 128',
    bg: '#6a1577',
    svgPaths: [
      {
        d: 'M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z',
        fill: '#9B4F96',
      },
      {
        d: 'M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z',
        fill: '#68217A',
      },
      {
        d: 'M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z',
        fill: '#ffffff',
      },
    ],
    muted: true,
  },
]

export const FRAMEWORK_ICONS: FrameworkGroup[] = [
  {
    group: 'Frontend',
    items: [
      {
        label: 'Angular',
        svgPath: siAngular.path,
        bg: '#dd0031',
        fg: '#ffffff',
      },
      {
        label: 'React',
        svgPath: siReact.path,
        bg: '#20232a',
        fg: hex(siReact), // #61DAFB
      },
      {
        label: 'Stencil',
        svgPath: siStencil.path,
        bg: hex(siStencil), // #5530FF
        fg: '#ffffff',
        muted: true,
      },
      {
        label: 'SolidJS',
        svgPath: siSolid.path,
        bg: hex(siSolid), // #2C4F7C
        fg: '#ffffff',
      },
    ],
  },
  {
    group: 'Backend',
    items: [
      {
        label: 'Node.js',
        svgPath: siNodedotjs.path,
        bg: hex(siNodedotjs), // #5FA04E
        fg: '#ffffff',
      },
      {
        label: 'Express',
        svgPath: siExpress.path,
        bg: hex(siExpress), // #000000
        fg: '#ffffff',
      },
      {
        label: 'NestJS',
        svgPath: siNestjs.path,
        bg: hex(siNestjs), // #E0234E
        fg: '#ffffff',
      },
      {
        label: 'Rust',
        imgSrc: ferrisImg,
        bg: '#111111',
      },
    ],
  },
  {
    group: 'Enterprise',
    items: [
      {
        // Composite: Java cup (devicons) + "Java EE" wordmark
        label: 'JEE',
        imgSrc: javaEEImg,
        bg: '#ffffff',
        iconSize: 'h-11 w-auto',
        tilePadding: 'p-1.5',
        muted: true,
      },
      {
        label: '.NET',
        svgPath: siDotnet.path,
        bg: hex(siDotnet), // #512BD4
        fg: '#ffffff',
        muted: true,
      },
    ],
  },
]

// ─── SkillTile ────────────────────────────────────────────────────────────────

interface SkillTileProps {
  icon: IconDef
  iconSize?: string
  tilePadding?: string
}

export function SkillTile({
  icon,
  iconSize = 'h-9 w-9',
  tilePadding = '',
}: SkillTileProps) {
  const resolvedSize = icon.iconSize ?? iconSize
  const resolvedPadding = icon.tilePadding ?? tilePadding
  const viewBox = icon.viewBox ?? '0 0 24 24'

  return (
    <div
      title={icon.label}
      className={`group relative flex items-center justify-center transition-transform duration-200 hover:z-10 hover:scale-105 ${resolvedPadding} ${icon.muted ? 'opacity-90 hover:opacity-100' : ''}`}
      style={{ backgroundColor: icon.bg }}
    >
      <span className='sr-only'>{icon.label}</span>

      {icon.imgSrc ? (
        <img
          src={icon.imgSrc}
          alt={icon.label}
          className={`${resolvedSize} object-contain`}
        />
      ) : (
        <svg
          role='img'
          viewBox={viewBox}
          aria-hidden='true'
          className={resolvedSize}
        >
          <title>{icon.label}</title>
          {icon.svgNode ??
            (icon.svgPaths ? (
              icon.svgPaths.map((p, i) => (
                <path key={i} d={p.d} fill={p.fill} />
              ))
            ) : (
              <path d={icon.svgPath} fill={icon.fg} />
            ))}
        </svg>
      )}
    </div>
  )
}

// ─── SkillGrid ────────────────────────────────────────────────────────────────

interface SkillGridProps {
  icons: IconDef[]
  cols?: number
  iconSize?: string
  tilePadding?: string
}

export function SkillGrid({
  icons,
  cols = 3,
  iconSize,
  tilePadding,
}: SkillGridProps) {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }

  return (
    <div
      className={`grid h-full w-full ${gridCols[cols] ?? 'grid-cols-3'}`}
      style={{ gridAutoRows: '1fr', minHeight: 0 }}
    >
      {icons.map(icon => (
        <SkillTile
          key={icon.label}
          icon={icon}
          iconSize={iconSize}
          tilePadding={tilePadding}
        />
      ))}
    </div>
  )
}
