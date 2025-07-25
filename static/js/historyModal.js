import { historyModal, closeButton, historyModalTitle, weightChartCanvas, historyList, currentChart, setCurrentChart } from "./constants.js";
import { showMessage, formatWeight, formatDateTime } from "./utils.js"; // Beibehalten, da formatWeight für die Liste benötigt wird
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
            // VERBESSERUNG: Sicherstellen, dass nur numerische Werte für das Diagramm verwendet werden
            const dataPoints = sortedHistory.map(entry => parseFloat(entry.weight)); // Weights for Y-axis data points, ensure they are numbers

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
                        // --- START CHART.JS STYLE OVERHAUL ---
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(), // Use primary color from CSS variables
                        backgroundColor: 'rgba(106, 142, 113, 0.3)', // Semi-transparent primary color for fill
                        tension: 0.4, // Smoother line (Bezier curve)
                        fill: true, // Fill the area below the line
                        pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(), // Dot color
                        pointBorderColor: '#fff', // White border for dots
                        pointRadius: 5, // Larger dots
                        pointHoverRadius: 7, // Even larger on hover
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        spanGaps: true // WICHTIGE VERBESSERUNG: Verbindet Punkte über 'null'- oder fehlende Datenpunkte hinweg
                        // --- END CHART.JS STYLE OVERHAUL ---
                    }]
                },
                options: {
                    responsive: true, // Chart resizes with its container
                    maintainAspectRatio: false, // Do not maintain aspect ratio
                    // --- START CHART.JS OPTIONS OVERHAUL ---
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(), // Legend text color
                                font: {
                                    size: 14,
                                    family: "'Roboto', sans-serif"
                                }
                            }
                        },
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
                            },
                            // Tooltip styling
                            backgroundColor: 'rgba(63, 74, 86, 0.9)', // Dark background for tooltips
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                            borderWidth: 1,
                            borderRadius: 6, // Rounded tooltip corners
                            displayColors: true // Show color box in tooltip
                        }
                    },
                    scales: {
                        x: {
                            type: "category", // Treat x-axis labels as categories
                            title: {
                                display: true,
                                text: "Datum", // X-axis title
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(), // Title color
                                font: {
                                    size: 14,
                                    family: "'Roboto', sans-serif"
                                }
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--light-text-color').trim(), // Tick label color
                                font: {
                                    family: "'Roboto', sans-serif"
                                }
                            },
                            grid: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(), // Grid line color
                                drawBorder: false // Do not draw axis line
                            }
                        },
                        y: {
                            beginAtZero: false, // Y-axis does not necessarily start at zero
                            title: {
                                display: true,
                                text: "Gewicht (kg)", // Y-axis title
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(), // Title color
                                font: {
                                    size: 14,
                                    family: "'Roboto', sans-serif"
                                }
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--light-text-color').trim(), // Tick label color
                                font: {
                                    family: "'Roboto', sans-serif"
                                }
                            },
                            grid: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(), // Grid line color
                                drawBorder: false // Do not draw axis line
                            }
                        }
                    },
                    // --- END CHART.JS OPTIONS OVERHAUL ---
                }
            }));

            // Populate the history list with individual entries
            history.forEach(entry => {
                const listItem = document.createElement("li");
                // Hier verwenden wir weiterhin formatWeight, da es für die Anzeige im Text sinnvoll ist
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