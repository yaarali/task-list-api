import express, { Express, Request, Response } from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import Task from "./models/task";
import AppConfigs from "./app-config";
import { randomUUID } from "crypto";

/**
 * Main Task list server
 * 
 * ali.qamar SEP 2024
 * 
 */

const app: Express = express();
app.use(bodyParser.json());

// Use an in-memory store on the server. Setup initial data
let taskList: Task[] = [
  {id:randomUUID(), title: "Homework", description: "Complete today's homework"},
  {id:randomUUID(), title: "Grocery", description: "Order grocery for pickup"},
  {id:randomUUID(), title: "Garden", description: "Take care of yard"}
];

/**
 * Setup CORS to allow task-list-ui react app to interact
 */
const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options));

/**
 * GET /tasks
 * Retrieve a list of all tasks
 */
app.route(AppConfigs.ROUTES.TASK_BASE).get((req, res) => {
  // SUCCESS
  res.send({
    success: true,
    response: taskList,
  });
});

/**
 * GET /tasks/:id
 * Retrieve a specific task by its ID
 */
app.route(AppConfigs.ROUTES.TASK_ID_URL).get((req: Request, res: Response) => {
  const taskId = req.params['id'];
  console.log("task id to retrieve::" + taskId);
  let found = taskList.find((task: Task) => task.id === taskId);

  // If the task is not found, return an ERROR
  if (found === null || found === undefined) {
    // ERROR: Task not found
    res.status(404).send({
      success: false,
      errorMessage: AppConfigs.MESSAGES.ERROR_TASK_NOT_FOUND
    });
  }

  // Success: Task found, return it back
  res.send({ 
    success: true,
    response: found 
  });
})

/**
 * POST /tasks
 * Create a new task
 */
app.route(AppConfigs.ROUTES.TASK_BASE).post((req: Request, res: Response) => {
  console.log(req.body);
  const { title, description } = req.body;

  // Check for required fields
  if (!title ) {
    // ERROR: Validation failed
    res.status(400).json({
      success: false,
      errorMessage: AppConfigs.MESSAGES.ERROR_TITLE_MISSING
    });
  }

  var newId = randomUUID();
  const newTask: Task = { id: newId, title, description };

  // Add the new user to the "in-memory list"
  taskList.push(newTask);

  // Respond back the newly created task
  res.status(201).json({
    success: true,
    response: newTask
  });
})

/**
 * DELETE /tasks/:id
 * Delete a task by its id
 */
app.route(AppConfigs.ROUTES.TASK_ID_URL).delete((req, res) => {
  const taskId = req.params.id;
  console.log("task id to delete::" + taskId);

  // Remove task from the "in-memory list"
  taskList = taskList.filter((task: Task) => {
      if (task.id !== taskId) {
          return true;
      }
      return false;
  });

  // SUCCESS: Task Deleted
  res.send({
    success: true
  });
});

/**
 * PUT /tasks/:id
 * Update an existing task’s title and description
 */
app.route(AppConfigs.ROUTES.TASK_ID_URL).put((req, res) => {
  const taskId: any = req.params['id'];
  const { title, description } = req.body;

  // Check for mandatory fields
  if (!title ) {
    // ERROR: Validation failed
    res.status(400).json({
      success: false,
      errorMessage: AppConfigs.MESSAGES.ERROR_TITLE_MISSING
    });
  }
  const updatedTask: Task = { id: taskId, title, description };

  // Update the task in the existing list
  for (let i = 0; i < taskList.length; i++) {
      let task = taskList[i];
      if (task.id === taskId) {
        taskList[i] = updatedTask;
        break;
      }
  }

  // SUCCESS: Task Updated
  res.send({
    success: true
  });
});

/**
 * Start the server
 */
app.listen(AppConfigs.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${AppConfigs.PORT}`);
});

/**
 * Catch-all route to handle 501 errors (routes not found)
 */
app.use((req: Request, res: Response) => {
  res.status(501).json({ error: AppConfigs.MESSAGES.ERROR_NOT_SUPPORTED });
});