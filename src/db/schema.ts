/**
 * DB 스키마의 원본(SSoT). Notion `04 Tech`에는 요약만 있고 여기가 기준이다.
 * 바꾸면 `npm run db:generate`로 drizzle/ 아래 마이그레이션을 만든다.
 *
 * 모든 테이블은 RLS를 켜고 정책은 비워둔다.
 * 앱 서버는 소유자 권한으로 직접 접속하고(권한 검사는 서버 코드에서),
 * Supabase 공개 Data API(anon 키)로는 아무것도 읽거나 쓸 수 없게 하려는 것.
 */
import { sql } from 'drizzle-orm'
import {
  bigserial,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import type { ListenLinks } from '../lib/music/types'

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()

/** 로그인한 사람. id는 Supabase Auth의 user id(로컬 dev 로그인은 이메일에서 만든 uuid) */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: createdAt(),
}).enableRLS()

/** 취향 보드(board)의 주인 정보. 온보딩에서 handle을 정하면 생긴다 */
export const profiles = pgTable(
  'profiles',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    handle: text('handle').notNull(),
    displayName: text('display_name').notNull(),
    bio: text('bio'),
    acceptingSlips: boolean('accepting_slips').notNull().default(true),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('profiles_handle_key').on(sql`lower(${t.handle})`)],
).enableRLS()

/** 곡 메타데이터 캐시. 같은 곡은 (provider, provider_track_id)로 한 번만 저장 */
export const tracks = pgTable(
  'tracks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider', { enum: ['itunes', 'odesli', 'manual', 'mock'] }).notNull(),
    providerTrackId: text('provider_track_id').notNull(),
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    album: text('album'),
    artworkUrl: text('artwork_url'),
    previewUrl: text('preview_url'),
    durationMs: integer('duration_ms'),
    /** 원본 곡 페이지(예: Apple Music 링크) */
    sourceUrl: text('source_url'),
    /** 각 스트리밍 앱 링크. Odesli 조회 결과를 곡당 한 번만 저장 */
    links: jsonb('links').$type<ListenLinks>(),
    linksFetchedAt: timestamp('links_fetched_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('tracks_provider_track_key').on(t.provider, t.providerTrackId)],
).enableRLS()

/** 군집(crate): 이름 붙인 곡 묶음 */
export const crates = pgTable(
  'crates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    position: integer('position').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index('crates_owner_idx').on(t.ownerId, t.position)],
).enableRLS()

export const crateTracks = pgTable(
  'crate_tracks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    crateId: uuid('crate_id')
      .notNull()
      .references(() => crates.id, { onDelete: 'cascade' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id),
    position: integer('position').notNull().default(0),
    /** 주머니에서 '담기'로 들어온 곡이면 출처 소매 */
    sourceSlipId: uuid('source_slip_id').references(() => slips.id, { onDelete: 'set null' }),
    addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('crate_tracks_crate_track_key').on(t.crateId, t.trackId)],
).enableRLS()

export const SLIP_STATUSES = ['unread', 'opened', 'hidden'] as const
export const REACTIONS = ['fit', 'new', 'miss'] as const
export type Reaction = (typeof REACTIONS)[number]

/** 소매(slip): 남의 보드에 넣은 곡 한 개 + 한마디 */
export const slips = pgTable(
  'slips',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    boardOwnerId: uuid('board_owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    crateId: uuid('crate_id').references(() => crates.id, { onDelete: 'set null' }),
    trackId: uuid('track_id')
      .notNull()
      .references(() => tracks.id),
    message: text('message').notNull(),
    giverNickname: text('giver_nickname').notNull(),
    /** 준 사람이 로그인 상태였으면 연결됨 → 답례 소매 가능 */
    giverUserId: uuid('giver_user_id').references(() => users.id, { onDelete: 'set null' }),
    /** 영수증 링크 토큰의 SHA-256. 원문 토큰은 저장하지 않는다 */
    receiptTokenHash: text('receipt_token_hash').notNull().unique(),
    ipHash: text('ip_hash').notNull(),
    status: text('status', { enum: SLIP_STATUSES }).notNull().default('unread'),
    reaction: text('reaction', { enum: REACTIONS }),
    openedAt: timestamp('opened_at', { withTimezone: true }),
    reactedAt: timestamp('reacted_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    index('slips_board_owner_idx').on(t.boardOwnerId, t.createdAt),
    index('slips_ip_idx').on(t.ipHash, t.createdAt),
    check('slips_status_check', sql`${t.status} in ('unread', 'opened', 'hidden')`),
    check(
      'slips_reaction_check',
      sql`${t.reaction} is null or ${t.reaction} in ('fit', 'new', 'miss')`,
    ),
  ],
).enableRLS()

/** 차단: 보드 주인이 특정 IP(해시) 또는 계정을 막음 */
export const blocks = pgTable(
  'blocks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ipHash: text('ip_hash'),
    giverUserId: uuid('giver_user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [index('blocks_owner_idx').on(t.ownerId)],
).enableRLS()

export const EVENT_NAMES = [
  'board_published',
  'slip_created',
  'slip_opened',
  'reaction',
  'keep',
  'receipt_viewed',
  'signup_from_receipt',
] as const
export type EventName = (typeof EVENT_NAMES)[number]

/** 계측 이벤트. Stage 3 지표(첫 소매 수신율, 반응률, fit+new 비율 등)의 원천 */
export const events = pgTable(
  'events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name', { enum: EVENT_NAMES }).notNull(),
    userId: uuid('user_id'),
    props: jsonb('props').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index('events_name_idx').on(t.name, t.createdAt)],
).enableRLS()
