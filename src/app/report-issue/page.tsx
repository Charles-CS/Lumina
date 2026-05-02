"use client";

import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { useState } from "react";

export default function ReportIssuePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-page-bg text-foreground transition-colors duration-300">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Report an Issue</h1>
        <p className="text-lg text-black/60 dark:text-white/60 mb-12">
          Found a bug or experiencing technical difficulties? Let us know so we can fix it.
        </p>

        {submitted ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-6 rounded-2xl flex flex-col items-center text-center">
            <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Issue Reported Successfully</h3>
            <p className="text-sm opacity-80">
              Thank you for helping us improve Lumina. Our team will look into this right away.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Report Another Issue
            </button>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }} 
            className="space-y-6"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Issue Title</label>
              <input 
                type="text" 
                id="title" 
                required
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all"
                placeholder="E.g., Save button not working on mobile"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                id="description" 
                rows={5}
                required
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all"
                placeholder="Please describe the issue in detail. What were you trying to do? What happened instead?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="browser" className="block text-sm font-medium mb-2">Browser</label>
                <select 
                  id="browser"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all appearance-none"
                >
                  <option value="chrome">Chrome</option>
                  <option value="firefox">Firefox</option>
                  <option value="safari">Safari</option>
                  <option value="edge">Edge</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="os" className="block text-sm font-medium mb-2">Operating System</label>
                <select 
                  id="os"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all appearance-none"
                >
                  <option value="mac">macOS</option>
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity mt-4"
            >
              Submit Report
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
