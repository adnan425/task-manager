import { Task } from "@/generated/prisma";
import { clsx, type ClassValue } from "clsx";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleIcon,
  Timer
} from "lucide-react";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusIcon(status: Task["status"]) {
  const statusIcons = {
    completed: CheckCircle2,
    "pending": Timer,
  };

  return statusIcons[status] || CircleIcon;
}

export function getPriorityIcon(priority: Task["priority"]) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}