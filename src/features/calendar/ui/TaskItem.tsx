"use client";

import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/api/axios";
import type { Task } from "../../../types/task.types";

interface TaskItemProps {
  task: Task;
  date: string;
}

export function TaskItem({ task, date }: TaskItemProps) {
  const qc = useQueryClient();

  const today = dayjs().format("YYYY-MM-DD");

  const isFuture = dayjs(task.date).format("YYYY-MM-DD") > today;

  const refresh = async () => {
    await qc.refetchQueries({
      queryKey: ["day", date]
    });

    await qc.refetchQueries({
      queryKey: ["month"]
    });
  };

  const toggle = useMutation({
    mutationFn: () => api.post(`/tasks/${task.id}/toggle`),

    onSuccess: refresh
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),

    onSuccess: refresh
  });

  const move = useMutation({
    mutationFn: (newDate: string) =>
      api.post(`/tasks/${task.id}/move`, {
        date: newDate
      }),

    onSuccess: refresh
  });

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-2xl
        border
        border-gray-700
        bg-[#0a1121]
        p-3
        text-white
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          disabled={isFuture}
          onClick={() => toggle.mutate()}
          className={`
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-md
            border
            text-xs
            transition
            ${task.isDone ? "border-green-500 bg-green-500 text-white" : "border-gray-500"}
            ${isFuture ? "cursor-not-allowed opacity-40" : ""}
          `}
        >
          {task.isDone && "✓"}
        </button>
        <div className="min-w-0">
          <div
            className={`

              break-words
              font-medium

              ${task.isDone ? "line-through text-gray-400" : ""}
            `}
          >
            Задача: {task.title}
          </div>
          {task.description && (
            <div
              className={`

                mt-1
                break-words

                text-xs
                text-gray-400

                ${task.isDone ? "line-through" : ""}
              `}
            >
              Описание: {task.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input
          type="date"
          min={dayjs().format("YYYY-MM-DD")}
          value={dayjs(task.date).format("YYYY-MM-DD")}
          disabled={task.isDone}
          onChange={(e) => move.mutate(e.target.value)}
          className={`
            rounded-xl
            border
            border-gray-700
            bg-black/40
            px-2
            py-1
            text-xs
            text-white
            outline-none
            [color-scheme:dark]
            ${task.isDone ? "cursor-not-allowed opacity-40" : ""}
          `}
        />
        <button onClick={() => remove.mutate()} className="text-xs text-red-500 transition hover:text-red-400">
          ❌
        </button>
      </div>
    </div>
  );
}
