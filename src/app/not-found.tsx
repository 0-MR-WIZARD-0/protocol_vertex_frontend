import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        bg-[#060b16]
        px-4
        text-white
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-gray-700
          bg-[#0a1121]
          p-8
          text-center
          shadow-2xl
        "
      >
        <div className="text-7xl font-bold text-red-500">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          Страница не найдена
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Возможно страница была удалена
          или ссылка введена неверно.
        </p>
        <Link
          href="/dashboard"
          className="
            mt-6
            inline-flex
            rounded-2xl
            bg-green-600
            px-5
            py-3
            font-medium
            transition
            hover:bg-green-700
          "
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}