import { z } from "zod";

export const signUpValidation = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(50, {
      message: "Username must be less than 50 characters",
    }),
  email: z.string().email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const signInValidation = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Must be a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});
export const postValidation = z.object({
  caption: z
    .string()
    .max(2200, { message: "Caption must be less than 2200 characters" }),
  file: z.custom<File[]>(),
  location: z.string().max(100, {
    message: "Location must be less than 100 characters",
  }),
  tags: z.string().optional(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 4 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
