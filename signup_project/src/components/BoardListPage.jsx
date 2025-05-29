import React, { useState, useEffect } from "react";
import axiosInstance from "../libs/axiosInstance";
import { Link } from "react-router-dom";

export default function BoardListPage() {
  const [posts, setPosts] = useState([]);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPostsAndExtractBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      setDeleteError(null);

      const response = await axiosInstance.get("/posts");
      const allPosts = response.data;

      const uniqueBoards = allPosts.reduce((acc, post) => {
        const boardInfo = post.board;
        if (!boardInfo || boardInfo.boardId === undefined || boardInfo.boardId === null) {
          return acc;
        }

        const exists = acc.find(b => b.boardId === boardInfo.boardId);

        if (!exists) {
          acc.push({
            boardId: boardInfo.boardId,
            title: boardInfo.title,
            ownerId: boardInfo.ownerId
          });
        }
        return acc;
      }, []);

      uniqueBoards.sort((a, b) => a.boardId - b.boardId);

      setPosts(allPosts);
      setBoards(uniqueBoards);
    } catch (err) {
      setError("게시판 목록을 불러오는데 실패했습니다.");
      console.error("게시판 목록 API 호출 에러:", err);
      setPosts([]);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndExtractBoards();
  }, []);

  const handleDeleteBoard = async (boardIdToDelete) => {
    const confirmDelete = window.confirm(`정말로 게시판 (ID: ${boardIdToDelete})을 삭제하시겠습니까?`);

    if (confirmDelete) {
      setDeletingId(boardIdToDelete);
      setDeleteError(null);

      try {
        const response = await axiosInstance.delete(`/boards/${boardIdToDelete}`);

        console.log(`게시판 ${boardIdToDelete} 삭제 응답:`, response.data);

        fetchPostsAndExtractBoards();
      } catch (err) {
        setDeleteError("❌ 게시판 삭제 실패!");
        console.error(`게시판 ${boardIdToDelete} 삭제 API 호출 에러:`, err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
        게시판 목록을 불러오는 중입니다...
      </main>
    );
  }

  if (error) {
    return (
      <main className="container" style={{ maxWidth: "800px", marginTop: "4rem", color: "red" }}>
        {error}
      </main>
    );
  }

  if (boards.length === 0) {
    return (
      <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
        <h2>게시판 목록</h2>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/boards/write">
            <button>새 게시판 만들기</button>
          </Link>
        </div>
        <p>등록된 게시판이 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
      <h2>게시판 목록</h2>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/boards/write">
          <button>새 게시판 만들기</button>
        </Link>
      </div>
      {deleteError && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{deleteError}</p>
      )}
      <ul>
        {boards.map((board) => (
          <li key={board.boardId}>
            <Link to={`/boards/${board.boardId}/posts`}>
              {board.title} (ID: {board.boardId})
            </Link>
            <span style={{ marginLeft: '1rem' }}>
              <Link to={`/boards/${board.boardId}/edit`} style={{ marginRight: '0.5rem' }}>수정</Link>
              <button
                onClick={() => handleDeleteBoard(board.boardId)}
                disabled={deletingId === board.boardId || loading}
              >
                {deletingId === board.boardId ? '삭제 중...' : '삭제'}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}