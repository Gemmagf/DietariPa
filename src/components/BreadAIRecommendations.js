import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../utils/aiService';

const BreadAIRecommendations = ({ bestAttempt, lastAttempt }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!bestAttempt || !lastAttempt) {
        setRecommendations([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const bestRecipe = {
          name: bestAttempt.name,
          ingredients: bestAttempt.ingredients,
          techniques: bestAttempt.techniques,
          score: bestAttempt.score
        };
        const lastRecipe = {
          name: lastAttempt.name,
          ingredients: lastAttempt.ingredients,
          techniques: lastAttempt.techniques,
          score: lastAttempt.score
        };
        const result = await getRecommendations(bestRecipe, lastRecipe);
        setRecommendations(result);
      } catch (err) {
        setError("Error al obtener recomendaciones de la IA. Inténtalo de nuevo más tarde.");
        console.error("AI Recommendation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [bestAttempt, lastAttempt]);

  if (!bestAttempt || !lastAttempt) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto my-8 text-center text-gray-600">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🤖 Recomanacions amb IA</h2>
        <p>Necessites almenys dos intents de pa registrats (el millor i l'últim) per obtenir recomanacions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">🤖 Recomanacions amb IA</h2>
      {loading && (
        <div className="text-center text-blue-600 text-lg">
          Carregant recomanacions...
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      )}
      {error && <p className="text-center text-red-600 text-lg">{error}</p>}
      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">Basat en el teu millor pa ("{bestAttempt.name}") i el teu últim intent ("{lastAttempt.name}"), aquí tens algunes recomanacions per millorar:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">{rec}</li>
            ))}
          </ul>
        </div>
      )}
      {!loading && !error && recommendations.length === 0 && (bestAttempt && lastAttempt) && (
        <p className="text-center text-gray-600 text-lg">No s'han pogut generar recomanacions en aquest moment. Prova-ho més tard.</p>
      )}
    </div>
  );
};

export default BreadAIRecommendations;