import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../libs/axiosInstance";

export default function BoardEditPage() {
 
  const { boardId } = useParams();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    notice: "",
    ownerId: 0,
});
  
  const [board, setBoard] = useState(null);
 
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState(null); 
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true); 
        setError(null); 
        setMessage(""); 
        setBoard(null); 
        setFormData({ title: "", description: "", notice: "", ownerId: 0 }); // 폼 상태 초기화

        const response = await axiosInstance.get(`/boards/${boardId}`);
        const existingBoard = response.data;

        
        setFormData({
          title: existingBoard.title,
          description: existingBoard.description,
          notice: existingBoard.notice,
          ownerId: existingBoard.ownerId 
        });
        
        setBoard(existingBoard);

        console.log(`기존 게시판 ${boardId} 정보 불러오기 성공:`, existingBoard);

      } catch (err) {
        setError("기존 게시판 정보를 불러오는데 실패했습니다.");
        console.error(`기존 게시판 ${boardId} 정보 API 호출 에러:`, err);
        setBoard(null); 
        setFormData({ title: "", description: "", notice: "", ownerId: 0 }); // 에러 시 폼 데이터 비움
      } finally {
        setLoading(false); 
      }
    };

   
    if (boardId) {
      fetchBoard();
    } else {
       setLoading(false);
       setError("잘못된 접근입니다: 게시판 ID가 없습니다.");
       setBoard(null); 
    }

  }, [boardId]); 

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedValue = name === 'ownerId' ? parseInt(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const updateData = {
      title: formData.title,
      description: formData.description,
      notice: formData.notice,
      ownerId: formData.ownerId 
    };

    setSaving(true); 
    setError(null); 
    setMessage(""); 화

    try {
      
      const response = await axiosInstance.put(`/boards/${boardId}`, updateData);

      setMessage("✅ 게시판 수정 성공!");
      console.log("게시판 수정 응답:", response.data);

      navigate("/boards"); 


    } catch (err) {
      setError("❌ 게시판 수정 실패!");
      console.error("게시판 수정 API 호출 에러:", err);
      
    } finally {
      setSaving(false); 
    }
  };

  if (loading) {
    return (
        <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
            게시판 정보를 불러오는 중입니다...
        </main>
    );
  }

  if (!board) {
      if (error) {
          return (
              <main className="container" style={{ maxWidth: "700px", marginTop: "4rem", color: "red" }}>
                  {error}
              </main>
          );
      } else {
           return (
               <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
                   게시판 정보를 찾을 수 없습니다.
               </main>
           );
      }
  }

  return (
    <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
      <h2>게시판 수정 (ID: {boardId})</h2> 

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "green" }}>{message}</p>
      )}
      {error && !loading && ( 
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
       
        <label>
          게시판 제목
          <input
            type="text"
            name="title"
            value={formData.title} 
            onChange={handleChange}
            required 
          />
        </label>

       
        <label>
          설명
          <textarea
            name="description"
            value={formData.description} 
            onChange={handleChange}
            rows="4"
          />
        </label>

       
        <label>
          공지
          <textarea
            name="notice"
            value={formData.notice} 
            onChange={handleChange}
            rows="4"
          />
        </label>

        
        <label>
           소유자 ID
           <input
             type="number" 경
             name="ownerId"
             value={formData.ownerId}
             onChange={handleChange} 
             required

           />
        </label>

        <button type="submit" disabled={saving || loading}>
          {saving ? '저장 중...' : '수정 완료'}
        </button>
      </form>

      
       <div style={{ marginTop: '1rem' }}>
           
           <Link to="/boards">목록으로 돌아가기</Link>
       </div>

    </main>
  );
}
