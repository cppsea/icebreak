-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "pronouns" "user_pronoun" NOT NULL DEFAULT 'They/Them/Their';
