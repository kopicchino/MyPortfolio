"use client";
/**
 * app/admin/messages/page.tsx — Inbox for contact form submissions
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, CheckCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/messages");
    setMessages(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read: true }) });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Message deleted.");
  };

  const unread = messages.filter((m) => !m.read).length;

  const formatTime = (iso: string) => new Date(iso).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            Messages
            {unread > 0 && <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-600 text-white">{unread}</span>}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Contact form submissions from your portfolio</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-[var(--text-muted)]">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="card-glass p-16 text-center">
          <Mail size={40} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-muted)]">No messages yet. Your inbox is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
          {/* List */}
          <div className="lg:col-span-2 card-glass overflow-y-auto">
            {messages.map((msg) => (
              <button key={msg.id} onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
                className={cn(
                  "w-full text-left p-4 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors",
                  selected?.id === msg.id && "bg-indigo-500/10",
                  !msg.read && "border-l-2 border-l-indigo-500"
                )}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cn("text-sm truncate", !msg.read ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>{msg.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{msg.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0 whitespace-nowrap">{formatTime(msg.receivedAt)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3 card-glass overflow-y-auto">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{selected.subject}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        From: <a href={`mailto:${selected.email}`} className="text-indigo-400 hover:underline">{selected.name} &lt;{selected.email}&gt;</a>
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{formatTime(selected.receivedAt)}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                        <Mail size={12} /> Reply
                      </a>
                      <button onClick={() => deleteMessage(selected.id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors border border-[var(--border-color)]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                  {selected.read && <div className="flex items-center gap-1.5 mt-4 text-xs text-emerald-400"><CheckCheck size={14} /> Read</div>}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20">
                  <Mail size={40} className="text-[var(--text-muted)] mb-3" />
                  <p className="text-[var(--text-muted)] text-sm">Select a message to read</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
