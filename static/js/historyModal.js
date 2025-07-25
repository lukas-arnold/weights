import { historyModal, closeButton, historyModalTitle, weightChartCanvas, historyList, currentChart, setCurrentChart } from "./constants.js";
import { showMessage, formatWeight, formatDateTime } from "./utils.js";
import { getWeightHistory } from "./apiService.js";

/**
 * Displays the weight history modal for a specific exercise.
 * Fetches the weight history, populates the chart, and lists the entries.
 * @param {string} exerciseId - The ID of the exercise.
 * @param {string} muscleGroup - The muscle group of the exercise.
 * @param {string} exerciseName - The name of the exercise.
 */
export async function showWeightHistory(exerciseId, muscleGroup, exerciseName) {
    try {
        const history = await getWeightHistory(exerciseId); // Fetch the weight history for the given exercise ID

        historyModalTitle.textContent = `Gewichtsverlauf für ${muscleGroup} - ${exerciseName}`; // Set modal title
        historyList.innerHTML = ""; // Clear previous history entries in the list

        if (history.length === 0) {
            historyList.innerHTML = "<li>Keine Gewichtseinträge vorhanden.</li>"; // Display message if no history entries
        } else {
            // Sort history entries by date in ascending order for the chart
            const sortedHistory = [...history].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

            // Prepare data for Chart.js
            const labels = sortedHistory.map(entry => formatDateTime(entry.created_at)); // Dates for X-axis labels
            const dataPoints = sortedHistory.map(entry => formatWeight(entry.weight)); // Weights for Y-axis data points

            // Destroy existing chart instance if any, to prevent memory leaks and redraw
            if (currentChart) {
                currentChart.destroy();
            }
            // Create a new Chart.js line chart
            setCurrentChart(new Chart(weightChartCanvas, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Gewicht (kg)", // Label for the dataset
                        data: dataPoints,
                        borderColor: "#4CAF50", // Line color
                        backgroundColor: "rgba(76, 175, 80, 0.2)", // Area color below the line
                        tension: 0.1, // Smoothness of the line
                        fill: false // Do not fill the area below the line
                    }]
                },
                options: {
                    responsive: true, // Chart resizes with its container
                    maintainAspectRatio: false, // Do not maintain aspect ratio
                    scales: {
                        x: {
                            type: "category", // Treat x-axis labels as categories
                            title: {
                                display: true,
                                text: "Datum" // X-axis title
                            }
                        },
                        y: {
                            beginAtZero: false, // Y-axis does not necessarily start at zero
                            title: {
                                display: true,
                                text: "Gewicht (kg)" // Y-axis title
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                // Custom tooltip label for displaying weight
                                label: function(context) {
                                    let label = context.dataset.label || "";
                                    if (label) {
                                        label += ": ";
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y + " kg";
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            }));

            // Populate the history list with individual entries
            history.forEach(entry => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${formatDateTime(entry.created_at)}</span>
                    <span><strong>${formatWeight(entry.weight)} kg</strong></span> `;
                historyList.appendChild(listItem);
            });
        }

        historyModal.style.display = "block"; // Show the modal
    } catch (error) {
        console.error("Error fetching weight history:", error); // Log any errors
        showMessage("Fehler beim Laden des Gewichtsverlaufs.", "error"); // Show user-friendly error message
    }
}

/**
 * Initializes the history modal by setting up event listeners for closing it.
 */
export function initializeHistoryModal() {
    // Event listener for the close button
    closeButton.addEventListener("click", () => {
        historyModal.style.display = "none"; // Hide the modal
        if (currentChart) {
            currentChart.destroy(); // Destroy the chart instance to free up resources
            setCurrentChart(null); // Clear the current chart reference
        }
    });

    // Event listener for clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === historyModal) { // Check if the click occurred on the modal background
            historyModal.style.display = "none"; // Hide the modal
            if (currentChart) {
                currentChart.destroy(); // Destroy the chart instance
                setCurrentChart(null); // Clear the current chart reference
            }
        }
    });
}