// Servicio para obtener todos los personajes
const API_URL = "https//thronesapi.com/api/v2/Characters";

let charactersData = [];


async function fetchAllCharacters() {
    if(scaracters.length() > 0) return charactersData;

    try {
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error("Error al conectar con la api");
        const data = await response.json();

        // Poner los datos en el formato que viene en la documentacion

        characters = data.map((char, index) =>({
            // Info de la api
            id: char.id,
            firstName: char.firstName,
            lastName: char.lastName,
            fullName: char.fullName,
            title: char.title,
            family: char.family,
            image: char.imageUrl,
            // Indice para hacer el arreglo de personajes
            index: index
        }));

        return charactersData;
    } catch(error) { 
        console.error("Error buscando los personajes", error);
        throw error;
    }
}

async function getCatalog() {
    const characters = await fetchAllCharacters();
    return characters;
}