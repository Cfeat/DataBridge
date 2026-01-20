
import React from 'react';
import { AnalysisResult, translations, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportDisplayProps {
  report: AnalysisResult;
  lang: Language;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, lang }) => {
  const t = translations[lang];
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-700">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.reportSummary}</h2>
        <p className="text-slate-600 leading-relaxed text-lg">{report.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px]">
          <h3 className="font-bold text-slate-800 mb-4">{t.reportChart}</h3>
          <ResponsiveContainer width="100%" height="90%">
            {report.chartType === 'line' ? (
              <LineChart data={report.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            ) : report.chartType === 'pie' ? (
              <PieChart>
                <Pie data={report.chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                  {report.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <BarChart data={report.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t.reportInsights}
            </h3>
            <ul className="space-y-2">
              {report.insights.map((insight, i) => (
                <li key={i} className="flex gap-2 text-blue-800">
                  <span className="font-bold">·</span> {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t.reportRecs}
            </h3>
            <ul className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-green-800">
                  <span className="font-bold">→</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
