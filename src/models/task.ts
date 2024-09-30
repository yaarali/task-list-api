/**
 * Model class for a Task
 * Required:
 *  id, title
 * 
 * Optional:
 *  description
 * 
 * ali.qamar SEP 2024
 * 
 */

import { UUID } from "crypto";

export default interface Task {
    id: UUID;
    title: string;
    description?: string;
  }