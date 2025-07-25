export const API_URL = window.location.origin + "/weights";

// DOM Elements for Exercises
export const exercisesTableBody = document.querySelector("#exercisesTable tbody");
export const exerciseForm = document.getElementById("exerciseForm");
export const muscleGroupInput = document.getElementById("muscleGroup");
export const exerciseNameInput = document.getElementById("exerciseName");
export const weightInput = document.getElementById("weight");
export const submitButton = document.getElementById("submitButton");
export const cancelEditButton = document.getElementById("cancelEditButton");
export const addWeightButton = document.getElementById("addWeightButton");
export const formTitle = document.getElementById("formTitle");
export const messageDiv = document.getElementById("message");
export const weightInputContainer = document.getElementById("weightInputContainer");

// DOM Elements for Modal
export const historyModal = document.getElementById("historyModal");
export const closeButton = document.querySelector(".close-button");
export const historyModalTitle = document.getElementById("historyModalTitle");
export const weightChartCanvas = document.getElementById("weightChart");
export const historyList = document.getElementById("historyList");

// Global State Variables
export let editingExerciseId = null;
export let currentChart = null; // Variable to store the Chart.js diagram

// Setter functions for global variables
export function setEditingExerciseId(id) {
    editingExerciseId = id;
}

export function setCurrentChart(chart) {
    currentChart = chart;
}