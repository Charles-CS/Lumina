"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support & Help Center</h1>
        <p className="text-lg text-black/60 dark:text-white/60 mb-12">
          We're here to help. Choose the best way to get assistance with Lumina.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Support</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6">
              Get in touch with our support team directly. We aim to respond within 24 hours.
            </p>
            <a href="mailto:charlesplaton263@gmail.com" className="mt-auto px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Contact Us
            </a>
          </div>

          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Discord</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6">
              Join our active community of developers and designers for quick help.
            </p>
            <a href="https://discord.gg/PaZVdZav" target="_blank" rel="noopener noreferrer" className="mt-auto px-6 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white rounded-lg text-sm font-semibold transition-colors border border-black/10 dark:border-white/10">
              Join Discord
            </a>
          </div>

          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="w-6 h-6 text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-6">
              Find answers to the most commonly asked questions about Lumina.
            </p>
            <a href="/faq" className="mt-auto px-6 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white rounded-lg text-sm font-semibold transition-colors border border-black/10 dark:border-white/10">
              Read FAQs
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
