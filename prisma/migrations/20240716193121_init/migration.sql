/*
  Warnings:

  - Added the required column `isComplete` to the `ToDo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToDo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "important" BOOLEAN NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ToDo" ("id", "important", "title", "weight") SELECT "id", "important", "title", "weight" FROM "ToDo";
DROP TABLE "ToDo";
ALTER TABLE "new_ToDo" RENAME TO "ToDo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
