import type { Reaction } from '@/db/schema'

/** 반응 3종의 화면 표기 (Notion Glossary '반응'과 같은 정의) */
export const REACTION_META: Record<
  Reaction,
  { label: string; description: string; dot: string; chip: string }
> = {
  fit: {
    label: '딱 내 취향',
    description: '어떻게 알았지 싶은 곡',
    dot: 'bg-reaction-fit',
    chip: 'border-reaction-fit text-ochre-700 bg-ochre-300/25',
  },
  new: {
    label: '새로웠어',
    description: '몰랐는데 좋은 곡',
    dot: 'bg-reaction-new',
    chip: 'border-reaction-new text-eucalyptus-700 bg-accent-soft',
  },
  miss: {
    label: '내 스타일 아냐',
    description: '이번엔 빗나간 곡',
    dot: 'bg-reaction-miss',
    chip: 'border-reaction-miss text-ink-700 bg-surface-sunken',
  },
}
