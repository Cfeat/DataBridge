
import { AnalysisPlan, AnalysisResult, Language } from "../types.ts";

const API_KEY = "your_deepseek_api_key_here"; 
const API_URL = "https://api.deepseek.com/chat/completions";

async function callDeepSeek(messages: any[], responseFormat?: { type: string }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      response_format: responseFormat,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "DeepSeek API Error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export const translateText = async (text: string, targetLang: Language): Promise<string> => {
  if (!text.trim()) return "";
  const content = await callDeepSeek([
    { role: "system", content: `Translate the following text to ${targetLang === 'zh' ? 'Chinese' : 'English'}. Return ONLY the translated string, no explanations.` },
    { role: "user", content: text }
  ]);
  return content.trim();
};

export const translateContent = async (content: any, targetLang: Language): Promise<any> => {
  const result = await callDeepSeek([
    { 
      role: "system", 
      content: `You are a professional translator. Translate all string values in the provided JSON to ${targetLang === 'zh' ? 'Chinese' : 'English'}. Keep keys identical. Return valid JSON only.` 
    },
    { role: "user", content: JSON.stringify(content) }
  ], { type: "json_object" });
  return JSON.parse(result);
};

export const generateAnalysisPlan = async (userInput: string, lang: Language): Promise<AnalysisPlan> => {
  const result = await callDeepSeek([
    { 
      role: "system", 
      content: `Translate non-technical data requests into professional analysis plans in ${lang === 'zh' ? 'Chinese' : 'English'}. Return JSON with exactly these keys: businessGoal (string), statisticalApproach (string), requiredData (array of strings), metrics (array of strings).` 
    },
    { role: "user", content: userInput }
  ], { type: "json_object" });
  return JSON.parse(result);
};

export const generateFinalReport = async (plan: AnalysisPlan, lang: Language): Promise<AnalysisResult> => {
  const result = await callDeepSeek([
    { 
      role: "system", 
      content: `Based on the provided analysis plan, generate a mock analysis report in ${lang === 'zh' ? 'Chinese' : 'English'}. Return JSON with exactly these keys: summary (string), insights (array of strings), recommendations (array of strings), chartType (string: 'bar', 'line', or 'pie'), chartData (array of objects with 'label' and 'value'). Ensure at least 5 data points in chartData.` 
    },
    { role: "user", content: JSON.stringify(plan) }
  ], { type: "json_object" });
  return JSON.parse(result);
}
