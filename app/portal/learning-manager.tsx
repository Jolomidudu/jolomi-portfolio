"use client";

import { useEffect, useState, type FormEvent } from "react";
import tracks from "../../backend/learning-tracks.json";

type LearningItem = {
  id: string;
  trackId: string;
  type: "resource" | "assignment";
  title: string;
  description: string;
  resourceUrl: string | null;
  dueDate: string | null;
  status: "draft" | "published";
  updatedAt: string;
};

type ItemForm = Omit<LearningItem, "id" | "updatedAt">;

const emptyForm: ItemForm = {
  trackId: tracks[0].id,
  type: "resource",
  title: "",
  description: "",
  resourceUrl: "",
  dueDate: "",
  status: "draft",
};

function asForm(item: LearningItem): ItemForm {
  return {
    trackId: item.trackId,
    type: item.type,
    title: item.title,
    description: item.description,
    resourceUrl: item.resourceUrl ?? "",
    dueDate: item.dueDate?.slice(0, 10) ?? "",
    status: item.status,
  };
}

function trackName(trackId: string) {
  return tracks.find((track) => track.id === trackId)?.title ?? "Unknown track";
}

export default function LearningManager() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadItems() {
      try {
        const response = await fetch("/api/portal/learning-items", { cache: "no-store" });
        const result = await response.json() as { items?: LearningItem[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Unable to load learning content.");
        setItems(result.items ?? []);
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load learning content.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void loadItems();
    return () => { active = false; };
  }, []);

  function startNewItem() {
    setForm(emptyForm);
    setSelectedId(null);
    setIsCreating(true);
    setErrorMessage("");
    setNotice("");
  }

  function selectItem(item: LearningItem) {
    setForm(asForm(item));
    setSelectedId(item.id);
    setIsCreating(false);
    setErrorMessage("");
    setNotice("");
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch(isCreating ? "/api/portal/learning-items" : `/api/portal/learning-items/${selectedId}`, {
        method: isCreating ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json() as { item?: LearningItem; error?: string };
      if (!response.ok || !result.item) throw new Error(result.error ?? "Unable to save this item.");
      setItems((current) => [result.item!, ...current.filter(({ id }) => id !== result.item!.id)]);
      setSelectedId(result.item.id);
      setForm(asForm(result.item));
      setIsCreating(false);
      setNotice("Learning content saved.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save this item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem() {
    if (!selectedId || !window.confirm("Delete this learning item? This cannot be undone.")) return;
    setErrorMessage("");
    setNotice("");
    try {
      const response = await fetch(`/api/portal/learning-items/${selectedId}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to delete this item.");
      setItems((current) => current.filter(({ id }) => id !== selectedId));
      setSelectedId(null);
      setForm(emptyForm);
      setIsCreating(false);
      setNotice("Learning content deleted.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete this item.");
    }
  }

  const selectedItem = items.find(({ id }) => id === selectedId);

  return (
    <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
      <section className="border-b border-black/10 bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 p-4 sm:p-5">
          <div>
            <h2 className="font-semibold">Course content</h2>
            <p className="mt-1 text-xs text-black/45">{items.length} total items</p>
          </div>
          <button type="button" onClick={startNewItem} className="bg-[#111111] px-3 py-2 text-sm font-semibold text-white hover:bg-[#333333]">
            Add item
          </button>
        </div>
        {errorMessage && <p role="alert" className="m-4 text-sm text-red-700">{errorMessage}</p>}
        {isLoading ? <p className="p-5 text-sm text-black/50">Loading course content...</p> : items.length === 0 ? (
          <p className="p-5 text-sm text-black/50">No resources or assignments have been added.</p>
        ) : (
          <ul className="divide-y divide-black/10">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectItem(item)}
                  aria-current={selectedId === item.id ? "true" : undefined}
                  className={`w-full border-l-2 px-4 py-4 text-left transition-colors sm:px-5 ${selectedId === item.id ? "border-[#00A9A5] bg-[#00A9A5]/5" : "border-transparent hover:bg-black/[0.025]"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-semibold">{item.title}</span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/45">{item.status}</span>
                  </span>
                  <span className="mt-1 block text-sm text-black/55">{trackName(item.trackId)}</span>
                  <span className="mt-1 block text-xs capitalize text-black/40">{item.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-live="polite" className="p-5 sm:p-8">
        {isCreating || selectedItem ? (
          <form onSubmit={saveItem} className="mx-auto max-w-3xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#008e8a]">{isCreating ? "New course item" : "Edit course item"}</p>
                <h2 className="mt-2 text-2xl font-semibold">{isCreating ? "Add learning content" : form.title}</h2>
              </div>
              {!isCreating && <button type="button" onClick={deleteItem} className="border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">Delete</button>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Track
                <select required value={form.trackId} onChange={(event) => setForm({ ...form, trackId: event.target.value })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]">
                  {tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Type
                <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as ItemForm["type"] })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5]">
                  <option value="resource">Resource</option>
                  <option value="assignment">Assignment</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium">
              Title
              <input required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
            </label>
            <label className="block text-sm font-medium">
              Instructions or description
              <textarea required maxLength={5000} rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full resize-y border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Resource link <span className="font-normal text-black/45">(optional)</span>
                <input type="url" value={form.resourceUrl ?? ""} onChange={(event) => setForm({ ...form, resourceUrl: event.target.value })} placeholder="https://..." className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
              </label>
              {form.type === "assignment" && (
                <label className="block text-sm font-medium">
                  Due date <span className="font-normal text-black/45">(optional)</span>
                  <input type="date" value={form.dueDate ?? ""} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-[#00A9A5]" />
                </label>
              )}
            </div>
            <label className="block text-sm font-medium">
              Visibility
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ItemForm["status"] })} className="mt-2 w-full border border-black/15 bg-white px-3 py-3 outline-none focus:border-[#00A9A5] sm:max-w-xs">
                <option value="draft">Draft</option>
                <option value="published">Published to enrolled learners</option>
              </select>
            </label>
            {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
            {notice && <p role="status" className="text-sm text-[#007d79]">{notice}</p>}
            <button type="submit" disabled={isSaving} className="min-h-11 bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Saving..." : isCreating ? "Create item" : "Save changes"}
            </button>
          </form>
        ) : (
          <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">
            Select a course item or add a new resource or assignment.
          </div>
        )}
      </section>
    </div>
  );
}