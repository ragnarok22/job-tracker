"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { JobCard } from "./JobCard";
import { Column } from "./Column";
import { QuickAddModal } from "./QuickAddModal";
import { moveJobStage, reorderJobs } from "@/app/actions";
import type { JobApplication, Stage } from "@/lib/types";
import { STAGES, STAGE_LABELS } from "@/lib/types";
import { Plus } from "lucide-react";

interface BoardProps {
  initialJobs: JobApplication[];
}

export function Board({ initialJobs }: BoardProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with server updates (e.g., when new jobs are added)
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const jobsByStage: Record<Stage, JobApplication[]> = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = jobs
        .filter((job) => job.stage === stage)
        .sort((a, b) => a.order - b.order);
      return acc;
    },
    {} as Record<Stage, JobApplication[]>,
  );

  const activeJob = activeId ? jobs.find((job) => job.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeJobId = active.id as string;
    const activeJob = jobs.find((job) => job.id === activeJobId);

    if (!activeJob) {
      setActiveId(null);
      return;
    }

    // Determine if we're dropping on a column or another job
    const overId = over.id as string;
    const isDroppedOnColumn = STAGES.includes(overId as Stage);

    let targetStage: Stage;
    let overJob: JobApplication | undefined;

    if (isDroppedOnColumn) {
      targetStage = overId as Stage;
    } else {
      overJob = jobs.find((job) => job.id === overId);
      if (!overJob) {
        setActiveId(null);
        return;
      }
      targetStage = overJob.stage;
    }

    const sourceStage = activeJob.stage;
    const isSameColumn = sourceStage === targetStage;

    if (isSameColumn && !overJob) {
      // Dropped on the same column container, no change
      setActiveId(null);
      return;
    }

    // Get jobs in target column
    const targetJobs = jobs.filter((job) => job.stage === targetStage);

    // Calculate new order
    let newOrder: number;
    let newJobs: JobApplication[];

    if (isSameColumn && overJob) {
      // Reordering within the same column
      const oldIndex = targetJobs.findIndex((job) => job.id === activeJobId);
      const newIndex = targetJobs.findIndex((job) => job.id === overJob.id);

      const reorderedJobs = arrayMove(targetJobs, oldIndex, newIndex);

      // Update all jobs in this column with new order
      const updates = reorderedJobs.map((job, index) => ({
        id: job.id,
        order: index,
        stage: targetStage,
      }));

      // Optimistic update
      newJobs = jobs.map((job) => {
        const update = updates.find((u) => u.id === job.id);
        return update ? { ...job, order: update.order } : job;
      });

      setJobs(newJobs);

      // Server update
      await reorderJobs(updates);
    } else {
      // Moving to a different column
      if (overJob) {
        // Insert at specific position
        const overIndex = targetJobs.findIndex((job) => job.id === overJob.id);
        newOrder = overIndex;

        // Update orders for jobs in target column
        const updates = targetJobs
          .filter((job) => job.id !== activeJobId)
          .map((job, index) => {
            const adjustedIndex = index >= overIndex ? index + 1 : index;
            return {
              id: job.id,
              order: adjustedIndex,
              stage: targetStage,
            };
          });

        updates.push({
          id: activeJobId,
          order: newOrder,
          stage: targetStage,
        });

        // Optimistic update
        newJobs = jobs.map((job) => {
          if (job.id === activeJobId) {
            return { ...job, stage: targetStage, order: newOrder };
          }
          const update = updates.find((u) => u.id === job.id);
          return update ? { ...job, order: update.order } : job;
        });

        setJobs(newJobs);

        // Server update
        await reorderJobs(updates);
      } else {
        // Dropped on column container, add to end
        newOrder = targetJobs.length;

        // Optimistic update
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === activeJobId
              ? { ...job, stage: targetStage, order: newOrder }
              : job,
          ),
        );

        // Server update
        await moveJobStage(activeJobId, targetStage, newOrder);
      }
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
          collisionDetection={closestCenter}
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
