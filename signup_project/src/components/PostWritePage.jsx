import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axiosInstance from "../libs/axiosInstance"; 


export default function PostWritePage() {
  
  const { boardId } = useParams();
  
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    anonymous: false, 
    
  });

  // API 호출 상태 및 메시지
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); 

  // 입력 필드 값이 변경될 때 상태 업데이트
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
   
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const postData = {
      ...formData,
      boardId: parseInt(boardId), 
      writerId: 0, 
    };

    setLoading(true); 
    setError(null); 
    setMessage("");

    try {
      
      const response = await axiosInstance.post("/posts", postData);

      setMessage("✅ 게시글 작성 성공!");
      console.log("게시글 작성 응답:", response.data);

      // ✨ 게시글 작성 성공 후 게시글 상세 페이지로 이동 ✨
    
      const newPostId = response.data.postId;
      if (newPostId) {
         navigate(`/posts/${newPostId}`); // 생성된 게시글 상세 페이지로 이동
      } else {
         
          alert("게시글이 작성되었으나 상세 정보 링크를 얻을 수 없습니다. 목록으로 이동합니다.");
          navigate(`/boards/${boardId}/posts`);
      }


    } catch (err) {
      setError("❌ 게시글 작성 실패!");
      console.error("게시글 작성 API 호출 에러:", err);
      
    } finally {
      setLoading(false); 
    }
  };


  return (
    <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
      <h2>새 게시글 작성 (게시판 ID: {boardId})</h2> 
      <form onSubmit={handleSubmit}>
        
        <label>
          제목
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required 
          />
        </label>

        
        <label>
          내용
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required 
            rows="10" 
          />
        </label>

     
        <label>
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange} 
          />
          익명으로 작성
        </label>

        
        <button type="submit" disabled={loading}>
          {loading ? '작성 중...' : '작성 완료'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "green" }}>{message}</p>
      )}
      {error && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{error}</p>
      )}
    </main>
  );
}
