import { exerciseForm, addWeightButton, cancelEditButton } from "./constants.js";
import { showMessage } from "./utils.js";
import { getExercises } from "./apiService.js";
import { renderExercises } from "./uiRenderer.js";
import { handleSubmit, handleAddWeight, resetForm } from "./formHandler.js";
import { initializeHistoryModal } from "./historyModal.js";

// Function to fetch and render exercises
export async function fetchExercises() {
    try {
        const exercises = await getExercises();
        renderExercises(exercises);
    } catch (error) {
        console.error("Error fetching exercises:", error);
        showMessage("Fehler beim Laden der Kraftwerte. Server möglicherweise nicht erreichbar.", "error");
    }
}

// Initialization of all event listeners and initial data load
document.addEventListener("DOMContentLoaded", () => {
    // Initialize modals
    initializeHistoryModal();

    // Event listeners for form
    exerciseForm.addEventListener("submit", handleSubmit);
    addWeightButton.addEventListener("click", handleAddWeight);
    cancelEditButton.addEventListener("click", resetForm);

    // Initial data load
    fetchExercises();
});