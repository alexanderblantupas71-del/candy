/* ============================================================
   TASKSYNC
   Calendar + Create Event / Task
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       CALENDAR ELEMENTS
       ======================================================== */

    const weekHeader =
        document.getElementById("weekHeader");

    const dayColumns =
        document.getElementById("dayColumns");

    const timeColumn =
        document.getElementById("timeColumn");

    const currentMonth =
        document.getElementById("currentMonth");

    const miniMonth =
        document.getElementById("miniMonth");

    const miniCalendarDays =
        document.getElementById("miniCalendarDays");

    const todayButton =
        document.getElementById("todayButton");

    const previousWeek =
        document.getElementById("previousWeek");

    const nextWeek =
        document.getElementById("nextWeek");

    const miniPrevious =
        document.getElementById("miniPrevious");

    const miniNext =
        document.getElementById("miniNext");

    const calendarScroll =
        document.getElementById("calendarScroll");


    /* ========================================================
       CREATE ELEMENTS
       ======================================================== */

    const createButton =
        document.getElementById("createButton");

    const createMenu =
        document.getElementById("createMenu");

    const createEventButton =
        document.getElementById("createEventButton");

    const createTaskButton =
        document.getElementById("createTaskButton");


    /* ========================================================
       EVENT ELEMENTS
       ======================================================== */

    const eventModal =
        document.getElementById("eventModal");

    const eventForm =
        document.getElementById("eventForm");

    const closeEventModal =
        document.getElementById("closeEventModal");

    const cancelEvent =
        document.getElementById("cancelEvent");


    /* ========================================================
       TASK ELEMENTS
       ======================================================== */

    const taskModal =
        document.getElementById("taskModal");

    const taskForm =
        document.getElementById("taskForm");

    const closeTaskModal =
        document.getElementById("closeTaskModal");

    const cancelTask =
        document.getElementById("cancelTask");


    /* ========================================================
       CONSTANTS
       ======================================================== */

    const HOURS_IN_DAY = 24;

    const HOUR_HEIGHT = 43;

    const DAYS_IN_WEEK = 7;


    /* ========================================================
       STATE
       ======================================================== */

    let selectedDate = new Date();
    let calendarEvents = [];

    let calendarTasks = [];

    let editingTaskId = null;

    let displayedWeek =
        getStartOfWeek(selectedDate);

    let miniCalendarDate =
        new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );


    /* ========================================================
       INITIALIZE
       ======================================================== */

 loadCalendarItems();

renderMiniCalendar();

scrollToCurrentTime();

startCurrentTimeUpdater();


    /* ========================================================
       DATE HELPERS
       ======================================================== */

    function startOfDay(date) {

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    }


    function getStartOfWeek(date) {

        const result =
            startOfDay(date);

        const day =
            result.getDay();

        result.setDate(
            result.getDate() - day
        );

        return result;

    }


    function isSameDay(date1, date2) {

        return (
            date1.getFullYear() === date2.getFullYear()
            &&
            date1.getMonth() === date2.getMonth()
            &&
            date1.getDate() === date2.getDate()
        );

    }


    function formatMonthYear(date) {

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    }


    /* ========================================================
       CALENDAR
       ======================================================== */

    function renderCalendar() {

    renderMonthTitle();

    renderWeekHeader();

    renderTimeColumn();

    renderDayColumns();

    renderCurrentTimeLine();

}


    function renderMonthTitle() {

        const middleOfWeek =
            new Date(displayedWeek);

        middleOfWeek.setDate(
            middleOfWeek.getDate() + 3
        );

        currentMonth.textContent =
            formatMonthYear(
                middleOfWeek
            );

    }


    function renderWeekHeader() {

        weekHeader.innerHTML = "";

        for (
            let i = 0;
            i < DAYS_IN_WEEK;
            i++
        ) {

            const date =
                new Date(displayedWeek);

            date.setDate(
                displayedWeek.getDate() + i
            );


            const header =
                document.createElement("div");

            header.className =
                "week-day-header";


            if (
                isSameDay(
                    date,
                    new Date()
                )
            ) {

                header.classList.add("today");

            }


            const dayName =
                document.createElement("div");

            dayName.className =
                "week-day-name";

            dayName.textContent =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                ).toUpperCase();


            const dayNumber =
                document.createElement("div");

            dayNumber.className =
                "week-day-number";

            dayNumber.textContent =
                date.getDate();


            header.appendChild(dayName);

            header.appendChild(dayNumber);

            weekHeader.appendChild(header);

        }

    }


    function renderTimeColumn() {

        timeColumn.innerHTML = "";

        for (
            let hour = 0;
            hour < HOURS_IN_DAY;
            hour++
        ) {

            const label =
                document.createElement("div");

            label.className =
                "time-label";

            label.textContent =
                formatHour(hour);

            timeColumn.appendChild(label);

        }

    }


    function formatHour(hour) {

        if (hour === 0) {
            return "12 AM";
        }

        if (hour === 12) {
            return "12 PM";
        }

        if (hour < 12) {
            return `${hour} AM`;
        }

        return `${hour - 12} PM`;

    }


    function renderDayColumns() {

    dayColumns.innerHTML = "";


    for (
        let day = 0;
        day < DAYS_IN_WEEK;
        day++
    ) {

        const column =
            document.createElement("div");

        column.className =
            "day-column";


        const date =
            new Date(displayedWeek);

        date.setDate(
            displayedWeek.getDate() + day
        );


        /* ====================================================
           HOURLY ROWS
           ==================================================== */

        for (
            let hour = 0;
            hour < HOURS_IN_DAY;
            hour++
        ) {

            const row =
                document.createElement("div");

            row.className =
                "hour-row";


            const slot =
                document.createElement("div");

            slot.className =
                "time-slot";


            slot.style.top =
                `${hour * HOUR_HEIGHT}px`;

            slot.style.height =
                `${HOUR_HEIGHT}px`;


            slot.addEventListener(
                "click",
                () => {

                    openEventModal(
                        date,
                        hour
                    );

                }
            );


            row.appendChild(slot);

            column.appendChild(row);

        }


        /* ====================================================
           HALF-HOUR LINES
           ==================================================== */

        for (
            let hour = 0;
            hour < HOURS_IN_DAY;
            hour++
        ) {

            const halfHour =
                document.createElement("div");

            halfHour.className =
                "half-hour";


            halfHour.style.top =
                `${hour * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`;


            column.appendChild(
                halfHour
            );

        }


        /* ====================================================
           CALENDAR ITEMS
           ==================================================== */

        const dayEvents =
            calendarEvents.filter(
                item =>
                    isDateInsideItem(
                        date,
                        item.startDate,
                        item.endDate
                    )
            );


        const dayTasks =
            calendarTasks.filter(
                item =>
                    isDateInsideItem(
                        date,
                        item.startDate,
                        item.endDate
                    )
            );


        const items = [

            ...dayEvents.map(
                item => ({
                    ...item,
                    type: "event"
                })
            ),

            ...dayTasks.map(
                item => ({
                    ...item,
                    type: "task"
                })
            )

        ];


        positionCalendarItems(
            column,
            items,
            date
        );


        dayColumns.appendChild(
            column
        );

    }

}

function isDateInsideItem(
    date,
    startDate,
    endDate
) {

    const current =
        formatDateForInput(date);


    return (
        current >= startDate &&
        current <= endDate
    );

}
function positionCalendarItems(column, items, date) {

    if (!items || items.length === 0) {
        return;
    }


    /*
     * Sort everything by start time.
     * If two items start at the same time,
     * keep them in their existing order.
     */
    items.sort((a, b) => {

        const startA =
            getItemStartMinutes(a, date);

        const startB =
            getItemStartMinutes(b, date);

        return startA - startB;

    });


    /*
     * Each item gets assigned to the first
     * column where it doesn't overlap another item.
     */
    const columns = [];


    items.forEach(item => {

        let placed = false;


        for (
            let columnIndex = 0;
            columnIndex < columns.length;
            columnIndex++
        ) {

            const columnItems =
                columns[columnIndex];


            const hasOverlap =
                columnItems.some(existingItem =>
                    itemsOverlap(
                        existingItem,
                        item,
                        date
                    )
                );


            if (!hasOverlap) {

                columnItems.push(item);

                item._layoutColumn =
                    columnIndex;

                placed = true;

                break;

            }

        }


        /*
         * No existing column was available.
         * Create a new one.
         */
        if (!placed) {

            const newColumn = [item];

            columns.push(newColumn);

            item._layoutColumn =
                columns.length - 1;

        }

    });


    const totalColumns =
        Math.max(1, columns.length);


    /*
     * Create the actual calendar bars.
     */
    items.forEach(item => {

        const startMinutes =
            getItemStartMinutes(
                item,
                date
            );


        const endMinutes =
            getItemEndMinutes(
                item,
                date
            );


        /*
         * Position from the top of the calendar.
         */
        const top =
            (startMinutes / 60) *
            HOUR_HEIGHT;


        /*
         * Calculate height.
         */
        const height =
            Math.max(
                20,
                (
                    (endMinutes - startMinutes) /
                    60
                ) * HOUR_HEIGHT
            );


        /*
         * Calculate horizontal position.
         */
        const columnWidth =
            100 / totalColumns;


        const left =
            item._layoutColumn *
            columnWidth;


        /*
         * Create element.
         */
        const itemElement =
            document.createElement("div");


        itemElement.className =
            `calendar-item ${item.type} ${item.color || "red"}`;


        /*
         * Mark overlapping items.
         */
        if (totalColumns > 1) {

            itemElement.classList.add(
                "overlapping"
            );

        }


        itemElement.style.top =
            `${top}px`;


        itemElement.style.height =
            `${height}px`;


        itemElement.style.left =
            `calc(${left}% + 2px)`;


        itemElement.style.width =
            `calc(${columnWidth}% - 4px)`;


        /*
         * Title
         */
        const title =
            document.createElement("div");


        title.className =
            "calendar-item-title";


        title.textContent =
            item.title ||
            "(Untitled)";


        itemElement.appendChild(title);


        /*
         * Time
         */
        if (height >= 35) {

            const time =
                document.createElement("div");


            time.className =
                "calendar-item-time";


            time.textContent =
                formatItemTime(
                    item,
                    date
                );


            itemElement.appendChild(time);

        }


        /*
         * Clicking the bar.
         *
         * We'll turn this into the
         * edit/details system next.
         */
        itemElement.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        openDetailsModal(item);

    }
);


        column.appendChild(
            itemElement
        );

    });

}

function getItemStartMinutes(item, date) {

    const currentDate =
        formatDateForInput(date);

    if (currentDate > item.startDate) {
        return 0;
    }

    const [
        hours,
        minutes
    ] = item.startTime
        .split(":")
        .map(Number);

    return (
        hours * 60 +
        minutes
    );
}


function getItemEndMinutes(item, date) {

    const currentDate =
        formatDateForInput(date);

    if (currentDate < item.endDate) {
        return 24 * 60;
    }

    const [
        hours,
        minutes
    ] = item.endTime
        .split(":")
        .map(Number);

    return (
        hours * 60 +
        minutes
    );
}


function itemsOverlap(
    itemA,
    itemB,
    date
) {

    const startA =
        getItemStartMinutes(
            itemA,
            date
        );

    const endA =
        getItemEndMinutes(
            itemA,
            date
        );

    const startB =
        getItemStartMinutes(
            itemB,
            date
        );

    const endB =
        getItemEndMinutes(
            itemB,
            date
        );

    return (
        startA < endB &&
        endA > startB
    );
}
function getItemStartMinutes(
    item,
    date
) {

    const currentDate =
        formatDateForInput(date);


    if (
        currentDate > item.startDate
    ) {

        return 0;

    }


    const [
        hours,
        minutes
    ] =
        item.startTime
            .split(":")
            .map(Number);


    return (
        hours * 60 +
        minutes
    );

}
function getItemEndMinutes(
    item,
    date
) {

    const currentDate =
        formatDateForInput(date);


    if (
        currentDate < item.endDate
    ) {

        return 24 * 60;

    }


    const [
        hours,
        minutes
    ] =
        item.endTime
            .split(":")
            .map(Number);


    return (
        hours * 60 +
        minutes
    );

}
function formatItemTime(
    item,
    date
) {

    const startDate =
        formatDateForInput(date);


    const start =
        startDate === item.startDate
            ? item.startTime
            : "12:00";


    const endDate =
        formatDateForInput(date);


    const end =
        endDate === item.endDate
            ? item.endTime
            : "11:59";


    return `${formatDisplayTime(start)} – ${formatDisplayTime(end)}`;

}
function formatDisplayTime(
    time
) {

    const [
        hour,
        minute
    ] =
        time.split(":").map(Number);


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    let displayHour =
        hour % 12;


    if (displayHour === 0) {
        displayHour = 12;
    }


    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;

}



    /* ========================================================
       CURRENT TIME
       ======================================================== */

    function renderCurrentTimeLine() {

        const oldLine =
            document.querySelector(
                ".current-time-line"
            );

        if (oldLine) {
            oldLine.remove();
        }


        const now = new Date();

        let todayColumnIndex = -1;


        for (
            let i = 0;
            i < DAYS_IN_WEEK;
            i++
        ) {

            const date =
                new Date(displayedWeek);

            date.setDate(
                displayedWeek.getDate() + i
            );


            if (
                isSameDay(
                    date,
                    now
                )
            ) {

                todayColumnIndex = i;

                break;

            }

        }


        if (todayColumnIndex === -1) {
            return;
        }


        const currentHour =
            now.getHours();

        const currentMinutes =
            now.getMinutes();


        const topPosition =
            (
                currentHour +
                currentMinutes / 60
            ) * HOUR_HEIGHT;


        const line =
            document.createElement("div");

        line.className =
            "current-time-line";


        const columnWidth =
            100 / DAYS_IN_WEEK;


        line.style.top =
            `${topPosition}px`;

        line.style.left =
            `calc(${todayColumnIndex} * ${columnWidth}%)`;

        line.style.width =
            `${columnWidth}%`;


        dayColumns.appendChild(line);

    }


    function startCurrentTimeUpdater() {

        setInterval(
            renderCurrentTimeLine,
            60000
        );

    }


    /* ========================================================
       MINI CALENDAR
       ======================================================== */

    function renderMiniCalendar() {

        miniCalendarDays.innerHTML = "";

        miniMonth.textContent =
            formatMonthYear(
                miniCalendarDate
            );


        const year =
            miniCalendarDate.getFullYear();

        const month =
            miniCalendarDate.getMonth();


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        const previousMonthDays =
            firstDay.getDay();


        for (
            let i = previousMonthDays - 1;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    year,
                    month,
                    -i
                );

            createMiniDay(
                date,
                true
            );

        }


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );

            createMiniDay(
                date,
                false
            );

        }


        const totalCells =
            miniCalendarDays.children.length;


        const remaining =
            (
                Math.ceil(
                    totalCells / 7
                ) * 7
            ) - totalCells;


        for (
            let i = 1;
            i <= remaining;
            i++
        ) {

            const date =
                new Date(
                    year,
                    month + 1,
                    i
                );

            createMiniDay(
                date,
                true
            );

        }

    }
    async function loadCalendarItems() {

    try {

        const data =
            await getAllCalendarItems();


        calendarEvents =
            data.events;

        calendarTasks =
            data.tasks;


        console.log(
            "Events:",
            calendarEvents
        );

        console.log(
            "Tasks:",
            calendarTasks
        );


        renderCalendar();


    } catch (error) {

        console.error(
            "Could not load calendar data:",
            error
        );

    }

}
    function createMiniDay(
        date,
        otherMonth
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "mini-day";

        button.textContent =
            date.getDate();


        if (otherMonth) {

            button.classList.add(
                "other-month"
            );

        }


        if (
            isSameDay(
                date,
                new Date()
            )
        ) {

            button.classList.add(
                "today"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectedDate =
                    new Date(date);

                displayedWeek =
                    getStartOfWeek(
                        selectedDate
                    );


                miniCalendarDate =
                    new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        1
                    );


                renderCalendar();

                renderMiniCalendar();

            }
        );


        miniCalendarDays.appendChild(
            button
        );

    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    todayButton.addEventListener(
        "click",
        () => {

            selectedDate =
                new Date();

            displayedWeek =
                getStartOfWeek(
                    selectedDate
                );

            miniCalendarDate =
                new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    1
                );

            renderCalendar();

            renderMiniCalendar();

            scrollToCurrentTime();

        }
    );


    previousWeek.addEventListener(
        "click",
        () => {

            displayedWeek.setDate(
                displayedWeek.getDate() - 7
            );

            selectedDate =
                new Date(displayedWeek);

            miniCalendarDate =
                new Date(
                    displayedWeek.getFullYear(),
                    displayedWeek.getMonth(),
                    1
                );

            renderCalendar();

            renderMiniCalendar();

        }
    );


    nextWeek.addEventListener(
        "click",
        () => {

            displayedWeek.setDate(
                displayedWeek.getDate() + 7
            );

            selectedDate =
                new Date(displayedWeek);

            miniCalendarDate =
                new Date(
                    displayedWeek.getFullYear(),
                    displayedWeek.getMonth(),
                    1
                );

            renderCalendar();

            renderMiniCalendar();

        }
    );


    miniPrevious.addEventListener(
        "click",
        () => {

            miniCalendarDate.setMonth(
                miniCalendarDate.getMonth() - 1
            );

            renderMiniCalendar();

        }
    );


    miniNext.addEventListener(
        "click",
        () => {

            miniCalendarDate.setMonth(
                miniCalendarDate.getMonth() + 1
            );

            renderMiniCalendar();

        }
    );


    /* ========================================================
       CREATE MENU
       ======================================================== */

    createButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            createMenu.classList.toggle(
                "hidden"
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                !createMenu.contains(event.target)
                &&
                !createButton.contains(event.target)
            ) {

                createMenu.classList.add(
                    "hidden"
                );

            }

        }
    );


    /* ========================================================
       OPEN EVENT
       ======================================================== */

    createEventButton.addEventListener(
        "click",
        () => {

            createMenu.classList.add(
                "hidden"
            );

            openEventModal();

        }
    );


    /* ========================================================
       OPEN TASK
       ======================================================== */

createTaskButton.addEventListener(
    "click",
    () => {

        createMenu.classList.add(
            "hidden"
        );

        editingTaskId = null;

        openTaskModal();

    }
);


    /* ========================================================
       OPEN EVENT MODAL
       ======================================================== */

    function openEventModal(
        date = selectedDate,
        hour = 9
    ) {

        const dateString =
            formatDateForInput(date);


        document.getElementById(
            "eventStartDate"
        ).value = dateString;


        document.getElementById(
            "eventEndDate"
        ).value = dateString;





        document.getElementById(
            "eventStartTime"
        ).value =
            formatTimeForInput(hour);


        document.getElementById(
            "eventEndTime"
        ).value =
            formatTimeForInput(
                Math.min(
                    hour + 1,
                    23
                )
            );




        eventModal.classList.remove(
            "hidden"
        );

    }


   window.openTaskModal = function openTaskModal(
    date = selectedDate,
    hour = 9,
    task = null
) {

    editingTaskId =
        task ? task.id : null;


    const dateString =
        formatDateForInput(date);


    // Default values

    document.getElementById(
        "taskStartDate"
    ).value = dateString;

    document.getElementById(
        "taskEndDate"
    ).value = dateString;

    document.getElementById(
        "taskStartTime"
    ).value =
        formatTimeForInput(hour);

    document.getElementById(
        "taskEndTime"
    ).value =
        formatTimeForInput(
            Math.min(hour + 1, 23)
        );


    // Editing existing task

    if (task) {

        document.getElementById(
            "taskTitle"
        ).value =
            task.title || "";

        document.getElementById(
            "taskStartDate"
        ).value =
            task.startDate || "";

        document.getElementById(
            "taskStartTime"
        ).value =
            task.startTime || "";

        document.getElementById(
            "taskEndDate"
        ).value =
            task.endDate || "";

        document.getElementById(
            "taskEndTime"
        ).value =
            task.endTime || "";

        document.getElementById(
            "taskRepeat"
        ).value =
            task.repeat || "";

        document.getElementById(
            "taskDescription"
        ).value =
            task.description || "";

        document.getElementById(
            "taskReminder"
        ).value =
            task.reminder || "";

        document.getElementById(
            "taskColor"
        ).value =
            task.color || "red";

    }


    taskModal.classList.remove(
        "hidden"
    );

}


    /* ========================================================
       DATE INPUT
       ======================================================== */

    function formatDateForInput(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return `${year}-${month}-${day}`;

    }


    function formatTimeForInput(hour) {

        return `${String(hour).padStart(2, "0")}:00`;

    }


    /* ========================================================
       CLOSE MODALS
       ======================================================== */

    closeEventModal.addEventListener(
        "click",
        () => {

            eventModal.classList.add(
                "hidden"
            );

        }
    );


    cancelEvent.addEventListener(
        "click",
        () => {

            eventModal.classList.add(
                "hidden"
            );

        }
    );


    closeTaskModal.addEventListener(
        "click",
        () => {

            taskModal.classList.add(
                "hidden"
            );

        }
    );


    cancelTask.addEventListener(
        "click",
        () => {

            taskModal.classList.add(
                "hidden"
            );

        }
    );


    /* ========================================================
       CLICK OUTSIDE MODAL
       ======================================================== */

    eventModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === eventModal
            ) {

                eventModal.classList.add(
                    "hidden"
                );

            }

        }
    );


    taskModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === taskModal
            ) {

                taskModal.classList.add(
                    "hidden"
                );

            }

        }
    );


    /* ========================================================
       FORM SUBMISSION
       ======================================================== */

    eventForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const eventData = {

            title:
                document.getElementById(
                    "eventTitle"
                ).value.trim(),

            startDate:
                document.getElementById(
                    "eventStartDate"
                ).value,

            startTime:
                document.getElementById(
                    "eventStartTime"
                ).value,

            endDate:
                document.getElementById(
                    "eventEndDate"
                ).value,

            endTime:
                document.getElementById(
                    "eventEndTime"
                ).value,

            repeat:
                document.getElementById(
                    "eventRepeat"
                ).value,

            location:
                document.getElementById(
                    "eventLocation"
                ).value.trim(),

            description:
                document.getElementById(
                    "eventDescription"
                ).value.trim(),

            reminder:
                document.getElementById(
                    "eventReminder"
                ).value,

            color:
                document.getElementById(
                    "eventColor"
                ).value

        };


        try {

            await saveEvent(eventData);

            console.log(
                "Event saved:",
                eventData
            );


            eventModal.classList.add(
                "hidden"
            );


            eventForm.reset();


            await loadCalendarItems();


        } catch (error) {

            console.error(
                "Failed to save event:",
                error
            );

            alert(
                "Could not save the event."
            );

        }

    }
);


   /* ========================================================
   TASK FORM SUBMISSION
   ======================================================== */





    /* ========================================================
       SCROLL TO CURRENT TIME
       ======================================================== */

    function scrollToCurrentTime() {

        const now =
            new Date();

        const hour =
            now.getHours();


        const scrollPosition =
            Math.max(
                0,
                (hour - 1) * HOUR_HEIGHT
            );


        setTimeout(
            () => {

                calendarScroll.scrollTop =
                    scrollPosition;

            },
            100
        );

    }

});
/* ============================================================
   DETAILS MODAL
   ============================================================ */

let selectedCalendarItem = null;

const detailsModal =
    document.getElementById("detailsModal");

const detailsClose =
    document.getElementById("detailsClose");

const detailsTitle =
    document.getElementById("detailsTitle");

const detailsType =
    document.getElementById("detailsType");

const detailsDate =
    document.getElementById("detailsDate");

const detailsTime =
    document.getElementById("detailsTime");

const detailsDescription =
    document.getElementById("detailsDescription");

const detailsLocation =
    document.getElementById("detailsLocation");

const detailsDelete =
    document.getElementById("detailsDelete");

const detailsEdit =
    document.getElementById("detailsEdit");

    



/* ============================================================
   OPEN DETAILS
   ============================================================ */
/* ============================================================
   FORMAT DISPLAY TIME
   ============================================================ */

function formatDisplayTime(timeString) {

    if (!timeString) {
        return "";
    }

    const [hours, minutes] =
        timeString.split(":").map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}
function openDetailsModal(item) {

    selectedCalendarItem = item;


    detailsTitle.textContent =
        item.title || "(Untitled)";


    detailsType.textContent =
        item.type === "task"
            ? "TASK"
            : "EVENT";


    detailsDate.textContent =
        formatDetailsDate(
            item.startDate
        );


    detailsTime.textContent =
        `${formatDisplayTime(item.startTime)} – ${formatDisplayTime(item.endTime)}`;


    detailsDescription.textContent =
        item.description ||
        "No description";


    detailsLocation.textContent =
        item.location ||
        "No location";


    detailsModal.classList.remove(
        "hidden"
    );

}


/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatDetailsDate(dateString) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* ============================================================
   CLOSE DETAILS
   ============================================================ */

function closeDetailsModal() {

    detailsModal.classList.add(
        "hidden"
    );

    selectedCalendarItem = null;

}


detailsClose.addEventListener(
    "click",
    closeDetailsModal
);

// ============================================================
// DELETE CALENDAR ITEM
// ============================================================

detailsDelete.addEventListener(
    "click",
    async () => {

        if (!selectedCalendarItem) {
            return;
        }

        const item = selectedCalendarItem;

        const confirmed = confirm(
            `Delete "${item.title || "this item"}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            if (item.type === "event") {

                await db.events.delete(item.id);

            } else if (item.type === "task") {

                await db.tasks.delete(item.id);

            }

            closeDetailsModal();

            window.location.reload();

        } catch (error) {

            console.error(
                "Could not delete calendar item:",
                error
            );

            alert(
                "Something went wrong while deleting this item."
            );

        }

    }
);

detailsModal.addEventListener(
    "click",
    event => {

        if (
            event.target === detailsModal
        ) {

            closeDetailsModal();

        }

    }
);
/* ============================================================
   FORMAT DISPLAY TIME
   ============================================================ */

function formatDisplayTime(timeString) {

    if (!timeString) {
        return "";
    }

    const [hours, minutes] =
        timeString.split(":").map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}
