import { getOfferJobs } from "../actions";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { FEELING_EMOJI } from "@/lib/types";
import type { JobApplication } from "@/lib/types";

export default async function OffersPage() {
  const jobs = await getOfferJobs();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Offers Received</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Review and compare your job offers
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-neutral-500">No offers yet. Keep applying!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <OfferCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferCard({ job }: { job: JobApplication }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl mb-1">{job.company}</h3>
          {job.role && <p className="text-sm text-neutral-600">{job.role}</p>}
        </div>
        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-blue-600 flex-shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>

      {job.salaryRange && (
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-neutral-600 mb-1">Salary Range</p>
          <p className="font-bold text-lg text-green-700">{job.salaryRange}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div>
          <p className="text-xs text-neutral-600 mb-1">Your Feeling</p>
          <span className="text-3xl">{FEELING_EMOJI[job.feeling]}</span>
        </div>

        {job.priority && (
          <div>
            <p className="text-xs text-neutral-600 mb-1">Priority</p>
            <span
              className={`
              text-xs px-3 py-1.5 rounded-md font-medium
              ${job.priority === "HIGH" ? "bg-red-100 text-red-700" : ""}
              ${job.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : ""}
              ${job.priority === "LOW" ? "bg-neutral-100 text-neutral-700" : ""}
            `}
            >
              {job.priority}
            </span>
          </div>
        )}
      </div>

      {job.appliedDate && (
        <p className="text-xs text-neutral-500 mb-2">
          Applied: {format(new Date(job.appliedDate), "MMM d, yyyy")}
        </p>
      )}

      {job.notes && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 line-clamp-3">{job.notes}</p>
        </div>
      )}
    </div>
  );
}
