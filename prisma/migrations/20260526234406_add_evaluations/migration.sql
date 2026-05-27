-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxAttempts" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChallengeModelToEvaluationModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeModelToEvaluationModel_AB_unique" ON "_ChallengeModelToEvaluationModel"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeModelToEvaluationModel_B_index" ON "_ChallengeModelToEvaluationModel"("B");

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeModelToEvaluationModel" ADD CONSTRAINT "_ChallengeModelToEvaluationModel_A_fkey" FOREIGN KEY ("A") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeModelToEvaluationModel" ADD CONSTRAINT "_ChallengeModelToEvaluationModel_B_fkey" FOREIGN KEY ("B") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
