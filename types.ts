
export type Language = 'zh' | 'en';

export enum AnalysisStep {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  ANALYZING = 'ANALYZING',
  REPORTING = 'REPORTING'
}

export interface AnalysisPlan {
  businessGoal: string;
  statisticalApproach: string;
  requiredData: string[];
  metrics: string[];
}

export interface AnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  chartData: any[];
  chartType: 'bar' | 'line' | 'pie';
}

// Store content for both languages to enable instant switching
export interface MultiLangContent<T> {
  zh: T | null;
  en: T | null;
}

export const translations = {
  zh: {
    title: "DataBridge",
    subtitle: "无需专业术语，用大白话描述你的需求，我们将为您桥接专业的统计分析与洞察报告。",
    inputPlaceholder: "例如：我想看看去年那些经常买贵衣服的客户，在今年夏天是不是买得少了？我想知道是什么原因...",
    inputTitle: "你想了解数据的什么？",
    btnGenerate: "转化专业分析方案",
    btnConfirm: "确认方案并开始分析",
    btnReset: "重新分析",
    loadingUnderstanding: "正在理解需求...",
    loadingAnalyzing: "正在进行专业计算",
    loadingDetail: "运用统计学模型提取关键数据点...",
    planTitle: "专业分析方案确认",
    goalLabel: "业务目标 (Business Goal)",
    approachLabel: "采用技术 (Approach)",
    metricsLabel: "核心指标 (Metrics)",
    fieldsLabel: "所需字段 (Fields)",
    reportSummary: "分析结论摘要",
    reportChart: "数据可视化趋势",
    reportInsights: "关键洞察 (Insights)",
    reportRecs: "行动建议 (Recommendations)",
    footer: "© 2026 DataBridge - 赋能每一个人成为数据驱动者"
  },
  en: {
    title: "DataBridge",
    subtitle: "Describe your needs in plain English. We bridge the gap to professional statistical analysis and insights.",
    inputPlaceholder: "e.g., I want to see if customers who bought expensive clothes last year are buying less this summer? Why is that?",
    inputTitle: "What do you want to learn from data?",
    btnGenerate: "Generate Analysis Plan",
    btnConfirm: "Confirm & Start Analysis",
    btnReset: "New Analysis",
    loadingUnderstanding: "Understanding needs...",
    loadingAnalyzing: "Performing professional analysis",
    loadingDetail: "Applying statistical models to extract insights...",
    planTitle: "Analysis Plan Confirmation",
    goalLabel: "Business Goal",
    approachLabel: "Approach",
    metricsLabel: "Metrics",
    fieldsLabel: "Required Fields",
    reportSummary: "Executive Summary",
    reportChart: "Data Visualization Trends",
    reportInsights: "Key Insights",
    reportRecs: "Recommendations",
    footer: "© 2026 DataBridge - Empowering everyone to be data-driven"
  }
};
