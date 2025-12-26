import { format } from "date-fns";
import { AlertCircle, ExternalLink } from "lucide-react";
import type { JobApplication } from "@/lib/types";
import { FEELING_EMOJI } from "@/lib/types";
import Link from "next/link";

interface JobCardProps {
  job: JobApplication;
  isDragging?: boolean;
}

export function JobCard({ job, isDragging }: JobCardProps) {
  const isOverdue =
    job.nextActionDate && new Date(job.nextActionDate) < new Date();
  const hasNoNextAction =
    job.stage !== "REJECTED" && job.stage !== "OFFER" && !job.nextActionDate;

  return (
    <div
      className={`
        bg-white border border-neutral-200 rounded-lg p-4
        hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-50" : ""}
        ${hasNoNextAction ? "border-l-4 border-l-amber-500" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{job.company}</h3>
          {job.role && (
            <p className="text-xs text-neutral-600 truncate">{job.role}</p>
          )}
        </div>
        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-blue-600 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        {job.priority && (
          <span
            className={`
            px-2 py-0.5 rounded-full font-medium
            ${job.priority === "HIGH" ? "bg-red-100 text-red-700" : ""}
            ${job.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : ""}
            ${job.priority === "LOW" ? "bg-neutral-100 text-neutral-700" : ""}
          `}
          >
            {job.priority}
          </span>
        )}
        <span className="text-lg">{FEELING_EMOJI[job.feeling]}</span>
      </div>

      {job.nextActionDate && (
        <div
          className={`mt-2 text-xs flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : "text-neutral-600"}`}
        >
          {isOverdue && <AlertCircle className="w-3 h-3" />}
          Next: {format(new Date(job.nextActionDate), "MMM d")}
        </div>
      )}

      {hasNoNextAction && (
        <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          No next action date
        </div>
      )}
    </div>
  );
}
