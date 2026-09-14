import { CalendarCheck, MessageCircle, TrendingUp } from "lucide-react";

const bars = [42, 58, 36, 74, 64, 88, 70];
const days = ["S", "T", "Q", "Q", "S", "S", "D"];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-100/60 blur-2xl pulse-soft" />
      <div className="rounded-3xl border border-border bg-card p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Painel da clínica
            </p>
            <p className="font-display text-lg font-bold">Hoje</p>
          </div>
          <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
            Ao vivo
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: CalendarCheck, value: "24", label: "Consultas" },
            { icon: MessageCircle, value: "312", label: "Lembretes" },
            { icon: TrendingUp, value: "98%", label: "Confirmação" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-surface p-3">
              <s.icon className="size-4 text-primary" />
              <p className="mt-2 font-display text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">Agendamentos na semana</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary/85 transition-all duration-500"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { n: "Fernanda Dias", t: "11:00 · Cardiologia", c: "bg-mint-soft text-accent-foreground", s: "Confirmada" },
            { n: "Sofia Andrade", t: "14:10 · Pediatria", c: "bg-brand-100 text-primary", s: "Lembrete enviado" },
          ].map((r) => (
            <div
              key={r.n}
              className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.n}</p>
                <p className="text-xs text-muted-foreground">{r.t}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.c}`}>
                {r.s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
