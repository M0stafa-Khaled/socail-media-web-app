import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  const liked = currentUser && "liked" in currentUser && currentUser.liked;
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {liked.length === 0 && <p className="text-light-4">No liked posts</p>}

      <GridPostsList posts={liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
