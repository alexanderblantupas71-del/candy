// ========================================
// TASKSYNC - TASK MANAGEMENT
// ========================================

let editingTaskId = null;


// ========================================
// SAVE TASK FROM FORM
// ========================================

async function saveTaskFromForm() {

    const title =
        document.getElementById("taskTitle").value.trim();

    const description =
        document.getElementById("taskDescription").value.trim();

    const date =
        document.getElementById("taskDate").value;

    const time =
        document.getElementById("taskTime").value;

    const reminder =
        document.getElementById("taskReminder").value;

    const priority =
        document.getElementById("taskPriority").value;

    const projectId =
        document.getElementById("taskProject").value;


    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (title === "") {

        alert("Please enter a task name.");

        return;
    }


    if (date === "") {

        alert("Please select a date.");

        return;
    }


    // -----------------------------
    // EDIT EXISTING TASK
    // -----------------------------

    if (editingTaskId !== null) {

        await updateTask(editingTaskId, {

            title: title,

            description: description,

            date: date,

            time: time,

            dueDate: date,

            priority: priority

        });

    }


    // -----------------------------
    // ADD NEW TASK
    // -----------------------------

    else {

       await addTask({

    title: title,

    description: description,

    date: date,

    time: time,

    dueDate: date,

    priority: priority,

    status: "not-yet",

    projectId:
        projectId ? Number(projectId) : null,

    reminder:
        reminder === "none"
            ? null
            : Number(reminder)

});

    }


    // -----------------------------
    // RESET EDIT MODE
    // -----------------------------

    editingTaskId = null;


    // -----------------------------
    // CLOSE FORM
    // -----------------------------

    document
        .getElementById("taskForm")
        .classList.add("hidden");


    // -----------------------------
    // CLEAR FORM
    // -----------------------------

    clearTaskForm();


    // -----------------------------
    // REFRESH TASK LIST
    // -----------------------------

    if (typeof showTasks === "function") {

        await showTasks();

    }

}


// ========================================
// EDIT TASK
// ========================================

async function editTask(id) {

    const task = await getTask(id);


    if (!task) {

        alert("Task not found.");

        return;
    }


    editingTaskId = id;


    document.getElementById("taskTitle").value =
        task.title || "";


    document.getElementById("taskDescription").value =
        task.description || "";


    document.getElementById("taskDate").value =
        task.date || "";


    document.getElementById("taskTime").value =
        task.time || "";


    document.getElementById("taskPriority").value =
        task.priority || "medium";

    document.getElementById("taskProject").value =
    task.projectId || "";

    document
        .getElementById("taskForm")
        .classList.remove("hidden");

}


// ========================================
// DELETE TASK
// ========================================

async function removeTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");


    if (!confirmed) {

        return;
    }


    await deleteTask(id);


    if (typeof showTasks === "function") {

        await showTasks();

    }

}


// ========================================
// CHANGE TASK STATUS
// ========================================

async function changeTaskStatus(id, status) {

    await updateTask(id, {

        status: status

    });


    if (typeof showTasks === "function") {

        await showTasks();

    }

}


// ========================================
// CLEAR TASK FORM
// ========================================

function clearTaskForm() {

    document.getElementById("taskTitle").value = "";

    document.getElementById("taskDescription").value = "";

    document.getElementById("taskDate").value = "";

    document.getElementById("taskTime").value = "";

    document.getElementById("taskReminder").value = "none";

    document.getElementById("taskPriority").value = "medium";

    document.getElementById("taskProject").value = "";

    editingTaskId = null;
}

// ========================================
// PROJECTS / GROUPS
// ========================================

const projectNameInput =
    document.getElementById("projectName");

const projectDescriptionInput =
    document.getElementById("projectDescription");

const addProjectButton =
    document.getElementById("addProjectButton");

const projectList =
    document.getElementById("projectList");


// ========================================
// ADD PROJECT
// ========================================

addProjectButton.addEventListener("click", async () => {

    const name =
        projectNameInput.value.trim();

    const description =
        projectDescriptionInput.value.trim();


    if (name === "") {

        alert("Please enter a project name.");

        return;
    }


    await addProject(
        name,
        description
    );


    projectNameInput.value = "";

    projectDescriptionInput.value = "";


    await showProjects();

await loadProjectOptions();

});


// ========================================
// SHOW PROJECTS
// ========================================

async function showProjects() {

    const projects =
        await getProjects();


    projectList.innerHTML = "";


    if (projects.length === 0) {

        projectList.innerHTML = `
            <p>No projects yet.</p>
        `;

        return;
    }


    projects.forEach(project => {

        const projectElement =
            document.createElement("div");


        projectElement.className =
            "project-item";


        projectElement.innerHTML = `

            <div>

                <strong>
                    📁 ${project.name}
                </strong>

                <p>
                    ${project.description || "No description"}
                </p>

            </div>

            <button
                onclick="removeProject(${project.id})"
            >
                Delete
            </button>

        `;


        projectList.appendChild(projectElement);

    });

}


// ========================================
// DELETE PROJECT
// ========================================

async function removeProject(id) {

    const confirmed =
        confirm("Delete this project?");


    if (!confirmed) {

        return;
    }


    await deleteProject(id);

    await showProjects();

}

// ========================================
// LOAD PROJECTS INTO TASK FORM
// ========================================

async function loadProjectOptions() {

    const projectSelect =
        document.getElementById("taskProject");

    if (!projectSelect) {
        return;
    }


    const projects =
        await getProjects();


    projectSelect.innerHTML = `
        <option value="">
            No Project
        </option>
    `;


    projects.forEach(project => {

        const option =
            document.createElement("option");


        option.value = project.id;

        option.textContent =
            `📁 ${project.name}`;


        projectSelect.appendChild(option);

    });

}


// Load projects when page starts
loadProjectOptions();

// ========================================
// SUBTASKS / CHECKLIST
// ========================================

async function displaySubtasks(taskId) {

    const container =
        document.getElementById(`subtasks-${taskId}`);

    if (!container) {
        return;
    }


    const subtasks =
        await getSubtasks(taskId);


    container.innerHTML = "";


    if (subtasks.length === 0) {

        container.innerHTML = `
            <p>No checklist items.</p>
        `;

        return;
    }


    subtasks.forEach(subtask => {

        const item =
            document.createElement("div");

        item.className = "subtask-item";


        item.innerHTML = `

            <label>

                <input
                    type="checkbox"
                    ${subtask.completed ? "checked" : ""}
                    onchange="
                        toggleSubtaskItem(
                            ${subtask.id},
                            this.checked
                        )
                    "
                >

                <span>
                    ${subtask.title}
                </span>

            </label>


            <button
                onclick="removeSubtask(${subtask.id})"
            >
                ×
            </button>

        `;


        container.appendChild(item);

    });

}


// ========================================
// CREATE SUBTASK
// ========================================

async function createSubtask(taskId) {

    const input =
        document.getElementById(
            `new-subtask-${taskId}`
        );


    const title =
        input.value.trim();


    if (title === "") {

        return;
    }


    await addSubtask(
        taskId,
        title
    );


    input.value = "";


    await displaySubtasks(taskId);

}


// ========================================
// TOGGLE SUBTASK
// ========================================

async function toggleSubtaskItem(
    id,
    completed
) {

    await toggleSubtask(
        id,
        completed
    );


    // Find the task that owns this subtask
    const subtasks =
        await db.subtasks.get(id);


    if (subtasks) {

        await displaySubtasks(
            subtasks.taskId
        );

    }

}


// ========================================
// DELETE SUBTASK
// ========================================

async function removeSubtask(id) {

    const confirmed =
        confirm(
            "Delete this checklist item?"
        );


    if (!confirmed) {
        return;
    }


    const subtask =
        await db.subtasks.get(id);


    if (!subtask) {
        return;
    }


    await deleteSubtask(id);


    await displaySubtasks(
        subtask.taskId
    );

}

// ========================================
// REMINDER CHECKER
// ========================================

let notifiedTasks = new Set();


async function checkReminders() {

    const tasks =
        await getTasks();


    const now =
        new Date();


    tasks.forEach(task => {

        if (!task.time) {
            return;
        }


        if (!task.reminder) {
            return;
        }


        if (task.status === "done") {
            return;
        }


        const deadline =
            new Date(
                `${task.date}T${task.time}`
            );


        const reminderTime =
            new Date(
                deadline.getTime()
                -
                task.reminder * 60 * 1000
            );


        const taskKey =
            `${task.id}-${task.date}-${task.time}`;


        // Reminder time reached
        if (
            now >= reminderTime &&
            now < deadline &&
            !notifiedTasks.has(taskKey)
        ) {

            notifiedTasks.add(taskKey);


            playReminderSound();


if (
    "Notification" in window &&
    Notification.permission === "granted"
) {

    new Notification("🔔 TaskSync Reminder", {

        body:
            `${task.title}\n` +
            `Deadline: ${task.time}`,

        tag:
            `task-${task.id}`

    });

}
else {

    alert(
        `🔔 Reminder\n\n` +
        `${task.title}\n\n` +
        `Deadline: ${task.time}`
    );

}
        }

    });

}


// Check every 30 seconds
setInterval(
    checkReminders,
    30000
);

// ========================================
// NOTIFICATION PERMISSION
// ========================================

async function requestNotificationPermission() {

    if (!("Notification" in window)) {

        console.log("Notifications are not supported.");

        return;
    }


    if (Notification.permission === "default") {

        await Notification.requestPermission();

    }

}


// Ask when TaskSync starts
requestNotificationPermission();

// ========================================
// REMINDER SOUND
// ========================================

function playReminderSound() {

    const audioContext =
        new (window.AudioContext ||
            window.webkitAudioContext)();


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.frequency.value = 800;

    oscillator.type = "sine";


    gain.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.5
    );

}


// Check immediately
checkReminders();

// ========================================
// LOAD PROJECTS
// ========================================

showProjects();