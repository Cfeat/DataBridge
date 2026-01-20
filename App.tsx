
import React, { useState, useEffect } from 'react';
import { AnalysisStep, AnalysisPlan, AnalysisResult, Language, translations, MultiLangContent } from './types.ts';
import { generateAnalysisPlan, generateFinalReport, translateContent, translateText } from './services/ApiService.ts';
import { PlanDisplay } from './components/PlanDisplay.tsx';
import { ReportDisplay } from './components/ReportDisplay.tsx';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem('db_lang') as Language) || 'zh';
    } catch (e) {
      return 'zh';
    }
  });

  const [inputState, setInputState] = useState<Record<Language, string>>({
    zh: '',
    en: ''
  });
  
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  
  const [multiPlan, setMultiPlan] = useState<MultiLangContent<AnalysisPlan>>({
    zh: null,
    en: null
  });
  
  const [multiReport, setMultiReport] = useState<MultiLangContent<AnalysisResult>>({
    zh: null,
    en: null
  });

  const [loading, setLoading] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('db_lang', lang);
  }, [lang]);

  const t = translations[lang];

  const handleAnalysis = async () => {
    const currentInput = inputState[lang];
    if (!currentInput.trim()) return;
    setLoading(true);
    
    try {
      const generatedPlan = await generateAnalysisPlan(currentInput, lang);
      const otherLang = lang === 'zh' ? 'en' : 'zh';
      
      setMultiPlan({
        [lang]: generatedPlan,
        [otherLang]: null // Reset other lang while translating
      } as any);
      setStep(AnalysisStep.PLANNING);

      // Background Translation for instant switching
      translateContent(generatedPlan, otherLang).then(translated => {
        setMultiPlan(prev => ({ ...prev, [otherLang]: translated }));
      });

      // Background input translation
      translateText(currentInput, otherLang).then(translatedInput => {
        setInputState(prev => ({ ...prev, [otherLang]: translatedInput }));
      });

    } catch (error) {
      console.error("Plan generation error:", error);
      alert(lang === 'zh' ? "分析过程中断，请检查网络或 API 配置" : "Analysis interrupted. Please check API config.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPlan = async () => {
    const currentPlan = multiPlan[lang];
    if (!currentPlan) return;
    setLoading(true);
    setStep(AnalysisStep.ANALYZING);
    
    try {
      const finalReport = await generateFinalReport(currentPlan, lang);
      const otherLang = lang === 'zh' ? 'en' : 'zh';

      setMultiReport({
        [lang]: finalReport,
        [otherLang]: null
      } as any);
      setStep(AnalysisStep.REPORTING);

      // Background Translation for the final report
      translateContent(finalReport, otherLang).then(translated => {
        setMultiReport(prev => ({ ...prev, [otherLang]: translated }));
      });
    } catch (error) {
      console.error("Report generation error:", error);
      alert(lang === 'zh' ? "生成报告失败" : "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(AnalysisStep.IDLE);
    setMultiPlan({ zh: null, en: null });
    setMultiReport({ zh: null, en: null });
    setInputState({ zh: '', en: '' });
  };

  const toggleLang = (newLang: Language) => {
    setLang(newLang);
    // If we have content in the new language, the UI will update instantly
    // If not, we could trigger a retry translation here if needed, but background tasks usually handle it.
  };

  // Helper to determine if we are waiting for a background translation
  const isWaitingForTranslation = 
    (step === AnalysisStep.PLANNING && !multiPlan[lang]) || 
    (step === AnalysisStep.REPORTING && !multiReport[lang]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
      <nav className="flex justify-end mb-8">
        <div className="flex bg-white/50 p-1 rounded-xl shadow-inner border border-white/20">
          <button 
            onClick={() => toggleLang('zh')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${lang === 'zh' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            中文
          </button>
          <button 
            onClick={() => toggleLang('en')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${lang === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            English
          </button>
        </div>
      </nav>

      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {t.title.slice(0, 4)}<span className="text-blue-600">{t.title.slice(4)}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      <main className="space-y-8">
        {step === AnalysisStep.IDLE && (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.inputTitle}</h2>
            <textarea
              disabled={loading}
              className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg text-slate-700 transition-all resize-none disabled:bg-slate-50"
              placeholder={t.inputPlaceholder}
              value={inputState[lang]}
              onChange={(e) => setInputState(prev => ({ ...prev, [lang]: e.target.value }))}
            />
            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm"># DeepSeek AI</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm"># Instant-Multilingual</span>
              </div>
              <button
                disabled={loading || !inputState[lang]}
                onClick={handleAnalysis}
                className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {t.loadingUnderstanding}
                  </>
                ) : t.btnGenerate}
              </button>
            </div>
          </div>
        )}

        {(loading || isWaitingForTranslation) && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800">
                {isWaitingForTranslation ? "Translating Result..." : t.loadingAnalyzing}
              </h3>
              <p className="text-slate-500">{t.loadingDetail}</p>
            </div>
          </div>
        )}

        {step === AnalysisStep.PLANNING && multiPlan[lang] && !loading && (
          <PlanDisplay plan={multiPlan[lang]!} onConfirm={handleConfirmPlan} lang={lang} />
        )}

        {step === AnalysisStep.REPORTING && multiReport[lang] && !loading && (
          <div className="space-y-8">
             <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl">
              <p className="text-slate-500 font-medium italic">"{inputState[lang].substring(0, 60)}..."</p>
              <button 
                onClick={reset}
                className="text-blue-600 font-bold hover:underline"
              >
                {t.btnReset}
              </button>
            </div>
            <ReportDisplay report={multiReport[lang]!} lang={lang} />
          </div>
        )}
      </main>

      <footer className="mt-20 pt-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
