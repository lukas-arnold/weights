import { messageDiv } from "./constants.js";

export function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 3000);
}

export function formatWeight(weight) {
    return Number(weight.toFixed(1)).toLocaleString("de-DE");
}


export function formatDateTime(isoTimestamp) {
    if (!isoTimestamp) return "";
    const date = new Date(isoTimestamp);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    return date.toLocaleString("de-DE", options);
}