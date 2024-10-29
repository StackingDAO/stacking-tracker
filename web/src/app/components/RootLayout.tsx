// @ts-nocheck

"use client";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export function RootLayout({ signOut, children }) {
  return (
    <div className="relative flex flex-auto overflow-hidden">
      <div className="relative flex flex-col w-full">
        <Header />

        <main>
          <div className="mx-auto max-w-6xl p-6 lg:px-8 w-full">
            <div className="flex flex-col justify-between w-full">
              {children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
