import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";

import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ProfileLayout from "./components/profile/ProfileLayout";
import ProfilePosts from "./components/profile/ProfilePosts";
import ProfileFollowers from "./components/profile/ProfileFollowers";
import ProfileFollowings from "./components/profile/ProfileFollowings";
import AllUsers from "./pages/AllUsers";
import MyFeed from "./pages/MyFeed";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { setCredentials } from "./store";

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  console.log(userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUserQuery = useQuery(
    ["auth"],
    ({ signal }) =>
      axios
        .get(`/api/me`, { withCredentials: true, signal })
        .then((res) => res.data),
    {
      onSuccess(data) {
        console.log("innn");
        dispatch(setCredentials(data));
      },
      onError() {
        console.log("error");
        navigate("/login");
      },
      retry: 0,
    }
  );

  if (authUserQuery?.isLoading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/:user_id/allUsers" element={<AllUsers />} />
        <Route path="/:user_id/myFeed" element={<MyFeed />} />
        <Route path="/profile/:id" element={<ProfileLayout />}>
          <Route index element={<ProfilePosts />} />
          <Route path="followers" element={<ProfileFollowers />} />
          <Route path="followings" element={<ProfileFollowings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
