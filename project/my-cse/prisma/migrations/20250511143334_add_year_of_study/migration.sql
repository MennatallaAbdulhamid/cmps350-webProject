/*
  Warnings:

  - Added the required column `userEmail` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearOfStudy` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "studentId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,
    CONSTRAINT "Student_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("email", "name", "password", "studentId") SELECT "email", "name", "password", "studentId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_userEmail_key" ON "Student"("userEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
