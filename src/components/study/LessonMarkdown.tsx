import { Fragment } from 'react'

// Renderizador de markdown mínimo para o conteúdo controlado das lições
// (## / ### headings, **bold**, - bullets, parágrafos). Sem dependência externa.

function renderInline(text: string) {
  // Divide em **bold** preservando o resto
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-text-main font-semibold">{part.slice(2, -2)}</strong>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function LessonMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = () => {
    if (bullets.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1 text-muted-foreground">
        {bullets.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
      </ul>
    )
    bullets = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('### ')) {
      flushBullets()
      blocks.push(<h4 key={blocks.length} className="font-semibold text-text-main mt-3">{renderInline(line.slice(4))}</h4>)
    } else if (line.startsWith('## ')) {
      flushBullets()
      blocks.push(<h3 key={blocks.length} className="font-semibold text-text-main text-lg mt-4">{renderInline(line.slice(3))}</h3>)
    } else if (/^[-*]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, ''))
    } else if (line.trim() === '') {
      flushBullets()
    } else {
      flushBullets()
      blocks.push(<p key={blocks.length} className="text-muted-foreground leading-relaxed">{renderInline(line)}</p>)
    }
  }
  flushBullets()

  return <div className="space-y-2 text-sm">{blocks}</div>
}
