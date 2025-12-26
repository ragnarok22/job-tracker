-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'WISHLIST',
    "appliedDate" DATETIME,
    "lastUpdate" DATETIME NOT NULL,
    "nextActionDate" DATETIME,
    "salaryRange" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "feeling" TEXT NOT NULL DEFAULT 'NEUTRAL',
    "link" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
