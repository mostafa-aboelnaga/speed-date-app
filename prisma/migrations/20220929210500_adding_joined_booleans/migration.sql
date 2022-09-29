-- AlterTable
ALTER TABLE "Date" ADD COLUMN     "sinkUserJoined" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceUserJoined" BOOLEAN NOT NULL DEFAULT false;
