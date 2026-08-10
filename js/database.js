/* ============================================================
   TASKSYNC DATABASE
   Dexie + IndexedDB
   ============================================================ */

const db = new Dexie("TaskSyncDB");


/* ============================================================
   DATABASE VERSION
   ============================================================ */

db.version(1).stores({

    events:
        "++id, title, startDate, endDate, dueDate",

    tasks:
        "++id, title, startDate, endDate, dueDate"

});


/* ============================================================
   EVENTS
   ============================================================ */

async function saveEvent(eventData) {

    return await db.events.add({

        title: eventData.title,

        startDate: eventData.startDate,
        startTime: eventData.startTime,

        endDate: eventData.endDate,
        endTime: eventData.endTime,

        dueDate: eventData.dueDate,
        dueTime: eventData.dueTime,

        repeat: eventData.repeat,

        location: eventData.location,

        description: eventData.description,

        reminder: Number(eventData.reminder),

        color: eventData.color,

        createdAt: new Date().toISOString()

    });

}


async function getEvents() {

    return await db.events.toArray();

}


async function deleteEvent(id) {

    return await db.events.delete(id);

}


/* ============================================================
   TASKS
   ============================================================ */

async function saveTask(taskData) {

    return await db.tasks.add({

        title: taskData.title,

        startDate: taskData.startDate,
        startTime: taskData.startTime,

        endDate: taskData.endDate,
        endTime: taskData.endTime,

        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,

        repeat: taskData.repeat,

        description: taskData.description,

        reminder: Number(taskData.reminder),

        color: taskData.color,

        completed: false,

        createdAt: new Date().toISOString()

    });

}


async function getTasks() {

    return await db.tasks.toArray();

}


async function deleteTask(id) {

    return await db.tasks.delete(id);

}


/* ============================================================
   GET EVERYTHING
   ============================================================ */

async function getAllCalendarItems() {

    const events =
        await getEvents();

    const tasks =
        await getTasks();


    return {

        events,
        tasks

    };

}
