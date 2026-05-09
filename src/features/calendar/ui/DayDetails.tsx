"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/shared/api/axios";
import { GoalItem } from "../ui/GoalItem";
import { TaskItem } from "../ui/TaskItem";
import type { Goal, GoalProgress } from "../../../types/goal.types";
import type { Task } from "../../../types/task.types";
import type { CalendarDayResponse } from "../../../types/calendar.types";

interface DayGoal extends Goal {
  completedSlots?: string[];
  day?: GoalProgress;
  total?: GoalProgress;
  isFailed?: boolean;
}

interface DayDetailsData extends CalendarDayResponse {
  goals: DayGoal[];
  tasks: Task[];
}

interface DayDetailsProps {
  data: DayDetailsData;
  date: string;
}

export function DayDetails({ data, date }: DayDetailsProps) {
  const [tab, setTab] = useState<"goals" | "tasks">("goals");

  const { data: pendingCount } = useQuery<number>({
    queryKey: ["pending-goals"],

    queryFn: () => api.get<number>("/goals/pending-count").then((r) => r.data)
  });

  if (!data) {
    return <div className="text-sm text-white">Загрузка...</div>;
  }

  const goals = data.goals || [];

  const tasks = data.tasks || [];

  const renderTab = (
    type: "goals" | "tasks",

    label: string
  ) => {
    const isActive = tab === type;

    return (
      <button
        onClick={() => setTab(type)}
        className={`
          rounded-xl
          border
          px-3
          py-2
          text-sm
          sm:text-base
          transition
          ${isActive ? "border-green-600 bg-green-600 text-white" : "border-gray-700 text-white hover:bg-white/5"}
        `}
      >
        {label}
      </button>
    );
  };

  const emptyState = tab === "goals" ? "Нет целей" : "Задачи на день отсутствуют";

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {renderTab("goals", "Цели")}
        {renderTab("tasks", "Задачи")}
      </div>
      {!!pendingCount && pendingCount > 0 && <div className="text-center text-xs text-white sm:text-sm">Целей на модерации: {pendingCount}</div>}
      {tab === "goals" && <>{goals.length > 0 ? goals.map((goal) => <GoalItem key={goal.id} goal={goal} date={date} />) : <div className="text-center text-sm text-white">{emptyState}</div>}</>}
      {tab === "tasks" && <>{tasks.length > 0 ? tasks.map((task) => <TaskItem key={task.id} task={task} date={date} />) : <div className="text-center text-sm text-white">{emptyState}</div>}</>}
    </div>
  );
}
