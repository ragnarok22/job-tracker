import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableJobCard } from "./SortableJobCard";
import type { JobApplication } from "@/lib/types";

interface ColumnProps {
  id: string;
  title: string;
  jobs: JobApplication[];
  count: number;
}

export function Column({ id, title, jobs, count }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col h-full min-h-[500px] bg-neutral-100 rounded-lg p-4
        transition-colors
        ${isOver ? "bg-blue-50 ring-2 ring-blue-400" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-neutral-600">
          {title}
        </h3>
        <span className="text-xs bg-neutral-200 px-2 py-1 rounded-full font-medium">
          {count}
        </span>
      </div>

      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 flex-1">
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
