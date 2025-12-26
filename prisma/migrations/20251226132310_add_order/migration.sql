-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'WISHLIST',
    "order" INTEGER NOT NULL DEFAULT 0,
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
INSERT INTO "new_JobApplication" ("appliedDate", "company", "createdAt", "feeling", "id", "lastUpdate", "link", "nextActionDate", "notes", "priority", "role", "salaryRange", "stage", "updatedAt") SELECT "appliedDate", "company", "createdAt", "feeling", "id", "lastUpdate", "link", "nextActionDate", "notes", "priority", "role", "salaryRange", "stage", "updatedAt" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
