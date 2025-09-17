import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-12 max-w-4xl w-full">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/logo_gul-tekin.png"
            alt="Gül-Tekin Mühendislik"
            width={200}
            height={200}
            priority
            className="rounded-lg shadow-2xl"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 dark:text-white">
            Gül-Tekin Mühendislik
          </h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl">
            Modern web teknolojileri ile güçlendirilmiş kurumsal çözümler
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Cloudinary</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Medya yönetimi ve optimizasyon çözümleri
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Neon PostgreSQL</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Serverless veritabanı altyapısı
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Inngest</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Event-driven iş akışı yönetimi
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/api/test-cloudinary"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Test Cloudinary
          </a>
          <a
            href="/api/test-neon"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Test Neon DB
          </a>
          <a
            href="/api/test-inngest"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Test Inngest
          </a>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; 2025 Gül-Tekin Mühendislik. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}