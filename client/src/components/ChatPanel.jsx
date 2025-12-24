// src/components/ChatPanel.jsx
import React, { useEffect, useRef } from "react";

export default function ChatPanel({ messages, loading, thinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-panel">
      <div className="chat-column">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isLast = index === messages.length - 1;

          return (
            <React.Fragment key={msg.id}>
              <div
                className={
                  "chat-row " +
                  (isUser ? "chat-row-user" : "chat-row-assistant")
                }
              >
                <div
                  className={
                    "chat-bubble " +
                    (isUser ? "chat-bubble-user" : "chat-bubble-assistant")
                  }
                >
                  {!isUser && msg.image && (
                    <img src={msg.image} alt="" className="bubble-image" />
                  )}

                  {isUser ? (
                    msg.content
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  )}
                </div>

              </div>

              {isLast && thinking && (
                <div className="thinking-row">
                  <span className="thinking-text">正在思考 ›</span>
                </div>
              )}
            </React.Fragment>
          );
        })}

        <div ref={bottomRef} />
      </div>


    </div>
  );
}
