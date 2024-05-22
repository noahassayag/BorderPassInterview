import axios from "axios";
import { Question } from "../types";

export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await axios.get<Question[]>("/questions.json");
  return response.data;
};
