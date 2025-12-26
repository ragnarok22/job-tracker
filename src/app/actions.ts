"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Stage, Priority, Feeling } from "@/lib/types";

export async function createJob(formData: FormData) {
  const company = formData.get("company") as string;
  const role = formData.get("role") as string | null;

  if (!company || company.trim() === "") {
    throw new Error("Company is required");
  }

  await prisma.jobApplication.create({
    data: {
      company: company.trim(),
      role: role?.trim() || null,
    },
  });

  revalidatePath("/");
}

export async function updateJob(
  id: string,
  data: Partial<{
    company: string;
    role: string;
    stage: Stage;
    appliedDate: Date;
    nextActionDate: Date;
    salaryRange: string;
    priority: Priority;
    feeling: Feeling;
    link: string;
    notes: string;
  }>,
) {
  // Validate company if provided
  if (data.company !== undefined && data.company.trim() === "") {
    throw new Error("Company cannot be empty");
  }

  // Validate URL if provided
  if (data.link && data.link.trim() !== "") {
    try {
      new URL(data.link);
    } catch {
      throw new Error("Invalid URL format");
    }
  }

  await prisma.jobApplication.update({
    where: { id },
    data: {
      ...data,
      lastUpdate: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/follow-up");
  revalidatePath("/offers");
}

export async function moveJobStage(
  id: string,
  stage: Stage,
  newOrder?: number,
) {
  const updateData: any = {
    stage,
    lastUpdate: new Date(),
  };

  if (newOrder !== undefined) {
    updateData.order = newOrder;
  } else {
    // If no order specified, put at the end of the target column
    const maxOrder = await prisma.jobApplication.findFirst({
      where: { stage },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    updateData.order = (maxOrder?.order ?? -1) + 1;
  }

  await prisma.jobApplication.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath("/follow-up");
  revalidatePath("/offers");
}

export async function reorderJobs(
  updates: { id: string; order: number; stage: Stage }[],
) {
  await prisma.$transaction(
    updates.map((update) =>
      prisma.jobApplication.update({
        where: { id: update.id },
        data: { order: update.order, stage: update.stage },
      }),
    ),
  );

  revalidatePath("/");
}

export async function deleteJob(id: string) {
  await prisma.jobApplication.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/follow-up");
  revalidatePath("/offers");
}

export async function getAllJobs() {
  return await prisma.jobApplication.findMany({
    orderBy: [{ stage: "asc" }, { order: "asc" }],
  });
}

export async function getJobsByStage(stage: Stage) {
  return await prisma.jobApplication.findMany({
    where: { stage },
    orderBy: { lastUpdate: "desc" },
  });
}

export async function getFollowUpJobs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.jobApplication.findMany({
    where: {
      stage: {
        not: "REJECTED",
      },
      nextActionDate: {
        lte: today,
      },
    },
    orderBy: { nextActionDate: "asc" },
  });
}

export async function getOfferJobs() {
  return await prisma.jobApplication.findMany({
    where: { stage: "OFFER" },
    orderBy: { lastUpdate: "desc" },
  });
}
