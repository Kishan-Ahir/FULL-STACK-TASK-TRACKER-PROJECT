let button = document.getElementById("submit");
let ul_toDoremains = document.getElementById("toDoremains");
let ul_toDocompleted = document.getElementById("toDocompleted");

// Event listeners
button.addEventListener("click", savedata);
window.addEventListener("load", loaddata);
ul_toDoremains.addEventListener("click", removedata);
ul_toDoremains.addEventListener("click", editdata);
ul_toDocompleted.addEventListener("click", deletetask);

// Save data to server
async function savedata(event) {
    event.preventDefault();
    try {
        let taskName = document.getElementById("taskname").value;
        let taskDescription = document.getElementById("description").value;
        let data = {
            taskName,
            taskDescription
        };
        await axios.post("https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/todolist", data);

        showonscreen();
    } catch {
        alert("ERROR: Not able to store the data.");
    }
}

// Display data on screen
async function showonscreen() {
    try {
        ul_toDoremains.innerHTML = "";
        let data = await axios.get("https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/todolist");
        for (let i = 0; i < data.data.length; i++) {
            showdata(data.data[i]);
        }
    } catch {
        alert("ERROR: Not able to fetch the data from the server");
    }
}

// Display single data item on screen
async function showdata(data)
 {
    try {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.appendChild(
            document.createTextNode(`Task is ${data.taskName}. Description of the task is ${data.taskDescription}.`)
        );
        li.setAttribute("dataid", `${data._id}`);

        let delete_btn = document.createElement("button");
        delete_btn.className = "btn btn-danger float-end delete";
        delete_btn.style = "margin-left: 5px;";
        delete_btn.appendChild(document.createTextNode("X"));

        li.appendChild(delete_btn);

        let edit_btn = document.createElement("button");
        edit_btn.className = "btn btn-success float-end edit";
        edit_btn.style = "margin-left: 5px;";
        const checkmarkSymbol = '\u2713';
        edit_btn.appendChild(document.createTextNode(checkmarkSymbol));

        li.appendChild(edit_btn);
        ul_toDoremains.appendChild(li);
    } catch {
        alert("ERROR: Not able to show data on the screen.");
    }
}

// Load data from server on window load
async function loaddata() {
    let data = await axios.get("https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/todolist");

    for (let i = 0; i < data.data.length; i++) {
        showdata(data.data[i]);
    }
    showoncompletedcard();
}

// Edit data
async function editdata(event) {
    if (event.target.classList.contains("edit")) {
        try {
            let parent_li = event.target.parentNode;
            let taskname = parent_li.firstChild.textContent.split(" is ")[1].split(".")[0];
            let descriptionInfo = parent_li.firstChild.textContent.split(" is ")[2].split(".")[0];
            let taskid = event.target.parentNode.getAttribute("dataid");
            addintocompleted(taskname, descriptionInfo);
            await axios.delete(`https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/todolist/${taskid}`);
            ul_toDoremains.removeChild(parent_li);
        } catch {
            alert("ERROR: Not able to transfer the data.");
        }
    }
}

// Add completed task to the completed task list
async function addintocompleted(name, discrp) {
    let data = {
        name,
        discrp
    };

    await axios.post("https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/taskcompletedlist", data);

    showoncompletedcard();
}

// Display completed tasks on the completed task list
async function showoncompletedcard() {
    try {
        ul_toDocompleted.innerHTML = "";
        let completed_tasks = await axios.get("https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/taskcompletedlist");
        for (let i = 0; i < completed_tasks.data.length; i++) {
            completedtaskshown(completed_tasks.data[i]);
        }
    } catch {
        alert("ERROR: Not able to show competed task.");
    }
}

// Remove data from the to-do list
async function removedata(event) {
    if (event.target.classList.contains("delete")) {
        try {
            let parent_li = event.target.parentNode;
            let data_id = parent_li.getAttribute("dataid");
            await axios.delete(`https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/todolist/${data_id}`);
            ul_toDoremains.removeChild(parent_li);
        } catch {
            alert("ERROR: Not able to delete the task.");
        }
    }
}

// Delete a task from the completed task list
async function deletetask(event) {
    if (event.target.classList.contains("delete")) {
        try {
            let parent_li = event.target.parentNode;
            let dataid = event.target.parentNode.getAttribute("dataid");
            axios.delete(`https://crudcrud.com/api/55f82027e5d14f34a359e6cd09b523fc/taskcompletedlist/${dataid}`);
            ul_toDocompleted.removeChild(parent_li);
        } catch {
            alert("ERROR: Not able to delete the task from the completed task list.");
        }
    }
}

// Display completed task on the completed task list
function completedtaskshown(data) {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.appendChild(
        document.createTextNode(`Task is ${data.name}. Description of the task is ${data.discrp}.`)
    );
    li.setAttribute("dataid", `${data._id}`);
    let delete_btn = document.createElement("button");
    delete_btn.className = "btn btn-danger float-end delete";
    delete_btn.style = "margin-left: 5px;";
    delete_btn.appendChild(document.createTextNode("X"));

    li.appendChild(delete_btn);
    ul_toDocompleted.appendChild(li);
}
