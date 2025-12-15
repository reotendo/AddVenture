export const metadata = {
  title: "AddVenture",
  description: "未知を開拓する初めの一歩を",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
