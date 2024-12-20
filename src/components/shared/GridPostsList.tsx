import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

interface IProps {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostsList = ({
  posts,
  showUser = true,
  showStats = true,
}: IProps) => {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts.length > 0 &&
        posts.map((post) => {
          if (!post.$id) return;
          return (
            <li
              key={post.$id || Math.random().toString()}
              className="relative min-w-80 h-80"
            >
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="grid-post_user">
                {showUser && (
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img
                      src={
                        post?.creator?.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post?.creator?.name}</p>
                  </div>
                )}
                {showStats && <PostStats post={post} userId={user?.id ?? ""} />}
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default GridPostsList;
