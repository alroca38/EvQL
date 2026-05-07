-- AddForeignKey
ALTER TABLE "challenge_schemas" ADD CONSTRAINT "challenge_schemas_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
