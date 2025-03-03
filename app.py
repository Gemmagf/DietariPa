import streamlit as st
import pandas as pd
import requests
import psycopg2

# 🎯 API de Hugging Face
HUGGINGFACE_API_KEY = "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"
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

# 🎯 Connexió a la base de dades Neon
DB_CONFIG = {
    "dbname": "neondb",
    "user": "neondb_owner",
    "password": "npg_pa1yz3tDZMdx",
    "host": "ep-super-block-a9x88hxq-pooler.gwc.azure.neon.tech",
    "port": "5432",
    "sslmode": "require",
    "options": "-c endpoint=ep-super-block-a9x88hxq"
}

# 🎯 Funció per obtenir les dades de la base de dades
def obtenir_dades():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT data, nom, farina, aigua, sal, massa_mare, fermentacio_freda, resultat, puntuacio FROM intents_pa;")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        st.error(f"⚠️ Error carregant dades: {e}")
        return []

# 🎯 Funció per obtenir recomanacions de l'IA
def obtenir_recomanacions(text):
    payload = {"inputs": f"Aquí tens dues receptes:\n{text}\nCom puc millorar aquesta recepta?"}
    try:
        resposta = requests.post(API_URL, headers=HEADERS, json=payload)
        resposta.raise_for_status()
        data = resposta.json()
        return data[0]["generated_text"] if isinstance(data, list) else "⚠️ Error en la resposta de l'IA."
    except requests.exceptions.RequestException as e:
        return f"⚠️ Error amb l'IA: {e}"

# 🎯 Configuració Streamlit
st.set_page_config(page_title="Dietari de Pa", layout="centered")
st.title("🍞 Dietari de Pa")

# 🎯 Carregar dades de la base de dades
dades = obtenir_dades()
if dades:
    df = pd.DataFrame(dades, columns=["Data", "Nom", "Farina", "Aigua", "Sal", "Massa Mare", "Fermentació freda", "Resultat", "Puntuació"])
else:
    df = pd.DataFrame()

# 🎯 Mostrar intents de pa
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

# 🎯 Millor intent de pa
st.subheader("🏆 Millor intent de pa")
if not df.empty:
    best_attempt = df.loc[df["Puntuació"].idxmax()]
    st.write(f"🥇 **{best_attempt['Nom']}** ({best_attempt['Data']}) amb una puntuació de {best_attempt['Puntuació']} estrelles.")
    st.write(f"🔹 **Resultat:** {best_attempt['Resultat']}")
    st.write(f"🔹 **Fermentació:** {best_attempt['Fermentació freda']}")

# 🎯 Formulari per afegir un nou intent
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
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO intents_pa (data, nom, farina, aigua, sal, massa_mare, fermentacio_freda, resultat, puntuacio) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (data, nom, farina, aigua, sal, massa_mare, fermentacio, resultat, puntuacio),
        )
        conn.commit()
        cur.close()
        conn.close()
        st.success("Nou intent afegit! 🎉")
        st.experimental_rerun()
    except Exception as e:
        st.error(f"⚠️ Error guardant intent: {e}")

# 🎯 Editar intents anteriors
st.subheader("✏️ Editar intent existent")
if not df.empty:
    entry_to_edit = st.selectbox("Selecciona l'intent a editar", df["Nom"].unique())
    if entry_to_edit:
        idx = df[df["Nom"] == entry_to_edit].index[0]
        new_puntuacio = st.slider("Actualitza la puntuació", 1, 5, df.at[idx, "Puntuació"])
        new_resultat = st.text_area("Actualitza el resultat", df.at[idx, "Resultat"])

        if st.button("Guardar canvis"):
            try:
                conn = psycopg2.connect(**DB_CONFIG)
                cur = conn.cursor()
                cur.execute(
                    "UPDATE intents_pa SET puntuacio = %s, resultat = %s WHERE nom = %s",
                    (new_puntuacio, new_resultat, entry_to_edit),
                )
                conn.commit()
                cur.close()
                conn.close()
                st.success(f"Intent '{entry_to_edit}' actualitzat! ✅")
                st.experimental_rerun()
            except Exception as e:
                st.error(f"⚠️ Error actualitzant intent: {e}")

# 🎯 Resum de les dades
st.subheader("📊 Resum dels intents")
st.dataframe(df)

# 🎯 Recomanacions de millora basades en IA
st.subheader("🤖 Recomanacions de millora")
if len(df) >= 2:
    ultima_recepta = df.iloc[-1]
    millor_recepta = df.iloc[df["Puntuació"].idxmax()]
    text_receptes = (
        f"1️⃣ **Última recepta:** {ultima_recepta['Nom']} ({ultima_recepta['Data']}) - {ultima_recepta['Resultat']}\n"
        f"2️⃣ **Millor recepta:** {millor_recepta['Nom']} ({millor_recepta['Data']}) - {millor_recepta['Resultat']}"
    )
    st.write(text_receptes)

    if st.button("🔍 Obtenir recomanacions"):
        with st.spinner("Consultant l'IA..."):
            recomanacions = obtenir_recomanacions(text_receptes)
            st.write("💡 **Recomanacions:**")
            st.write(recomanacions)
