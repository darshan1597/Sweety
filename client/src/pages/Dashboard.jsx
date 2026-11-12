import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, Check, CheckCircle2, ClipboardList, CookingPot, ForkKnife, List, LoaderCircle, Moon, Pencil, Plus, RefreshCw, Sigma, Sun, Trash2, TriangleAlert, X,} from "lucide-react";
import {createElement, useCallback, useEffect, useMemo, useRef, useState,} from "react";
import api from "../api.js";
import AppLayout from "./components/AppLayout.jsx";
import { useAuth } from "./components/AuthContext.jsx";

const slots = [
  {
    key: "morning_fasting",
    label: "Morning (fasting)",
    icon: Sun,
    color: "text-amber-500",
  },
  {
    key: "after_breakfast",
    label: "After breakfast",
    icon: ForkKnife,
    color: "text-emerald-500",
  },
  {
    key: "after_lunch",
    label: "After lunch",
    icon: CookingPot,
    color: "text-emerald-500",
  },
  {
    key: "after_dinner",
    label: "After dinner",
    icon: Moon,
    color: "text-violet-700",
  },
];

const today = new Date().toLocaleDateString("en-CA");
const formatSelectedDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

const formatTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date(value))
    : "";
const shiftDate = (value, amount) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

function ReadingModal({ mode, reading, selectedDate, onClose, onSaved }) {
  const editing = mode === "edit";
  const deleting = mode === "delete";
  const [slot, setSlot] = useState(reading?.slot || "morning_fasting");
  const [value, setValue] = useState(reading?.value ?? "");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!deleting) {
      const nextErrors = {};
      if (value === "") nextErrors.value = "Please enter a glucose value.";
      else if (
        !Number.isInteger(Number(value)) ||
        Number(value) < 40 ||
        Number(value) > 600
      )
        nextErrors.value = "Value must be between 40 and 600 mg/dl.";
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        return;
      }
    }
    setSubmitting(true);
    setApiError("");
    try {
      if (deleting) await api.delete(`/readings/${reading.id}`);
      else if (editing)
        await api.put(`/readings/${reading.id}`, {
          readingDate: selectedDate,
          slot,
          value: Number(value),
        });
      else
        await api.post("/readings", {
          readingDate: selectedDate,
          slot,
          value: Number(value),
        });
      onSaved(
        deleting
          ? "Reading deleted successfully."
          : editing
            ? "Reading updated successfully!"
            : "Reading added successfully!",
      );
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setApiError(
        error.response?.data?.message ||
          "Failed to save reading. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
      <section className="w-full max-w-[430px] rounded-2xl border border-violet-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-extrabold">
            {deleting && <Trash2 className="h-6 w-6 text-red-500" />}
            {deleting
              ? "Delete Reading?"
              : editing
                ? "Edit Reading"
                : "Add Reading"
            }
          </h2>
          <button
            className="rounded-lg p-1 hover:bg-slate-100 cursor-pointer"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {apiError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {apiError}
          </p>
        )}
        <form className="mt-6" onSubmit={submit}>
          {deleting ? (
            <p className="text-center text-sm leading-6 text-slate-700">
              Are you sure you want to delete the{" "}
              <strong>
                {slots.find((item) => item.key === reading.slot)?.label}
              </strong>{" "}
              reading ({reading.value} mg/dl)?
              <br />
              This action cannot be undone.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="slot">
                  Time Slot
                </label>
                <select
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 outline-none focus:border-violet-600"
                  id="slot"
                  value={slot}
                  onChange={(event) => {
                    setSlot(event.target.value);
                    setApiError("");
                  }}
                >
                  {slots.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.slot && (
                  <p className="mt-2 text-sm text-red-600">{errors.slot}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="value">
                  Glucose Value (mg/dl)
                </label>
                <input
                  className={`h-12 w-full rounded-lg border px-4 outline-none ${errors.value ? "border-red-500" : "border-slate-300 focus:border-violet-600"}`}
                  id="value"
                  type="number"
                  min="40"
                  max="600"
                  step="1"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setErrors({});
                    setApiError("");
                  }}
                  placeholder="Enter glucose value"
                />
                {errors.value ? (
                  <p className="mt-2 text-sm text-red-600">{errors.value}</p>
                ) : (
                  <p className="mt-2 text-xs text-slate-600">
                    Enter a value between 40 and 600 mg/dl.
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="mt-7 flex justify-end gap-3">
            <button
              className="h-11 rounded-lg border border-slate-300 px-7 font-semibold cursor-pointer"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`flex h-11 min-w-[125px] items-center justify-center rounded-lg px-7 font-semibold text-white disabled:opacity-60 cursor-pointer ${deleting ? "bg-red-600" : "bg-gradient-to-r from-violet-600 to-purple-700 shadow-md shadow-violet-200"}`}
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : deleting ? (
                "Delete"
              ) : editing ? (
                "Save Changes"
              ) : (
                "Add Reading"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Summary({ icon, label, value, tone, noUnit = false }) {
  const colors = {
    red: "bg-red-50 text-red-500",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-700",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="flex items-center gap-3 px-2 md:px-5">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors[tone]}`}
      >
        {createElement(icon, { className: "h-5 w-5" })}
      </span>
      <div>
        <p className="text-xs text-slate-600">{label}</p>
        <p className="mt-1 font-extrabold">
          {value}
          {!noUnit && value !== "—" && (
            <span className="ml-1 text-xs font-medium">mg/dl</span>
          )}
        </p>
      </div>
    </div>
  );
}

function EmptyReadings({ onAdd }) {
  return (
    <section className="mt-7 flex min-h-[420px] items-center justify-center rounded-2xl border border-violet-200 bg-white px-6 py-12 text-center shadow-sm">
      <div>
        <span className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-[35%] bg-violet-100 text-violet-500">
          <span className="absolute -left-5 top-9 h-2 w-5 rounded-full bg-violet-200" />
          <span className="absolute -right-5 top-6 h-2 w-5 rotate-[-25deg] rounded-full bg-violet-200" />
          <ClipboardList className="h-16 w-16" />
        </span>
        <h2 className="mt-7 text-2xl font-extrabold">
          No readings for this date
        </h2>
        <p className="mt-2 text-slate-600">
          Start by adding your first blood glucose reading.
        </p>
        <button
          className="mx-auto mt-7 flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-7 font-bold text-white shadow-lg shadow-violet-200 cursor-pointer"
          type="button"
          onClick={onAdd}
        >
          <Plus className="h-5 w-5" />
          Add Reading
        </button>
      </div>
    </section>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [toast, setToast] = useState("");
  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    if (typeof dateInputRef.current?.showPicker === "function")
      dateInputRef.current.showPicker();
    else dateInputRef.current?.click();
  };

  const changeDate = (nextDate) => {
    if (!nextDate || nextDate === selectedDate) return;
    setReadings([]);
    setFetchError("");
    setLoading(true);
    setSelectedDate(nextDate);
  };

  const loadReadings = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await api.get("/readings", {
        params: { date: selectedDate },
      });
      setReadings(data.readings);
    } catch (error) {
      setFetchError(
        error.response?.data?.message ||
          "Could not load readings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    api
      .get("/readings", { params: { date: selectedDate } })
      .then(({ data }) => {
        if (active) {
          setReadings(data.readings);
          setFetchError("");
        }
      })
      .catch((error) => {
        if (active)
          setFetchError(
            error.response?.data?.message ||
              "Could not load readings. Please try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedDate]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const readingsBySlot = useMemo(
    () =>
      Object.fromEntries(readings.map((reading) => [reading.slot, reading])),
    [readings],
  );
  const values = readings.map((reading) => Number(reading.value));
  const count = values.length;
  const high = count ? Math.max(...values) : "—";
  const low = count ? Math.min(...values) : "—";
  const average = count
    ? (values.reduce((sum, value) => sum + value, 0) / count).toFixed(1)
    : "—";
  const percentage = count * 25;
  const saved = (message) => {
    setDialog(null);
    setToast(message);
    loadReadings();
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-12">
        <div className="lg:hidden">
          <h1 className="text-2xl font-extrabold leading-7">
            Good evening,
            <br />
            {user?.name?.split(" ")[0] || "User"}!
          </h1>
        </div>
        <div className="mt-5 flex items-center gap-2 lg:mt-0">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-violet-400"
            type="button"
            onClick={() => changeDate(shiftDate(selectedDate, -1))}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex flex-1 sm:max-w-[270px]">
            <button
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold hover:border-violet-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              type="button"
              onClick={openDatePicker}
            >
              <CalendarDays className="h-5 w-5" />
              <span>{formatSelectedDate(selectedDate)}</span>
            </button>
            <input
              ref={dateInputRef}
              className="pointer-events-none absolute h-px w-px opacity-0"
              type="date"
              value={selectedDate}
              max={today}
              tabIndex="-1"
              aria-hidden="true"
              onChange={(event) => changeDate(event.target.value)}
            />
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-violet-400 disabled:opacity-40"
            type="button"
            onClick={() => changeDate(shiftDate(selectedDate, 1))}
            disabled={selectedDate >= today}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            className="ml-auto hidden h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-6 font-semibold text-white lg:flex cursor-pointer"
            type="button"
            onClick={() => setDialog({ mode: "add" })}
          >
            <Plus className="h-5 w-5" />
            Add Reading
          </button>
        </div>

        {fetchError ? (
          <section className="mt-8 rounded-2xl border border-red-200 bg-white p-10 text-center">
            <TriangleAlert className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-extrabold">
              Couldn&apos;t load data
            </h2>
            <p className="mt-2 text-slate-600">{fetchError}</p>
            <button
              className="mx-auto mt-6 flex h-11 items-center gap-2 rounded-lg border border-violet-600 px-6 font-bold text-violet-700"
              type="button"
              onClick={loadReadings}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </section>
        ) : loading ? (
          <section className="mt-8 rounded-2xl border border-violet-200 bg-white p-14 text-center">
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-violet-700" />
            <h2 className="mt-5 text-xl font-extrabold">Loading readings...</h2>
            <p className="mt-2 text-slate-600">Please wait a moment.</p>
          </section>
        ) : count === 0 ? (
          <EmptyReadings onAdd={() => setDialog({ mode: "add" })} />
        ) : (
          <>
            <section className="mt-5 rounded-2xl border border-violet-200 bg-violet-50/40 px-5 py-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-extrabold">Daily Progress</h2>
                  <p className="mt-1 text-sm text-slate-700">
                    {count} of 4 readings recorded
                  </p>
                </div>
                <strong>{percentage}%</strong>
              </div>
              <div className="mt-3 grid h-3 grid-cols-4 overflow-hidden rounded-full bg-violet-200">
                {slots.map((slot, index) => (
                  <span
                    className={`h-full transition-colors duration-300 ${index < count ? "bg-gradient-to-r from-violet-600 to-purple-700" : "bg-transparent"}`}
                    key={slot.key}
                  />
                ))}
              </div>
            </section>
            <section className="mt-4 grid gap-2 lg:mt-5 lg:grid-cols-4 lg:gap-3">
              {slots.map((slot) => {
                const reading = readingsBySlot[slot.key];
                const Icon = slot.icon;
                return (
                  <article
                    className={`rounded-xl border px-3 py-3 lg:min-h-[190px] lg:rounded-2xl lg:p-4 ${reading ? "border-emerald-200 bg-emerald-50/60" : "border-violet-200 bg-violet-50/60"}`}
                    key={slot.key}
                  >
                    <div className="flex items-center gap-3 lg:items-start">
                      <Icon className={`h-7 w-7 shrink-0 ${slot.color}`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold lg:text-base">
                          {slot.label}
                        </h3>
                        {reading ? (
                          <>
                            <p className="text-xs lg:mt-5 lg:text-2xl lg:font-extrabold">
                              {reading.value}{" "}
                              <span className="lg:text-sm lg:font-medium">
                                mg/dl
                              </span>
                              <span className="lg:hidden">
                                {" "}
                                · {formatTime(reading.created_at)}
                              </span>
                            </p>
                            <p className="mt-1 hidden text-sm lg:block">
                              {formatTime(reading.created_at)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-600 lg:mt-5 lg:text-sm">
                            Not recorded yet
                          </p>
                        )}
                      </div>
                      {reading ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300 bg-white text-violet-700 lg:hidden"
                          type="button"
                          onClick={() =>
                            setDialog({
                              mode: "add",
                              reading: { slot: slot.key },
                            })
                          }
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {reading ? (
                      <div className="mt-3 hidden justify-end gap-2 lg:flex">
                        <button
                          className="flex h-10 w-12 items-center justify-center rounded-lg border bg-white cursor-pointer"
                          type="button"
                          onClick={() => setDialog({ mode: "edit", reading })}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-10 w-12 items-center justify-center rounded-lg border bg-white text-red-500 cursor-pointer"
                          type="button"
                          onClick={() => setDialog({ mode: "delete", reading })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="mt-6 hidden h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-500 bg-white font-semibold text-violet-700 lg:flex cursor-pointer"
                        type="button"
                        onClick={() =>
                          setDialog({
                            mode: "add",
                            reading: { slot: slot.key },
                          })
                        }
                      >
                        <Plus className="h-5 w-5" />
                        Add
                      </button>
                    )}
                  </article>
                );
              })}
            </section>
            <section className="mt-5 hidden rounded-2xl border border-violet-200 bg-white p-5 lg:block">
              <h2 className="flex items-center gap-3 text-lg font-extrabold">
                <List className="h-6 w-6 text-violet-700" />
                Daily Summary
              </h2>
              <div className="mt-5 grid grid-cols-4 divide-x">
                <Summary
                  icon={ArrowUp}
                  label="Highest"
                  value={high}
                  tone="red"
                />
                <Summary
                  icon={ArrowDown}
                  label="Lowest"
                  value={low}
                  tone="green"
                />
                <Summary
                  icon={Sigma}
                  label="Average"
                  value={average}
                  tone="violet"
                />
                <Summary
                  icon={List}
                  label="Total Readings"
                  value={`${count} of 4`}
                  tone="blue"
                  noUnit
                />
              </div>
            </section>
          </>
        )}
      </div>
      {toast && (
        <div className="fixed right-5 top-5 z-[60] flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 font-semibold text-emerald-800 shadow-xl">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          {toast}
          <button type="button" onClick={() => setToast("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {dialog && (
        <ReadingModal
          mode={dialog.mode}
          reading={dialog.reading}
          selectedDate={selectedDate}
          onClose={() => setDialog(null)}
          onSaved={saved}
        />
      )}
    </AppLayout>
  );
}

export default Dashboard;
