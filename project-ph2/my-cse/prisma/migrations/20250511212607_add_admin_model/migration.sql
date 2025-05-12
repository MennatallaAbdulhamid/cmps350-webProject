/*
  Warnings:

  - You are about to drop the column `instructor` on the `Section` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Instructor" (
    "instructorId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Instructor_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Admin_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseCode" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "schedule" TEXT NOT NULL DEFAULT '',
    "deadline" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "instructorId" TEXT NOT NULL,
    CONSTRAINT "Section_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Section_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("instructorId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("capacity", "courseCode", "deadline", "id", "location", "schedule") SELECT "capacity", "courseCode", "deadline", "id", "location", "schedule" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_instructorId_key" ON "Instructor"("instructorId");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userEmail_key" ON "Instructor"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminId_key" ON "Admin"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userEmail_key" ON "Admin"("userEmail");
