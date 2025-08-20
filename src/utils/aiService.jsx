export async function getAIRecommendation(prompt) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  if (!apiKey) {
    console.error("❌ No s'ha trobat la clau de l'API. Revisa el fitxer .env");
    return null;
  }

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.error("❌ Error HTTP:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("📥 Gemini response:", data);

    // Retorna el text generat (si existeix)
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("❌ Error cridant la IA:", err);
    return null;
  }
}
