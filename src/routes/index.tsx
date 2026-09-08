import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TeleSaúde — A Central Inteligente de Teleagendamento" },
      {
        name: "description",
        content:
          "Plataforma digital que automatiza o agendamento de consultas: agendamento online, confirmação automática, lembretes via WhatsApp e SMS, cancelamento, reagendamento, painel para gestores e relatórios em tempo real.",
      },
      {
        property: "og:title",
        content: "TeleSaúde — A Central Inteligente de Teleagendamento",
      },
      {
        property: "og:description",
        content:
          "Automatize o agendamento, a confirmação e os lembretes de consultas com a TeleSaúde. Painel para gestores e relatórios em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-emerald-50 antialiased">
      <div className="mx-auto max-w-7xl px-5 py-5">
        <Header />
        <Hero />
        <StatsRow />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between rounded-xl px-2 py-1">
      <div className="flex items-center gap-3">
        <div
          className="grid size-10 place-items-center rounded-lg bg-emerald/25 glow-emerald"
          style={{ boxShadow: "0 0 28px -4px #12b886" }}
        >
          <span className="font-display text-lg font-semibold text-emerald">T</span>
        </div>
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold tracking-tight text-emerald-50">
            TeleSaúde
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/50">
            Central de Teleagendamento
          </p>
        </div>
      </div>
      <nav className="hidden items-center gap-7 text-sm text-emerald-100/70 md:flex">
        <a href="#" className="transition hover:text-emerald-200">
          Painel
        </a>
        <a href="#" className="transition hover:text-emerald-200">
          Agendamentos
        </a>
        <a href="#" className="transition hover:text-emerald-200">
          Relatórios
        </a>
        <a
          href="#"
          className="rounded-lg bg-emerald/20 px-4 py-2 font-medium text-emerald-50 ring-1 ring-emerald/40"
          style={{ boxShadow: "0 0 22px -8px #12b886" }}
        >
          Entrar
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-7 grid gap-4 lg:grid-cols-12">
      <HeroMain />
      <RemindersCard />
    </section>
  );
}

function HeroMain() {
  return (
    <div
      className="lg:col-span-8 rounded-2xl border border-cobalt/40 bg-gradient-to-br from-cobalt/30 via-cobalt/10 to-transparent p-8"
      style={{
        boxShadow: "0 0 60px -22px #2563eb inset, 0 0 40px -30px #2563eb",
      }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-cobalt-200/70">
        Agendamento inteligente
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-emerald-50 md:text-6xl">
        Agende, confirme e lembre —{" "}
        <span className="italic text-cobalt-200">sem a menor fricção.</span>
      </h1>
      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-emerald-100/70">
        A TeleSaúde orquestra o fluxo completo da consulta em tempo real: da
        primeira solicitação ao lembrete no WhatsApp, tudo sob luz própria.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href="#"
          className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          style={{ boxShadow: "0 8px 30px -10px #12b886" }}
        >
          Criar teleagendamento
        </a>
        <a
          href="#"
          className="rounded-lg px-6 py-3 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-100/20 transition hover:ring-emerald-100/40"
        >
          Ver demonstração
        </a>
      </div>
      <div className="mt-8 flex flex-wrap gap-6 border-t border-emerald-100/10 pt-6">
        <div>
          <p className="font-display text-2xl font-semibold text-emerald-50">98,2%</p>
          <p className="text-xs text-emerald-300/50">taxa de confirmação</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-emerald-50">−63%</p>
          <p className="text-xs text-emerald-300/50">no-shows</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-emerald-50">24/7</p>
          <p className="text-xs text-emerald-300/50">atendimento</p>
        </div>
      </div>
    </div>
  );
}

function RemindersCard() {
  const reminders = [
    {
      name: "Ana Beltrão · CDM",
      tag: "WhatsApp",
      tagColor: "bg-emerald/20 text-emerald-200",
      ring: "ring-amber/25",
      time: "Amanhã · 09:40",
      timeColor: "text-amber-200/70",
    },
    {
      name: "Caio Duarte",
      tag: "SMS",
      tagColor: "bg-rose/20 text-rose-200",
      ring: "ring-rose/25",
      time: "Hoje · 14:15",
      timeColor: "text-rose-200/70",
    },
    {
      name: "Lúcia Prado",
      tag: "Reagendada",
      tagColor: "bg-violet/20 text-violet-200",
      ring: "ring-emerald/25",
      time: "Sex · 11:00",
      timeColor: "text-emerald-300/60",
    },
  ];

  return (
    <div
      className="lg:col-span-4 rounded-2xl border border-amber/40 bg-gradient-to-br from-amber/25 to-transparent p-6"
      style={{ boxShadow: "0 0 50px -24px #f59e0b inset" }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-200/70">
        Lembretes ativos
      </p>
      <div className="mt-4 space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.name}
            className={`rounded-xl bg-brand/50 p-3 ring-1 ${reminder.ring}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-emerald-50">{reminder.name}</p>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${reminder.tagColor}`}
              >
                {reminder.tag}
              </span>
            </div>
            <p className={`mt-1 font-mono text-xs ${reminder.timeColor}`}>
              {reminder.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsRow() {
  const stats = [
    {
      value: "1.284",
      label: "Consulta confirmada",
      detail: "+12% esta semana",
      detailColor: "text-emerald-300/60",
      border: "border-emerald/40",
      gradient: "from-emerald/25",
      shadow: "#12b886",
    },
    {
      value: "312",
      label: "Lembretes disparados",
      detail: "entrega 99,1%",
      detailColor: "text-violet-200/60",
      border: "border-violet/40",
      gradient: "from-violet/25",
      shadow: "#7c3aed",
    },
    {
      value: "7,4%",
      label: "Cancelamentos",
      detail: "queda de 2,1 p.p.",
      detailColor: "text-rose-200/60",
      border: "border-rose/40",
      gradient: "from-rose/25",
      shadow: "#e11d48",
    },
  ];

  return (
    <section className="mt-4 grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.gradient} to-transparent p-6`}
          style={{ boxShadow: `0 0 44px -22px ${stat.shadow} inset` }}
        >
          <p className="font-display text-3xl font-semibold text-emerald-50">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-emerald-100/70">{stat.label}</p>
          <p className={`mt-3 font-mono text-xs ${stat.detailColor}`}>
            {stat.detail}
          </p>
        </div>
      ))}
    </section>
  );
}
