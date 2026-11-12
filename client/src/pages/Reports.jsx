import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, CookingPot, ForkKnife, House, List, LoaderCircle, Moon, Plus, RefreshCw, Sigma, Sun, TriangleAlert,} from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import api from "../api.js";
import AppLayout from "./components/AppLayout.jsx";

const today = new Date().toLocaleDateString("en-CA");
const tabs = {
  daily: "Daily",
  "month-to-date": "Month-to-date",
  "previous-month": "Previous month",
};
const slotInfo = {
  morning_fasting: {
    label: "Morning (fasting)",
    icon: Sun,
    color: "text-amber-500",
  },
  after_breakfast: {
    label: "After breakfast",
    icon: ForkKnife,
    color: "text-emerald-500",
  },
  after_lunch: {
    label: "After lunch",
    icon: CookingPot,
    color: "text-emerald-500",
  },
  after_dinner: { label: "After dinner", icon: Moon, color: "text-violet-700" },
};
const slotOrder = {
  morning_fasting: 1,
  after_breakfast: 2,
  after_lunch: 3,
  after_dinner: 4,
};
const chartSeries = [
  {
    key: "morning_fasting",
    label: "Morning",
    stroke: "#f59e0b",
    dot: "bg-amber-500",
    active: "border-amber-400 bg-amber-50 text-amber-800",
  },
  {
    key: "after_breakfast",
    label: "After breakfast",
    stroke: "#ef4444",
    dot: "bg-red-500",
    active: "border-red-400 bg-red-50 text-red-800",
  },
  {
    key: "after_lunch",
    label: "After lunch",
    stroke: "#10b981",
    dot: "bg-emerald-500",
    active: "border-emerald-400 bg-emerald-50 text-emerald-800",
  },
  {
    key: "after_dinner",
    label: "After dinner",
    stroke: "#6d28d9",
    dot: "bg-violet-600",
    active: "border-violet-400 bg-violet-50 text-violet-800",
  },
];
const iso = (date) => date.toISOString().slice(0, 10);
const shiftDate = (value, amount, byMonth = false) => {
  const date = new Date(`${value}T00:00:00Z`);
  if (byMonth) date.setUTCMonth(date.getUTCMonth() + amount);
  else date.setUTCDate(date.getUTCDate() + amount);
  return iso(date);
};
const formatDate = (value, weekday = false) => {
  const dateOnly = String(value).slice(0, 10);
  return new Intl.DateTimeFormat("en-US", {
    ...(weekday && { weekday: "short" }),
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateOnly}T00:00:00Z`));
};
const formatShortDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${String(value).slice(0, 10)}T00:00:00Z`));
const formatTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));

function StatCard({ icon, label, value, tone, count = false }) {
  const colors = {
    red: "border-red-200 bg-red-50 text-red-500",
    green: "border-emerald-200 bg-emerald-50 text-emerald-600",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    blue: "border-blue-200 bg-blue-50 text-blue-600",
  };
  return (
    <div
      className={`flex min-h-[82px] items-center gap-3 rounded-xl border p-4 ${colors[tone]}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">
        {createElement(icon, { className: "h-5 w-5" })}
      </span>
      <div className="text-[#11102f]">
        <p className="text-xs">{label}</p>
        <p className="mt-1 text-xl font-extrabold">
          {value ?? "—"}
          {!count && value !== null && (
            <span className="ml-1 text-sm font-semibold">mg/dl</span>
          )}
        </p>
      </div>
    </div>
  );
}

function Reports() {
  const [tab, setTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(today);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get("/reports", { params: { type: tab, date: selectedDate } })
      .then(({ data }) => {
        if (active) {
          setReport(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message ||
              "Could not load report. Please try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, selectedDate, requestVersion]);

  const changeTab = (nextTab) => {
    if (nextTab === tab) return;
    setReport(null);
    setError("");
    setLoading(true);
    setTab(nextTab);
  };
  const changeDate = (nextDate) => {
    if (!nextDate || nextDate === selectedDate) return;
    setReport(null);
    setError("");
    setLoading(true);
    setSelectedDate(nextDate);
  };
  const retry = () => {
    setReport(null);
    setError("");
    setLoading(true);
    setRequestVersion((value) => value + 1);
  };
  const rangeLabel = report
    ? report.range.startDate === report.range.endDate
      ? formatDate(report.range.startDate, true)
      : `${formatDate(report.range.startDate)} - ${formatDate(report.range.endDate)}`
    : formatDate(selectedDate, true);

  return (
    <AppLayout
      pageTitle="Reports"
      pageSubtitle="View and analyze your blood glucose readings."
    >
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-12">
        <h1 className="text-2xl font-extrabold lg:hidden">Reports</h1>
        <div className="mt-5 grid grid-cols-3 rounded-xl border border-violet-200 bg-white p-1.5 lg:mt-0">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              className={`flex h-11 items-center justify-center gap-2 rounded-lg text-xs font-bold transition sm:text-sm cursor-pointer ${tab === key ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md" : "hover:bg-violet-50"}`}
              key={key}
              type="button"
              onClick={() => changeTab(key)}
            >
              <CalendarDays className="hidden h-5 w-5 sm:block" />
              <span className="lg:hidden">
                {key === "month-to-date"
                  ? "MTD"
                  : key === "previous-month"
                    ? "Prev. Month"
                    : label}
              </span>
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white hover:border-violet-400"
            type="button"
            onClick={() =>
              changeDate(shiftDate(selectedDate, -1, tab === "previous-month"))
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <label className="relative flex h-11 flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold sm:max-w-[330px] sm:text-sm">
            <CalendarDays className="h-5 w-5" />
            <span>{rangeLabel}</span>
            <input
              className="absolute inset-0 cursor-pointer opacity-0"
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => changeDate(event.target.value)}
            />
          </label>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white hover:border-violet-400 disabled:opacity-40"
            type="button"
            onClick={() =>
              changeDate(shiftDate(selectedDate, 1, tab === "previous-month"))
            }
            disabled={selectedDate >= today}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <State
            icon={LoaderCircle}
            title="Loading report..."
            message="Please wait while we fetch your data."
            spinning
          />
        ) : error ? (
          <State
            icon={TriangleAlert}
            title="Couldn't load report"
            message={error}
          >
            <button
              className="mx-auto mt-5 flex h-11 items-center gap-2 rounded-lg border border-violet-600 px-6 font-bold text-violet-700 cursor-pointer"
              type="button"
              onClick={retry}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </State>
        ) : report?.summary.count === 0 ? (
          <State
            icon={CalendarDays}
            title="No readings found"
            message={`There are no glucose readings for ${rangeLabel}. Add your readings to view a report.`}
          >
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-7 font-bold text-white"
                to="/dashboard"
              >
                <Plus className="h-5 w-5" />
                Add Reading
              </Link>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-violet-500 px-7 font-bold text-violet-700"
                to="/dashboard"
              >
                <House className="h-5 w-5" />
                Back to Readings
              </Link>
            </div>
          </State>
        ) : (
          <>
            <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                icon={ArrowUp}
                label="Highest"
                value={report.summary.highest}
                tone="red"
              />
              <StatCard
                icon={ArrowDown}
                label="Lowest"
                value={report.summary.lowest}
                tone="green"
              />
              <StatCard
                icon={Sigma}
                label="Average"
                value={Number(report.summary.average).toFixed(1)}
                tone="violet"
              />
              <StatCard
                icon={List}
                label="Readings"
                value={report.summary.count}
                tone="blue"
                count
              />
            </section>
            {tab !== "daily" && (
              <MonthlyChart readings={report.readings} range={rangeLabel} />
            )}
            <ReadingsTable
              readings={report.readings}
              title={
                tab === "daily"
                  ? "Daily Readings"
                  : tab === "month-to-date"
                    ? "Month-to-date Readings"
                    : "Previous Month Readings"
              }
              showDate={tab !== "daily"}
              range={rangeLabel}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}

function State({ icon, title, message, spinning = false, children }) {
  return (
    <section className="mt-7 rounded-2xl border border-violet-200 bg-white p-12 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700">
        {createElement(icon, {
          className: `h-9 w-9 ${spinning ? "animate-spin" : ""}`,
        })}
      </span>
      <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{message}</p>
      {children}
    </section>
  );
}

function MonthlyChart({ readings, range }) {
  const [activeSeries, setActiveSeries] = useState("all");
  const rowsByDate = new Map();
  [...readings]
    .sort((first, second) => {
      const dateDifference = String(first.reading_date)
        .slice(0, 10)
        .localeCompare(String(second.reading_date).slice(0, 10));
      return dateDifference || slotOrder[first.slot] - slotOrder[second.slot];
    })
    .forEach((reading) => {
      const dateKey = String(reading.reading_date).slice(0, 10);
      const row = rowsByDate.get(dateKey) || {
        date: formatShortDate(dateKey),
        fullDate: formatDate(dateKey),
      };
      row[reading.slot] = Number(reading.value);
      rowsByDate.set(dateKey, row);
    });
  const data = [...rowsByDate.values()];

  return (
    <section className="mt-6 rounded-2xl border border-violet-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold">Glucose Trend</h2>
          <p className="mt-1 text-sm text-slate-500">
            Readings by time slot across the selected month
          </p>
        </div>
        <span className="text-sm text-slate-600">{range}</span>
      </div>
      <div
        className="mt-5 flex flex-wrap items-center gap-2"
        aria-label="Filter chart by time slot"
      >
        {chartSeries.map((series) => (
          <button
            className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition ${activeSeries === series.key ? series.active : activeSeries === "all" ? "border-slate-200 bg-white text-slate-700 hover:border-violet-300" : "border-slate-200 bg-white text-slate-400 hover:text-slate-700"}`}
            key={series.key}
            type="button"
            onClick={() => setActiveSeries(series.key)}
            aria-pressed={activeSeries === series.key}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${series.dot}`} />
            {series.label}
          </button>
        ))}
        {activeSeries !== "all" && (
          <button
            className="h-9 rounded-full border border-violet-400 bg-violet-50 px-4 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
            type="button"
            onClick={() => setActiveSeries("all")}
          >
            Show all readings
          </button>
        )}
      </div>
      <div className="mt-5 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 18, left: -18, bottom: 8 }}
          >
            <CartesianGrid
              stroke="#ede9fe"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              domain={["dataMin - 20", "dataMax + 20"]}
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.fullDate || ""
              }
              formatter={(value, name) => [`${value} mg/dl`, name]}
            />
            {chartSeries
              .filter(
                (series) =>
                  activeSeries === "all" || activeSeries === series.key,
              )
              .map((series) => (
                <Line
                  key={series.key}
                  name={series.label}
                  type="monotone"
                  dataKey={series.key}
                  stroke={series.stroke}
                  strokeWidth={3}
                  connectNulls
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ReadingsTable({ readings, title, showDate, range }) {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(readings.length / pageSize));
  const visibleReadings = readings.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-lg font-extrabold">
          <List className="h-6 w-6 text-violet-700" />
          {title}
        </h2>
        <span className="hidden text-sm sm:block">{range}</span>
      </div>
      <div
        className={`mt-4 hidden rounded-lg bg-violet-50 px-4 py-2 text-sm font-bold lg:grid ${showDate ? "grid-cols-[1fr_1.2fr_1fr_1fr]" : "grid-cols-[1.2fr_1fr_1fr]"}`}
      >
        {showDate && <span>Date</span>}
        <span>Time Slot</span>
        <span>Reading (mg/dl)</span>
        <span>Recorded At</span>
      </div>
      <div className="divide-y divide-slate-200">
        {visibleReadings.map((reading) => {
          const info = slotInfo[reading.slot];
          const Icon = info.icon;
          return (
            <div
              className={`grid grid-cols-[1fr_auto] items-center gap-3 py-3 lg:px-4 ${showDate ? "lg:grid-cols-[1fr_1.2fr_1fr_1fr]" : "lg:grid-cols-[1.2fr_1fr_1fr]"}`}
              key={reading.id}
            >
              {showDate && (
                <span className="hidden text-sm lg:block">
                  {formatDate(reading.reading_date)}
                </span>
              )}
              <div className="flex items-center gap-3">
                <Icon className={`h-6 w-6 ${info.color}`} />
                <div>
                  <p className="text-sm font-bold">{info.label}</p>
                  {showDate && (
                    <p className="text-xs text-slate-500 lg:hidden">
                      {formatDate(reading.reading_date)}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-center text-xs font-bold lg:w-[62px] ${reading.value > 125 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
              >
                {reading.value}
                <span className="ml-1 lg:hidden">mg/dl</span>
              </span>
              <span className="hidden text-sm lg:block">
                {formatTime(reading.created_at)}
              </span>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
          <p className="text-sm text-slate-600">
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, readings.length)} of {readings.length}{" "}
            readings
          </p>
          <div className="flex items-center gap-2">
            <button
              className="flex h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-2 text-sm font-bold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              className="flex h-10 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Reports;
