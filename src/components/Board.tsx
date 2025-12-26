"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { JobCard } from "./JobCard";
import { Column } from "./Column";
import { QuickAddModal } from "./QuickAddModal";
import { moveJobStage } from "@/app/actions";
import type { JobApplication, Stage } from "@/lib/types";
import { STAGES, STAGE_LABELS } from "@/lib/types";
import { Plus } from "lucide-react";

interface BoardProps {
  initialJobs: JobApplication[];
}

export function Board({ initialJobs }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const jobsByStage: Record<Stage, JobApplication[]> = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = initialJobs.filter((job) => job.stage === stage);
      return acc;
    },
    {} as Record<Stage, JobApplication[]>,
  );

  const activeJob = activeId
    ? initialJobs.find((job) => job.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const jobId = active.id as string;
    const targetStage = over.id as Stage;

    if (targetStage && STAGES.includes(targetStage)) {
      await moveJobStage(jobId, targetStage);
    }

    setActiveId(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Job Board</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAGES.map((stage) => (
              <Column
                key={stage}
                id={stage}
                title={STAGE_LABELS[stage]}
                jobs={jobsByStage[stage]}
                count={jobsByStage[stage].length}
              />
            ))}
          </div>

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
