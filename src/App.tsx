import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import AuthLayout from "./pages/auth/AuthLayout";
import SinIn from "./pages/auth/SignIn";
import SinUp from "./pages/auth/SignUp";
import RootLayout from "./pages/RootLayout";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./pages";

const App = () => {
  return (
    <>
      <main className="flex h-screen">
        <Routes>
          {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SinIn />} />
            <Route path="/sign-up" element={<SinUp />} />
          </Route>
          {/* private routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/saved" element={<Saved />} />
          </Route>
        </Routes>
        <Toaster />
      </main>
    </>
  );
};

export default App;
