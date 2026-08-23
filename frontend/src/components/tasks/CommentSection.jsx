import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const CommentSection = ({
  comments = [],
  onAddComment,
  onDeleteComment,
  currentUser,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    await onAddComment(content.trim());
    setContent('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!content.trim()}
        >
          <Send size={16} />
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => {
            const canDelete =
              comment.user?._id === currentUser?._id ||
              currentUser?.role === 'admin';

            return (
              <div
                key={comment._id}
                style={{
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>{comment.user?.name || 'User'}</strong>

                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment._id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p style={{ margin: '6px 0 0' }}>
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;