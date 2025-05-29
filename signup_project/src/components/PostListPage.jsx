import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import axiosInstance from "../libs/axiosInstance"; 


export default function PostListPage() {
  
  const { boardId } = useParams();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        const response = await axiosInstance.get(`/boards/${boardId}/posts`);

        setPosts(response.data);
        console.log(`게시판 ${boardId}의 게시글 목록:`, response.data); 

      } catch (err) {
        setError("게시글 목록을 불러오는데 실패했습니다.");
        console.error(`게시판 ${boardId}의 게시글 목록 API 호출 에러:`, err);
        setPosts([]); // 에러 발생 시 게시글 목록 비우기
      } finally {
        setLoading(false); 
      }
    };

    if (boardId) {
      fetchPosts();
    } else {
      // boardId가 없는 예외적인 상황 처리
      setLoading(false);
      setError("잘못된 접근입니다: 게시판 ID가 없습니다.");
    }

  }, [boardId]); 


  if (loading) {
    return <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>게시글 목록을 불러오는 중입니다...</main>;
  }


  if (error) {
    return <main className="container" style={{ maxWidth: "800px", marginTop: "4rem", color: "red" }}>{error}</main>;
  }


  if (posts.length === 0) {
      
      const boardTitle = posts[0]?.board?.title || '해당 게시판'; 

      return (
        <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
            <h2>{boardTitle} 게시글</h2>
            <p>아직 등록된 게시글이 없습니다.</p>
           
            <Link to={`/boards/${boardId}/write`}>새 글 작성하기</Link> 
        </main>
      );
  }


  return (
    <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
      
      <h2>{posts[0]?.board?.title || '게시글 목록'}</h2>
      <ul>
       
        {posts.map((post) => (
          
          <li key={post.postId}>
            
            <Link to={`/posts/${post.postId}`}>
                {post.title} 
                {' '} - 작성자: {post.member?.nickname || '익명'} 
                
            </Link>
          </li>
        ))}
      </ul>
     
      <Link to={`/boards/${boardId}/write`}>새 글 작성하기</Link>
      <div style={{ marginTop: '2rem' }}>
        <Link to={`/boards/${boardId}/write`}>새 글 작성하기</Link>
      </div>
    </main>
  );
}
