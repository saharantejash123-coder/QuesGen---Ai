export const englishPYQ2025 = {
  id: "CBSE-Class 10-English-2025",
  board: "CBSE",
  class: "Class 10",
  subject: "English",
  year: 2025,
  title: "CBSE Class 10 English Language & Literature — Annual Examination 2025",
  duration: "3 Hours",
  maxMarks: 80,
  sections: [
    {
      name: "Section A: Reading Skills",
      marks: 20,
      questions: [
        {
          id: "q1",
          text: "Read the passage given below and answer the questions that follow: (10 marks)\n'The advancement of technology has significantly changed the way we communicate...'",
          questions: [
            { id: "q1.1", text: "According to the passage, what is the primary impact of technology on communication?", type: "MCQ", options: ["Faster interaction", "Less personal touch", "Global connectivity", "All of the above"], answer: "All of the above" },
            { id: "q1.2", text: "Find a word in paragraph 2 that means 'to change'.", type: "Subjective", answer: "Alter" }
          ]
        }
      ]
    },
    {
      name: "Section B: Writing Skills & Grammar",
      marks: 20,
      questions: [
        {
          id: "q2",
          text: "Write a letter to the editor of a national daily advocating for cleaner city parks.",
          type: "Subjective",
          marks: 5
        },
        {
          id: "q3",
          text: "Fill in the blanks with correct verb forms: (5 marks)",
          subQuestions: [
            { id: "q3.1", text: "He _______ (go) to the market yesterday.", answer: "went" },
            { id: "q3.2", text: "They _______ (play) since morning.", answer: "have been playing" }
          ]
        }
      ]
    },
    {
      name: "Section C: Literature",
      marks: 40,
      questions: [
        {
          id: "q4",
          text: "Answer the following based on 'The Necklace':",
          questions: [
            { id: "q4.1", text: "Why was Matilda unhappy with her life?", type: "Subjective", marks: 3 },
            { id: "q4.2", text: "What did the necklace symbolize for her?", type: "MCQ", options: ["Wealth", "Status", "False pride", "Security"], answer: "False pride" }
          ]
        }
      ]
    }
  ]
};
