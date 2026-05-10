-- CreateTable
CREATE TABLE "challenge_schemas" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "ddlScript" TEXT NOT NULL,
    "seedScript" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "challenge_schemas_challengeId_key" ON "challenge_schemas"("challengeId");
