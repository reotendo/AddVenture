import "./globals.css";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="mx-auto min-h-screen max-w-md bg-gray-50 shadow-xl">
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

