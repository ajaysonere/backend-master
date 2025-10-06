import { z } from "zod";

const newsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be 5 character long")
    .max(150, "Title cannot exceed 25 characters "),
  content: z
    .string()
    .min(10, "Content must be 10 character long.")
    .max(30000, "Content can not exceed 30000."),
});

export default newsSchema;
