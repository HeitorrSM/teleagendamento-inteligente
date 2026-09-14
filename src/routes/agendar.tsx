import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, CalendarCheck2, MessageSquare } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import {
  SPECIALTIES,
  TIME_SLOTS,
  formatDate,
  nextDays,
  useAppointments,
  weekdayLabel,
  type Appointment,
} from "@/lib/appointments";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar consulta — TeleSaúde" },
      {
        name: "description",
        content:
          "Escolha especialidade, profissional, data e horário e confirme sua consulta em poucos cliques na TeleSaúde.",
      },
      { property: "og:title", content: "Agendar consulta — TeleSaúde" },
      {
        property: "og:description",
        content: "Agendamento online com confirmação imediata e lembretes automáticos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgendarPage,
});

const stepLabels = ["Especialidade", "Profissional", "Data e horário", "Seus dados"];

function AgendarPage() {
  const { appointments, create } = useAppointments();
  const [step, setStep] = useState(0);
  const [specialty, setSpecialty] = useState("");
  const [professional, setProfessional] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Appointment | null>(null);

  const professionals = useMemo(
    () => SPECIALTIES.find((s) => s.name === specialty)?.professionals ?? [],
    [specialty],
  );

  const taken = useMemo(
    () =>
      new Set(
        appointments
          .filter((a) => a.professional === professional && a.date === date && a.status !== "cancelada")
          .map((a) => a.time),
      ),
    [appointments, professional, date],
  );

  function submit() {
    const e: Record<string, string> = {};
    if (patient.trim().length < 3) e.patient = "Informe seu nome completo.";
    if (phone.replace(/\D/g, "").length < 10) e.phone = "Informe um telefone válido com DDD.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const appt = create({
      specialty,
      professional,
      date,
      time,
      patient: patient.trim().slice(0, 80),
      phone: phone.trim().slice(0, 20),
      notes: notes.trim().slice(0, 300),
    });
    setDone(appt);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <div className="rise-in rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-soft text-accent-foreground">
              <Check className="size-8" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold">Consulta confirmada!</h1>
            <p className="mt-2 text-muted-foreground">
              Enviamos a confirmação e os lembretes para {done.phone}.
            </p>

            <dl className="mt-7 space-y-2 rounded-2xl bg-surface p-5 text-left text-sm">
              {[
                ["Paciente", done.patient],
                ["Especialidade", done.specialty],
                ["Profissional", done.professional],
                ["Data", formatDate(done.date)],
                ["Horário", done.time],
                ["Código", done.id.toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-border p-4 text-left text-sm text-muted-foreground">
              <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Simulação: lembrete por WhatsApp e SMS agendado para 24h e 2h antes da consulta.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/consultas"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-700"
              >
                Ver minhas consultas
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-extrabold">Agendar consulta</h1>
        <p className="mt-2 text-muted-foreground">
          Quatro passos rápidos. Você recebe a confirmação na hora.
        </p>

        <ol className="mt-8 grid grid-cols-4 gap-2">
          {stepLabels.map((label, i) => (
            <li key={label} className="text-center">
              <div
                className={`mx-auto grid size-8 place-items-center rounded-full text-xs font-bold transition ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <p
                className={`mt-2 text-[11px] sm:text-xs ${i <= step ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {step === 0 && (
            <div className="rise-in">
              <h2 className="text-lg font-bold">Escolha a especialidade</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => {
                      setSpecialty(s.name);
                      setProfessional("");
                      setStep(1);
                    }}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-primary ${
                      specialty === s.name ? "border-primary bg-brand-50" : "border-border"
                    }`}
                  >
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.professionals.length} profissionais
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rise-in">
              <h2 className="text-lg font-bold">Escolha o profissional</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {professionals.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setProfessional(p);
                      setStep(2);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-primary ${
                      professional === p ? "border-primary bg-brand-50" : "border-border"
                    }`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 font-display text-sm font-bold text-primary">
                      {p.split(" ")[1]?.[0] ?? "T"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{p}</span>
                      <span className="block text-xs text-muted-foreground">{specialty}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rise-in">
              <h2 className="text-lg font-bold">Escolha a data</h2>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {nextDays(10).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                    className={`shrink-0 rounded-xl border px-4 py-3 text-sm capitalize transition ${
                      date === d ? "border-primary bg-brand-50 font-semibold text-primary" : "border-border"
                    }`}
                  >
                    {weekdayLabel(d)}
                  </button>
                ))}
              </div>

              {date && (
                <>
                  <h3 className="mt-6 text-sm font-bold">Horários disponíveis</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {TIME_SLOTS.map((t) => {
                      const busy = taken.has(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={busy}
                          onClick={() => setTime(t)}
                          className={`rounded-xl border py-2.5 text-sm transition ${
                            busy
                              ? "cursor-not-allowed border-border bg-secondary text-muted-foreground line-through"
                              : time === t
                                ? "border-primary bg-primary font-semibold text-primary-foreground"
                                : "border-border hover:border-primary"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="mt-7 flex justify-between">
                <BackButton onClick={() => setStep(1)} />
                <button
                  type="button"
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-700 disabled:opacity-40"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form
              className="rise-in"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <h2 className="text-lg font-bold">Seus dados</h2>
              <div className="mt-4 grid gap-4">
                <Field label="Nome completo" error={errors.patient}>
                  <input
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    maxLength={80}
                    placeholder="Maria da Silva"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Telefone (WhatsApp)" error={errors.phone}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    placeholder="(81) 99999-0000"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Observações (opcional)">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={300}
                    rows={3}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-4 text-sm">
                <CalendarCheck2 className="size-5 shrink-0 text-primary" />
                <p className="min-w-0">
                  <span className="font-semibold">{specialty}</span> com {professional} ·{" "}
                  {date && formatDate(date)} às {time}
                </p>
              </div>

              <div className="mt-7 flex justify-between">
                <BackButton onClick={() => setStep(2)} />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-brand-700"
                >
                  Confirmar consulta
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-secondary"
    >
      <ChevronLeft className="size-4" /> Voltar
    </button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
