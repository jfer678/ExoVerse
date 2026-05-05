import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

interface Option {
  id: string;
  option_text: string;
  question_id: string;
}

interface Question {
  id: string;
  question_text: string;
  question_options: Option[];
  test_correct_option_id: string;
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: questionsData, error: qError } = await supabase
        .from("questions")
        .select("*");

      const { data: optionsData, error: oError } = await supabase
        .from("question_options")
        .select("*");

      if (qError || oError) {
        console.error(qError || oError);
        return;
      }

      const merged = questionsData?.map((q) => ({
        ...q,
        question_options: optionsData?.filter(
          (opt) => opt.question_id === q.id
        ),
      }));

      setQuestions(merged || []);
    };

    fetchData();
  }, []);

  return questions;
};