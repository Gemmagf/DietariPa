import streamlit as st
import pandas as pd
import requests


# Dades inicials
data = [
    {"Data": "08-02-2025", "Nom": "Pa rodó de mig", "Farina": "50% espelta, 50% blat", "Aigua": 325, "Sal": 10, "Massa Mare": 30, 
     "Fermentació freda": "24h", "Resultat": "Pa molt pla, sense volum", "Puntuació": 2},
    
    {"Data": "10-02-2025", "Nom": "Pa amb olives", "Farina": "50% espelta, 50% blat", "Aigua": 162.5, "Sal": 5, "Massa Mare": 15, 
     "Fermentació freda": "24h", "Resultat": "Pa molt pla de nou", "Puntuació": 1},

    {"Data": "17-02-2025", "Nom": "Pa de Massa Mare (ABC News)", "Farina": "175 g panificable, 25 g integral", "Aigua": 150, "Sal": 4, "Massa Mare": 22.5, 
     "Fermentació freda": "12h a temperatura ambient, després nevera", "Resultat": "Bona expansió, molla esponjosa", "Puntuació": 5},
]

# Convertir en DataFrame
df = pd.DataFrame(data)

# Configuració Streamlit
st.set_page_config(page_title="Dietari de Pa", layout="centered")
st.title("🍞 Dietari de Pa")

# Mostrar intents
st.subheader("📜 Llistat d'intents de pa")
for index, row in df.iterrows():
    with st.expander(f"**{row['Nom']}** - {row['Data']}"):
        st.write(f"**Farina:** {row['Farina']}")
        st.write(f"**Aigua:** {row['Aigua']} ml")
        st.write(f"**Sal:** {row['Sal']} g")
        st.write(f"**Massa Mare:** {row['Massa Mare']} g")
        st.write(f"**Fermentació freda:** {row['Fermentació freda']}")
        st.write(f"**Resultat:** {row['Resultat']}")

        # Puntuació amb estrelles
        rating = "⭐" * row["Puntuació"] + "☆" * (5 - row["Puntuació"])
        st.write(f"**Puntuació:** {rating}")

# 🔹 Millor intent de pa
st.subheader("🏆 Millor intent de pa")

best_attempt = df.loc[df["Puntuació"].idxmax()]
st.write(f"🥇 **{best_attempt['Nom']}** ({best_attempt['Data']}) amb una puntuació de {best_attempt['Puntuació']} estrelles.")
st.write(f"🔹 **Resultat:** {best_attempt['Resultat']}")
st.write(f"🔹 **Fermentació:** {best_attempt['Fermentació freda']}")

# 🆕 Formulari per afegir un nou intent
st.subheader("➕ Afegir nou intent")

nom = st.text_input("Nom del pa")
data = st.date_input("Data")
farina = st.text_input("Tipus de farina")
aigua = st.number_input("Quantitat d’aigua (ml)", min_value=0)
sal = st.number_input("Quantitat de sal (g)", min_value=0)
massa_mare = st.text_input("Quantitat de massa mare")
fermentacio = st.text_input("Temps de fermentació")
resultat = st.text_area("Resultat")
puntuacio = st.slider("Puntuació", 1, 5, 3)

if st.button("Guardar intent"):
    new_entry = {
        "Data": str(data),
        "Nom": nom,
        "Farina": farina,
        "Aigua": aigua,
        "Sal": sal,
        "Massa Mare": massa_mare,
        "Fermentació freda": fermentacio,
        "Resultat": resultat,
        "Puntuació": puntuacio
    }
    df = df.append(new_entry, ignore_index=True)
    st.success("Nou intent afegit!")

# 🔹 Editar intents anteriors
st.subheader("✏️ Editar intent existent")
entry_to_edit = st.selectbox("Selecciona l'intent a editar", df["Nom"].unique())

if entry_to_edit:
    idx = df[df["Nom"] == entry_to_edit].index[0]
    new_puntuacio = st.slider("Actualitza la puntuació", 1, 5, df.at[idx, "Puntuació"])
    new_resultat = st.text_area("Actualitza el resultat", df.at[idx, "Resultat"])

    if st.button("Guardar canvis"):
        df.at[idx, "Puntuació"] = new_puntuacio
        df.at[idx, "Resultat"] = new_resultat
        st.success(f"Intent '{entry_to_edit}' actualitzat!")

# Mostrar la taula de dades
st.subheader("📊 Resum dels intents")
st.dataframe(df)

# 🔹 Recomanacions basades en IA (simulació)
st.subheader("🤖 Recomanacions de millora")

# Preparar els intents en format text per enviar a la IA
intents_text = "\n".join(
    [f"{row['Nom']} ({row['Data']}): {row['Resultat']} - Puntuació: {row['Puntuació']}" for _, row in df.iterrows()]
)

# Simulació d'una API d'IA
st.write("🔍 Analitzant resultats amb IA...")

# Exemple de crida a una API d'IA real (comentada perquè no tenim una API real)
"""
response = requests.post("https://api.example.com/recomanacions",
                         json={"dades": intents_text})
recomanacions = response.json().get("recomanacions", "No s'han rebut recomanacions.")
"""

# Simulació de resposta de la IA
recomanacions = """
1️⃣ Reduir la quantitat d’aigua en pans amb molla densa.  
2️⃣ Fer una fermentació més curta per evitar sobrefermentació.  
3️⃣ Augmentar el temps d'autòlisi per millorar la textura.  
4️⃣ Fer servir una massa mare més activa per millorar l'expansió.
"""

st.write(recomanacions)
