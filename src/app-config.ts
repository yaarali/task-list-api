/**
 * Global place to store all Application level variables
 * 
 * ali.qamar SEP 2024
 * 
 */

export default class AppConfigs {
    public static PORT = 3001;
    public static MESSAGES = {
        ERROR_TASK_NOT_FOUND: "Task not found",
        ERROR_NOT_SUPPORTED: "This function is not supported",
        ERROR_TITLE_MISSING: "Required field Title is missing"
    };
    public static ROUTES = {
        TASK_BASE: "/tasks",
        TASK_ID_URL: "/tasks/:id"
    }
}