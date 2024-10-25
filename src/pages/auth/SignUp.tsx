import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpValidation } from "@/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { signUpInputs } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
const SinUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // ** check user **
  const { checkAuthUser } = useUserContext();

  // ** create user **
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  // ** sign in **
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (user: z.infer<typeof signUpValidation>) => {
    const newUser = await createUserAccount(user);
    if (!newUser)
      return toast({
        title: "Email or username has been taken",
        duration: 3000,
        variant: "destructive",
        className: "bg-dark-3 border-red text-red",
      });

    const session = await signInAccount({
      email: user.email,
      password: user.password,
    });

    if (!session) {
      return toast({
        title: "Sign up field",
        duration: 3000,
        variant: "destructive",
        className: "bg-dark-3 border-red text-red",
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Email or username has been taken",
        duration: 3000,
        variant: "destructive",
        className: "bg-dark-3 border-red text-red",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 max-w-sm flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold sm:pt-5">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-4"
        >
          {signUpInputs.map((input, idx) => (
            <FormField
              key={idx}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={input.type}
                      className="shad-input"
                      placeholder={input.label}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className={`shad-button_primary py-6 ${
              isCreatingAccount
                ? "cursor-not-allowed disabled:opacity-25"
                : "cursor-pointer"
            }`}
            // disabled={isLoading}
          >
            {isCreatingAccount ? (
              <div className="flex-center">
                <Loader className="mx-2" /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-light-3 small-medium md:base-regular text-center">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-light-2 small-medium md:base-regular underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SinUp;
