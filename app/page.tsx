'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── HH Goa Official Scene Themes (preserved) ───────────
const scenes = [
  {
    id: 'shore',
    label: 'SUNSET SHORE',
    kicker: 'FIND YOUR HORIZON',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-59GHbatbGmMpWavzQcrcE8g5jobqWc.png',
  },
  {
    id: 'house',
    label: 'THE HOUSE',
    kicker: 'MAKE IT REAL',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-SyVL45cawQaSO0QPiD1Z1eYbtj1JBB.png',
  },
  {
    id: 'table',
    label: 'BUILDERS TABLE',
    kicker: 'SHIP TOGETHER',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ebfC5ADGzyxUgW1bmKzpjSgnAXwIGA.png',
  },
  {
    id: 'mark',
    label: 'THE MARK',
    kicker: 'LEAVE A TRACE',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-X37NtcmV10hUoVwatkZI4Z4doCRH8a.png',
  },
]

// ─── Fun auto-generated builder titles ───────────────────
const BUILDER_TITLES = [
  'PIXEL ARCHITECT', 'STACK SURGEON', 'DEPLOY CAPTAIN', 'CODE ALCHEMIST',
  'BUG WHISPERER', 'API ARTISAN', 'FULLSTACK NOMAD', 'SHIP COMMANDER',
  'HASH HUNTER', 'MERGE MYSTIC', 'BUILD BARON', 'DEBUG ORACLE',
  'COMMIT SENSEI', 'INFRA WIZARD', 'SCHEMA SAGE', 'RUNTIME REBEL',
]

const W = 1080
const H = 1080

type Mode = 'frame' | 'id'
type Sticker = 'sun' | 'palm' | 'spark'

// ─── Helpers ─────────────────────────────────────────────

/** Cover-fit: scales image to fully cover target rect, centered */
function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number
) {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.width - sw) / 2
  const sy = (img.height - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

/** Deterministic builder title from name */
function getBuilderTitle(name: string): string {
  if (!name) return 'MASTER BUILDER'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  return BUILDER_TITLES[Math.abs(hash) % BUILDER_TITLES.length]
}

/** Convert HEIC/HEIF to JPEG */
async function convertHeic(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
  return Array.isArray(result) ? result[0] : result
}

/** Promise-based image loader */
function loadImage(src: string, crossOrigin?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = crossOrigin
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Font shorthand */
const font = (weight: string, size: number) =>
  `${weight} ${size}px "Space Grotesk", Arial, sans-serif`

/** Draw a rounded-corner pill shape */
function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// ─── PFP Frame Rendering ────────────────────────────────
// Circular design optimized for X profile picture.
// Center ~72% is protected avatar area; ring carries HH Goa branding.
// Works when X crops to circle — branding survives the crop.

function renderPFPFrame(
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement | null,
  photoImg: HTMLImageElement | null,
  sticker: Sticker,
  scene: (typeof scenes)[number]
) {
  const cx = W / 2
  const cy = H / 2
  const outerR = 515
  const innerR = 385
  const midR = (outerR + innerR) / 2

  // Cream background (visible in corners of square, not in circle crop)
  ctx.fillStyle = '#fffef4'
  ctx.fillRect(0, 0, W, H)

  // Corner text — only visible in square download, not when X crops to circle
  ctx.fillStyle = '#08783d'
  ctx.font = font('900', 22)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('HACKER HOUSE GOA 2026', 30, 42)
  ctx.fillText('#FrameInGoa', 30, H - 26)
  ctx.textAlign = 'right'
  ctx.fillText('HHGOA.COM', W - 30, H - 26)
  ctx.fillText(scene.label, W - 30, 42)
  ctx.textAlign = 'start'

  // ── Outer circle: scene background fills the ring ──
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.clip()
  if (bgImg) {
    drawCoverFit(ctx, bgImg, 0, 0, W, H)
  } else {
    ctx.fillStyle = '#08783d'
    ctx.fillRect(0, 0, W, H)
  }
  ctx.fillStyle = 'rgba(0, 45, 25, 0.5)'
  ctx.fillRect(0, 0, W, H)
  ctx.restore()

  // ── Inner circle: user's photo (the avatar) ──
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.clip()
  if (photoImg) {
    drawCoverFit(ctx, photoImg, cx - innerR, cy - innerR, innerR * 2, innerR * 2)
  } else {
    ctx.fillStyle = '#fffef4'
    ctx.fillRect(cx - innerR, cy - innerR, innerR * 2, innerR * 2)
    ctx.fillStyle = '#08783d'
    ctx.font = font('900', 28)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('↥ YOUR PHOTO', cx, cy - 14)
    ctx.font = font('700', 17)
    ctx.fillStyle = '#999'
    ctx.fillText('Upload to generate your PFP', cx, cy + 24)
  }
  ctx.restore()

  // ── Borders ──
  ctx.strokeStyle = '#ffde16'
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#111'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.stroke()

  // ── "HH" badge at top of ring ──
  const topBadgeY = cy - midR
  ctx.fillStyle = '#ffde16'
  ctx.beginPath()
  ctx.arc(cx, topBadgeY, 38, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, topBadgeY, 38, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#111'
  ctx.font = font('900', 28)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HH', cx, topBadgeY)

  // ── "GOA·26" pill at bottom of ring ──
  const botBadgeY = cy + midR
  const pillW = 110
  const pillH = 40
  ctx.fillStyle = '#ff1686'
  drawPill(ctx, cx - pillW / 2, botBadgeY - pillH / 2, pillW, pillH, pillH / 2)
  ctx.fill()
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 3
  drawPill(ctx, cx - pillW / 2, botBadgeY - pillH / 2, pillW, pillH, pillH / 2)
  ctx.stroke()
  ctx.fillStyle = '#fffef4'
  ctx.font = font('900', 20)
  ctx.fillText('GOA · 26', cx, botBadgeY + 1)

  // ── Side accent dots ──
  ctx.fillStyle = '#ff1686'
  ctx.beginPath()
  ctx.arc(cx - midR, cy, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + midR, cy, 10, 0, Math.PI * 2)
  ctx.fill()

  // ── Sticker in ring (upper-right, ~1:30 position) ──
  const sAngle = -Math.PI / 4
  const sX = cx + Math.cos(sAngle) * midR
  const sY = cy + Math.sin(sAngle) * midR
  ctx.fillStyle = '#ff1686'
  ctx.font = '900 44px Georgia'
  ctx.fillText(
    sticker === 'sun' ? '◒' : sticker === 'palm' ? '♒' : '✳',
    sX, sY
  )

  // Reset
  ctx.textAlign = 'start'
  ctx.textBaseline = 'alphabetic'
}

// ─── Builder ID Rendering ────────────────────────────────
// Detailed card-style layout: photo + identity + event info.
// Designed to be posted as a social image on X.

function renderBuilderID(
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement | null,
  photoImg: HTMLImageElement | null,
  sticker: Sticker,
  scene: (typeof scenes)[number],
  name: string,
  handle: string,
  team: string
) {
  // ── Scene background ──
  ctx.fillStyle = '#08783d'
  ctx.fillRect(0, 0, W, H)
  if (bgImg) {
    drawCoverFit(ctx, bgImg, 0, 0, W, H)
  }
  ctx.fillStyle = 'rgba(0, 45, 25, 0.26)'
  ctx.fillRect(0, 0, W, H)

  // ── Double border ──
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 18
  ctx.strokeRect(18, 18, W - 36, H - 36)
  ctx.strokeStyle = '#ffde16'
  ctx.lineWidth = 10
  ctx.strokeRect(38, 38, W - 76, H - 76)

  // ── Rotated card with photo ──
  ctx.save()
  ctx.translate(540, 400)
  ctx.rotate(-0.035)

  ctx.fillStyle = '#fffef4'
  ctx.fillRect(-380, -310, 760, 540)

  // Photo
  if (photoImg) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(-350, -280, 420, 490)
    ctx.clip()
    drawCoverFit(ctx, photoImg, -350, -280, 420, 490)
    ctx.restore()
  } else {
    ctx.fillStyle = 'rgba(8, 120, 61, 0.06)'
    ctx.fillRect(-350, -280, 420, 490)
    ctx.fillStyle = '#08783d'
    ctx.font = font('900', 18)
    ctx.textAlign = 'center'
    ctx.fillText('↥ YOUR PHOTO', -140, 0)
    ctx.textAlign = 'start'
  }

  ctx.strokeStyle = '#111'
  ctx.lineWidth = 6
  ctx.strokeRect(-350, -280, 420, 490)

  // ── Minimal label on card (identity info lives in bottom panel) ──
  ctx.fillStyle = '#111'
  ctx.font = font('900', 16)
  ctx.fillText('BUILDER', 100, -260)
  ctx.fillText('ID / 26', 100, -238)

  ctx.fillStyle = '#ff1686'
  ctx.fillRect(100, -220, 45, 4)

  // Builder title badge (unique element not duplicated below)
  ctx.fillStyle = '#ffde16'
  ctx.fillRect(100, -195, 260, 34)
  ctx.fillStyle = '#111'
  ctx.font = font('900', 15)
  ctx.fillText(`★ ${getBuilderTitle(name)}`, 110, -173)

  // HH circle on card
  ctx.fillStyle = '#ffde16'
  ctx.beginPath()
  ctx.arc(320, 160, 40, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#111'
  ctx.font = font('900', 18)
  ctx.fillText('HH', 307, 167)

  ctx.restore()

  // ── Bottom Identity Panel ──
  ctx.fillStyle = '#fffef4'
  ctx.fillRect(55, 690, 970, 318)
  ctx.fillStyle = '#111'
  ctx.fillRect(55, 690, 970, 6)

  // Builder ID pink badge
  ctx.fillStyle = '#ff1686'
  ctx.fillRect(80, 720, 170, 130)
  ctx.strokeStyle = '#ff1686'
  ctx.lineWidth = 5
  ctx.strokeRect(80, 720, 170, 130)
  ctx.fillStyle = '#fffef4'
  ctx.font = font('900', 22)
  ctx.fillText('BUILDER', 100, 760)
  ctx.fillText('ID', 100, 788)
  ctx.fillStyle = '#ffde16'
  ctx.font = font('900', 36)
  ctx.fillText('26', 100, 835)

  // Name
  ctx.fillStyle = '#08783d'
  ctx.font = font('900', 48)
  ctx.fillText((name || 'YOUR NAME').toUpperCase().slice(0, 18), 280, 775)

  // Handle
  ctx.fillStyle = '#111'
  ctx.font = font('900', 22)
  ctx.fillText(handle || '@yourhandle', 280, 815)

  // Team
  ctx.fillStyle = '#08783d'
  ctx.font = font('900', 18)
  ctx.fillText(
    team ? `TEAM / ${team.toUpperCase().slice(0, 20)}` : 'TEAM / INDEPENDENT BUILDER',
    280, 855
  )

  // Event info
  ctx.fillStyle = '#111'
  ctx.font = font('900', 18)
  ctx.fillText('OPEN TRIALS · AUGUST 2026', 280, 900)
  ctx.fillText('28—31 OCT · GOA, INDIA', 620, 900)

  // Yellow separator
  ctx.strokeStyle = '#ffde16'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(55, 935)
  ctx.lineTo(1025, 935)
  ctx.stroke()

  // #FrameInGoa
  ctx.fillStyle = '#ff1686'
  ctx.font = font('900', 20)
  ctx.fillText('#FrameInGoa', 80, 975)

  // Scene info
  ctx.fillStyle = '#08783d'
  ctx.font = font('900', 17)
  ctx.fillText(scene.label + ' · ' + scene.kicker, 540, 975)

  // HH circle in panel
  ctx.fillStyle = '#ffde16'
  ctx.beginPath()
  ctx.arc(930, 770, 48, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#111'
  ctx.font = font('900', 20)
  ctx.fillText('HH', 916, 778)

  // Sticker (upper area, above card)
  ctx.fillStyle = '#ff1686'
  ctx.font = '900 78px Georgia'
  ctx.fillText(
    sticker === 'sun' ? '◒' : sticker === 'palm' ? '♒' : '✳',
    920, 120
  )
}

// ─── Main Render Orchestrator ────────────────────────────

async function renderCanvas(
  canvas: HTMLCanvasElement,
  photoSrc: string | null,
  mode: Mode,
  scene: (typeof scenes)[number],
  sticker: Sticker,
  name: string,
  handle: string,
  team: string
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  try { await document.fonts.load('900 48px "Space Grotesk"') } catch {}

  let bgImg: HTMLImageElement | null = null
  try { bgImg = await loadImage(scene.image, 'anonymous') } catch {}

  let photoImg: HTMLImageElement | null = null
  if (photoSrc) {
    try { photoImg = await loadImage(photoSrc) } catch {}
  }

  ctx.clearRect(0, 0, W, H)

  if (mode === 'frame') {
    renderPFPFrame(ctx, bgImg, photoImg, sticker, scene)
  } else {
    renderBuilderID(ctx, bgImg, photoImg, sticker, scene, name, handle, team)
  }
}

// ─── Page Component ──────────────────────────────────────

export default function Page() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [fileName, setFileName] = useState('no file selected')
  const [mode, setMode] = useState<Mode>('frame')
  const [scene, setScene] = useState(scenes[0])
  const [sticker, setSticker] = useState<Sticker>('sun')
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [team, setTeam] = useState('')
  const [dragging, setDragging] = useState(false)
  const [exported, setExported] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [shareNotice, setShareNotice] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const circleRef = useRef<HTMLCanvasElement>(null)

  // Re-render canvas + circular preview whenever state changes
  useEffect(() => {
    if (!canvasRef.current) return
    let cancelled = false
    renderCanvas(canvasRef.current, photo, mode, scene, sticker, name, handle, team)
      .then(() => {
        if (cancelled) return
        // Draw circular preview for PFP frame mode
        if (mode === 'frame' && circleRef.current && canvasRef.current) {
          const cCtx = circleRef.current.getContext('2d')
          if (cCtx) {
            cCtx.clearRect(0, 0, 200, 200)
            cCtx.save()
            cCtx.beginPath()
            cCtx.arc(100, 100, 100, 0, Math.PI * 2)
            cCtx.clip()
            cCtx.drawImage(canvasRef.current, 0, 0, 200, 200)
            cCtx.restore()
          }
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [photo, mode, scene, sticker, name, handle, team])

  // ── File upload with HEIC conversion ──
  const handleFile = useCallback(async (file?: File) => {
    if (!file) return
    const isHeic =
      /\.(heic|heif)$/i.test(file.name) ||
      file.type === 'image/heic' ||
      file.type === 'image/heif'
    if (!file.type.startsWith('image/') && !isHeic) return

    setLoading(true)
    setFileName(file.name)
    try {
      let blob: Blob = file
      if (isHeic) blob = await convertHeic(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPhoto(reader.result as string)
        setLoading(false)
      }
      reader.onerror = () => setLoading(false)
      reader.readAsDataURL(blob)
    } catch (err) {
      console.error('Error processing image:', err)
      setLoading(false)
    }
  }, [])

  // ── Download PNG ──
  const download = useCallback(() => {
    if (!canvasRef.current) return
    try {
      const a = document.createElement('a')
      a.download = `hh-goa-2026-${mode}-${scene.id}.png`
      a.href = canvasRef.current.toDataURL('image/png')
      a.click()
      setExported(true)
      setTimeout(() => setExported(false), 2500)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [mode, scene.id])

  // ── Share to X ──
  // 1) Auto-download the generated PNG so the user has it ready
  // 2) Try Vercel Blob upload for OG card (works on deployed Vercel)
  // 3) Open X composer with caption + share URL if available
  // 4) Show hint to attach the downloaded image
  const shareToX = useCallback(async () => {
    if (!canvasRef.current) return
    setSharing(true)

    const caption =
      mode === 'id'
        ? 'Just got #FrameInGoa 🌴\nHacker House Goa \'26\nBuild. Ship. Repeat.'
        : 'Just framed up for #FrameInGoa 🌴\nHacker House Goa \'26'

    // Open window IMMEDIATELY to preserve user gesture (prevents popup blocker)
    const xWindow = window.open('about:blank', '_blank')

    try {
      // Canvas → PNG blob
      const blob = await new Promise<Blob | null>((r) =>
        canvasRef.current?.toBlob(r, 'image/png')
      )
      if (!blob) throw new Error('Failed to generate image')

      // Step 1: Auto-download the image so user can attach it to their tweet
      const objUrl = URL.createObjectURL(blob)
      const dl = document.createElement('a')
      dl.download = `hh-goa-2026-${mode}.png`
      dl.href = objUrl
      dl.click()
      URL.revokeObjectURL(objUrl)

      // Step 2: Try uploading to Vercel Blob (for OG card on deployed version)
      let shareUrl = ''
      try {
        const formData = new FormData()
        formData.append('image', blob, 'hh-goa-2026.png')
        const res = await fetch('/api/share', { method: 'POST', body: formData })
        if (res.ok) {
          const { id } = await res.json()
          shareUrl = `${window.location.origin}/share/${id}`
        }
      } catch {
        // Blob upload not available (local dev) — that's fine, image was already downloaded
      }

      // Step 3: Navigate the already-opened window to X composer
      const params = new URLSearchParams({ text: caption })
      if (shareUrl) params.set('url', shareUrl)
      if (xWindow) {
        xWindow.location.href = `https://x.com/intent/tweet?${params.toString()}`
      }

      // Step 4: Show notice
      setShareNotice(true)
      setTimeout(() => setShareNotice(false), 6000)
    } catch (err) {
      console.error('Share error:', err)
      if (xWindow) {
        xWindow.location.href = `https://x.com/intent/tweet?text=${encodeURIComponent(caption)}`
      }
    } finally {
      setSharing(false)
    }
  }, [mode])

  // ── Mobile fallback: native share with file attachment ──
  const moreShare = useCallback(async () => {
    try {
      const blob = await new Promise<Blob | null>((r) =>
        canvasRef.current?.toBlob(r, 'image/png')
      )
      if (blob && navigator.share) {
        const file = new File([blob], 'hh-goa-2026.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: 'Hacker House Goa 2026',
            text: 'Just got #FrameInGoa 🌴',
            files: [file],
          })
        }
      }
    } catch {}
  }, [])

  // ── Reset ──
  const reset = useCallback(() => {
    setPhoto(null)
    setFileName('no file selected')
    setName('')
    setHandle('')
    setTeam('')
    setMode('frame')
    setScene(scenes[0])
    setSticker('sun')
  }, [])

  return (
    <main className="site-shell">
      {/* ── Top Bar ── */}
      <header className="topbar">
        <div className="brand-mark">
          <span>HH</span>
          <i>GOA</i>
        </div>
        <div className="top-meta">
          <span>OPEN TRIALS / AUG 2026</span>
          <b>●</b>
          <span>28—31 OCT / GOA</span>
        </div>
        <a href="https://hhgoa.com" target="_blank" rel="noreferrer">
          HHGOA.COM <strong>↗</strong>
        </a>
      </header>

      <section className="hero-grid">
        {/* ── Left: Hero Copy ── */}
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" />
            THE ROLLING CHALLENGE
          </p>
          <h1>
            MAKE<br />
            <em>YOUR</em><br />
            MARK<span>.</span>
          </h1>
          <p className="hero-sub">
            Not a waiting list. A signal. Build something that makes the room
            turn around — then earn your way to the house.
          </p>
          <div className="manifesto">
            <span>01</span>
            <p>SELECT<br />YOUR WORLD</p>
            <span>02</span>
            <p>ADD<br />YOUR SIGNAL</p>
            <span>03</span>
            <p>SHIP<br />THE PROOF</p>
          </div>
          <div className="hero-note">
            OPEN TRIALS / AUGUST 2026<br />
            <strong>247 BUILDERS. ONE HOUSE. KEEP GOING.</strong>
          </div>
          <div className="doodle">
            ✳{' '}
            <span>
              GOA IS A STATE OF MIND<br />
              MAKE IT LOUD.
            </span>
          </div>
        </div>

        {/* ── Right: Workspace ── */}
        <div className="workspace">
          {/* Step 1: Upload */}
          <div className="workspace-head">
            <span>01 / YOUR SIGNAL</span>
            <span>PNG · JPG · HEIC</span>
          </div>
          <button
            className={`dropzone ${dragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleFile(e.dataTransfer.files[0])
            }}
          >
            {loading ? (
              <>
                <span className="upload-spinner" />
                <span className="drop-title">PROCESSING YOUR PHOTO...</span>
              </>
            ) : (
              <>
                <span className="upload-symbol">↥</span>
                <span className="drop-title">
                  {photo ? 'TAP TO CHANGE PHOTO' : 'DROP YOUR PHOTO HERE'}
                </span>
                <span className="drop-hint">
                  {photo ? fileName : 'or tap to browse · supports JPG, PNG, HEIC'}
                </span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.heic,.heif"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </button>

          {/* Step 2: Format */}
          <div className="workspace-head mode-head">
            <span>02 / YOUR FORMAT</span>
            <span>1080 × 1080 PNG</span>
          </div>
          <div className="mode-tabs">
            <button
              className={mode === 'frame' ? 'active' : ''}
              onClick={() => setMode('frame')}
            >
              <small>01</small>
              <strong>X PROFILE FRAME</strong>
              <em>Your X profile picture frame</em>
            </button>
            <button
              className={mode === 'id' ? 'active' : ''}
              onClick={() => setMode('id')}
            >
              <small>02</small>
              <strong>BUILDER ID</strong>
              <em>Builder Card / 26</em>
            </button>
          </div>

          {/* Step 3: Scene */}
          <div className="workspace-head mode-head">
            <span>03 / YOUR GOA WORLD</span>
            <span>LIVE ART DIRECTION</span>
          </div>
          <div className="scene-grid">
            {scenes.map((item) => (
              <button
                key={item.id}
                className={`scene-card ${scene.id === item.id ? 'active' : ''}`}
                onClick={() => setScene(item)}
              >
                <img src={item.image} alt={item.label} />
                <span>{item.label}</span>
                <small>{item.kicker}</small>
              </button>
            ))}
          </div>

          {/* Stickers */}
          <div className="sticker-row">
            <span>ADD A MARK</span>
            {(['sun', 'palm', 'spark'] as Sticker[]).map((item) => (
              <button
                key={item}
                aria-label={item}
                className={sticker === item ? 'selected' : ''}
                onClick={() => setSticker(item)}
              >
                {item === 'sun' ? '◒' : item === 'palm' ? '♒' : '✳'}
              </button>
            ))}
          </div>

          {/* ID Card Fields */}
          {mode === 'id' && (
            <div className="fields">
              <label>
                YOUR NAME
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  maxLength={20}
                />
              </label>
              <label>
                HANDLE
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  maxLength={20}
                />
              </label>
              <label>
                TEAM / PROJECT
                <input
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="optional"
                  maxLength={20}
                />
              </label>
            </div>
          )}

          {/* Step 4: Preview */}
          <div className="workspace-head preview-head">
            <span>04 / THE PROOF</span>
            <span>
              {sharing ? 'UPLOADING...' : exported ? '✓ SAVED' : 'MAKE IT SHAREABLE'}
            </span>
          </div>

          <div className="preview-area">
            <div className="preview-wrap">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                aria-label="Generated Hacker House Goa 2026 artwork"
              />
            </div>
            {mode === 'frame' && (
              <div className="x-preview-hint">
                <div className="x-circle">
                  <canvas ref={circleRef} width={200} height={200} />
                </div>
                <span className="x-preview-label">
                  X PROFILE<br />PREVIEW
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="action-row">
            <button
              className="share-button"
              onClick={shareToX}
              disabled={sharing}
            >
              {sharing ? 'SHARING...' : 'SHARE TO X'} <span>↗</span>
            </button>
            <button className="download-button" onClick={download}>
              {exported ? '✓ DOWNLOADED' : 'DOWNLOAD PNG'} <span>↓</span>
            </button>
          </div>
          {shareNotice && (
            <div className="share-notice">
              ✓ Image downloaded — attach it to your tweet on X!
            </div>
          )}
          <button className="more-share-button" onClick={moreShare}>
            MORE SHARE OPTIONS
          </button>
          <button className="reset-button" onClick={reset}>
            RESET / START OVER
          </button>
        </div>
      </section>

      <footer className="footer">
        <span>HACKER HOUSE GOA 2026</span>
        <span className="footer-center">
          KEEP PARTICIPATING UNTIL YOUR WHOLE TEAM IS IN.
        </span>
        <span>MADE TO BUILD</span>
      </footer>
    </main>
  )
}
