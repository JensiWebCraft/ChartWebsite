import { useEffect, useState } from "react";
import "./TaskComments.scss";

const TaskComments = ({
  comments = [],
  newComments = [],
  currentUser,
  onSave,
}) => {
  const [text, setText] = useState("");

  let safeComments;

  useEffect(() => {
    if (comments?.length > 0) {
      safeComments = Array.isArray(comments) ? comments : [];
    } else if (newComments.length > 0) {
      safeComments = Array.isArray(newComments) ? newComments : [];
    } else {
      safeComments = [];
    }
    console.log("safeComments", safeComments);
  });

  const handleAdd = () => {
    if (!text.trim()) return;

    const newComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, // safer unique string id
      userEmail: currentUser?.email || "anonymous@example.com",
      userRole: currentUser?.role || "user",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    console.log("New comment →", newComment);

    onSave(newComment);
    setText("");
  };

  return (
    <div className="comments-section">
      <h3>Comments ({safeComments?.length})</h3>

      <div className="comments-list">
        {safeComments?.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          safeComments?.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-user">
                  <strong>{comment.userEmail || "Unknown user"}</strong>
                  <span className={`role ${comment.userRole || "user"}`}>
                    {comment.userRole || "user"}
                  </span>
                </div>

                <span className="comment-time">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </span>
              </div>

              <p className="comment-text">
                {comment.text || "(empty comment)"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="add-comment">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          title={!text.trim() ? "Write something first" : ""}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default TaskComments;
