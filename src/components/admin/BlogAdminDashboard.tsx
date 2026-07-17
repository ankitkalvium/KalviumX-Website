"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { PostRecord } from "@/lib/repo/posts";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function BlogAdminDashboard({
  posts,
  adminEmail,
  onSignOut,
}: {
  posts: PostRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const router = useRouter();
  const [html, setHtml] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [useBrandStyling, setUseBrandStyling] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ title: string; url: string } | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setHtml(await file.text());
  }

  function resetForm() {
    setHtml("");
    setSlug("");
    setCoverImageUrl("");
    setUseBrandStyling(false);
    setEditingId(null);
    setResult(null);
    setError("");
  }

  async function loadForEdit(post: PostRecord) {
    if (!post.fullPageHtml) {
      setError(`"${post.title}" is a structured post, not an HTML import — edit its content in the Posts sheet directly.`);
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    const response = await fetch(`/api/admin/blog/${post.id}`);
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not load this post.");
      return;
    }
    setHtml(data.post.fullPageHtml || "");
    setSlug(data.post.slug || "");
    setCoverImageUrl(data.post.ogImageUrl || "");
    setUseBrandStyling(data.post.useBrandStyling ?? false);
    setEditingId(post.id);
  }

  async function handleSave(publishNow?: boolean) {
    if (!html.trim()) {
      setError("Paste or upload an HTML file first.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    const response = await fetch("/api/admin/blog/import-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html,
        slug: slug.trim() || undefined,
        publish: publishNow,
        useBrandStyling,
        coverImageUrl: coverImageUrl.trim() || undefined,
      }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not save this post.");
      return;
    }
    setResult({ title: data.title, url: data.url });
    setEditingId(data.id);
    setSlug(data.slug);
    router.refresh();
  }

  async function togglePublish(post: PostRecord) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not update this post.");
      return;
    }
    router.refresh();
  }

  async function deletePost(post: PostRecord) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not delete this post.");
      return;
    }
    if (editingId === post.id) resetForm();
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AdminSidebar adminEmail={adminEmail} onSignOut={onSignOut} />

      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-9">
        <header>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Blog</h1>
          <p className="mt-2 text-sm text-muted">
            Paste or upload a standalone HTML article (own title, style, and body) and publish it as-is — no
            design template required. Saves as a draft until you publish it.
          </p>
        </header>

        {error ? (
          <p className="mt-5 rounded-lg border border-red/20 bg-red/5 px-4 py-2.5 text-sm font-semibold text-red">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-950">
            Saved <strong>{result.title}</strong>.{" "}
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-extrabold underline">
              Preview →
            </a>
          </div>
        ) : null}

        <div className="mt-6 max-w-3xl rounded-xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.1em] text-muted">
              {editingId ? "Editing existing post" : "New post"}
            </h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="text-xs font-extrabold text-red hover:underline">
                Start a new post instead
              </button>
            ) : null}
          </div>

          <label className="mt-5 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Upload an HTML file
          </label>
          <input
            type="file"
            accept=".html,text/html"
            onChange={(event) => void handleFile(event)}
            className="mt-2 block w-full text-sm"
          />

          <label className="mt-6 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Or paste the full HTML here
          </label>
          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            rows={14}
            placeholder="<html>...<title>My post</title>...<body>...</body></html>"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 font-mono text-xs leading-5"
          />

          <label className="mt-6 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Slug {editingId ? "(locked while editing)" : "(optional)"}
          </label>
          {!editingId ? <p className="mt-1 text-xs text-muted">Leave blank to auto-generate from the &lt;title&gt; tag.</p> : null}
          <input
            type="text"
            value={slug}
            disabled={Boolean(editingId)}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="my-custom-slug"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-sm disabled:bg-soft disabled:text-muted"
          />

          <label className="mt-6 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
            Cover image (optional)
          </label>
          <p className="mt-1 text-xs text-muted">
            Shown as the blog index thumbnail and social link preview. Auto-detected from the HTML&apos;s og:image
            or first image if left blank.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="Paste an image URL..."
              className="flex-1 min-w-[220px] rounded-lg border border-line px-3 py-2.5 text-sm"
            />
          </div>
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URL, not a known remote pattern for next/image
            <img src={coverImageUrl} alt="Cover preview" className="mt-3 h-32 w-auto rounded-lg border border-line object-cover" />
          ) : null}

          <label className="mt-6 flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={useBrandStyling}
              onChange={(event) => setUseBrandStyling(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-red"
            />
            <span>
              <span className="font-bold text-ink">Force KalviumX brand styling</span>
              <br />
              <span className="text-xs text-muted">
                Off by default — your HTML&apos;s own fonts, colors, and layout render exactly as pasted. Only
                turn this on for a plain text-only paste with no real design of its own.
              </span>
            </span>
          </label>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave(undefined)}
              className="h-11 rounded-lg border-2 border-ink px-5 text-sm font-extrabold disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave(true)}
              className="h-11 rounded-lg bg-red px-5 text-sm font-extrabold text-white disabled:opacity-50"
            >
              {busy ? "Publishing..." : "Save & publish"}
            </button>
          </div>
        </div>

        <h2 className="mt-9 text-sm font-extrabold uppercase tracking-[0.1em] text-muted">
          All posts ({posts.length})
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
          {posts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-black">No posts yet</h3>
              <p className="mt-2 text-sm text-muted">Import your first HTML article above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-extrabold">Title</th>
                    <th className="px-5 py-4 font-extrabold">Status</th>
                    <th className="px-5 py-4 font-extrabold">Updated</th>
                    <th className="px-5 py-4 font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-5 py-4">
                        <p className="font-extrabold">{post.title}</p>
                        <p className="text-xs text-muted">/blog/{post.slug}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${
                            post.published
                              ? "border-green-200 bg-green-50 text-green-800"
                              : "border-amber-200 bg-amber-50 text-amber-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted">{formatDate(post.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-3 text-xs font-extrabold">
                          {post.fullPageHtml ? (
                            <button type="button" disabled={busy} onClick={() => void loadForEdit(post)} className="text-ink hover:text-red disabled:opacity-50">
                              Edit
                            </button>
                          ) : (
                            <span className="text-muted" title="Structured post — edit its content in the Posts sheet directly">
                              Structured post
                            </span>
                          )}
                          <button type="button" disabled={busy} onClick={() => void togglePublish(post)} className="text-ink hover:text-red disabled:opacity-50">
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-red">
                            View
                          </a>
                          <button type="button" disabled={busy} onClick={() => void deletePost(post)} className="text-red hover:underline disabled:opacity-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
