"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";

export function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);

  const [openRepeat, setOpenRepeat] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [deadline, setDeadline] = useState("");
  const [repeatType, setRepeatType] = useState("DAILY");
  const [isDream, setIsDream] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState("");
  const [interval, setIntervalValue] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamDescription, setDreamDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const addSlot = (slot: string) => {
    if (!slots.includes(slot)) {
      setSlots((prev) => [...prev, slot]);
    }
  };

  const addCustomTime = () => {
    if (!/^\d{2}:\d{2}$/.test(customTime)) {
      alert("Формат времени: 13:00");
      return;
    }

    if (!slots.includes(customTime)) {
      setSlots((prev) => [...prev, customTime]);
    }

    setCustomTime("");
  };

  const addInterval = () => {
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(interval)) {
      alert("Формат интервала: 14:00-16:00");
      return;
    }

    const [start, end] = interval.split("-");

    if (start >= end) {
      alert("Интервал не может идти назад");
      return;
    }

    if (!slots.includes(interval)) {
      setSlots((prev) => [...prev, interval]);
    }

    setIntervalValue("");
  };

  const removeSlot = (slot: string) => {
    setSlots((prev) => prev.filter((s) => s !== slot));
  };

  const create = async () => {
    if (!title || !deadline) {
      alert("Заполни обязательные поля");
      return;
    }

    if (startDate < today) {
      alert("Нельзя создать цель в прошлом");
      return;
    }

    if (deadline < today) {
      alert("Дедлайн не может быть в прошлом");
      return;
    }

    if (isDream && (!dreamTitle || !dreamDescription)) {
      alert("Заполни поля мечты");
      return;
    }

    const finalSlots = slots.length > 0 ? slots : ["day"];

    try {
      setLoading(true);

      await api.post("/goals", {
        title,
        description: description || null,
        startDate,
        deadline,
        repeatType,
        repeatDays: [],
        slots: finalSlots,
        isDream,
        dreamTitle,
        dreamDescription
      });

      qc.invalidateQueries({
        queryKey: ["day"]
      });

      qc.invalidateQueries({
        queryKey: ["month"]
      });

      onClose();
    } catch (e) {
      console.error(e);

      alert("Ошибка создания цели");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-gray-700 bg-[#0a1121] p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none]
  [-ms-overflow-style:none]"
      >
        <button onClick={onClose} className="absolute right-3 top-3 text-xl text-gray-400 transition hover:text-white">
          ✕
        </button>
        <h2 className="mb-6 text-2xl font-bold">Создать цель 🎯</h2>
        <div className="space-y-4">
          <input required placeholder="Название цели" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />
          <textarea placeholder="Описание (необязательно)" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px] w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm text-gray-400">Начало</div>
              <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500 [color-scheme:dark]" />
            </div>
            <div>
              <div className="mb-2 text-sm text-gray-400">Дедлайн</div>
              <input type="date" min={today} value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500 [color-scheme:dark]" />
            </div>
          </div>
          <div className="relative">
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Периодичность</div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenRepeat((prev) => !prev)}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-700
                    bg-black/40
                    p-3
                    text-left
                    text-white
                    transition
                    hover:border-blue-500
                  "
                >
                  {
                    {
                      DAILY: "Каждый день",
                      WEEKDAYS: "Будни",
                      WEEKENDS: "Выходные"
                    }[repeatType]
                  }
                </button>

                {openRepeat && (
                  <div
                    className="
                  absolute
                  z-50
                  mt-2
                  w-full
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#0a1121]
                  shadow-2xl
                "
                  >
                    {[
                      {
                        value: "DAILY",
                        label: "Каждый день"
                      },
                      {
                        value: "WEEKDAYS",
                        label: "Будни"
                      },
                      {
                        value: "WEEKENDS",
                        label: "Выходные"
                      }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setRepeatType(item.value);

                          setOpenRepeat(false);
                        }}
                        className={`
                        w-full
                        px-4
                        py-3
                        text-left
                        transition

                        hover:bg-white/10

                        ${repeatType === item.value ? "bg-blue-600/20 text-blue-300" : "text-white"}
                      `}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-300">Когда выполнять</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addSlot("morning")} className="rounded-xl border border-gray-700 px-4 py-2 transition hover:bg-white/10">
                🌅 Утро
              </button>
              <button onClick={() => addSlot("day")} className="rounded-xl border border-gray-700 px-4 py-2 transition hover:bg-white/10">
                ☀️ День
              </button>
              <button onClick={() => addSlot("evening")} className="rounded-xl border border-gray-700 px-4 py-2 transition hover:bg-white/10">
                🌙 Вечер
              </button>
            </div>
            <div className="flex gap-2">
              <input value={customTime} onChange={(e) => setCustomTime(e.target.value)} placeholder="13:00" className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />
              <button onClick={addCustomTime} className="rounded-xl bg-blue-600 px-4 transition hover:bg-blue-700">
                +
              </button>
            </div>
            <div className="flex gap-2">
              <input value={interval} onChange={(e) => setIntervalValue(e.target.value)} placeholder="14:00-16:00" className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />

              <button onClick={addInterval} className="rounded-xl bg-blue-600 px-4 transition hover:bg-blue-700">
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => removeSlot(s)} className="rounded-full border border-blue-500/40 bg-blue-600/20 px-3 py-1 text-sm text-blue-300 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300">
                  {s} ✕
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-700 bg-black/30 p-4">
            <input type="checkbox" checked={isDream} onChange={(e) => setIsDream(e.target.checked)} className="h-4 w-4" />

            <div>
              <div className="font-medium">Осуществить мечту 🌟</div>

              <div className="text-xs text-gray-400">Такая цель требует модерации</div>
            </div>
          </label>
          {isDream && (
            <div className="space-y-4">
              <input placeholder="Название мечты" value={dreamTitle} onChange={(e) => setDreamTitle(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />

              <textarea placeholder="Описание / ссылка" value={dreamDescription} onChange={(e) => setDreamDescription(e.target.value)} className="min-h-[100px] w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-blue-500" />
            </div>
          )}
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={onClose} className="rounded-xl border border-gray-700 px-5 py-2 transition hover:bg-white/10">
              Отмена
            </button>
            <button onClick={create} disabled={loading} className="rounded-xl bg-green-600 px-5 py-2 transition hover:bg-green-700 disabled:opacity-50">
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
