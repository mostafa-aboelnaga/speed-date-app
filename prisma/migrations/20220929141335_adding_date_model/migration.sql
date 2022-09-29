-- CreateTable
CREATE TABLE "Date" (
    "id" TEXT NOT NULL,
    "sourceUserId" TEXT NOT NULL,
    "sinkUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ongoing',

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "SpeedDateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Date" ADD CONSTRAINT "Date_sinkUserId_fkey" FOREIGN KEY ("sinkUserId") REFERENCES "SpeedDateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
