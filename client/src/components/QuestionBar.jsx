// src/components/QuestionBar.jsx
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const QUESTIONS = [
  { id: "experience", label: "你的專業經歷是什麼？" },
  { id: "skills", label: "你擅長哪些能力？" },
  { id: "whyHire", label: "為什麼我們應該錄取你？" }
];

export default function QuestionBar({ onAsk, loading }) {
  return (
    <div>

      <ButtonGroup className="flex-wrap gap-2">
        {QUESTIONS.map((q) => (
          <Button
            key={q.id}
            variant="outline-light"
            size="sm"
            className="rounded-pill"
            disabled={loading}
            onClick={() => onAsk(q.id)}
          >
            {q.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
