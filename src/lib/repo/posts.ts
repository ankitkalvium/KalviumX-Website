import { appendRow, deleteRowsByColValue, ensureTab, findRow, readAllRows, updateRow } from "./_sheets";

export interface SimpleBlock {
  type: "h2" | "h3" | "p" | "blockquote" | "bullet-list" | "number-list";
  text?: string;
  items?: string[];
}

export interface ExtractedScript {
  src?: string;
  content?: string;
}

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  published: boolean;
  coverImageUrl: string;
  ogImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  // A complete standalone HTML document (own styling/layout) that replaces
  // the standard title/date/cover chrome entirely — used by the HTML
  // importer. Empty for posts that use the structured `body` blocks instead.
  fullPageHtml: string;
  useBrandStyling: boolean;
  customStyles: string;
  scripts: ExtractedScript[];
  body: SimpleBlock[];
  createdAt: string;
  updatedAt: string;
}

const TAB = "Posts";
const HEADERS = [
  "id", "slug", "title", "excerpt", "author_name", "published_at", "published",
  "cover_image_url", "og_image_url", "seo_title", "seo_description", "canonical_url",
  "full_page_html", "use_brand_styling", "custom_styles", "scripts", "body",
  "created_at", "updated_at",
];

const C = {
  id: 0, slug: 1, title: 2, excerpt: 3, authorName: 4, publishedAt: 5, published: 6,
  coverImageUrl: 7, ogImageUrl: 8, seoTitle: 9, seoDescription: 10, canonicalUrl: 11,
  fullPageHtml: 12, useBrandStyling: 13, customStyles: 14, scripts: 15, body: 16,
  createdAt: 17, updatedAt: 18,
} as const;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

function parseJson<T>(str: string, fallback: T): T {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

function toRecord(row: string[]): PostRecord {
  return {
    id: row[C.id] ?? "",
    slug: row[C.slug] ?? "",
    title: row[C.title] ?? "",
    excerpt: row[C.excerpt] ?? "",
    authorName: row[C.authorName] || "KalviumX Team",
    publishedAt: row[C.publishedAt] ?? "",
    published: row[C.published] === "true",
    coverImageUrl: row[C.coverImageUrl] ?? "",
    ogImageUrl: row[C.ogImageUrl] ?? "",
    seoTitle: row[C.seoTitle] ?? "",
    seoDescription: row[C.seoDescription] ?? "",
    canonicalUrl: row[C.canonicalUrl] ?? "",
    fullPageHtml: row[C.fullPageHtml] ?? "",
    useBrandStyling: row[C.useBrandStyling] === "true",
    customStyles: row[C.customStyles] ?? "",
    scripts: parseJson<ExtractedScript[]>(row[C.scripts] ?? "", []),
    body: parseJson<SimpleBlock[]>(row[C.body] ?? "", []),
    createdAt: row[C.createdAt] ?? "",
    updatedAt: row[C.updatedAt] ?? "",
  };
}

function toRow(r: PostRecord): string[] {
  return [
    r.id, r.slug, r.title, r.excerpt, r.authorName, r.publishedAt, String(r.published),
    r.coverImageUrl, r.ogImageUrl, r.seoTitle, r.seoDescription, r.canonicalUrl,
    r.fullPageHtml, String(r.useBrandStyling), r.customStyles,
    JSON.stringify(r.scripts), JSON.stringify(r.body),
    r.createdAt, r.updatedAt,
  ];
}

// Public site — only ever shows posts explicitly marked published and
// already at/before their publish time.
export async function getAllPosts(): Promise<PostRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  const now = new Date().toISOString();
  return rows.slice(1)
    .filter((r) => r[C.id] && r[C.slug] && r[C.published] === "true" && (r[C.publishedAt] ?? "") <= now)
    .map(toRecord)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}

// Unfiltered — used by the public /blog/[slug] route too, which separately
// gates unpublished posts behind an admin-session check.
export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  await ready();
  const found = await findRow(TAB, C.slug, slug);
  return found ? toRecord(found.row) : null;
}

export async function getPostById(id: string): Promise<PostRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  return found ? toRecord(found.row) : null;
}

// Admin-only — every post regardless of published status, newest edited first.
export async function getAllPostsForAdmin(): Promise<PostRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  return rows.slice(1).filter((r) => r[C.id]).map(toRecord)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertPost(input: {
  id: string; slug: string; title: string; excerpt: string; authorName: string;
  publishedAt: string; published: boolean; coverImageUrl?: string; ogImageUrl?: string;
  seoTitle?: string; seoDescription?: string; canonicalUrl?: string;
  fullPageHtml?: string; useBrandStyling?: boolean; customStyles?: string;
  scripts?: ExtractedScript[]; body?: SimpleBlock[];
}): Promise<PostRecord> {
  await ready();
  const now = new Date().toISOString();
  const found = await findRow(TAB, C.id, input.id);
  const record: PostRecord = {
    id: input.id, slug: input.slug, title: input.title, excerpt: input.excerpt,
    authorName: input.authorName, publishedAt: input.publishedAt, published: input.published,
    coverImageUrl: input.coverImageUrl ?? "", ogImageUrl: input.ogImageUrl ?? "",
    seoTitle: input.seoTitle ?? "", seoDescription: input.seoDescription ?? "",
    canonicalUrl: input.canonicalUrl ?? "", fullPageHtml: input.fullPageHtml ?? "",
    useBrandStyling: input.useBrandStyling ?? false, customStyles: input.customStyles ?? "",
    scripts: input.scripts ?? [], body: input.body ?? [],
    createdAt: found ? toRecord(found.row).createdAt : now,
    updatedAt: now,
  };
  if (found) await updateRow(TAB, found.rowNum, toRow(record));
  else await appendRow(TAB, toRow(record));
  return record;
}

export async function updatePostPublished(id: string, published: boolean): Promise<PostRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return null;
  const updated = { ...toRecord(found.row), published, updatedAt: new Date().toISOString() };
  await updateRow(TAB, found.rowNum, toRow(updated));
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  await ready();
  return (await deleteRowsByColValue(TAB, C.id, [id])) > 0;
}
