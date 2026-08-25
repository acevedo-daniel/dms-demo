import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50 text-center p-6">
      <div className="text-7xl mb-4 animate-bounce">🦷</div>
      <p className="mt-3 text-lg text-gray-700">
        <span className="text-2xl font-bold text-primary ">¡Oops!</span> Esta
        página se perdió como un diente de leche.
      </p>
      <p className="text-gray-600 mt-1">
        Pero no te preocupes, ¡seguimos sonriendo juntos! 😁
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-2xl shadow hover:bg-primary/80 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
