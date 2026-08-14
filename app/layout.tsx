import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Task Manager",
  description: "A full-stack task manager built with Next.js, Prisma, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900 antialiased">
        <div className="mx-auto max-w-3xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}
