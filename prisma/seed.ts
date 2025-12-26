import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.jobApplication.deleteMany();

  // Create sample job applications
  await prisma.jobApplication.createMany({
    data: [
      {
        company: "Vercel",
        role: "Senior Frontend Engineer",
        stage: "INTERVIEW",
        appliedDate: new Date("2025-01-15"),
        nextActionDate: new Date("2025-12-27"),
        salaryRange: "$140k - $180k",
        priority: "HIGH",
        feeling: "UP",
        link: "https://vercel.com/careers",
        notes: "Great team culture. Second round interview scheduled.",
      },
      {
        company: "Stripe",
        role: "Full Stack Engineer",
        stage: "APPLIED",
        appliedDate: new Date("2025-01-20"),
        nextActionDate: new Date("2025-12-28"),
        salaryRange: "$150k - $200k",
        priority: "HIGH",
        feeling: "NEUTRAL",
        link: "https://stripe.com/jobs",
        notes: "Waiting for recruiter response.",
      },
      {
        company: "Shopify",
        role: "React Developer",
        stage: "OFFER",
        appliedDate: new Date("2025-01-10"),
        salaryRange: "$130k - $160k",
        priority: "MEDIUM",
        feeling: "UP",
        link: "https://www.shopify.com/careers",
        notes: "Offer received! Need to respond by end of month.",
      },
      {
        company: "Figma",
        role: "Product Engineer",
        stage: "WISHLIST",
        priority: "HIGH",
        feeling: "UP",
        link: "https://www.figma.com/careers",
        notes: "Amazing product. Need to polish portfolio before applying.",
      },
      {
        company: "Notion",
        role: "Software Engineer",
        stage: "REJECTED",
        appliedDate: new Date("2025-01-05"),
        priority: "MEDIUM",
        feeling: "DOWN",
        notes: "Didn't pass technical assessment.",
      },
      {
        company: "Linear",
        role: "Frontend Engineer",
        stage: "WISHLIST",
        priority: "MEDIUM",
        feeling: "UP",
        link: "https://linear.app/careers",
        notes: "Small team, great product.",
      },
      {
        company: "Anthropic",
        role: "Full Stack Engineer",
        stage: "APPLIED",
        appliedDate: new Date("2025-01-22"),
        nextActionDate: new Date("2025-12-30"),
        salaryRange: "$160k - $210k",
        priority: "HIGH",
        feeling: "UP",
        link: "https://www.anthropic.com/careers",
        notes: "AI company. Very excited about this one!",
      },
      {
        company: "GitHub",
        role: "Senior Developer",
        stage: "INTERVIEW",
        appliedDate: new Date("2025-01-18"),
        nextActionDate: new Date("2025-12-26"),
        salaryRange: "$145k - $175k",
        priority: "MEDIUM",
        feeling: "NEUTRAL",
        link: "https://github.com/about/careers",
        notes: "Technical interview today.",
      },
    ],
  });

  const count = await prisma.jobApplication.count();
  console.log(`✅ Seeded ${count} job applications`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
