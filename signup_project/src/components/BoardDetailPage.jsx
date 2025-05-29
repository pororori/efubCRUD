import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../libs/axiosInstance";

export default function BoardDetailPage() {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        setError(null);
        setBoard(null);

        const response = await axiosInstance.get(`/boards/${boardId}`);
        const fetchedBoard = response.data;

        setBoard(fetchedBoard);
        console.log(`게시판 ${boardId} 상세 정보:`, fetchedBoard);
      } catch (err) {
        setError("게시판 정보를 불러오는데 실패했습니다.");
        console.error(`게시판 ${boardId} 상세 API 호출 에러:`, err);
        setBoard(null);
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

  if (loading) {
    return (
      <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
        게시판 정보를 불러오는 중입니다...
      </main>
    );
  }

  if (!board) {
    if (error) {
      return (
        <main className="container" style={{ maxWidth: "800px", marginTop: "4rem", color: "red" }}>
          {error}
        </main>
      );
    } else {
      return (
        <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
          게시판 정보를 찾을 수 없습니다.
        </main>
      );
    }
  }

  return (
    <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
      <h2>{board.title} (ID: {board.boardId})</h2>
      <p>설명: {board.description || '설명 없음'}</p>
      <p>공지: {board.notice || '공지 없음'}</p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/boards">게시판 목록으로 돌아가기</Link>
        <span style={{ marginLeft: '1rem' }}>
          <Link to={`/boards/${boardId}/posts`}>게시글 목록 보기</Link>
        </span>
      </div>
    </main>
  );
}