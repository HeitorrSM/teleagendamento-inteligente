import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import {
  formatDate,
  nextDays,
  todayISO,
  useAppointments,
  weekdayLabel,
} from "@/lib/appointments";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel do gestor — TeleSaúde" },
      {
        name: "description",
        content:
          "Painel administrativo com consultas de hoje, confirmações, cancelamentos, agenda e gráfico de agendamentos em tempo real.",
      },
      { property: "og:title", content: "Painel do gestor — TeleSaúde" },
      {
        property: "og:description",
        content: "Acompanhe a agenda da clínica e os indicadores em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { appointments, notifications } = useAppointments();
  const today = todayISO();
  const days = useMemo(() => nextDays(7), []);

  const todays = appointments.filter((a) => a.date === today);
  const confirmed = appointments.filter((a) => a.status !== "cancelada");
  const cancelled = appointments.filter((a) => a.status === "cancelada");
  const upcoming = appointments
    .filter((a) => a.status !== "cancelada" && a.date >= today)
    .slice(0, 6);

  const chart = days.map((d) => ({
    day: d,
    count: appointments.filter((a) => a.date === d && a.status !== "cancelada").length,
  }));
  const max = Math.max(1, ...chart.map((c) => c.count));

  const cards = [
    { icon: CalendarDays, label: "Consultas de hoje", value: todays.length, tone: "text-primary bg-brand-50" },
    { icon: CheckCircle2, label: "Confirmadas", value: confirmed.length, tone: "text-accent-foreground bg-mint-soft" },
    { icon: XCircle, label: "Cancelamentos", value: cancelled.length, tone: "text-destructive bg-destructive/10" },
    { icon: Clock, label: "Próximos atendimentos", value: upcoming.length, tone: "text-primary bg-brand-50" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold">Painel do gestor</h1>
            <p className="mt-2 text-muted-foreground">
              Dados fictícios para demonstração · atualiza a cada agendamento.
            </p>
          </div>
          <Link
            to="/agendar"
            className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-700"
          >
            Novo agendamento
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className={`grid size-10 place-items-center rounded-xl ${c.tone}`}>
                <c.icon className="size-5" />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">Agendamentos por dia</h2>
            <div className="mt-6 flex h-52 items-end gap-3">
              {chart.map((c) => (
                <div key={c.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">{c.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-primary/85 transition-all duration-500"
                    style={{ height: `${(c.count / max) * 100}%`, minHeight: "6px" }}
                  />
                  <span className="text-[10px] capitalize text-muted-foreground">
                    {weekdayLabel(c.day).split(",")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">Próximos atendimentos</h2>
            <ul className="mt-4 space-y-3">
              {upcoming.length === 0 && (
                <li className="text-sm text-muted-foreground">Nada agendado.</li>
              )}
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card font-display text-xs font-bold text-primary">
                    {a.time}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.patient}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.specialty} · {a.professional}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card shadow-soft">
          <h2 className="border-b border-border px-6 py-4 text-lg font-bold">Agenda completa</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {["Paciente", "Especialidade", "Profissional", "Data", "Hora", "Status"].map(
                    (h) => (
                      <th key={h} className="px-6 py-3 font-semibold">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-6 py-3 font-medium">{a.patient}</td>
                    <td className="px-6 py-3 text-muted-foreground">{a.specialty}</td>
                    <td className="px-6 py-3 text-muted-foreground">{a.professional}</td>
                    <td className="px-6 py-3">{formatDate(a.date)}</td>
                    <td className="px-6 py-3">{a.time}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          a.status === "cancelada"
                            ? "bg-destructive/10 text-destructive"
                            : a.status === "remarcada"
                              ? "bg-brand-100 text-primary"
                              : "bg-mint-soft text-accent-foreground"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold">Lembretes enviados (simulação)</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {notifications.length === 0 && (
              <li className="text-sm text-muted-foreground">Nenhum lembrete enviado ainda.</li>
            )}
            {notifications.slice(0, 6).map((n) => (
              <li key={n.id} className="rounded-xl bg-surface p-4">
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {n.channel}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{n.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
