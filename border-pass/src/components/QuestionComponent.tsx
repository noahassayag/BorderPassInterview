import React, { useState, useEffect } from "react";
import { Question, Answer } from "../types";
import { Form, FormGroup, Label, Input } from "reactstrap";

interface QuestionComponentProps {
  question: Question;
  onAnswer: (answer: Answer) => void;
  existingAnswer?: Answer;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  onAnswer,
  existingAnswer,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    (existingAnswer?.answer as string[]) || []
  );

  const [textInput, setTextInput] = useState<string>(
    (existingAnswer?.answer as string) || ""
  );

  useEffect(() => {
    if (question.type === "checkbox") {
      setSelectedOptions((existingAnswer?.answer as string[]) || []);
    } else if (question.type === "text" || question.type === "email") {
      setTextInput((existingAnswer?.answer as string) || "");
    }
  }, [question, existingAnswer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | boolean | string[] = "";
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const checked = e.target.checked;
      const checkedValue = e.target.value;
      if (checked) {
        value = [...selectedOptions, checkedValue];
      } else {
        value = selectedOptions.filter((v) => v !== checkedValue);
      }
      setSelectedOptions(value as string[]);
    } else if (e.target instanceof HTMLInputElement) {
      value = e.target.value;
      setTextInput(value);
    } else if (e.target instanceof HTMLSelectElement) {
      value = e.target.value;
    }

    onAnswer({ questionId: question.id, answer: value });
  };

  return (
    <Form>
      <FormGroup>
        <Label for={`question-${question.id}`}>{question.text}</Label>
        {question.type === "text" && (
          <Input
            type="text"
            id={`question-${question.id}`}
            value={textInput}
            onChange={handleChange}
            placeholder="Enter your answer"
          />
        )}
        {question.type === "checkbox" &&
          question.options &&
          question.options.map((option, index) => (
            <FormGroup check key={index}>
              <Label check>
                <Input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleChange}
                />{" "}
                {option}
              </Label>
            </FormGroup>
          ))}
        {question.type === "dropdown" && question.options && (
          <Input
            type="select"
            id={`question-${question.id}`}
            value={textInput}
            onChange={handleChange}
          >
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Input>
        )}
        {question.type === "email" && (
          <Input
            type="email"
            id={`question-${question.id}`}
            value={textInput}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        )}
      </FormGroup>
    </Form>
  );
};

export default QuestionComponent;
