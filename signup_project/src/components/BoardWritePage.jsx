import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../libs/axiosInstance";

export default function BoardWritePage() {
  const navigate = useNavigate();

 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    notice: "",
    ownerId: 0, 
  });


  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const boardData = {
      ...formData,
      ownerId: 0, 
    };

    setLoading(true); 
    setError(null); 
    setMessage(""); 

    try {
      
      const response = await axiosInstance.post("/boards", boardData);

      setMessage("✅ 게시판 생성 성공!");
      console.log("게시판 생성 응답:", response.data);

      navigate("/boards");

    } catch (err) {
      setError("❌ 게시판 생성 실패!");
      console.error("게시판 생성 API 호출 에러:", err);
      
    } finally {
      setLoading(false); 
    }
  };

  
  return (
    <main className="container" style={{ maxWidth: "700px", marginTop: "4rem" }}>
      <h2>새 게시판 만들기</h2>
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

        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '생성 완료'}
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
