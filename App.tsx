import React, { useState } from 'react';
import InputSection from './components/InputSection';
import LessonCard from './components/LessonCard';
import { Microlesson, LoadingState } from './types';
import { generateMicrolesson } from './services/geminiService';
import { GraduationCap, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [lesson, setLesson] = useState<Microlesson | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false });

  const handleGenerate = async (topic: string, audience: string) => {
    setLoadingState({ isLoading: true, error: undefined });
    setLesson(null); // Clear previous lesson
    
    try {
      const generatedLesson = await generateMicrolesson(topic, audience);
      setLesson(generatedLesson);
      setLoadingState({ isLoading: false });
    } catch (error: any) {
      setLoadingState({ 
        isLoading: false, 
        error: error.message || "An unexpected error occurred while contacting the curriculum architect." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/30 blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-sky-200/30 blur-3xl mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        
        {/* Branding Header */}
        <header className="mb-12 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl shadow-indigo-900/10 mb-4 transform hover:scale-105 transition-transform duration-500">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            MicroLearn Architect
          </h1>
          <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed font-medium">
            Instant, rigorous, and highly structured educational microlessons powered by AI.
          </p>
        </header>

        {/* Input Area */}
        <div className="w-full mb-12">
          <InputSection onGenerate={handleGenerate} isLoading={loadingState.isLoading} />
        </div>

        {/* Error Display */}
        {loadingState.error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 mb-8 animate-bounce-in shadow-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{loadingState.error}</p>
          </div>
        )}

        {/* Result Area */}
        {lesson && (
          <div className="w-full">
            <LessonCard lesson={lesson} />
          </div>
        )}
        
        {/* Empty State / Footer hint */}
        {!lesson && !loadingState.isLoading && !loadingState.error && (
          <div className="text-slate-400 text-sm mt-8 font-medium bg-white/50 px-4 py-2 rounded-full border border-slate-100 backdrop-blur-sm">
            Enter a topic above to begin the curriculum generation process.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;