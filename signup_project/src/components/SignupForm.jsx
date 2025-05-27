import React, { useState } from "react";
import axiosInstance from "../libs/axiosInstance";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    university: "",
    studentId: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/members", formData);
      setMessage("✅ 회원가입 성공!");
      console.log(res.data);
    } catch (err) {
      setMessage("❌ 회원가입 실패!");
      console.error(err);
    }
  };

  return (
    <main
      className="container"
      style={{ maxWidth: "500px", marginTop: "4rem" }}
    >
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          닉네임
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          대학교
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          학번
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">회원가입</button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}
    </main>
  );
}
