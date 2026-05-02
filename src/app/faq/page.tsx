"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Lumina?",
    answer: "Lumina is an AI-powered visual builder that helps you create stunning, high-performance websites without writing a single line of code. It provides an intuitive interface with beautifully crafted templates and components.",
  },
  {
    question: "Is Lumina free to use?",
    answer: "Yes, Lumina offers a free tier that gives you access to basic templates and components. For advanced features, premium templates, and priority support, we offer scalable pro plans.",
  },
  {
    question: "Can I export my code?",
    answer: "Absolutely. Lumina generates clean, production-ready React/Next.js code with Tailwind CSS that you can easily export and host anywhere you like.",
  },
  {
    question: "Do you support custom domains?",
    answer: "Yes, users on our paid plans can easily connect custom domains to their published Lumina projects with just a few clicks.",
  },
  {
    question: "How do I get help if I'm stuck?",
    answer: "You can reach out to our community Discord, check our detailed documentation, or contact us directly via email at charlesplaton263@gmail.com.",
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-black/60 dark:text-white/60">
            Everything you need to know about Lumina and how it works.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                <ChevronDown 
                  className={`w-5 h-5 text-black/50 dark:text-white/50 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 text-black/70 dark:text-white/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
          <p className="text-black/60 dark:text-white/60 mb-6">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <a 
            href="/support" 
            className="inline-flex px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get in touch
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
