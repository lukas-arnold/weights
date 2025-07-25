import { API_URL } from "./constants.js";

/**
 * Generic fetch helper function to handle API requests.
 * Encapsulates common logic for sending requests and error handling.
 * @param {string} endpoint - The API endpoint, relative to API_URL.
 * @param {object} options - Options for the fetch request.
 * @returns {Promise<any>} - The parsed JSON result or null for 204 No Content.
 * @throws {Error} - If the network request fails or the status code indicates an error.
 */
async function fetcher(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (response.ok) {
        // DELETE requests with 204 No Content do not return JSON
        if (response.status === 204) {
            return null; 
        }
        // Try to parse the response as JSON
        try {
            return await response.json();
        } catch (e) {
            // If the response is ok but not JSON, e.g., an empty 200 OK
            return null; 
        }
    } else {
        // Attempt to get more detailed error messages from the server
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // If the response is not JSON or parsing fails
            console.error("Error parsing error response:", e);
        }
        const errorMessage = errorData.detail || errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
    }
}

/**
 * Fetches all exercises.
 * @returns {Promise<Array>} A list of exercises.
 */
export async function getExercises() {
    return fetcher("/");
}

/**
 * Fetches an exercise by its ID.
 * @param {string} id - The ID of the exercise.
 * @returns {Promise<object>} The exercise.
 */
export async function getExerciseById(id) {
    return fetcher(`/${id}`);
}

/**
 * Creates a new exercise.
 * @param {object} data - The data for the new exercise.
 * @returns {Promise<object>} The newly created exercise.
 */
export async function createExercise(data) {
    return fetcher("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/**
 * Updates an existing exercise.
 * @param {string} id - The ID of the exercise to update.
 * @param {object} data - The updated exercise data.
 * @returns {Promise<object>} The updated exercise.
 */
export async function updateExercise(id, data) {
    return fetcher(`/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/**
 * Deletes an exercise by its ID.
 * @param {string} id - The ID of the exercise to delete.
 * @returns {Promise<void>}
 */
export async function deleteExercise(id) {
    await fetcher(`/${id}`, {
        method: "DELETE",
    });
}

/**
 * Adds a weight entry to an exercise's weight history.
 * @param {string} exerciseId - The ID of the exercise.
 * @param {number} weight - The weight to add.
 * @returns {Promise<object>} The newly added weight entry.
 */
export async function addWeightHistoryEntry(exerciseId, weight) {
    return fetcher(`/${exerciseId}/weighthistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: weight }),
    });
}

/**
 * Fetches the weight history for an exercise.
 * @param {string} exerciseId - The ID of the exercise.
 * @returns {Promise<Array>} A list of weight entries.
 */
export async function getWeightHistory(exerciseId) {
    return fetcher(`/${exerciseId}/weighthistory`);
}