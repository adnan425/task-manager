"use client";
import TableList from "@/components/tasks/TableList";

export default function TaskTable() {
  return (
    <div className="flex justify-center min-h-screen flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-6xl px-4 overflow-x-auto ">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center">
          Your Tasks
        </h1>
        <p className="leading-7 mt-4 text-muted-foreground text-center max-w-2xl mx-auto px-4">
          View, filter, and manage your personal tasks. Sort by priority or status, and keep track of what matters most.
        </p>
        <TableList />
      </div>
    </div>

  );
}
