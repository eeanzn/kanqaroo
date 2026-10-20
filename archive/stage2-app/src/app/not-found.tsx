import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 pt-20 text-center">
      <p className="text-5xl">🦘</p>
      <h1 className="text-xl font-bold">여기엔 아무것도 없어요</h1>
      <p className="text-text-muted text-[15px]">주소가 바뀌었거나, 아직 없는 보드예요.</p>
      <ButtonLink href="/" variant="secondary">
        처음으로
      </ButtonLink>
    </div>
  )
}
