import React, { Dispatch, SetStateAction } from "react";

export interface ISignUpInputs {
  name: "name" | "username" | "email" | "password";
  label: string;
  type: "email" | "text" | "password";
}
export interface ISignInInputs {
  name: "email" | "password";
  label: string;
  type: "email" | "text" | "password";
}

export interface INewUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface IUser {
  id: string | undefined;
  name: string;
  username: string;
  email: string;
  imageUrl?: string;
  bio: string;
}

export interface IContextUser {
  user: IUser;
  isLoading: boolean;
  setUser: Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export interface ISidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface IBottomBarLinks {
  imgURL?: string;
  route: string;
  label: string;
}

export interface INewPost {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
}

export interface IUpdatePost {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
}

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};
