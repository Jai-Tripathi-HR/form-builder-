import Link from "next/link";
import { FestiveBackground } from "@/components/registration/FestiveBackground";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 text-center">
      <FestiveBackground />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-900/5 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Page Not Found</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Lost your way?
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has moved. Return to the Garba 2026 event registration.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md shadow-slate-900/10 cursor-pointer active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Registration</span>
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-slate-400">
        Corporate Garba Gala 2026
      </footer>
    </main>
  );
}
