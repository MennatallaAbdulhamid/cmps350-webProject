// JSON file path - update this if needed
const baseJson = "sections.json";

// Select DOM Elements
const adminContainer = document.querySelector("#admin-container");

// Fetch sections when the page loads
document.addEventListener("DOMContentLoaded", fetchSections);

// Function to fetch sections from JSON
async function fetchSections() {
    try {
        const response = await fetch(baseJson);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const sections = data.sections || [];

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
    const waitlistSections = sections.filter(sec => sec.status.toLowerCase() === "waitlist");
    const closedSections = sections.filter(sec => sec.status.toLowerCase() === "closed");

    adminContainer.innerHTML = `
        <section class="controls">
            <button class="create-course-btn" onclick="location.href='createCourse.html'">
                <i class="fa-solid fa-plus"></i> Create New Course
            </button>
        </section>

        ${renderSectionGroup("Open for Registration", openSections)}
        ${renderSectionGroup("Waitlisted Sections", waitlistSections)}
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

            <div class="action-buttons">
                <button onclick="validateSection('${section.id}')">✔️ Validate</button>
                <button onclick="deleteSection('${section.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Validate a section by changing its status
function validateSection(sectionId) {
    fetch(baseJson)
        .then(res => res.json())
        .then(data => {
            const sections = data.sections || [];

            const updatedSections = sections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, status: "closed" }; // Or next status
                }
                return section;
            });

            // Save updated data in localStorage (or send to server in real app)
            localStorage.setItem("sections", JSON.stringify({ sections: updatedSections }));
            displaySections(updatedSections);
            alert(`Section "${sectionId}" has been validated (status set to 'closed').`);
        })
        .catch(err => console.error("Validation failed:", err));
}

// Delete a section by ID
function deleteSection(sectionId) {
    if (!confirm(`Are you sure you want to delete section "${sectionId}"?`)) return;

    fetch(baseJson)
        .then(res => res.json())
        .then(data => {
            const sections = data.sections || [];

            const updatedSections = sections.filter(section => section.id !== sectionId);

            localStorage.setItem("sections", JSON.stringify({ sections: updatedSections }));
            displaySections(updatedSections);
            alert(`Section "${sectionId}" has been deleted.`);
        })
        .catch(err => console.error("Delete failed:", err));
}

