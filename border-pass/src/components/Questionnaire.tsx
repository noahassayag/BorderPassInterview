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

  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestions();
      setQuestions(questions);
    };
    loadQuestions();
  }, []);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (
      currentQuestion.isRequired &&
      !answers.find((a) => a.questionId === currentQuestion.id)
    ) {
      setError("This question is required. Please provide an answer.");
    } else {
      setError(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(null);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setError(null);
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

  return (
    <Container className="mt-4">
      {questions.length > 0 && (
        <div className="text-center">
          <QuestionComponent
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        </div>
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
            <Button color="primary" onClick={handleNext}>
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
