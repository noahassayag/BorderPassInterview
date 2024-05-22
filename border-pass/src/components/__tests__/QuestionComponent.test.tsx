import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import QuestionComponent from "../QuestionComponent";
import { Question, Answer } from "../../types";

describe("QuestionComponent", () => {
  const mockOnAnswer = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders text question and handles input", () => {
    const textQuestion: Question = {
      id: 1,
      text: "What is your name?",
      type: "text",
      isRequired: true,
    };

    render(
      <QuestionComponent question={textQuestion} onAnswer={mockOnAnswer} />
    );

    const input = screen.getByLabelText("What is your name?");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "John Doe" } });
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: 1,
      answer: "John Doe",
    });
  });

  test("renders checkbox question and handles input", () => {
    const checkboxQuestion: Question = {
      id: 2,
      text: "Do you like programming?",
      type: "checkbox",
      options: ["Yes", "No"],
      isRequired: false,
    };

    render(
      <QuestionComponent question={checkboxQuestion} onAnswer={mockOnAnswer} />
    );

    const yesCheckbox = screen.getByLabelText("Yes");
    const noCheckbox = screen.getByLabelText("No");
    expect(yesCheckbox).toBeInTheDocument();
    expect(noCheckbox).toBeInTheDocument();

    fireEvent.click(yesCheckbox);
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: 2,
      answer: ["Yes"],
    });

    fireEvent.click(noCheckbox);
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: 2,
      answer: ["Yes", "No"],
    });

    fireEvent.click(yesCheckbox);
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: 2,
      answer: ["No"],
    });
  });

  test("renders dropdown question and handles input", () => {
    const dropdownQuestion: Question = {
      id: 3,
      text: "What is your favorite language?",
      type: "dropdown",
      options: ["JavaScript", "Python", "Java", "C++"],
      isRequired: true,
    };

    render(
      <QuestionComponent question={dropdownQuestion} onAnswer={mockOnAnswer} />
    );

    const dropdown = screen.getByLabelText("What is your favorite language?");
    expect(dropdown).toBeInTheDocument();

    fireEvent.change(dropdown, { target: { value: "JavaScript" } });
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: 3,
      answer: "JavaScript",
    });
  });
});
