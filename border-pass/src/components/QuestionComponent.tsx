import React, { useState, useEffect } from "react";
import { Question, Answer } from "../types";
import { Form, FormGroup, Label, Input } from "reactstrap";

interface QuestionComponentProps {
  question: Question;
  onAnswer: (answer: Answer) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  onAnswer,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (question.type === "checkbox") {
      setSelectedOptions([]);
    }
  }, [question]);

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
            onChange={handleChange}
            placeholder="Enter your answer"
          />
        )}
        {question.type === "checkbox" &&
          question.options &&
          question.options.map((option, index) => (
            <FormGroup check key={index}>
              <Label check>
                <Input type="checkbox" value={option} onChange={handleChange} />{" "}
                {option}
              </Label>
            </FormGroup>
          ))}
        {question.type === "dropdown" && question.options && (
          <Input
            type="select"
            id={`question-${question.id}`}
            onChange={handleChange}
          >
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Input>
        )}
      </FormGroup>
    </Form>
  );
};

export default QuestionComponent;
