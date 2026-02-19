import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Globe, FileText, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (prompt: string, url: string, type: 'article' | 'webpage') => void;
  isGenerating: boolean;
}

export function InputSection({ onGenerate, isGenerating }: InputSectionProps) {
  const [prompt, setPrompt] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [type, setType] = React.useState<'article' | 'webpage'>('webpage');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !url.trim()) return;
    onGenerate(prompt, url, type);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
          Idea Forge
        </h1>
        <p className="text-slate-500 text-lg font-light">
          Transform thoughts and URLs into enriched content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-slate-700 uppercase tracking-wider">
            Your Idea / Thought
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., The future of sustainable architecture in urban environments..."
            className="w-full h-48 p-4 rounded-xl bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 transition-all resize-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-slate-700 uppercase tracking-wider">
            Reference URL (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('article')}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all",
              type === 'article'
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">Article</span>
          </button>
          <button
            type="button"
            onClick={() => setType('webpage')}
            className={cn(
              "flex items-center justify-center gap-2 p-4 rounded-xl border transition-all",
              type === 'webpage'
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">Webpage</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isGenerating || (!prompt && !url)}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Forging...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Content</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
