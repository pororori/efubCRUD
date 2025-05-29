import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axiosInstance from "../libs/axiosInstance";


export default function PostEditPage() {
  
  const { postId } = useParams();
 
  const navigate = useNavigate();

 
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [post, setPost] = useState(null);

 
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null); 
  const [message, setMessage] = useState(""); 


  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); 
        setError(null); 
        setMessage(""); 
        setPost(null); 

        
        const response = await axiosInstance.get(`/posts/${postId}`);
        const existingPost = response.data;

        
        setFormData({
          title: existingPost.title,
          content: existingPost.content,
        });
       
        setPost(existingPost);

        console.log(`기존 게시글 ${postId} 정보 불러오기 성공:`, existingPost);

      } catch (err) {
        setError("기존 게시글 정보를 불러오는데 실패했습니다.");
        console.error(`기존 게시글 ${postId} 정보 API 호출 에러:`, err);
        setPost(null); 
        setFormData({ title: "", content: "" }); 
      } finally {
        setLoading(false);
      }
    };

    
    if (postId) {
      fetchPost();
    } else {
       setLoading(false);
       setError("잘못된 접근입니다: 게시글 ID가 없습니다.");
       setPost(null); 
    }

  }, [postId]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const updateData = {
      title: formData.title,
      content: formData.content,
    };

    setSaving(true); 
    setError(null); 
    setMessage(""); 

    try {
     
      const response = await axiosInstance.put(`/posts/${postId}`, updateData);

      setMessage("✅ 게시글 수정 성공!");
      console.log("게시글 수정 응답:", response.data);

     
      navigate(`/posts/${postId}`);


    } catch (err) {
      setError("❌ 게시글 수정 실패!");
      console.error("게시글 수정 API 호출 에러:", err);
      
    } finally {
      setSaving(false); 
    }
  };

  
  if (loading) {
    return (
        <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
            
        </main>
    );
  }

  
  if (!post) {
    
      if (error) { 
        return (
               <main className="container" style={{ maxWidth: "700px", marginTop: "4rem", color: "red" }}> 
                   {error}
               </main>
           );
      } else {
           
           return (
               <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
                   {error}
               </main>
           );
      }
  }


  return (
    <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
      <h2>게시글 수정 (ID: {postId})</h2> 
   
      {message && ( 
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "green" }}>{message}</p>
      )}
      {error && !loading && ( 
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{error}</p>
      )}


      <form onSubmit={handleSubmit}>
        
        <label>
          제목
          <input
            type="text"
            name="title"
            value={formData.title} 
            onChange={handleChange}
            required 력 필드
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

       
        <button type="submit" disabled={saving || loading}>
          {saving ? '저장 중...' : '수정 완료'}
        </button>
      </form>

      
       {post?.board?.boardId && (
           <div style={{ marginTop: '1rem' }}>
              
               <Link to={`/boards/${post.board.boardId}/posts`}>목록으로 돌아가기</Link>
           </div>
       )}

    </main>
  );
}
