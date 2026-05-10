-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "tags" TEXT[],
    "databaseEngine" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);
