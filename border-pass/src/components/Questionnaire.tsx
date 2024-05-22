import React, { useState, useEffect } from "react";
import { fetchQuestions } from "../services/questionService";
import { Question, Answer } from "../types";
import QuestionComponent from "./QuestionComponent";

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestions();
      setQuestions(questions);
    };
    loadQuestions();
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswer = (answer: Answer) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === answer.questionId
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = answer;
        return updatedAnswers;
      }
      return [...prevAnswers, answer];
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const renderAnswer = (answer: Answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return null;

    let formattedAnswer = answer.answer;
    if (Array.isArray(answer.answer)) {
      formattedAnswer = answer.answer.join(", ");
    }

    return (
      <li key={answer.questionId}>
        {question.text}: {formattedAnswer}
      </li>
    );
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>Survey Results</h2>
        <ul>{answers.map((answer) => renderAnswer(answer))}</ul>
      </div>
    );
  }

  return (
    <div>
      {questions.length > 0 && (
        <QuestionComponent
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      )}
      <button onClick={handleBack} disabled={currentQuestionIndex === 0}>
        Back
      </button>
      {currentQuestionIndex < questions.length - 1 ? (
        <button onClick={handleNext}>Next</button>
      ) : (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

export default Questionnaire;
