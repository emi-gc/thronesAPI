export async function getCharacter(identifier) {
    const response = await fetch(
        `/api/character?id=${encodeURIComponent(identifier)}`
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || "Could not load the character."
        );
    }

    const character = await response.json();
    return character;
}

export async function getCharacters(searchQuery = "") {
    let endpoint = "/api/characters";

    if (searchQuery) {
        endpoint += `?name=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(endpoint);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || "Could not load the catalog."
        );
    }

    const characters = await response.json();
    return characters;
}