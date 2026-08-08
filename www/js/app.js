let currentDate = new Date();
let selectedDate = null;

// ==============================
// ELEMENTS
// ==============================

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");

const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");

const selectedDateText = document.getElementById("selectedDate");
const taskList = document.getElementById("taskList");

const addTaskButton = document.getElementById("addTaskButton");
const taskForm = document.getElementById("taskForm");

const cancelTask = document.getElementById("cancelTask");
const saveTaskButton = document.getElementById("saveTask");

const taskDate = document.getElementById("taskDate");


// ==============================
// CALENDAR
// ==============================

function renderCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    monthYear.textContent = `${monthName} ${year}`;

    calendarDays.innerHTML = "";


    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }


    // Create calendar days
    for (let day = 1; day <= lastDate; day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        dayElement.dataset.date = dateString;


        // Highlight today
        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add("today");
        }


        // Highlight selected date
        if (selectedDate === dateString) {

            dayElement.classList.add("selected-day");
        }


        // Click date
        dayElement.addEventListener("click", async () => {

            selectedDate = dateString;


            const formattedDate =
                new Date(dateString + "T00:00:00")
                    .toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    });


            selectedDateText.textContent = formattedDate;


            renderCalendar();

            await showTasks();

        });


        calendarDays.appendChild(dayElement);
    }
}


// ==============================
// PREVIOUS MONTH
// ==============================

previousMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar();

});


// ==============================
// NEXT MONTH
// ==============================

nextMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar();

});


// ==============================
// SHOW TASKS
// ==============================

async function showTasks() {

    if (!selectedDate) {

        taskList.innerHTML = `
            <p>Select a date.</p>
        `;

        return;
    }


    taskList.innerHTML = `
        <p>Loading tasks...</p>
    `;


    const selectedTasks =
        await getTasksForDate(selectedDate);


    taskList.innerHTML = "";


    if (selectedTasks.length === 0) {

        taskList.innerHTML = `
            <p>No tasks for this day.</p>
        `;

        return;
    }


    selectedTasks.forEach(async task => {

    const taskElement = document.createElement("div");

    taskElement.className = "task-item";

    taskElement.innerHTML = `

        <div class="task-info">

            <strong>
                ${task.title}
            </strong>

            <p>
                ${task.description || "No description"}
            </p>

            <small>
                ${task.time || "No deadline"}
                •
                Priority: ${task.priority}
            </small>

            <br>

           <small>

    ${task.time || "No deadline"}

    •

    Priority: ${task.priority}

    •

    Reminder:
    ${
        task.reminder
            ? `${task.reminder} min before`
            : "None"
    }

</small>
        </div>


        <div class="task-buttons">

            <button onclick="editTask(${task.id})">
                Edit
            </button>

            <button onclick="removeTask(${task.id})">
                Delete
            </button>

        </div>


        <div class="task-status">

            <select
                onchange="changeTaskStatus(${task.id}, this.value)"
            >

                <option
                    value="not-yet"
                    ${task.status === "not-yet" ? "selected" : ""}
                >
                    Not Yet
                </option>

                <option
                    value="progressing"
                    ${task.status === "progressing" ? "selected" : ""}
                >
                    Progressing
                </option>

                <option
                    value="done"
                    ${task.status === "done" ? "selected" : ""}
                >
                    Done
                </option>

            </select>

        </div>


        <div class="subtasks">

            <strong>Checklist</strong>

            <div id="subtasks-${task.id}">
                Loading...
            </div>

            <input
                type="text"
                id="new-subtask-${task.id}"
                placeholder="Add checklist item"
            >

            <button onclick="createSubtask(${task.id})">
                + Add
            </button>

        </div>

    `;

    taskList.appendChild(taskElement);

    await displaySubtasks(task.id);

});

}


// ==============================
// OPEN ADD TASK FORM
// ==============================

addTaskButton.addEventListener("click", () => {

    taskForm.classList.remove("hidden");


    if (selectedDate) {

        taskDate.value = selectedDate;

    }

});


// ==============================
// CANCEL TASK
// ==============================

cancelTask.addEventListener("click", () => {

    taskForm.classList.add("hidden");

    clearTaskFormIfAvailable();

});


// ==============================
// SAVE TASK
// ==============================
//
// IMPORTANT:
// We DO NOT call saveTask() here.
// The actual function is saveTaskFromForm()
// inside tasks.js.
//

saveTaskButton.addEventListener("click", async () => {

    await saveTaskFromForm();

});


// ==============================
// CLEAR FORM
// ==============================

function clearTaskFormIfAvailable() {

    const title =
        document.getElementById("taskTitle");

    const description =
        document.getElementById("taskDescription");

    const time =
        document.getElementById("taskTime");

    const reminder =
    document.getElementById("taskReminder").value;

    const priority =
        document.getElementById("taskPriority");


    if (title) {
        title.value = "";
    }

    if (description) {
        description.value = "";
    }

    if (time) {
        time.value = "";
    }

    if (priority) {
        priority.value = "medium";
    }

}


// ==============================
// START CALENDAR
// ==============================

renderCalendar();