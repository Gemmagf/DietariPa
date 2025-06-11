// En un entorno real, esta función haría una llamada a una API de Hugging Face.
// Para esta demo, simularemos una respuesta.

export const getRecommendations = async (bestRecipe, lastRecipe) => {
  console.log("Enviando a Hugging Face (simulado):", { bestRecipe, lastRecipe });

  // Simulación de un retraso de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulación de la respuesta de la IA
  const recommendations = [
    "Considera ajustar la hidratación de la masa en un 5% para una miga más abierta.",
    "Prueba a usar una fermentación en bloque más larga a temperatura ambiente antes de la fermentación en frío.",
    "Experimenta con diferentes tipos de harina, como la harina de centeno, para variar el sabor y la textura.",
    "Asegúrate de que tu horno esté bien precalentado y usa una piedra de hornear para una mejor corteza.",
    "Para una corteza más crujiente, rocía agua en el horno al inicio de la cocción."
  ];

  return recommendations;
};