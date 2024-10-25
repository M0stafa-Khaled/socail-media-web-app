import { useUserContext } from "@/context/AuthContext";
import { formatDateAndTime } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStatus from "./PostStats";

interface IProps {
  post: Models.Document;
}

const PostCard = ({ post }: IProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  console.log(post.tags);

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold">{post.creator.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateAndTime(post.$createdAt)}
              </p>

              {post.location && (
                <>
                  -
                  <p className="subtle-semibold lg:small-regular">
                    {post.location}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <div className="small-medium lg:base-medium py-5">
        <p>{post.caption}</p>
        <ul className="flex gap-1 mt-2">
          {post.tags.length >= 1
            ? post.tags.map((tag: string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))
            : null}
        </ul>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post"
          className="post-card_img"
        />
      </Link>
      <PostStatus post={post} userId={user.id ?? ""} />
    </div>
  );
};

export default PostCard;
