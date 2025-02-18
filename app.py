import streamlit as st
import pandas as pd

# Dades inicials dels intents
data = [
    {"Data": "08-02-2025", "Nom": "Pa rodó de mig", "Farina": "50% espelta, 50% blat", "Aigua": 325, "Sal": 10, "Massa Mare": 30, 
     "Fermentació freda": "24h", "Resultat": "Pa molt pla, sense volum"},
    
    {"Data": "10-02-2025", "Nom": "Pa amb olives", "Farina": "50% espelta, 50% blat", "Aigua": 162.5, "Sal": 5, "Massa Mare": 15, 
     "Fermentació freda": "24h", "Resultat": "Pa molt pla de nou"},

    {"Data": "10-02-2025", "Nom": "Pa de 125 g", "Farina": "50% espelta, 50% blat", "Aigua": 80, "Sal": 2, "Massa Mare": 10, 
     "Fermentació freda": "8-12h", "Resultat": "Molla desigual, creixement insuficient"},

    {"Data": "11-02-2025", "Nom": "Pa de 250 g", "Farina": "50% espelta, 50% blat", "Aigua": 80, "Sal": 2, "Massa Mare": 10, 
     "Fermentació freda": "4h", "Resultat": "Massa sobrefermentada, molla densa"},

    {"Data": "14-02-2025", "Nom": "Pa rodó de mig", "Farina": "50% espelta, 50% blat", "Aigua": 145, "Sal": 4, "Massa Mare": 20, 
     "Fermentació freda": "23h", "Resultat": "Creixement lleuger, molla densa"},

    {"Data": "15-02-2025", "Nom": "Pa de 500 g", "Farina": "50% espelta, 50% blat", "Aigua": 145, "Sal": 4, "Massa Mare": 20, 
     "Fermentació freda": "23h", "Resultat": "Molla densa, forats grans irregulars"},

    {"Data": "15-02-2025", "Nom": "Pa de 500 g + Antònia", "Farina": "50% espelta, 50% blat", "Aigua": 170, "Sal": 4, "Massa Mare": "3 cullerades", 
     "Fermentació freda": "En procés", "Resultat": "En observació"},

    {"Data": "17-02-2025", "Nom": "Pa de Massa Mare (ABC News)", "Farina": "175 g panificable, 25 g integral", "Aigua": 150, "Sal": 4, "Massa Mare": 22.5, 
     "Fermentació freda": "Banc de cuina 12h, nevera mentre s'escalfa el forn", "Resultat": "Bona expansió, molla densa"},
]

# Inicialitzar el DataFrame a la sessió si no existeix
if "df" not in st.session_state:
    st.session_state.df = pd.DataFrame(data)

st.title("🥖 Dietari de Pa")

# Mostrar el DataFrame
st.subheader("📜 Entrades Anteriors")
st.dataframe(st.session_state.df)

# Afegir una nova entrada
st.subheader("➕ Nova Entrada")

col1, col2 = st.columns(2)

with col1:
    data = st.date_input("Data de l'intent")
    nom = st.text_input("Nom del pa")
    farina = st.text_input("Tipus de farina")
    aigua = st.number_input("Aigua (g)", min_value=0)

with col2:
    sal = st.number_input("Sal (g)", min_value=0)
    massa_mare = st.text_input("Massa mare (g o cullerades)")
    fermentacio = st.text_input("Fermentació freda")
    resultat = st.text_area("Resultat de l'intent")

if st.button("💾 Guardar"):
    if nom and farina and fermentacio and resultat:
        new_entry = pd.DataFrame([{
            "Data": data.strftime("%d-%m-%Y"),
            "Nom": nom,
            "Farina": farina,
            "Aigua": aigua,
            "Sal": sal,
            "Massa Mare": massa_mare,
            "Fermentació freda": fermentacio,
            "Resultat": resultat
        }])
        
        st.session_state.df = pd.concat([st.session_state.df, new_entry], ignore_index=True)
        st.success("Entrada afegida correctament!")
        st.experimental_rerun()
    else:
        st.error("Si us plau, omple tots els camps.")

# Editar entrades
st.subheader("✏️ Editar Entrada")

options = st.session_state.df["Nom"].tolist()
entry_to_edit = st.selectbox("Selecciona una entrada a editar", options)

if entry_to_edit:
    entry_data = st.session_state.df[st.session_state.df["Nom"] == entry_to_edit].iloc[0]

    col1, col2 = st.columns(2)
    
    with col1:
        new_data = st.date_input("Data", pd.to_datetime(entry_data["Data"], format="%d-%m-%Y"))
        new_nom = st.text_input("Nom del pa", entry_data["Nom"])
        new_farina = st.text_input("Tipus de farina", entry_data["Farina"])
        new_aigua = st.number_input("Aigua (g)", min_value=0, value=int(entry_data["Aigua"]))

    with col2:
        new_sal = st.number_input("Sal (g)", min_value=0, value=int(entry_data["Sal"]))
        new_massa_mare = st.text_input("Massa mare", entry_data["Massa Mare"])
        new_fermentacio = st.text_input("Fermentació freda", entry_data["Fermentació freda"])
        new_resultat = st.text_area("Resultat", entry_data["Resultat"])

    if st.button("💾 Guardar canvis"):
        index = st.session_state.df.index[st.session_state.df["Nom"] == entry_to_edit].tolist()[0]
        st.session_state.df.at[index, "Data"] = new_data.strftime("%d-%m-%Y")
        st.session_state.df.at[index, "Nom"] = new_nom
        st.session_state.df.at[index, "Farina"] = new_farina
        st.session_state.df.at[index, "Aigua"] = new_aigua
        st.session_state.df.at[index, "Sal"] = new_sal
        st.session_state.df.at[index, "Massa Mare"] = new_massa_mare
        st.session_state.df.at[index, "Fermentació freda"] = new_fermentacio
        st.session_state.df.at[index, "Resultat"] = new_resultat

        st.success("Entrada actualitzada correctament!")
        st.experimental_rerun()
