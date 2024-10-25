import { useToast } from "@/hooks/use-toast";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { MouseEvent, useEffect, useState } from "react";
import Loader from "./Loader";

interface IProps {
  post: Models.Document;
  userId: string;
}

const PostStatus = ({ post, userId }: IProps) => {
  const { toast } = useToast();

  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const {
    mutate: savePost,
    isPending: isSavingPost,
    isSuccess: isSavedSuccessfully,
  } = useSavePost();
  const {
    mutate: deleteSavedPost,
    isPending: isDeletingSaved,
    isSuccess: isDeletingSuccessfully,
  } = useDeleteSavedPost();

  // Get current user from server
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = (currentUser as Models.Document)?.save.find(
    (record: Models.Document) => {
      return record.$id === post.$id;
    }
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = (e: MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) newLikes = newLikes.filter((id) => id !== userId);
    else newLikes.push(userId);

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArr: newLikes });
  };

  const handleSavePost = (e: MouseEvent) => {
    e.stopPropagation();
    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
      if (isDeletingSuccessfully)
        toast({
          title: "Post unsaved successfully",
          duration: 3000,
          variant: "destructive",
          className: "bg-dark-3 border-green-800 text-green-700",
        });
    } else {
      savePost({ postId: post.$id, userId: userId });
      setIsSaved(true);
      if (isSavedSuccessfully)
        toast({
          title: "Post saved successfully",
          duration: 3000,
          variant: "destructive",
          className: "bg-dark-3 border-green-800 text-green-700",
        });
    }
  };

  return (
    <div className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleLikePost}
        />

        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader height={20} width={20} />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStatus;
