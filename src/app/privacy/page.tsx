"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert">
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">1. Introduction</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            Welcome to Lumina. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">2. Data We Collect</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 text-black/70 dark:text-white/70 mb-6 space-y-2">
            <li>Identity Data includes first name, last name, username or similar identifier.</li>
            <li>Contact Data includes email address and telephone numbers.</li>
            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-12 mb-4">3. How We Use Your Data</h2>
          <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            Where we need to perform the contract we are about to enter into or have entered into with you.
            Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
            Where we need to comply with a legal obligation.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
