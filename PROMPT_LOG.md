**Project Name:** GOT Finder / thronesAPI  
**Team Members:** Emiliano Gomez, Santiago Lopez

---

### 1. High-Level Goal

Understand how to connect the character catalog to the Express backend, combine information from two APIs, and handle missing information without breaking the page.

### 2. The Interaction Log

| AI Tool Used | Example Initial Prompt | Example AI Guidance |
| :--- | :--- | :--- |
| Codex | "how would i get what someone types in the search box into my express route? would that be req.body or req.query if my url is /api/characters?name=arya?" | Explained that this GET request puts the search value in `req.query.name`. The frontend adds the encoded search text to the URL, and the Express route passes it to `getCatalog()`. |
| Codex | "how would i return a character not found message without also running res.json(character) afterward?" | Explained how `return res.status(404).json(...)` sends the response and exits that route handler. This prevents the handler from continuing to another response. |
| Codex | "how would i handle fetch failing inside gotService.js? should i send the 502 there or do that in server.js?" | Suggested keeping Express responses in `server.js`. The service throws an error, and the route catches it and sends a JSON response with status 502. Also explained that an unsuccessful HTTP response needs an explicit `response.ok` check. |
| Codex | "how would i keep the characters after fetching them so searching for another name doesn't download the same list again?" | Explained storing the processed characters in a module-level array and returning it on later calls. Clarified that this is an in-memory cache, so restarting the server clears it. |
| Codex | "how would i add the birth date and aliases from the second api without losing the character's original picture and family?" | Explained creating a new response object with `...character`, followed by the extra biography fields. Suggested using defaults for missing information and `.join(", ")` to display arrays as readable text. |
| Codex | "how would i stop the whole character detail from failing if the ice and fire api takes too long or doesn't find anyone?" | Explained the five-second timeout in `getBiography()` and returning an empty object when enrichment fails. The main character information can still be returned because biography information is optional. |
| Codex | "how would i match ned stark if the other api calls him eddard stark? also what should happen if it returns two people with the same name?" | Suggested translating known name differences before building the request URL. Explained that the current service accepts a biography only when exactly one result is returned, avoiding an arbitrary choice between multiple matches. |
| Codex | "how would i make previous go to the last character when i'm looking at the first one? can i subtract one from the character id?" | Explained calculating the previous and next positions in the sorted array using modulo. Suggested returning the IDs at those positions because character IDs do not have to be consecutive. |

### 3. The Human Audit & Modifications

We adapted the guidance to my existing files and kept the Express responses in `server.js`, with character processing in the service files. We used the character's position in the array for navigation and kept the original character information available when biography information was missing. We adjusted the CSS selectors to work with the Bootstrap classes already used in my page.

### 4. Integration & Learnings

- **Query parameters:** `req.query.name` reads the search text from the request URL. The frontend uses `encodeURIComponent()` when building that URL.
- **Route responses:** `res.json()` sends JSON to the browser. Returning immediately after an error response prevents the handler from continuing.
- **Error handling:** A service can throw an error without knowing about Express. The route decides which HTTP response to send.
- **Fetch behavior:** `fetch()` can return an HTTP error response without throwing, so checking `response.ok` is necessary.
- **Caching:** The `charactersData` array stores the catalog in the running server process. It is not a database and does not survive a restart.
- **Combining APIs:** The first API supplies the main character information, while the second provides optional biography fields.
- **Timeouts and fallbacks:** A failed biography request returns `{}`, allowing the detail response to use empty strings or the original title.
- **Circular navigation:** Array positions determine the neighboring characters; the backend sends their actual IDs to the frontend.

### 5. Oral Defense Self-Check

- [ ] I can explain how the search text travels from the browser to `req.query.name`.
- [ ] I can explain why the Express routes and service functions have different responsibilities.
- [ ] I understand why `response.ok` is checked even inside `try/catch`.
- [ ] I can explain when the backend returns 404 and when it returns 502.
- [ ] I understand what happens when the biography API fails.
- [ ] I can explain the previous and next index calculations.
- [ ] I understand the limitations of the in-memory cache.
- [ ] I can locate the relevant functions in `server.js`, `services/gotService.js`, and `services/iceAndFire.js`.