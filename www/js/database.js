// TaskSync Offline Database
// Uses Dexie + IndexedDB

const db = new Dexie("TaskSyncDB");


// ================================
// DATABASE STRUCTURE
// ================================

db.version(1).stores({

    // Projects / Groups
    projects:
        "++id, name",

    // Calendar Events
    events:
        "++id, date, startDate, endDate",

    // Tasks
    tasks:
        "++id, date, startDate, dueDate, projectId, status, priority",

    // Subtasks / Checklist
    subtasks:
        "++id, taskId, completed",

    // Reminders
    reminders:
        "++id, taskId, eventId, remindAt, completed"

});


// ================================
// PROJECTS
// ================================

async function addProject(name, description = "") {

    return await db.projects.add({

        name: name,

        description: description,

        createdAt: new Date().toISOString()

    });

}


async function getProjects() {

    return await db.projects.toArray();

}


async function deleteProject(id) {

    await db.projects.delete(id);

}


// ================================
// TASKS
// ================================

async function addTask(task) {

    return await db.tasks.add({

        title: task.title,

        description: task.description || "",

        date: task.date,

        time: task.time || "",

        startDate: task.startDate || task.date,

        dueDate: task.dueDate || task.date,

        priority: task.priority || "medium",

        status: task.status || "not-yet",

        projectId: task.projectId || null,

        reminder: task.reminder || null,

        createdAt: new Date().toISOString()

    });

}


async function getTasks() {

    return await db.tasks.toArray();

}


async function getTasksForDate(date) {

    return await db.tasks
        .where("date")
        .equals(date)
        .toArray();

}


async function getTask(id) {

    return await db.tasks.get(id);

}


async function updateTask(id, changes) {

    return await db.tasks.update(id, changes);

}


async function deleteTask(id) {

    // Delete subtasks belonging to this task
    await db.subtasks
        .where("taskId")
        .equals(id)
        .delete();

    // Delete reminders belonging to this task
    await db.reminders
        .where("taskId")
        .equals(id)
        .delete();

    // Delete task
    return await db.tasks.delete(id);

}


// ================================
// SUBTASKS / CHECKLIST
// ================================

async function addSubtask(taskId, title) {

    return await db.subtasks.add({

        taskId: taskId,

        title: title,

        completed: false

    });

}


async function getSubtasks(taskId) {

    return await db.subtasks
        .where("taskId")
        .equals(taskId)
        .toArray();

}


async function toggleSubtask(id, completed) {

    return await db.subtasks.update(id, {

        completed: completed

    });

}


async function deleteSubtask(id) {

    return await db.subtasks.delete(id);

}


// ================================
// CALENDAR EVENTS
// ================================

async function addEvent(event) {

    return await db.events.add({

        title: event.title,

        description: event.description || "",

        date: event.date,

        startDate: event.startDate,

        endDate: event.endDate,

        location: event.location || "",

        meetingLink: event.meetingLink || "",

        people: event.people || "",

        reminder: event.reminder || null,

        checklist: event.checklist || [],

        attachments: event.attachments || [],

        createdAt: new Date().toISOString()

    });

}


async function getEventsForDate(date) {

    return await db.events
        .where("date")
        .equals(date)
        .toArray();

}


async function getEvents() {

    return await db.events.toArray();

}


async function updateEvent(id, changes) {

    return await db.events.update(id, changes);

}


async function deleteEvent(id) {

    return await db.events.delete(id);

}


// ================================
// REMINDERS
// ================================

async function addReminder(reminder) {

    return await db.reminders.add({

        taskId: reminder.taskId || null,

        eventId: reminder.eventId || null,

        remindAt: reminder.remindAt,

        completed: false

    });

}


async function getPendingReminders() {

    return await db.reminders
        .where("completed")
        .equals(false)
        .toArray();

}


async function completeReminder(id) {

    return await db.reminders.update(id, {

        completed: true

    });

}