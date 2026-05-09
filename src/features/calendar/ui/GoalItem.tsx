"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";
import type { Goal, GoalProgress } from "../../../types/goal.types";

interface GoalItemProps {
  goal: Goal & {
    completedSlots?: string[];
    day?: GoalProgress;
    total?: GoalProgress;
    isFailed?: boolean;
  };
  date: string;
}

export function GoalItem({ goal, date }: GoalItemProps) {
  const router = useRouter();

  const qc = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unmarkOpen, setUnmarkOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [password, setPassword] = useState("");
  const [unmarkPassword, setUnmarkPassword] = useState("");

  const today = dayjs().format("YYYY-MM-DD");

  const isFuture = date > today;

  const isFailed = goal?.isFailed ?? false;
  const isApproved = goal?.status === "APPROVED";
  const slots = goal?.slots || [];
  const completedSlots = goal?.completedSlots || [];

  const day =
    goal?.day ??
    ({
      total: 0,
      done: 0,
      percent: 0
    } satisfies GoalProgress);

  const total =
    goal?.total ??
    ({
      total: 0,
      done: 0,
      percent: 0
    } satisfies GoalProgress);

  const sortedSlots = [...slots].sort((a, b) => {
    const get = (s: string) => {
      if (s === "morning") return 6;

      if (s === "day") return 12;

      if (s === "evening") return 18;

      if (/^\d{2}:\d{2}$/.test(s)) {
        const [h, m] = s.split(":").map(Number);

        return h + m / 60;
      }

      if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(s)) {
        const [start] = s.split("-");

        const [h, m] = start.split(":").map(Number);

        return h + m / 60;
      }

      return 999;
    };

    return get(a) - get(b);
  });

  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["day", date]
    });

    qc.invalidateQueries({
      queryKey: ["month"]
    });
  };

  const mark = useMutation({
    mutationFn: (slot: string) =>
      api.post(`/goals/${goal.id}/mark`, {
        date,
        timeSlot: slot
      }),

    onSuccess: refresh
  });

  const unmark = useMutation({
    mutationFn: () =>
      api.post(`/goals/${goal.id}/unmark`, {
        date,
        timeSlot: selectedSlot,
        password: unmarkPassword
      }),

    onSuccess: () => {
      refresh();

      setUnmarkOpen(false);

      setSelectedSlot("");

      setUnmarkPassword("");
    }
  });

  const deleteGoal = useMutation({
    mutationFn: (password: string) =>
      api.post(`/goals/${goal.id}/delete-request`, {
        password
      }),

    onSuccess: () => {
      refresh();

      setDeleteOpen(false);

      setPassword("");
    }
  });

  const createAppeals = () => {
    router.push(`/appeals?goalId=${goal.id}&date=${date}`);
  };

  if (!isApproved) return null;

  return (
    <>
      <div className="space-y-3 rounded-xl border p-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="break-words font-semibold">Цель: {goal.title}</h3>
            {goal.description && <p className="break-words text-sm text-gray-300">Описание: {goal.description}</p>}
            {goal.dream && (
              <div className="mt-2 rounded border p-2">
                <div className="break-words text-sm font-medium">
                  Мечта 🌟:{" "}
                  <a href={goal.dream.description} target="_blank" className="text-blue-400 underline">
                    {goal.dream.title}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {isFailed && (
              <button className="text-xs text-yellow-600" onClick={() => createAppeals()}>
                обжаловать
              </button>
            )}
            <button onClick={() => router.push(`/notifications?goalId=${goal.id}`)} className="text-xs text-blue-400">
              🔔
            </button>
            <button onClick={() => setDeleteOpen(true)} className="text-xs text-red-500">
              ❌
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedSlots.map((slot) => {
            const done = completedSlots.includes(slot);
            return (
              <button
                key={slot}
                disabled={!isApproved || isFuture || isFailed}
                onClick={() => {
                  if (done) {
                    setSelectedSlot(slot);

                    setUnmarkOpen(true);

                    return;
                  }

                  mark.mutate(slot);
                }}
                className={`rounded border px-3 py-1 text-sm

                  ${done ? "bg-green-500 text-white" : ""}

                  ${!isApproved || isFuture || isFailed ? "cursor-not-allowed opacity-40" : ""}
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
        {isFailed && <div className="text-sm text-red-500">Цель провалена ❌</div>}
        <div>
          <div className="mb-1 text-xs text-gray-400">Прогресс за день</div>
          <div className="h-2 rounded bg-gray-200">
            <div
              className="h-full rounded bg-blue-500"
              style={{
                width: `${day.percent}%`
              }}
            />
          </div>
          <div className="mt-1 text-xs">
            {day.done}/{day.total} ({day.percent}%)
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-400">Общий прогресс цели</div>
          <div className="h-2 rounded bg-gray-200">
            <div
              className="h-full rounded bg-green-500"
              style={{
                width: `${total.percent}%`
              }}
            />
          </div>
          <div className="mt-1 text-xs">
            {total.done}/{total.total} ({total.percent}%)
          </div>
        </div>
      </div>
      {unmarkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-[#0a1121] p-6 text-white shadow-2xl">
            <button onClick={() => setUnmarkOpen(false)} className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white">
              ✕
            </button>
            <h2 className="mb-4 text-xl font-bold">Отмена выполнения</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Для отмены выполнения введи пароль от аккаунта.</p>
              <div className="rounded-xl border border-gray-700 bg-black/40 p-3 text-sm text-gray-300">
                Слот: <span className="text-white">{selectedSlot}</span>
              </div>
              <input type="password" value={unmarkPassword} onChange={(e) => setUnmarkPassword(e.target.value)} placeholder="Пароль" className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-yellow-500" />
              <button disabled={!unmarkPassword || unmark.isPending} onClick={() => unmark.mutate()} className="w-full rounded-xl bg-yellow-600 p-3 font-medium transition hover:bg-yellow-700 disabled:opacity-50">
                {unmark.isPending ? "Отмена..." : "Отменить выполнение"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-[#0a1121] p-6 text-white shadow-2xl">
            <button onClick={() => setDeleteOpen(false)} className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white">
              ✕
            </button>
            <h2 className="mb-4 text-xl font-bold">Удаление цели</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Для удаления цели введи пароль от аккаунта.</p>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-white outline-none focus:border-red-500" />
              <button disabled={!password || deleteGoal.isPending} onClick={() => deleteGoal.mutate(password)} className="w-full rounded-xl bg-red-600 p-3 font-medium transition hover:bg-red-700 disabled:opacity-50">
                {deleteGoal.isPending ? "Удаление..." : "Удалить цель"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
