import { useEffect, useState } from "react";
import { fetchCourseCategories } from "../services/operations/courseDetailsAPI";

export interface CourseCategory {
  _id: string;
  name: string;
  description?: string;
  courses?: unknown[];
}

export const useCourseCategories = () => {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchCourseCategories()
      .then((response) => {
        if (active) setCategories(response);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || "Could not load categories.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  return {
    categories,
    loading,
    error,
    retry: () => setAttempt((current) => current + 1),
  };
};