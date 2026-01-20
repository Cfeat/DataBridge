
import React from 'react';
import { AnalysisPlan, translations, Language } from '../types';

interface PlanDisplayProps {
  plan: AnalysisPlan;
  onConfirm: () => void;
  lang: Language;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onConfirm, lang }) => {
  const t = translations[lang];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.planTitle}</h2>
      </div>

      <div className="space-y-4">
        <section>
          <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.goalLabel}</label>
          <p className="text-slate-700 font-medium">{plan.businessGoal}</p>
        </section>

        <section>
          <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.approachLabel}</label>
          <p className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full inline-block">{plan.statisticalApproach}</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <section>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.metricsLabel}</label>
            <ul className="list-disc list-inside text-slate-600">
              {plan.metrics.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </section>
          <section>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.fieldsLabel}</label>
            <ul className="list-disc list-inside text-slate-600">
              {plan.requiredData.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </section>
        </div>
      </div>

      <button 
        onClick={onConfirm}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200"
      >
        {t.btnConfirm}
      </button>
    </div>
  );
};
