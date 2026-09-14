import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarX2, RefreshCw, MessageSquare } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import {
  TIME_SLOTS,
  formatDate,
  nextDays,
  useAppointments,
  weekdayLabel,
} from "@/lib/appointments";

export const Route = createFileRoute("/consultas")({
  head: () => ({
    meta: [
      { title: "Minhas consultas — TeleSaúde" },
      {
        name: "description",
        content:
          "Acompanhe, cancele ou reagende suas consultas e veja os lembretes enviados por WhatsApp e SMS.",
      },
      { property: "og:title", content: "Minhas consultas — TeleSaúde" },
      {
        property: "og:description",
        content: "Cancele ou reagende consultas em segundos na TeleSaúde.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsultasPage,
});

const statusStyle: Record<string, string> = {
  confirmada: "bg-mint-soft text-accent-foreground",
  cancelada: "bg-destructive/10 text-destructive",
  remarcada: "bg-brand-100 text-primary",
};

function ConsultasPage() {
  const { appointments, notifications, cancel, reschedule, ready } = useAppointments();
  const [editing, setEditing] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold">Minhas consultas</h1>
            <p className="mt-2 text-muted-foreground">
              Cancele ou reagende quando precisar — tudo atualiza em tempo real.
            </p>
          </div>
          <Link
            to="/agendar"
            className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-700"
          >
            Nova consulta
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {ready && appointments.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                Nenhuma consulta por aqui ainda.
              </p>
            )}
            {appointments.map((a) => (
              <article
                key={a.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold">{a.specialty}</p>
                    <p className="text-sm text-muted-foreground">{a.professional}</p>
                    <p className="mt-2 text-sm font-semibold">
                      {formatDate(a.date)} · {a.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.patient} · {a.phone}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[a.status]}`}
                  >
                    {a.status}
                  </span>
                </div>

                {a.status !== "cancelada" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(editing === a.id ? null : a.id);
                        setDate(a.date);
                        setTime(a.time);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:bg-secondary"
                    >
                      <RefreshCw className="size-3.5" /> Reagendar
                    </button>
                    <button
                      type="button"
                      onClick={() => cancel(a.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                    >
                      <CalendarX2 className="size-3.5" /> Cancelar
                    </button>
                  </div>
                )}

                {editing === a.id && (
                  <div className="rise-in mt-4 rounded-2xl bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Nova data
                    </p>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                      {nextDays(8).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDate(d)}
                          className={`shrink-0 rounded-lg border px-3 py-2 text-xs capitalize transition ${
                            date === d ? "border-primary bg-brand-50 font-semibold text-primary" : "border-border bg-card"
                          }`}
                        >
                          {weekdayLabel(d)}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Novo horário
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`rounded-lg border py-2 text-xs transition ${
                            time === t
                              ? "border-primary bg-primary font-semibold text-primary-foreground"
                              : "border-border bg-card"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        reschedule(a.id, date, time);
                        setEditing(null);
                      }}
                      className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-brand-700"
                    >
                      Salvar novo horário
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-24 lg:self-start">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <MessageSquare className="size-4 text-primary" /> Notificações simuladas
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Demonstração do envio por WhatsApp e SMS.
            </p>
            <ul className="mt-4 space-y-3">
              {notifications.length === 0 && (
                <li className="text-xs text-muted-foreground">
                  Nenhuma mensagem enviada ainda.
                </li>
              )}
              {notifications.slice(0, 8).map((n) => (
                <li key={n.id} className="rounded-xl bg-surface p-3">
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {n.channel}
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {n.message}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
