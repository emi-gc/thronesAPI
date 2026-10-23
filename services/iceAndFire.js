const API_URL = "https://anapioficeandfire.com/api/characters";

export async function getBiography(name) { 

    //some names are different i found out the hard way
    if (name === "Ned Stark") name = "Eddard Stark";
    if (name === "Jamie Lannister") name = "Jaime Lannister";
    if (name === "Rob Stark") name = "Robb Stark";
    if (name === "The Hound") name = "Sandor Clegane";

    try {
        const response = await fetch(
            API_URL + "?name=" + encodeURIComponent(name),
            { signal: AbortSignal.timeout(5000) } // wait 5 seconds.
        );

        if (!response.ok) return {};

        const characters = await response.json();

        // only use the result when there is a clear match.
        if (characters.length !== 1) return {};

        return characters[0];
    } catch (error) {
        console.error("Could not load extra information:", error.message);
        return {};
    }
};