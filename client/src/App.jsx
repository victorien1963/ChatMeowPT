// App.jsx
import React, { useState } from "react";
import ChatPanel from "./components/ChatPanel.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const QUESTIONS = [
  { id: "intro", label: "自我介紹" },
  { id: "experience", label: "作品集" },
  { id: "skills", label: "專長" },
  { id: "whyHire", label: "亮點" }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  // 底部輸入列用的 state
  const [inputValue, setInputValue] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const askById = async (questionId) => {
    if (loading) return;
    setLoading(true);
    setThinking(true);

    try {
      // 先從 QUESTIONS 找出對應文字
      const questionDef = QUESTIONS.find((q) => q.id === questionId);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: questionDef ? questionDef.label : ""
      };

      // 先 push 使用者提問
      setMessages((prev) => [...prev, userMessage]);

      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      // 模擬 GPT 思考時間 2.5 秒
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer.text || data.answer,
        image: data.answer.image || null
      };


      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("[Ask Error]", err);

      // 發生錯誤時也給一個簡單的訊息
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "抱歉，伺服器目前有點問題，稍後再試試看。"
        }
      ]);
    } finally {
      setLoading(false);
      setThinking(false);
    }
  };



  // 按下「送出」按鈕或 Enter
  const handleSubmit = () => {
    if (!selectedQuestionId || loading) return;
    setStarted(true);
    askById(selectedQuestionId);
    setInputValue("");
    setSelectedQuestionId(null);
  };

  // 點上方 chips：只先填到輸入框，不直接送出
  const handleChipClick = (q) => {
    setInputValue(q.label);
    setSelectedQuestionId(q.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showChat = started || messages.length > 0;

  return (
    <div className="app-shell bg-chat text-light">
      {/* 左側懸浮 sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <img src="/profile-logo.png" width="32" height="32" alt="Profile logo" />
        </div>
        <div className="sidebar-middle">
          <button className="sidebar-icon sidebar-icon-active" title="新對話">
            <i className="bi bi-pencil-square" />
          </button>
          <button className="sidebar-icon" title="搜尋">
            <i className="bi bi-search" />
          </button>
          <button className="sidebar-icon" title="Live / 語音">
            <i className="bi bi-broadcast" />
          </button>
          <button className="sidebar-icon" title="圖片">
            <i className="bi bi-image" />
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-avatar">V</div>
        </div>


      </aside>

      {/* 右側主畫面 */}
      <main className="app-main">
        {/* 上方模型名稱列 */}
        <header className="main-header">
          <div className="model-name fs-5">
            ChatGPT <span className="model-version fw-100 fs-5">5.1</span>
          </div>
        </header>

        <div className="app-main-content">
          {showChat ? (
            <ChatPanel messages={messages} loading={loading} thinking={thinking} />
          ) : (
            <HomeScreen />
          )}
        </div>

        {/* 底部輸入區（ChatGPT 風格） */}
        <div className={`bottom-area ${showChat ? "" : "bottom-area-center"}`}>

          {/* 輸入列 */}
          <div className="bottom-input-row">
            <button
              type="button"
              className="bottom-plus-btn"
              title="新對話（目前無功能，純樣式）"
            >
              ＋
            </button>

            <textarea
              className="bottom-textarea"
              placeholder="提出任何問題，或先點上方建議問題填入"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <button
              type="button"
              className={
                "bottom-send-btn" +
                (!selectedQuestionId || loading ? " disabled" : "")
              }
              onClick={handleSubmit}
            >
              ⏎
            </button>
          </div>

          {/* 預設問題 chips */}
          <div className="chip-row">
            {QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                className={
                  "chip-button" +
                  (selectedQuestionId === q.id ? " chip-button-active" : "")
                }
                onClick={() => handleChipClick(q)}
                disabled={loading}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/** 首頁畫面 **/
function HomeScreen() {
  return (
    <div className="home-screen">
      <div className="home-title">今天有什麼計畫？</div>
    </div>
  );
}

