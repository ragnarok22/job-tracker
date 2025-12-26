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

export async function moveJobStage(id: string, stage: Stage) {
  await prisma.jobApplication.update({
    where: { id },
    data: {
      stage,
      lastUpdate: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/follow-up");
  revalidatePath("/offers");
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
    orderBy: { lastUpdate: "desc" },
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
