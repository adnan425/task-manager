"use client";

import { Loader, Trash } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTasks } from "@/hooks/useTasks";

interface SimpleDeleteModalProps {
  taskId: string;
  refetch: () => void;
}

export function TaskDelete({ taskId, refetch }: SimpleDeleteModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { deleteTask, loading } = useTasks();

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      refetch();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Trash className="mr-2 h-4 w-4 text-red-500 hover:text-red-600" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <div className="flex items-center justify-center space-x-2">
              {loading && (
                <Loader
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {!loading ? "Confirm Deletion" : <span>Deleting...</span>}
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
