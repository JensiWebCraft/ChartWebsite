import { useState } from "react";
import "./TaskComments.scss";

const TaskComments = ({ comments = [], currentUser, onSave }) => {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      userEmail: currentUser.email,
      userRole: currentUser.role,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    console.log("New comment being saved:", newComment); // ← ADD THIS
    onSave(newComment);
    setText("");
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {/* LIST */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-user">
                  <strong>{c.userEmail}</strong>
                  <span className={`role ${c.userRole}`}>{c.userRole}</span>
                </div>

                {/* ✅ CREATED TIME */}
                <span className="comment-time">
                  {new Date(c.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <p className="comment-text">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* ADD COMMENT */}
      <div className="add-comment">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />
        <button onClick={handleAdd} disabled={!text.trim()}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default TaskComments;
