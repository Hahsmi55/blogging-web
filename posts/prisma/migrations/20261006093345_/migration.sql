-- DropForeignKey
ALTER TABLE "PostsTags" DROP CONSTRAINT "PostsTags_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostsTags" DROP CONSTRAINT "PostsTags_tagsId_fkey";

-- AddForeignKey
ALTER TABLE "PostsTags" ADD CONSTRAINT "PostsTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsTags" ADD CONSTRAINT "PostsTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
