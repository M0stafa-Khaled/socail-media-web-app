import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { postValidation } from "@/validation";
import { Models } from "appwrite";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Loader from "../shared/Loader";

interface IProps {
  post?: Models.Document;
  action: "Create" | "Update";
}

const PostForm = ({ post, action }: IProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    user: { id },
  } = useUserContext();

  // ** Queries
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();

  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // ** Handlers
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post && post?.tags.join(","),
    },
  });

  const onSubmit = async (data: z.infer<typeof postValidation>) => {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...data,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });
      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
          className: "bg-dark-3 border-red text-red",
        });
      }
      // return navigate(`/posts/${post.$id}`);
      return navigate(`/`);
    }
    // ACTION = CREATE
    const newPost = await createPost({
      ...data,
      userId: id as string,
    });
    console.log(newPost);

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
        className: "bg-dark-3 border-red text-red",
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-3xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea shad-input custom-scrollbar"
                  placeholder="caption"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="location"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Games, Programming, Music"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-end items-center">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => {
              form.reset();
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`shad-button_primary whitespace-nowrap`}
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
