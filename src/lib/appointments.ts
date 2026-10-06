import { useEffect, useState } from "react";

export type Status = "confirmada" | "cancelada" | "remarcada";

export type Appointment = {
  id: string;
  specialty: string;
  professional: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patient: string;
  phone: string;
  notes?: string;
  status: Status;
  createdAt: string;
};

export type NotificationLog = {
  id: string;
  channel: "WhatsApp" | "SMS";
  message: string;
  at: string;
};

export const SPECIALTIES = [
  { name: "Clínica Geral", professionals: ["Dra. Ana Beltrão", "Dr. Caio Duarte"] },
  { name: "Cardiologia", professionals: ["Dr. Rafael Lima", "Dra. Marina Souza"] },
  { name: "Dermatologia", professionals: ["Dra. Lúcia Prado", "Dr. Tiago Nunes"] },
  { name: "Pediatria", professionals: ["Dra. Helena Rocha", "Dr. Bruno Carvalho"] },
  { name: "Psicologia", professionals: ["Dra. Júlia Martins", "Dr. Pedro Alves"] },
];

export const TIME_SLOTS = [
  "08:00",
  "08:40",
  "09:20",
  "10:00",
  "11:00",
  "13:30",
  "14:10",
  "15:00",
  "16:00",
  "17:00",
];

const KEY = "telesaude:appointments:v2";
const NKEY = "telesaude:notifications:v2";

function iso(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): Appointment[] {
  const base: Array<Partial<Appointment>> = [
    { specialty: "Clínica Geral", professional: "Dra. Ana Beltrão", date: iso(0), time: "09:20", patient: "Marcos Vieira", phone: "(81) 99999-1010", status: "confirmada" },
    { specialty: "Cardiologia", professional: "Dr. Rafael Lima", date: iso(0), time: "11:00", patient: "Fernanda Dias", phone: "(81) 98888-2020", status: "confirmada" },
    { specialty: "Dermatologia", professional: "Dra. Lúcia Prado", date: iso(0), time: "14:10", patient: "Paulo Henrique", phone: "(81) 97777-3030", status: "cancelada" },
    { specialty: "Pediatria", professional: "Dra. Helena Rocha", date: iso(1), time: "08:00", patient: "Sofia Andrade", phone: "(81) 96666-4040", status: "confirmada" },
    { specialty: "Psicologia", professional: "Dra. Júlia Martins", date: iso(1), time: "16:00", patient: "Renato Bastos", phone: "(81) 95555-5050", status: "remarcada" },
    { specialty: "Clínica Geral", professional: "Dr. Caio Duarte", date: iso(2), time: "10:00", patient: "Beatriz Nogueira", phone: "(81) 94444-6060", status: "confirmada" },
    { specialty: "Cardiologia", professional: "Dra. Marina Souza", date: iso(3), time: "15:00", patient: "Otávio Freitas", phone: "(81) 93333-7070", status: "confirmada" },
    { specialty: "Dermatologia", professional: "Dr. Tiago Nunes", date: iso(4), time: "13:30", patient: "Carla Menezes", phone: "(81) 92222-8080", status: "confirmada" },
  ];
  return base.map((a) => ({
    id: uid(),
    notes: "",
    createdAt: new Date().toISOString(),
    ...a,
  })) as Appointment[];
}

let appointments: Appointment[] = [];
let notifications: NotificationLog[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    appointments = raw ? (JSON.parse(raw) as Appointment[]) : [];
    void seed;
    const nraw = localStorage.getItem(NKEY);
    notifications = nraw ? (JSON.parse(nraw) as NotificationLog[]) : [];
  } catch {
    appointments = [];
    notifications = [];
  }
  persist();
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(appointments));
  localStorage.setItem(NKEY, JSON.stringify(notifications.slice(0, 40)));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function notify(channel: NotificationLog["channel"], message: string) {
  notifications = [
    { id: uid(), channel, message, at: new Date().toISOString() },
    ...notifications,
  ];
}

export function useAppointments() {
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    load();
    setReady(true);
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    ready,
    appointments: ready ? [...appointments].sort(sortByWhen) : [],
    notifications: ready ? notifications : [],
    create: (data: Omit<Appointment, "id" | "status" | "createdAt">) => {
      const appt: Appointment = {
        ...data,
        id: uid(),
        status: "confirmada",
        createdAt: new Date().toISOString(),
      };
      appointments = [...appointments, appt];
      notify(
        "WhatsApp",
        `Olá ${appt.patient}! Sua consulta de ${appt.specialty} com ${appt.professional} está confirmada para ${formatDate(appt.date)} às ${appt.time}.`,
      );
      notify("SMS", `TeleSaude: consulta confirmada ${formatDate(appt.date)} ${appt.time}.`);
      emit();
      return appt;
    },
    cancel: (id: string) => {
      appointments = appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelada" as Status } : a,
      );
      const a = appointments.find((x) => x.id === id);
      if (a)
        notify("WhatsApp", `Consulta de ${a.patient} em ${formatDate(a.date)} às ${a.time} foi cancelada.`);
      emit();
    },
    reschedule: (id: string, date: string, time: string) => {
      appointments = appointments.map((a) =>
        a.id === id ? { ...a, date, time, status: "remarcada" as Status } : a,
      );
      const a = appointments.find((x) => x.id === id);
      if (a)
        notify(
          "WhatsApp",
          `Olá ${a.patient}! Sua consulta foi remarcada para ${formatDate(a.date)} às ${a.time}.`,
        );
      emit();
    },
  };
}

function sortByWhen(a: Appointment, b: Appointment) {
  return `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function weekdayLabel(d: string) {
  const date = new Date(`${d}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

export function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => iso(i));
}
