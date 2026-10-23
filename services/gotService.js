// service to obtain all characters
const API_URL = "https://thronesapi.com/api/v2/Characters";

let charactersData = [];


export async function fetchAllCharacters() {
    if(charactersData.length > 0) return charactersData;

    try {
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error("Error connecting to API");
        const data = await response.json();

        // Format data according to documentation
        data.sort((a,b)=> a.id - b.id); // Follows ID order if api returns unsorted list
        charactersData = data.map((char, index) =>({
            // api info
            id: char.id,
            firstName: char.firstName,
            lastName: char.lastName,
            fullName: char.fullName,
            title: char.title,
            family: char.family,
            image: char.imageUrl,
            // index to make character array
            index: index
        }));

        return charactersData;
    } catch(error) { 
        console.error("Error finding characters", error);
        throw error;
    }
}

export async function getCatalog(search = "") {
    const characters = await fetchAllCharacters();
    const query = String(search).trim().toLowerCase();

    return characters.filter(function (character) {
        const names = character.fullName + " " + character.firstName + " " + character.lastName;
        return (names.toLowerCase().includes(query) || String(character.id) === query);
    });
}

// search characters by id or search

export async function getCharacterByIdOrSearch(identifier) {
    const characters = await fetchAllCharacters();
    let index = -1;

    if(!isNaN(identifier)) {
       const idNum = Number(identifier);
       index = characters.findIndex(c => c.id === idNum);
    } else {
        const query = String(identifier).trim().toLowerCase();
        index = characters.findIndex(c =>
            c.fullName.toLowerCase().includes(query) ||
            c.firstName.toLowerCase().includes(query) ||
            c.lastName.toLowerCase().includes(query)
        );
    }

    if(index === -1) return null;

    const character = characters[index];

    // Navigation between characters
    const prevIndex = (index -1 + characters.length) % characters.length;
    const nextIndex = (index + 1) % characters.length;

    return {
        ...character,
        prevId: characters[prevIndex].id,
        nextId: characters[nextIndex].id
    };
}