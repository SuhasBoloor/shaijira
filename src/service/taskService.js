const taskRepository = require('../repository/taskRepository')
const projectRepository = require('../repository/projectRepository')

async function createTask(title, projectId, description, assigneeId, status = "todo"){
    const project = await projectRepository.findProjectById(projectId)
    if(!project) throw new Error("Project id not found")

    if(!["todo", "in_progress", "done"].includes(status.toLowerCase())) throw new Error("Wrong status")

    const task = await taskRepository.createTask(title, projectId, description, assigneeId, status)
    return task
}

async function updateTask(id, fields){
    const task = await taskRepository.findTaskById(id)
    if(!task) throw new Error("task does not exist")

    const update = await taskRepository.updateTask(id, fields)
    return update
}

async function deleteTask(id){
    const task = await taskRepository.findTaskById(id)
    if(!task) throw new Error("task does not exist")

    const remove = await taskRepository.deleteTask(id)
    return remove
}

async function getTaskById(id){
    const task = await taskRepository.findTaskById(id)
    if(!task) throw new Error("No task found for the id")

    return task
}

async function getTaskByProject(projectId){
    const task = await taskRepository.findTasksByProject(projectId)

    return task
}

async function getTasksByAssignee(assigneeId){
    const task = await taskRepository.findTasksByAssignee(assigneeId)
    
    return task
}

module.exports = {createTask, updateTask, deleteTask, getTaskById, getTaskByProject, getTasksByAssignee}