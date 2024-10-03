
    document.addEventListener("DOMContentLoaded", () => {
        const addTaskButton = document.querySelector('.second-tick');
        const taskInput = document.querySelector('.text-input');
        const dateInput = document.querySelector('.date-input');
        const taskTableBody = document.querySelector('.fourth-table tbody');
        const noTaskRow = document.querySelector('.no-task');
        const errorMsg = document.querySelector('.msg');
        const deleteAllButton = document.querySelector(".third-delete");
        const filterTask = document.querySelector('.third-select');
        let allData = JSON.parse(localStorage.getItem('tasks')) || [];

        // Function to save tasks to localStorage
        const saveTasksToLocalStorage = () => {
            const tasks = allData.map(row => {
                return {
                    description: row.querySelector('td:nth-child(1)').textContent,
                    dueDate: row.querySelector('td:nth-child(2)').textContent,
                    status: row.querySelector('td:nth-child(3)').textContent
                };
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };

        // Function to create a task row element
        const createTaskRow = (taskDescription, taskDueDate, taskStatus = 'Pending') => {
            const taskRow = document.createElement('tr');

            const taskDescriptionCell = document.createElement('td');
            taskDescriptionCell.textContent = taskDescription;

            const taskDueDateCell = document.createElement('td');
            taskDueDateCell.textContent = taskDueDate;

            const taskStatusCell = document.createElement('td');
            taskStatusCell.textContent = taskStatus;

            const taskActionsCell = document.createElement('td');

            // Actions complete Button
            const completeButton = document.createElement('button');
            completeButton.classList.add("actionCompleteButton");
            completeButton.style.backgroundImage = "url('./icons/tick.png')";

            completeButton.addEventListener('click', () => {
                taskStatusCell.textContent = "Completed";
                saveTasksToLocalStorage();
                errorMsg.textContent = "Task completed Successfully"
                errorMsg.style.display = "flex";
                errorMsg.style.backgroundColor = "green";

                setTimeout(() => {
                    errorMsg.textContent = "";
                    errorMsg.style.display = "none";
                }, 3000);
            });

            // Actions Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add("actionDeleteButton");

            deleteButton.addEventListener('click', () => {
                taskRow.remove();
                allData = allData.filter(row => row !== taskRow);
                saveTasksToLocalStorage();
                if (taskTableBody.children.length === 0) {
                    taskTableBody.appendChild(noTaskRow);
                }

                errorMsg.textContent = "Task Deleted Successfully"
                errorMsg.style.display = "flex";
                errorMsg.style.backgroundColor = "green";

                setTimeout(() => {
                    errorMsg.textContent = "";
                    errorMsg.style.display = "none";
                }, 3000);
            });

            taskActionsCell.appendChild(completeButton);
            taskActionsCell.appendChild(deleteButton);

            taskRow.appendChild(taskDescriptionCell);
            taskRow.appendChild(taskDueDateCell);
            taskRow.appendChild(taskStatusCell);
            taskRow.appendChild(taskActionsCell);


            
            return taskRow;
        };

        // Load tasks from localStorage
        allData.forEach(taskData => {
            const taskRow = createTaskRow(taskData.description, taskData.dueDate, taskData.status);
            taskTableBody.appendChild(taskRow);
        });

        if (allData.length > 0) {
            noTaskRow.remove();
        }

        addTaskButton.addEventListener('click', () => {
            const taskDescription = taskInput.value.trim();
            const taskDueDate = dateInput.value;

            if (taskDescription === "" || taskDueDate === "") {
                errorMsg.textContent = "Please enter both task description and due date."
                errorMsg.style.display = "flex";
                errorMsg.style.backgroundColor = "red"

                setTimeout(() => {
                    errorMsg.textContent = "";
                    errorMsg.style.display = "none";
                }, 3000);

                return;
            }

            const taskRow = createTaskRow(taskDescription, taskDueDate);

            if (noTaskRow) {
                noTaskRow.remove();
            }

            taskTableBody.appendChild(taskRow);
            allData.push(taskRow);
            saveTasksToLocalStorage();

            taskInput.value = "";
            dateInput.value = "";
        });

        // delete all button event listener
        deleteAllButton.addEventListener("click", () => {
            errorMsg.textContent = "All Tasks Deleted Successfully"
            errorMsg.style.display = "flex";
            errorMsg.style.backgroundColor = "green";

            setTimeout(() => {
                errorMsg.textContent = "";
                errorMsg.style.display = "none";
            }, 3000);

            taskTableBody.innerHTML = '';
            taskTableBody.appendChild(noTaskRow);
            allData = [];
            localStorage.removeItem('tasks');
        });

        // filter task event listener
        filterTask.addEventListener("change", () => {
            const filterValue = filterTask.value;
            taskTableBody.innerHTML = '';

            let filteredTasks = allData;
            if (filterValue === 'Pending') {
                filteredTasks = allData.filter(taskRow => taskRow.querySelector('td:nth-child(3)').textContent === 'Pending');
            } else if (filterValue === 'Completed') {
                filteredTasks = allData.filter(taskRow => taskRow.querySelector('td:nth-child(3)').textContent === 'Completed');
            }

            filteredTasks.forEach(taskRow => taskTableBody.appendChild(taskRow));

            if (taskTableBody.children.length === 0) {
                taskTableBody.appendChild(noTaskRow);
            }
        });
    });
