import axios from "axios";
import { Question, Answer } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await api.get<Question[]>("/questions");
  return response.data;
};

export const submitQuestionnaire = async (answers: Answer[]): Promise<void> => {
  const response = await api.post("/submit", { answers });
  return response.data;
};
