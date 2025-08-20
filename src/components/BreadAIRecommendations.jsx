import React, { useState, useEffect } from "react";
import { getAIRecommendation } from "../utils/aiService";

const BreadAIRecommendations = ({ bestAttempt, lastAttempt }) => {
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      if (bestAttempt && lastAttempt) {
        const prompt = `
Ets un mestre forner i actues com a mentor. Analitza els intents de pa següents i dona’m recomanacions molt concretes i pràctiques, amb números i substitucions clares.


👉 Millor intent:
${bestAttempt.title} (${bestAttempt.date})
Resultat: ${bestAttempt.result}

👉 Últim intent:
${lastAttempt.title} (${lastAttempt.date})
Resultat: ${lastAttempt.result}

Dona’m 3–5 recomanacions específiques per millorar el pròxim intent.
- Referència explícitament els ingredients i tècniques de l’últim intent.
- Proposa canvis quantitatius clars (ex: “Si vas usar 500 g de farina blanca, prova amb 300 g de farina de sègol i 200 g de blanca”).
- Sigues breu i directe, evita recomanacions generals.
- Escriu les recomanacions en català, en format de llista.
- No utilitzis negretes, cursives ni cap format especial


`;
        const result = await getAIRecommendation(prompt);
        setRecommendation(result);
      }
    };

    fetchAI();
  }, [bestAttempt, lastAttempt]);

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-xl">
      <h2 className="text-lg font-bold mb-2">🤖 Recomanacions de la IA</h2>
      {recommendation ? (
        <p className="whitespace-pre-line">{recommendation}</p>
      ) : (
        <p className="text-gray-500">⚠️ No s'ha pogut obtenir la recomanació.</p>
      )}
    </div>
  );
};

export default BreadAIRecommendations;
