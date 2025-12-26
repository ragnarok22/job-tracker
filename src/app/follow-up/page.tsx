import { getFollowUpJobs } from "../actions";
import { format } from "date-fns";
import { AlertCircle, ExternalLink } from "lucide-react";
import { FEELING_EMOJI, STAGE_LABELS } from "@/lib/types";
import type { JobApplication } from "@/lib/types";

export default async function FollowUpPage() {
  const jobs = await getFollowUpJobs();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Follow-up Needed</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Jobs that need action today or are overdue
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-neutral-500">
            No jobs need follow-up at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobRow({ job }: { job: JobApplication }) {
  const isOverdue =
    job.nextActionDate && new Date(job.nextActionDate) < new Date();

  return (
    <div
      className={`
      bg-white border rounded-lg p-4
      ${isOverdue ? "border-l-4 border-l-red-500" : "border-neutral-200"}
    `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{job.company}</h3>
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {job.role && (
            <p className="text-sm text-neutral-600 mb-2">{job.role}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
              {STAGE_LABELS[job.stage]}
            </span>

            {job.priority && (
              <span
                className={`
                text-xs px-2 py-1 rounded-md font-medium
                ${job.priority === "HIGH" ? "bg-red-100 text-red-700" : ""}
                ${job.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : ""}
                ${job.priority === "LOW" ? "bg-neutral-100 text-neutral-700" : ""}
              `}
              >
                {job.priority}
              </span>
            )}

            <span className="text-lg">{FEELING_EMOJI[job.feeling]}</span>

            {job.nextActionDate && (
              <div
                className={`
                text-xs flex items-center gap-1 font-medium
                ${isOverdue ? "text-red-600" : "text-neutral-600"}
              `}
              >
                {isOverdue && <AlertCircle className="w-4 h-4" />}
                Next action:{" "}
                {format(new Date(job.nextActionDate), "MMM d, yyyy")}
              </div>
            )}
          </div>

          {job.notes && (
            <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
              {job.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
