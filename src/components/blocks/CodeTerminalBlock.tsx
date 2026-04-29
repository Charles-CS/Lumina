import React from "react";
import { BlockPreviewProps } from "./BlockPrimitives";
import { Copy, Terminal } from "lucide-react";

export function CodeTerminalBlock({ title, subtitle, baseColor, visuals, code: propCode, fileName: propFileName }: BlockPreviewProps) {
  const accent = baseColor || "#a78bfa";
  const radius = visuals?.borderRadius ? `${visuals?.borderRadius}px` : "24px";
  
  const code = propCode || `import { serve } from '@lumina/server';
import { api } from './routes';

const app = serve({
  routes: api,
  port: 3000,
  tls: { mode: 'modern' }
});

console.log(\`✨ Lumina Engine running on port \${app.port}\`);`;

  const fileName = propFileName || "server.ts — Lumina";

  return (
    <div className="w-full py-16 @md:py-24 px-4 @md:px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 @md:flex-row @md:items-center">
        
        <div className="flex flex-col gap-4 @md:w-1/2">
          <Terminal size={32} style={{ color: accent }} className="mb-2" />
          <h2 className="text-3xl @md:text-5xl font-bold tracking-tight text-white mb-2">
            {title || "Deploy in seconds."}
          </h2>
          <p className="text-lg text-white/50 max-w-sm font-light">
            {subtitle || "No configuration needed. Just hit push and watch your application automatically build, test, and deploy globally."}
          </p>
        </div>

        <div className="@md:w-1/2 w-full pt-8 @md:pt-0 relative">
          {/* Editor Window */}
          <div 
            className="w-full bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl relative z-10"
            style={{ borderRadius: radius }}
          >
            {/* Window header */}
            <div className="flex items-center px-4 py-3 bg-[#111] border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/50" />
              </div>
              <div className="flex-1 text-center pr-8">
                <span className="text-[10px] font-mono text-white/30 truncate">{fileName}</span>
              </div>
              <button title="Copy code" className="text-white/30 hover:text-white transition-colors">
                 <Copy size={13} />
              </button>
            </div>
            
            {/* Code Body */}
            <div className="p-6 overflow-x-auto">
              <pre className="text-xs @md:text-sm font-mono leading-relaxed" style={{ color: "var(--foreground, #e5e7eb)" }}>
                <code>
                  {code.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-6 text-white/20 select-none inline-block text-right pr-4">{i + 1}</span>
                      <span className="text-white/80 whitespace-pre">
                        {/* Fake syntax highlighting logic via simple regex match or just render literal text for simplicity */}
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          
          {/* Background decoration */}
          <div 
            className="absolute -inset-4 blur-3xl opacity-20 -z-10 translate-y-8"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </div>
  );
}
