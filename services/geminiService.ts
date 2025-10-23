// services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
import { Match } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

/**
 * Generates a creative and engaging summary for a sports match using the Gemini API.
 * @param match The match to generate a summary for.
 * @returns A promise that resolves to a string containing the AI-generated summary.
 */
export const generateMatchSummary = async (match: Match): Promise<string> => {
  const prompt = `
    다음 스포츠 경기에 대한 매우 짧고 핵심적인 AI 분석 요약을 한국어로 생성해줘.
    **반드시 2~3 문장으로 요약해야 한다.** 전문가처럼 보이되, 일반 팬들도 쉽게 이해할 수 있도록 간결하게 작성해줘.
    결과만 제공하고, 다른 설명은 절대 추가하지 마.

    - 경기: ${match.homeTeam} vs ${match.awayTeam}
    - 배당률: 홈 ${match.odds.home}, 원정 ${match.odds.away}${match.odds.draw ? `, 무승부 ${match.odds.draw}` : ''}

    두 팀의 전력과 배당률을 고려한 핵심 예측을 중심으로 요약해줘.
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    const summary = response.text;
    
    if (summary) {
      return summary.trim();
    } else {
      return `${match.homeTeam}와(과) ${match.awayTeam}의 흥미진진한 대결이 펼쳐집니다. 두 팀의 전력을 분석하여 최고의 베팅 기회를 찾아보세요!`;
    }
  } catch (error) {
    console.error("Error generating match summary with Gemini API:", error);
    return `${match.homeTeam}와(과) ${match.awayTeam}의 대결! 전문가 분석을 통해 승자를 예측해보세요.`;
  }
};

/**
 * Generates an in-depth, premium analysis for a sports match.
 * @param match The match to generate a summary for.
 * @returns A promise that resolves to a string containing the AI-generated premium analysis.
 */
export const generatePremiumAnalysis = async (match: Match): Promise<string> => {
    const prompt = `
    **프리미엄 AI 심층 분석 요청**
    다음 스포츠 경기에 대해 전문가 수준의 심층 전술 분석을 한국어로 생성해줘. 단순한 요약을 넘어, 경기의 핵심을 꿰뚫는 통찰력을 제공해줘.
    결과만 제공하고, 다른 설명은 추가하지 마. 마크다운을 활용해서 가독성을 높여줘.

    - 경기 정보: ${match.sportId}, ${match.homeTeam} vs ${match.awayTeam}
    - 경기 시간: ${new Date(match.date).toLocaleString('ko-KR')}

    **분석 필수 항목:**
    1.  **핵심 전술 비교:** 두 팀의 예상 포메이션과 주요 공격 루트, 수비 전략을 비교 분석해줘.
    2.  **주요 선수 매치업:** 경기의 승패를 좌우할 가장 중요한 선수 간의 맞대결을 짚어주고, 누가 우위를 점할지 예측해줘.
    3.  **경기의 전환점 (Turning Point):** 어떤 상황(예: 세트피스, 특정 시간대의 선수 교체)이 경기의 흐름을 바꿀 수 있을지 예측해줘.
    4.  **최종 예측:** 위의 분석을 종합하여, 더 가능성이 높은 승리 팀과 예상 스코어를 제시해줘.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        const analysis = response.text;
        return analysis ? analysis.trim() : "프리미엄 분석을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.";
    } catch (error) {
        console.error("Error generating premium analysis:", error);
        return "프리미엄 분석 중 오류가 발생했습니다. API 상태를 확인해주세요.";
    }
};