import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../libs/axiosInstance";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [heartCount, setHeartCount] = useState(0);
  const [isHearted, setIsHearted] = useState(false);
  const [heartLoading, setHeartLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage("");
        setPost(null);
        setHeartCount(0);
        setIsHearted(false);

        const response = await axiosInstance.get(`/posts/${postId}`);
        const fetchedPost = response.data;

        setPost(fetchedPost);
        console.log(`게시글 ${postId} 상세 정보:`, fetchedPost);

        if (fetchedPost.heartCount !== undefined) {
          setHeartCount(fetchedPost.heartCount);
        }
      } catch (err) {
        setError("게시글 정보를 불러오는데 실패했습니다.");
        console.error(`게시글 ${postId} 상세 API 호출 에러:`, err);
        setPost(null);
        setHeartCount(0);
        setIsHearted(false);
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
      setHeartCount(0);
      setIsHearted(false);
    }
  }, [postId]);

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(`정말로 이 게시글을 삭제하시겠습니까?`);

    if (confirmDelete) {
      setDeleting(true);
      setError(null);
      setMessage("");

      try {
        const response = await axiosInstance.delete(`/posts/${postId}`);
        setMessage("✅ 게시글 삭제 성공!");
        console.log("게시글 삭제 응답:", response.data);

        const boardId = post?.board?.boardId;
        if (boardId) {
          navigate(`/boards/${boardId}/posts`);
        } else {
          navigate("/boards");
        }
      } catch (err) {
        setError("❌ 게시글 삭제 실패!");
        console.error("게시글 삭제 API 호출 에러:", err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleHeartClick = async () => {
    const memberId = 0;

    if (!postId || memberId === undefined || memberId === null) {
      console.error("좋아요 기능을 수행할 수 없습니다: postId 또는 memberId가 유효하지 않습니다.");
      return;
    }

    setHeartLoading(true);
    setError(null);
    setMessage("");

    try {
      let response;
      if (isHearted) {
        response = await axiosInstance.delete(`/posts/${postId}/hearts`, {
          params: { memberId: memberId }
        });
        setMessage("✅ 좋아요 취소 성공!");
        setHeartCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        setIsHearted(false);
      } else {
        response = await axiosInstance.post(`/posts/${postId}/hearts`, { memberId: memberId });
        setMessage("✅ 좋아요 성공!");
        setHeartCount(prevCount => prevCount + 1);
        setIsHearted(true);
      }

      console.log("좋아요/취소 응답:", response.data);
    } catch (err) {
      setError("❌ 좋아요 기능 실패!");
      console.error("좋아요/취소 API 호출 에러:", err);
    } finally {
      setHeartLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
        게시글 정보를 불러오는 중입니다...
      </main>
    );
  }

  if (!post) {
    if (error && !deleting) {
      return (
        <main className="container" style={{ maxWidth: "800px", marginTop: "4rem", color: "red" }}>
          {error}
        </main>
      );
    } else {
      return (
        <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
          게시글 정보를 찾을 수 없습니다.
        </main>
      );
    }
  }

  return (
    <main className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
      <h2>{post.title}</h2>
      <p>
        작성자: {post.member?.nickname || '익명'}
        {' '} | 작성일: {new Date(post.createdDate).toLocaleDateString()}
      </p>
      <hr />
      <p>{post.content}</p>

      {post?.postId && (
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <button onClick={handleHeartClick} disabled={heartLoading || deleting || loading} style={{ marginRight: '0.5rem', cursor: heartLoading ? 'not-allowed' : 'pointer' }}>
            {heartLoading ? '처리 중...' : (isHearted ? '❤️ 좋아요 취소' : '🤍 좋아요')}
          </button>
          <span>좋아요 {heartCount}개</span>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to={`/edit/${postId}`} style={{ marginRight: '0.5rem' }}>
          <button>수정</button>
        </Link>
        <button onClick={handleDeletePost} disabled={deleting || loading || heartLoading}>
          {deleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "green" }}>{message}</p>
      )}
      {error && !loading && !deleting && !heartLoading && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{error}</p>
      )}

      {post?.board?.boardId && (
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/boards/${post.board.boardId}/posts`}>목록으로 돌아가기</Link>
        </div>
      )}
    </main>
  );
}
