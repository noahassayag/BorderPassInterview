export interface Question {
  id: number;
  text: string;
  type: "text" | "checkbox" | "dropdown" | "email";
  options?: string[];
  isRequired: boolean;
}

export interface Answer {
  questionId: number;
  answer: string | boolean | string[];
}
