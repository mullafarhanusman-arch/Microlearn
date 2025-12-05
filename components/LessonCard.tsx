
import React, { useState, useEffect } from 'react';
import { Microlesson } from '../types';
import { CheckCircle2, XCircle, HelpCircle, Target, List, Book, ArrowRight, RotateCcw, Award, FlaskConical, ExternalLink } from 'lucide-react';

interface LessonCardProps {
  lesson: Microlesson;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsQuestionSubmitted(false);
    setScore(0);
    setShowResults(false);
  }, [lesson]);

  const currentQuestion = lesson.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === lesson.quiz.length - 1;

  const handleOptionSelect = (index: number) => {
    if (isQuestionSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitQuestion = () => {
    if (selectedOption !== null) {
      setIsQuestionSubmitted(true);
      if (selectedOption === currentQuestion.correctIndex) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsQuestionSubmitted(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsQuestionSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const isCorrect = selectedOption === currentQuestion?.correctIndex;
  const progressPercent = ((currentQuestionIndex + 1) / lesson.quiz.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white rounded-t-2xl p-8 border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase">
            {lesson.targetAudience}
          </span>
          <span className="text-slate-400 text-xs font-mono">MICROLESSON</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight">
          {lesson.title}
        </h1>
        
        <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <Target className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <span className="block text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">Objective</span>
            <p className="text-indigo-900 font-medium">{lesson.objective}</p>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="bg-white p-8 shadow-sm">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Key Concepts Sidebar (Desktop) / Top (Mobile) */}
          <div className="md:col-span-1 space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
              <List className="w-4 h-4" /> Key Concepts
            </h3>
            <ul className="space-y-3">
              {lesson.keyConcepts.map((concept, idx) => (
                <li key={idx} className="bg-slate-50 p-3 rounded text-sm text-slate-700 font-medium border-l-4 border-sky-400">
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          {/* Core Explanation */}
          <div className="md:col-span-2 prose prose-slate max-w-none">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 not-prose">
              <Book className="w-4 h-4" /> Core Knowledge
            </h3>
            <div 
              className="text-slate-800 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ 
                // Basic bold/italic support from markdown-like syntax
                __html: lesson.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>') 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Research Papers Section (New) */}
      {lesson.researchPapers && lesson.researchPapers.length > 0 && (
        <div className="bg-slate-50 p-8 border-t border-slate-200">
           <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wide mb-6">
              <FlaskConical className="w-4 h-4" /> Latest Research & Developments
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lesson.researchPapers.map((paper, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{paper.date || 'Recent'}</span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 mb-2 line-clamp-2">{paper.title}</h4>
                  <p className="text-sm text-slate-600 flex-grow mb-4">{paper.summary}</p>
                  <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-500 truncate max-w-[150px]">{paper.source}</span>
                    {paper.url && (
                       <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold">
                         View <ExternalLink className="w-3 h-3" />
                       </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}

      {/* Quiz Section */}
      <div className="bg-white rounded-b-2xl p-8 border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          
          {showResults ? (
             // Final Results View
             <div className="text-center animate-fade-in-up py-8">
               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 mb-6">
                 <Award className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
               <p className="text-slate-600 mb-6">You demonstrated your understanding of {lesson.title}.</p>
               
               <div className="text-5xl font-serif font-bold text-slate-900 mb-2">
                 {Math.round((score / lesson.quiz.length) * 100)}%
               </div>
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-8">
                 {score} out of {lesson.quiz.length} Correct
               </p>

               <button
                 onClick={handleRetryQuiz}
                 className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
               >
                 <RotateCcw className="w-4 h-4" />
                 Review Lesson & Retry
               </button>
             </div>
          ) : (
            // Active Quiz View
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wide">
                  <HelpCircle className="w-4 h-4" /> Knowledge Check
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  Question {currentQuestionIndex + 1} of {lesson.quiz.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-sky-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="animate-fade-in-up key={currentQuestionIndex}">
                <p className="text-xl font-serif font-medium text-slate-900 mb-6">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
                    
                    if (isQuestionSubmitted) {
                      if (idx === currentQuestion.correctIndex) {
                        btnClass += "bg-green-50 border-green-500 text-green-900";
                      } else if (idx === selectedOption) {
                        btnClass += "bg-red-50 border-red-500 text-red-900";
                      } else {
                        btnClass += "bg-white border-slate-200 text-slate-400 opacity-50";
                      }
                    } else {
                      if (selectedOption === idx) {
                        btnClass += "bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-500 text-sky-900 ring-2 ring-sky-200 ring-offset-2 shadow-sm transform hover:scale-[1.02]";
                      } else {
                        btnClass += "bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-slate-50 transform hover:scale-[1.02]";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isQuestionSubmitted}
                        className={btnClass}
                      >
                        <span className="font-medium">{option}</span>
                        {isQuestionSubmitted && idx === currentQuestion.correctIndex && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {isQuestionSubmitted && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Area */}
                {isQuestionSubmitted && (
                  <div className={`mt-6 p-4 rounded-lg border animate-fade-in ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect.'}
                      </div>
                      <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8">
                  {!isQuestionSubmitted ? (
                    <button
                      onClick={handleSubmitQuestion}
                      disabled={selectedOption === null}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={isLastQuestion ? handleFinishQuiz : handleNextQuestion}
                      className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isLastQuestion ? (
                        <>See Results <Award className="w-5 h-5" /></>
                      ) : (
                        <>Next Question <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
