import React, { useState, useEffect } from "react";
import {
  fetchQuestions,
  submitQuestionnaire,
} from "../services/questionService";
import { Question, Answer } from "../types";
import QuestionComponent from "./QuestionComponent";
import {
  Button,
  Container,
  Alert,
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [optionalQuestionAnswered, setOptionalQuestionAnswered] =
    useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await fetchQuestions();
        setQuestions(questions);
      } catch (error) {
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(
      (a) => a.questionId === currentQuestion.id
    );

    if (currentQuestion.isRequired && !currentAnswer) {
      setError("This question is required. Please provide an answer.");
    } else {
      setError(null);
      if (currentQuestion.type === "email") {
        if (
          currentAnswer &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentAnswer.answer as string)
        ) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setError("Please enter a valid email address.");
        }
      } else {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setOptionalQuestionAnswered(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(null);
      setOptionalQuestionAnswered(false);
    }
  };

  const handleSkip = () => {
    // Move to the next question without saving the answer
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setError(null);
    setOptionalQuestionAnswered(false);
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

    if (!questions[currentQuestionIndex].isRequired) {
      setOptionalQuestionAnswered(true);
    }
  };

  const handleSubmit = async () => {
    const unansweredMandatoryQuestions = questions.filter(
      (q) => q.isRequired && !answers.find((a) => a.questionId === q.id)
    );

    if (unansweredMandatoryQuestions.length > 0) {
      setError("Please answer all mandatory questions.");
    } else {
      setError(null);
      try {
        await submitQuestionnaire(answers);
        setIsSubmitted(true);
      } catch (error) {
        setError(
          "There was an error submitting your questionnaire. Please try again."
        );
      }
    }
  };

  const renderAnswer = (answer: Answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (
      !question ||
      !answer.answer ||
      (Array.isArray(answer.answer) && answer.answer.length === 0)
    )
      return null;

    let formattedAnswer = answer.answer;
    if (Array.isArray(answer.answer)) {
      formattedAnswer = answer.answer.join(", ");
    }

    return (
      <ListGroupItem key={answer.questionId}>
        <strong>{question.text}</strong>: {formattedAnswer}
      </ListGroupItem>
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (isSubmitted) {
    return (
      <Container className="mt-4">
        <Card>
          <CardBody>
            <CardTitle tag="h2" className="text-center">
              Survey Results
            </CardTitle>
            <ListGroup>
              {answers.map((answer) => renderAnswer(answer)).filter(Boolean)}
            </ListGroup>
          </CardBody>
        </Card>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  );

  return (
    <Container className="mt-4">
      {questions.length > 0 ? (
        <div className="text-center">
          <QuestionComponent
            question={currentQuestion}
            onAnswer={handleAnswer}
            existingAnswer={currentAnswer}
          />
        </div>
      ) : (
        <p>No questions available.</p>
      )}
      {error && <Alert color="danger">{error}</Alert>}
      <div className="d-flex justify-content-between mt-4">
        <Button
          color="secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
        >
          Back
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <div>
            {!currentQuestion.isRequired && (
              <Button color="warning" onClick={handleSkip} className="me-2">
                Skip
              </Button>
            )}
            <Button
              color="primary"
              onClick={handleNext}
              disabled={
                !currentQuestion.isRequired && !optionalQuestionAnswered
              }
            >
              Next
            </Button>
          </div>
        ) : (
          <Button color="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Questionnaire;
