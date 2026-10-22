async function getCharacter(query) {
    const response = await fetch("/api/character" + query);
    const character = await response.json();

    if (!response.ok) {
        throw new Error(character.message);
    }

    return character;
}