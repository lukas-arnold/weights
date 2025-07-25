import {
    exerciseForm, muscleGroupInput, exerciseNameInput, weightInput,
    submitButton, cancelEditButton, addWeightButton, formTitle,
    weightInputContainer, editingExerciseId, setEditingExerciseId 
} from "./constants.js";
import { showMessage } from "./utils.js";
// Using the renamed deleteExercise function from apiService
import { getExerciseById, createExercise, addWeightHistoryEntry, deleteExercise as deleteExerciseApi } from "./apiService.js"; 
import { fetchExercises } from "./main.js";

/**
 * Resets the form to its initial state for adding a new exercise.
 * Clears input fields, sets button texts, and controls element visibility.
 */
export function resetForm() {
    exerciseForm.reset(); // Clears all form fields
    submitButton.textContent = "Hinzufügen"; // Text for adding new exercise
    submitButton.style.display = "inline-block"; // Show submit button for new exercises
    formTitle.textContent = "Neue Übung hinzufügen"; // Form title for new exercise
    cancelEditButton.style.display = "none"; // Hide cancel button
    addWeightButton.style.display = "none"; // Hide add weight button
    weightInputContainer.style.display = "block"; // Show weight input for new exercise
    weightInput.required = true; // Weight is required for new exercises
    muscleGroupInput.readOnly = false; // Make muscle group editable
    exerciseNameInput.readOnly = false; // Make exercise name editable
    setEditingExerciseId(null); // Clear the ID of the exercise being edited/added weight for
}

/**
 * Loads exercise data into the form specifically for adding a new weight entry.
 * Makes muscle group and exercise name read-only and adjusts button visibility.
 * @param {string} id - The ID of the exercise to load.
 */
export async function loadExerciseForAddWeight(id) {
    try {
        const exercise = await getExerciseById(id); // Fetch exercise details

        muscleGroupInput.value = exercise.muscle_group;
        exerciseNameInput.value = exercise.exercise;
        // Set placeholder to the latest weight, if available, otherwise clear
        weightInput.placeholder = exercise.weight_history.length > 0 ? exercise.weight_history[0].weight : '';
        weightInput.value = ''; // Clear actual value to ensure user enters new weight
        
        // Make muscle group and exercise name non-editable
        muscleGroupInput.readOnly = true;
        exerciseNameInput.readOnly = true;

        setEditingExerciseId(exercise.id); // Set the ID of the exercise for which weight is being added

        formTitle.textContent = `Gewicht hinzufügen für: ${exercise.muscle_group} - ${exercise.exercise}`;
        submitButton.style.display = "none"; // Hide "Hinzufügen" button (for new exercises)
        cancelEditButton.style.display = "inline-block"; // Show cancel button
        
        weightInputContainer.style.display = "block"; // Ensure weight input is visible
        addWeightButton.style.display = "inline-block"; // Show "Gewicht hinzufügen" button

        weightInput.required = true; // Weight is required when adding
        weightInput.focus(); // Set focus to weight input for immediate entry

        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
    } catch (error) {
        console.error("Fehler beim Laden der Übung zum Gewicht hinzufügen:", error); // Log the error
        showMessage("Fehler beim Laden der Übung.", "error"); // Show user-friendly error message
    }
}

/**
 * Handles the form submission for creating a new exercise.
 * Prevents default form submission, validates input, and calls the API.
 * @param {Event} event - The form submission event.
 */
export async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const muscleGroup = muscleGroupInput.value;
    const exerciseName = exerciseNameInput.value;
    const initial_weight = parseFloat(weightInput.value);

    // Input validation
    if (isNaN(initial_weight) || initial_weight <= 0) {
        showMessage("Bitte ein gültiges initiales Gewicht eingeben.", "error");
        return;
    }
    if (!muscleGroup.trim() || !exerciseName.trim()) {
        showMessage("Bitte Muskelgruppe und Übung eingeben.", "error");
        return;
    }

    try {
        // Prepare data for API call
        const data = { muscle_group: muscleGroup, exercise: exerciseName, initial_weight: initial_weight };
        await createExercise(data); // Call API to create new exercise
        showMessage(`Neue Übung erfolgreich hinzugefügt!`, "success"); // Show success message
        resetForm(); // Reset the form
        fetchExercises(); // Refresh the list of exercises
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Übung:", error); // Log the error
        showMessage(`Fehler: ${error.message}`, "error"); // Show user-friendly error message
    }
}

/**
 * Handles adding a new weight entry to an existing exercise.
 * Validates input and calls the API to add to weight history.
 */
export async function handleAddWeight() {
    // Ensure an exercise is selected for adding weight
    if (!editingExerciseId) {
        showMessage('Wählen Sie zuerst eine Übung aus der Liste aus (Button "Gewicht hinzu").', "error");
        return;
    }

    const weight = parseFloat(weightInput.value);
    // Input validation
    if (isNaN(weight) || weight <= 0) {
        showMessage("Bitte ein gültiges Gewicht eingeben, das hinzugefügt werden soll.", "error");
        return;
    }

    try {
        await addWeightHistoryEntry(editingExerciseId, weight); // Call API to add weight entry
        showMessage(`Neuer Gewichtseintrag erfolgreich hinzugefügt!`, "success"); // Show success message
        weightInput.value = ""; // Clear weight field for potentially another entry
        fetchExercises(); // Refresh the list of exercises (to show updated latest weight)
    }
    catch (error) {
        console.error("Fehler beim Hinzufügen des Gewichts:", error); // Log the error
        showMessage(`Fehler: ${error.message}`, "error"); // Show user-friendly error message
    }
}

/**
 * Handles the deletion of an exercise.
 * Prompts for confirmation before calling the API to delete the exercise.
 * @param {string} id - The ID of the exercise to delete.
 */
export async function deleteExercise(id) {
    // Confirmation dialog before deleting
    if (!confirm(`Soll die Übung mit ID ${id} und alle zugehörigen Gewichtsdaten wirklich gelöscht werden?`)) {
        return; // If user cancels, stop execution
    }

    try {
        // Use the renamed API function (deleteExerciseApi)
        await deleteExerciseApi(id); 
        showMessage("Übung erfolgreich gelöscht!", "success"); // Show success message
        fetchExercises(); // Refresh the list of exercises
        if (editingExerciseId === id) { // If the deleted exercise was currently being edited
            resetForm(); // Reset the form
        }
    } catch (error) {
        console.error("Fehler beim Löschen der Übung:", error); // Log the error
        showMessage(`Fehler: ${error.message}`, "error"); // Show user-friendly error message
    }
}