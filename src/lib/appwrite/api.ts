/* eslint-disable @typescript-eslint/no-unused-vars */
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/interfaces";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Models, Query } from "appwrite";

// ** ========== Create Account ========== **
export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    return { error };
  }
};

// ** ========== Save Account In DB ========== **
export const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL | string;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    return { error };
  }
};

// ** ========== SignIn Account ========== **

export const SignInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = (await account.createEmailPasswordSession(
      user.email,
      user.password
    )) as Models.Session;
    return session;
  } catch (error) {
    return error;
  }
};

// ** ========== Get Current User ========== **
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("No user found for the current account");
    }
    return currentUser.documents[0];
  } catch (error) {
    return { error };
  }
};

// ** ========== LogOut Account ========== **
export const logOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    return { error };
  }
};

// ** ========== Get User By Id ========== **
export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw new Error();

    return user;
  } catch (error) {
    throw new Error();
  }
};

// ** ========== Update User ============= **
export const updateUser = async (user: IUpdateUser) => {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw new Error();

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error();
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw new Error();
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    throw new Error();
  }
};

// ** ========== Get Users =============== **
export const getUsers = async (limit?: number) => {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw new Error();

    return users;
  } catch (error) {
    throw new Error();
  }
};

// ** ========== Create Post ========== **
export const createPost = async (post: INewPost) => {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw new Error();

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error();
    }
    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error();
    }

    return newPost;
  } catch (error) {
    throw Error;
  }
};

// ** ========== Upload File ========== **
export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    throw new Error();
  }
};

// ** ========== Get File Preview ========== **
export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId);
    if (!fileUrl) throw new Error();

    return fileUrl;
  } catch (error) {
    throw new Error();
  }
};

// ** ========== Delete File ========== **
export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: 200 };
  } catch (error) {
    return { error };
  }
};

// ** ========== Get Recent Posts ========== **
export const getRecentPosts = async () => {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw new Error("Posts not found");
  return posts;
};

// ** ========== Like Post ========== **
export const likePost = async (postId: string, likesArr: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      { likes: likesArr }
    );
    if (!updatedPost) throw new Error("Post not found");

    return { updatedPost };
  } catch (error) {
    return { error };
  }
};

// ** ========== Save Post ========== **
export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw new Error("Post not found");

    return { updatedPost };
  } catch (error) {
    return { error };
  }
};

// ** ========== Delete Saved Post ========== **
export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw new Error("Post not found");

    return { status: 200 };
  } catch (error) {
    return { error };
  }
};

// ** ========== Get Post =================== **
export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    return error;
  }
};

// ** ========== Update Post ========== **
export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error();

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error();
      }
      const url = new URL(fileUrl);
      image = { ...image, imageUrl: url, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw new Error();
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    throw new Error();
  }
};
// ** ========== Delete Post ========== **
export const deletePost = async (postId?: string, imageId?: string) => {
  if (!postId || !imageId) throw new Error();
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    await deleteFile(imageId);

    return { status: 200 };
  } catch (error) {
    return { error };
  }
};

// ** ========== Get Infinite Posts ========== **
export const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) {
      throw new Error("Failed to fetch posts");
    }
    return posts;
  } catch (error) {
    throw new Error();
  }
};
// ** ========== Search Posts ========== **
export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw new Error();
    return posts;
  } catch (error) {
    throw new Error();
  }
};
