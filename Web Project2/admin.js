// JSON file path - update this if needed
const baseJson = "sections.json";

// Select DOM Elements
const adminContainer = document.querySelector("#admin-container");

// Fetch sections when the page loads
document.addEventListener("DOMContentLoaded", fetchSections);

// Function to fetch sections from JSON
async function fetchSections() {
    try {
        // Try loading from localStorage
        const localData = localStorage.getItem("sections");
        if (localData) {
            const parsed = JSON.parse(localData);
            displaySections(parsed.sections || []);
            return;
        }

        // If not found in localStorage, fetch from JSON file
        const response = await fetch(baseJson);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const sections = data.sections || [];

        // Save initial load to localStorage
        localStorage.setItem("sections", JSON.stringify({ sections }));

        displaySections(sections);
    } catch (error) {
        console.error("Error loading sections:", error);
        adminContainer.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Sections</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Function to display sections organized by status
function displaySections(sections) {
    const openSections = sections.filter(sec => sec.status.toLowerCase() === "open");
    const closedSections = sections.filter(sec => sec.status.toLowerCase() === "closed");

    adminContainer.innerHTML = `
        <section class="controls">
            <button class="create-course-btn" onclick="location.href='createCourse.html'">
                <i class="fa-solid fa-plus"></i> Create New Course
            </button>
        </section>

        ${renderSectionGroup("Open for Registration", openSections)}
        ${renderSectionGroup("Closed Sections", closedSections)}
    `;
}


// Render sections into a card grid
function renderSectionGroup(title, sectionList) {
    if (sectionList.length === 0) {
        return `
            <section class="section-header"><h2>${title}</h2></section>
            <p class="no-courses">No sections in this category.</p>
        `;
    }

    return `
        <section class="section-header"><h2>${title}</h2></section>
        <div class="card-container">
            ${sectionList.map(generateSectionCard).join("")}
        </div>
    `;
}

// Create section card
function generateSectionCard(section) {
    return `
        <div class="course-card">
            <h3>${section.courseCode} - ${section.id}</h3>
            <p><strong>Instructor:</strong> ${section.instructor}</p>
            <p><strong>Schedule:</strong> ${section.schedule}</p>
            <p><strong>Location:</strong> ${section.location}</p>
            <p><strong>Seats:</strong> ${section.availableSeats}/${section.seats}</p>
            <p><strong>Deadline:</strong> ${section.deadline}</p>
            <p><strong>Status:</strong> ${section.status}</p>

            <div class="card-actions">
                ${
                    section.status.toLowerCase() === "closed"
                        ? `<button onclick="validateSection('${section.id}')">Validate</button>`
                        : ""
                }
                <button class="btn-cancel" onclick="deleteSection('${section.id}')">Delete</button>
            </div>
        </div>
    `;
}

// Validate a section by changing its status - now works with localStorage
function validateSection(sectionId) {
    // Get sections from localStorage
    const localData = localStorage.getItem("sections");
    
    if (localData) {
        try {
            const data = JSON.parse(localData);
            const sections = data.sections || [];
            const sectionIndex = sections.findIndex(sec => sec.id === sectionId);

            if (sectionIndex === -1) {
                console.error("Section not found:", sectionId);
                return;
            }

            // Update status from "closed" to "open"
            if (sections[sectionIndex].status.toLowerCase() === "closed") {
                sections[sectionIndex].status = "open";

                // Save updated data back to localStorage
                localStorage.setItem("sections", JSON.stringify({ sections }));

                // Re-render
                displaySections(sections);
                alert(`Section "${sectionId}" status changed to OPEN.`);
            }
        } catch (error) {
            console.error("Error validating section:", error);
            alert("Failed to validate section. See console for details.");
        }
    } else {
        alert("No section data found in local storage.");
    }
}

// Delete a section by ID - now works with localStorage
function deleteSection(sectionId) {
    if (!confirm(`Are you sure you want to delete section "${sectionId}"?`)) return;

    // Get sections from localStorage
    const localData = localStorage.getItem("sections");
    
    if (localData) {
        try {
            const data = JSON.parse(localData);
            let sections = data.sections || [];
            sections = sections.filter(sec => sec.id !== sectionId);

            // Save updated data back to localStorage
            localStorage.setItem("sections", JSON.stringify({ sections }));

            // Re-render
            displaySections(sections);
        } catch (error) {
            console.error("Error deleting section:", error);
            alert("Failed to delete section. See console for details.");
        }
    } else {
        alert("No section data found in local storage.");
    }
}