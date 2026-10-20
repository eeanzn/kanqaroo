import { Artwork } from '@/components/track/artwork'
import { ButtonLink } from '@/components/ui/button'
import { REACTIONS } from '@/db/schema'
import { REACTION_META } from '@/lib/reactions'

const STEPS = [
  {
    title: '취향 보드 만들기',
    body: "좋아하는 곡을 군집으로 묶어 두세요. '새벽 운전', '비 오는 날'처럼요.",
  },
  {
    title: '링크 걸어두기',
    body: '인스타 프로필이나 스토리에 보드 링크를 걸어요. 친구는 로그인 없이 닉네임만으로 넣을 수 있어요.',
  },
  {
    title: '주머니 열어보기',
    body: '한 곡과 한마디가 주머니에 쌓여요. 듣고 나서 반응을 남기면, 넣어준 사람도 볼 수 있어요.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-14 pt-6">
      <section className="flex flex-col gap-5">
        <p className="text-primary text-sm font-semibold">사람이 골라주는 노래</p>
        <h1 className="text-[2rem] leading-[1.25] font-extrabold tracking-tight">
          알고리즘 말고,
          <br />
          나를 아는 사람이
          <br />
          골라준 노래
        </h1>
        <p className="text-text-muted text-[17px] leading-relaxed">
          좋아하는 노래로 취향 보드를 만들어 두면, 친구들이 &ldquo;너 이거 좋아할 듯&rdquo; 하고 한
          곡씩 소매에 넣어줘요.
        </p>
        <div className="flex gap-2">
          <ButtonLink href="/login" size="lg" className="flex-1">
            내 보드 만들기
          </ButtonLink>
        </div>
      </section>

      <SlipIllustration />

      <section className="flex flex-col gap-4" aria-labelledby="how">
        <h2 id="how" className="text-xl font-bold">
          이렇게 돌아가요
        </h2>
        <ol className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="bg-surface flex gap-4 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
            >
              <span className="bg-primary-soft text-primary grid size-8 shrink-0 place-items-center rounded-full font-bold">
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{step.title}</p>
                <p className="text-text-muted mt-1 text-[15px] leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="reactions">
        <h2 id="reactions" className="text-xl font-bold">
          반응은 세 가지
        </h2>
        <p className="text-text-muted text-[15px] leading-relaxed">
          알고리즘이 놓치는 두 가지, &lsquo;진짜 내 취향&rsquo;과 &lsquo;전혀 몰랐던 곡&rsquo;을
          사람이 채워줄 수 있는지 확인하려고 반응을 이렇게 나눴어요.
        </p>
        <ul className="grid grid-cols-3 gap-2">
          {REACTIONS.map((r) => (
            <li
              key={r}
              className="bg-surface flex flex-col gap-1 rounded-2xl p-3 shadow-[var(--shadow-card)]"
            >
              <span className={`size-2.5 rounded-full ${REACTION_META[r].dot}`} />
              <span className="text-sm font-bold">{REACTION_META[r].label}</span>
              <span className="text-text-muted text-xs">{REACTION_META[r].description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink-900 text-sand-50 flex flex-col items-center gap-4 rounded-[var(--radius-card)] px-6 py-10 text-center">
        <p className="text-xl font-bold">내 소매에도 노래 넣어줘</p>
        <p className="text-sand-300 text-sm">보드 만드는 데 1분이면 충분해요.</p>
        <ButtonLink href="/login" size="lg">
          시작하기
        </ButtonLink>
      </section>
    </div>
  )
}

function SlipIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-2 h-56">
      <div className="bg-sand-200 absolute inset-x-6 top-0 h-44 rotate-[-4deg] rounded-[var(--radius-card)]" />
      <div className="bg-surface absolute inset-x-0 top-4 flex flex-col gap-3 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-pop)]">
        <p className="text-text-muted text-xs font-semibold">민지가 소매에 노래를 넣었어요</p>
        <div className="flex items-center gap-3">
          <Artwork title="Square" />
          <div>
            <p className="font-semibold">Square (2017)</p>
            <p className="text-text-muted text-sm">백예린</p>
          </div>
        </div>
        <p className="bg-surface-sunken rounded-xl px-3 py-2 text-sm leading-relaxed">
          네 보드 보니까 새벽에 이거 들으면 딱일 듯
        </p>
        <div className="flex gap-1.5">
          {REACTIONS.map((r) => (
            <span
              key={r}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${REACTION_META[r].chip}`}
            >
              {REACTION_META[r].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
