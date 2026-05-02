"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert">
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">1. Agreement to Terms</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            By viewing or using this website, which can be accessed at Lumina, you agree to be bound by all of these Website Terms of Service and agree with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site or using our services.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">2. Use License</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials on Lumina's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 text-black/70 dark:text-white/70 mb-6 space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on Lumina's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-12 mb-4">3. Disclaimer</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            All the materials on Lumina's website are provided "as is". Lumina makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Lumina does not make any representations concerning the accuracy or reliability of the use of the materials on its website or otherwise relating to such materials or any sites linked to this website.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
