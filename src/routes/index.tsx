import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  LayoutDashboard,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { DashboardPreview } from "@/components/DashboardPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TeleSaúde — A Central Inteligente de Teleagendamento" },
      {
        name: "description",
        content:
          "Automatize seus agendamentos, reduza faltas e ofereça uma experiência mais simples para seus pacientes com a TeleSaúde.",
      },
      { property: "og:title", content: "TeleSaúde — A Central Inteligente de Teleagendamento" },
      {
        property: "og:description",
        content:
          "Agendamento online, confirmação automática, lembretes por WhatsApp/SMS e painel para gestores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: CalendarDays, emoji: "📅", title: "Agendamento online", text: "Pacientes marcam consultas 24/7, sem ligações e sem filas." },
  { icon: CheckCircle2, emoji: "✅", title: "Confirmação automática", text: "Cada consulta é confirmada na hora, com registro completo." },
  { icon: MessageSquare, emoji: "💬", title: "Lembretes WhatsApp/SMS", text: "Mensagens automáticas antes da consulta reduzem faltas." },
  { icon: RefreshCw, emoji: "🔄", title: "Cancelamento e reagendamento", text: "O paciente resolve sozinho, a agenda se reorganiza." },
  { icon: LayoutDashboard, emoji: "📊", title: "Painel para gestores", text: "Visão clara de hoje, da semana e de cada profissional." },
  { icon: LineChart, emoji: "📈", title: "Relatórios em tempo real", text: "Acompanhe volume, confirmações e cancelamentos ao vivo." },
];

const steps = [
  { n: "1", title: "Paciente escolhe o serviço", text: "Seleciona a especialidade desejada." },
  { n: "2", title: "Escolhe profissional, data e horário", text: "Vê a agenda real disponível." },
  { n: "3", title: "Confirma a consulta", text: "Recebe a confirmação imediata na tela." },
  { n: "4", title: "Recebe lembretes automáticos", text: "WhatsApp e SMS antes do atendimento." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-mint" /> Plataforma para clínicas e
              profissionais de saúde
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              A Central Inteligente de{" "}
              <span className="text-primary">Teleagendamento</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Automatize seus agendamentos, reduza faltas e ofereça uma experiência mais simples
              para seus pacientes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agendar"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lift transition hover:bg-brand-700"
              >
                Começar agora <ArrowRight className="size-4" />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition hover:bg-secondary"
              >
                Conhecer a solução
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["98,2%", "confirmações"],
                ["−63%", "faltas"],
                ["24/7", "agendamento"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-extrabold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise-in">
            <DashboardPreview />
          </div>
        </section>

        <section id="funcionalidades" className="bg-surface py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Funcionalidades</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Tudo que a sua clínica precisa para organizar a agenda em um só lugar.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">
                    <span className="mr-1">{f.emoji}</span>
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">Quatro passos, do clique ao lembrete.</p>
            <ol className="mt-10 grid gap-4 md:grid-cols-4">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-4">
          <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground shadow-lift">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Experimente a plataforma agora
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Agende uma consulta de demonstração e veja o painel do gestor atualizar em tempo
              real.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/agendar"
                className="rounded-xl bg-card px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-brand-50"
              >
                Agendar consulta
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-primary-foreground/40 px-6 py-3.5 text-sm font-semibold transition hover:bg-brand-700"
              >
                Ver painel do gestor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
