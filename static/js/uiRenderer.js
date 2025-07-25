import { exercisesTableBody } from "./constants.js";
import { formatWeight, formatDateTime } from "./utils.js";
import { loadExerciseForAddWeight, deleteExercise } from "./formHandler.js";
import { showWeightHistory } from "./historyModal.js";

/**
 * Renders the list of exercises into the exercises table.
 * Clears the existing table body and appends new rows for each exercise.
 * @param {Array<object>} exercises - An array of exercise objects to render.
 */
export function renderExercises(exercises) {
    exercisesTableBody.innerHTML = ""; // Clear existing table rows

    // Display a message if no exercises are present
    if (exercises.length === 0) {
        exercisesTableBody.innerHTML = "<tr><td colspan='5'>Noch keine Kraftwerte vorhanden.</td></tr>"; // German message
        return;
    }

    // Sort exercises by muscle group and then by exercise name
    const sortedExercises = [...exercises].sort((a, b) => {
        // First, sort by muscle_group
        const muscleGroupComparison = a.muscle_group.localeCompare(b.muscle_group);
        if (muscleGroupComparison !== 0) {
            return muscleGroupComparison;
        }
        // If muscle groups are the same, then sort by exercise name
        return a.exercise.localeCompare(b.exercise);
    });

    // Iterate over each sorted exercise and create a table row
    sortedExercises.forEach(exercise => {
        const row = exercisesTableBody.insertRow();

        // Determine the latest weight entry and its associated data
        const latestWeightEntry = exercise.weight_history && exercise.weight_history.length > 0
                                        ? exercise.weight_history[0]
                                        : null;

        const currentWeight = latestWeightEntry ? formatWeight(latestWeightEntry.weight) : "N/A";
        const lastUpdatedDate = latestWeightEntry ? formatDateTime(latestWeightEntry.created_at) : "Noch nicht erfasst"; // German message

        // Create and populate cells for muscle group, exercise name, current weight, and last updated date
        const muscleGroupCell = row.insertCell();
        muscleGroupCell.textContent = exercise.muscle_group;
        muscleGroupCell.setAttribute("data-label", "Muskelgruppe:"); // German data-label

        const exerciseCell = row.insertCell();
        exerciseCell.textContent = exercise.exercise;
        exerciseCell.setAttribute("data-label", "Übung:"); // German data-label

        const currentWeightCell = row.insertCell();
        currentWeightCell.textContent = currentWeight;
        currentWeightCell.setAttribute("data-label", "Aktuelles Gewicht (kg):"); // German data-label

        const lastUpdatedCell = row.insertCell();
        lastUpdatedCell.textContent = lastUpdatedDate;
        lastUpdatedCell.setAttribute("data-label", "Zuletzt aktualisiert:"); // German data-label

        const actionsCell = row.insertCell();
        actionsCell.className = "actions";
        actionsCell.setAttribute("data-label", "Aktionen:"); // German data-label

        // Create "Add Weight" button
        const addWeightToExistingButton = document.createElement("button");
        addWeightToExistingButton.textContent = "Gewicht hinzufügen"; // German button text
        addWeightToExistingButton.className = "edit-btn"; // Reusing "edit-btn" class for styling
        addWeightToExistingButton.onclick = () => loadExerciseForAddWeight(exercise.id); // Assign click handler
        actionsCell.appendChild(addWeightToExistingButton);

        // Create "Delete" button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen"; // German button text
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteExercise(exercise.id); // Assign click handler
        actionsCell.appendChild(deleteButton);

        // Create "History" button
        const historyButton = document.createElement("button");
        historyButton.textContent = "Verlauf"; // German button text
        historyButton.className = "history-btn";
        historyButton.onclick = () => showWeightHistory(exercise.id, exercise.muscle_group, exercise.exercise); // Assign click handler
        actionsCell.appendChild(historyButton);
    });
}