"use client";

import { useState } from "react";
import { api } from "../../../shared/api/axios";
import { useQueryClient } from "@tanstack/react-query";

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title) {
      alert("Введите название");
      return;
    }

    try {
      setLoading(true);

      await api.post("/tasks", {
        title,
        description,
        date
      });

      qc.invalidateQueries({
        queryKey: ["day"]
      });

      qc.invalidateQueries({
        queryKey: ["month"]
      });

      onClose();
    } catch {
      alert("Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className="
          hide-scrollbar
          relative
          w-full
          max-w-lg
          rounded-2xl
          border
          border-gray-700
          bg-[#0a1121]
          p-6
          text-white
          shadow-2xl
          max-h-[90vh]
          overflow-y-auto
          [scrollbar-width:none]
          [-ms-overflow-style:none]
        "
      >
        <button onClick={onClose} className="absolute right-3 top-3 text-xl text-gray-400 transition hover:text-white">
          ✕
        </button>
        <h2 className="mb-6 text-2xl font-bold">Создать задачу 📝</h2>
        <div className="space-y-4">
          <input
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-700
              bg-black/40
              p-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              min-h-[120px]
              w-full
              rounded-xl
              border
              border-gray-700
              bg-black/40
              p-3
              text-white
              outline-none
              focus:border-blue-500
            "
          />
          <div>
            <div className="mb-2 text-sm text-gray-400">Дата выполнения</div>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-gray-700
                bg-black/40
                p-3
                text-white
                outline-none
                focus:border-blue-500
                [color-scheme:dark]
              "
            />
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="
                rounded-xl
                border
                border-gray-700
                px-5
                py-2
                transition
                hover:bg-white/10
              "
            >
              Отмена
            </button>

            <button
              onClick={create}
              disabled={loading}
              className="
                rounded-xl
                bg-green-600
                px-5
                py-2
                transition
                hover:bg-green-700
                disabled:opacity-50
              "
            >
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
