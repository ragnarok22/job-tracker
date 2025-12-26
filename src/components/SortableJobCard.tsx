import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JobCard } from "./JobCard";
import type { JobApplication } from "@/lib/types";

interface SortableJobCardProps {
  job: JobApplication;
}

export function SortableJobCard({ job }: SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard job={job} isDragging={isDragging} />
    </div>
  );
}
