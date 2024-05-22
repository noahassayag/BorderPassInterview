import React, { useState, useEffect } from "react";
import { Question, Answer } from "../types";

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
    <div>
      <h2>{question.text}</h2>
      {question.type === "text" && (
        <input type="text" onChange={handleChange} />
      )}
      {question.type === "checkbox" &&
        question.options &&
        question.options.map((option, index) => (
          <label key={index}>
            <input type="checkbox" value={option} onChange={handleChange} />
            {option}
          </label>
        ))}
      {question.type === "dropdown" && question.options && (
        <select onChange={handleChange}>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default QuestionComponent;
