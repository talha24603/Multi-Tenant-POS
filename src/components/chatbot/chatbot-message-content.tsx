import { cn } from "@/lib/utils"

type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; intro?: string; items: string[] }

const LIST_LINE = /^(\d+\.|[-*•])\s+(.+)$/

function parseInlineBulletList(line: string): Block | null {
  if (!/\s\*\s/.test(line) && !line.includes(" * ")) {
    return null
  }

  const parts = line
    .split(/\s+\*\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) {
    return null
  }

  const [first, ...items] = parts
  const intro = first.endsWith(":") ? first : undefined
  const listItems = intro ? items : parts

  if (listItems.length === 0) {
    return null
  }

  return {
    type: "list",
    intro,
    items: listItems,
  }
}

function parseBlocks(content: string): Block[] {
  const rawLines = content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (rawLines.length === 0) {
    return []
  }

  const blocks: Block[] = []
  let listIntro: string | undefined
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length === 0) {
      listIntro = undefined
      return
    }
    blocks.push({ type: "list", intro: listIntro, items: listItems })
    listIntro = undefined
    listItems = []
  }

  for (const line of rawLines) {
    const inlineList = parseInlineBulletList(line)
    if (inlineList?.type === "list") {
      flushList()
      blocks.push(inlineList)
      continue
    }

    const listMatch = line.match(LIST_LINE)
    if (listMatch) {
      listItems.push(listMatch[2].trim())
      continue
    }

    flushList()

    if (line.endsWith(":") && rawLines.length > 1) {
      listIntro = line
      continue
    }

    blocks.push({ type: "paragraph", text: line })
  }

  flushList()
  return blocks
}

interface ChatbotMessageContentProps {
  content: string
  className?: string
}

export function ChatbotMessageContent({ content, className }: ChatbotMessageContentProps) {
  const blocks = parseBlocks(content)

  if (blocks.length === 0) {
    return <p className={cn("text-sm leading-relaxed", className)}>{content}</p>
  }

  return (
    <div className={cn("space-y-2.5 text-sm leading-relaxed", className)}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className="text-gray-800">
              {block.text}
            </p>
          )
        }

        return (
          <div key={index} className="space-y-1.5">
            {block.intro && (
              <p className="font-medium text-gray-900">{block.intro}</p>
            )}
            <ul className="space-y-1.5 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2 text-gray-700">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
                    aria-hidden
                  />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
