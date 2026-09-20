/** Submit to the public PocketBase API; published answers remain static. */
export async function submitQuestion(
    endpoint: string,
    input: string,
    request: typeof fetch = fetch
): Promise<void> {
    const question = input.trim();
    if (question.length < 5 || question.length > 1000) {
        throw new Error("Please enter a question between 5 and 1,000 characters.");
    }

    const questioner = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
        byte.toString(16).padStart(2, "0")
    ).join("");
    let response: Response;
    try {
        response = await request(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, questioner, hidden: false }),
            signal: AbortSignal.timeout(30_000)
        });
    } catch {
        throw new Error(
            "Couldn't confirm your submission. Please check your connection and try again later."
        );
    }

    if (!response.ok) {
        throw new Error(
            response.status === 429
                ? "Too many questions at once. Please wait a little before trying again."
                : "Your question couldn't be sent. Please try again later."
        );
    }
}
