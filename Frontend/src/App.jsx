import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { About, AddPost, HomeLoggedIn, Navbar, Profile, Explore, Signup, Header, HomeLogged, EditProfile, EditPostCard, CommentCard, EdiComment } from './components';
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Header />}>
        <Route index element={<HomeLogged />} />
        <Route path="register" element={<Signup />} />
      </Route>
      <Route path="/navbar" element={<Navbar />} errorElement={<ErrorBoundary />}>
        <Route path="home" element={<HomeLoggedIn />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="profile/:username/editProfile/:userId" element={<EditProfile />}/>
        <Route path="profile/:username/editPostCard/:postId" element={<EditPostCard />}/>
        <Route path="profile/:username/getAllComment/:postId" element={<CommentCard />}/>
        <Route path="profile/:username/getAllComment/:postId/editComment/:commentId" element={<EdiComment />}/>
        <Route path="addPost" element={<AddPost />} />
        <Route path="explore" element={<Explore />} />
        <Route path="about" element={<About />} />
      </Route>
        <Route path="*" element={<ErrorBoundary />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
