
import React, { useState } from 'react';
import { AUDIENCE_OPTIONS } from '../constants';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (topic: string, audience: string) => void;
  isLoading: boolean;
}

const SUGGESTED_TOPICS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning"
];

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[2].value); // Default to High School

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, audience);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-serif font-medium flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          Curriculum Architect
        </h2>
        <p className="text-slate-400 text-sm mt-1">Define your subject and audience level below.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Subject / Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Neural Networks, Logic Gates, Supervised Learning..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all outline-none text-slate-800 placeholder-slate-400"
            disabled={isLoading}
            autoComplete="off"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide self-center mr-1">
              Popular:
            </span>
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleSuggestionClick(t)}
                disabled={isLoading}
                className="px-3 py-1 text-xs font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="audience" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Target Audience
          </label>
          <div className="relative">
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all outline-none text-slate-800 appearance-none cursor-pointer"
              disabled={isLoading}
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
            ${isLoading || !topic.trim() 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:shadow-lg hover:from-sky-500 hover:to-indigo-500'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Microlesson
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;
