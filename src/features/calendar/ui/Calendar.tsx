"use client";

import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ru";
import type { DayData } from "../../../types/calendar.types";
import { JSX } from "react";

dayjs.locale("ru");

interface CalendarProps {
  data: Record<string, DayData>;
  selected: string;
  onSelect: (d: string) => void;
  currentMonth: Dayjs;
  onMonthChange: (d: Dayjs) => void;
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function Calendar({ data, selected, onSelect, currentMonth, onMonthChange }: CalendarProps) {
  const start = currentMonth.startOf("month");

  const end = currentMonth.endOf("month");

  const today = dayjs().format("YYYY-MM-DD");

  const days: JSX.Element[] = [];

  const firstDay = start.day() === 0 ? 6 : start.day() - 1;

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    const key = current.format("YYYY-MM-DD");

    const day = data?.[key];

    const isSelected = key === selected;

    const isToday = key === today;

    let icon = "";

    if (day?.hasGoals) {
      if (day.done === day.total) {
        icon = "✅";
      } else if (key < today) {
        icon = "❌";
      } else {
        icon = "🎯";
      }
    }

    if (day?.hasTasks) {
      icon = icon ? `${icon} 📑` : "📑";
    }

    days.push(
      <button
        key={key}
        onClick={() => onSelect(key)}
        className={`
          min-h-[50px]
          sm:min-h-[75px]
          rounded-2xl
          border
          p-1.5
          sm:p-2
          transition
          flex
          flex-col
          justify-between
          overflow-hidden
          ${isSelected ? "border-green-600 bg-white" : "border-gray-700 bg-[#0a1121]"}
          ${isToday ? "ring-2 ring-blue-400" : ""}
        `}
      >
        <div className="flex items-start justify-between gap-1">
          <span
            className={`
              text-xs
              sm:text-sm

              font-bold

              ${isSelected ? "text-black" : "text-white"}
            `}
          >
            {current.date()}
          </span>
          <span
            className="
              hidden
              sm:block
              text-xs
            "
          >
            {icon}
          </span>
        </div>
        <div className="sm:hidden text-[8px] leading-none">{icon}</div>
        {day?.total > 0 && (
          <div className="mt-1">
            <div
              className={`

                h-1
                rounded-full

                ${isSelected ? "bg-black/20" : "bg-white/20"}
              `}
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-green-500
                "
                style={{
                  width: `${day.percent}%`
                }}
              />
            </div>
          </div>
        )}
      </button>
    );
    current = current.add(1, "day");
  }

  return (
    <div className="px-1 sm:px-0">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => onMonthChange(currentMonth.subtract(1, "month"))}
          className="
            rounded-xl
            border
            border-gray-700
            bg-[#0a1121]
            px-3
            py-2
            text-sm
            text-white
            transition
            hover:bg-white/5
          "
        >
          ←
        </button>
        <div className="text-base font-bold capitalize text-white sm:text-xl">{currentMonth.format("MMMM YYYY")}</div>
        <button
          onClick={() => onMonthChange(currentMonth.add(1, "month"))}
          className="
            rounded-xl
            border
            border-gray-700
            bg-[#0a1121]
            px-3
            py-2
            text-sm
            text-white
            transition
            hover:bg-white/5
          "
        >
          →
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-3">
        {weekDays.map((d) => (
          <div
            key={d}
            className="
                text-center
                text-[10px]
                sm:text-sm
                font-medium
                text-gray-400
              "
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-3">{days}</div>
    </div>
  );
}
