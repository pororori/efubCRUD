import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUpForm from "./components/SignupForm";
import BoardListPage from "./components/BoardListPage";
import PostListPage from "./components/PostListPage";
import PostDetailPage from "./components/PostDetailPage";
import PostWritePage from "./components/PostWritePage";
import PostEditPage from "./components/PostEditPage";
import BoardWritePage from "./components/BoardWritePage";
import BoardEditPage from "./components/BoardEditPage";
import BoardDetailPage from "./components/BoardDetailPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<SignUpForm />} />

        <Route path="/boards/write" element={<BoardWritePage />} /> 
        <Route path="/boards/:boardId/edit" element={<BoardEditPage />} />
        <Route path="/boards" element={<BoardListPage />} />
        <Route path="/boards/:boardId/posts" element={<PostListPage />} /> 
        <Route path="/posts/:postId" element={<PostDetailPage />} /> 
        <Route path="/boards/:boardId/write" element={<PostWritePage />} /> 
        <Route path="/edit/:postId" element={<PostEditPage />} /> 
        <Route path="/board/:boardId" element={<BoardDetailPage />}/>

      </Routes>
    </BrowserRouter>
  );
}