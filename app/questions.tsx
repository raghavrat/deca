export interface Answer {
  text: string
}

export interface Question {
  text: string
  answers: Answer[]
  explanation: string
  answerType: AnswerType
  category: string
}

export enum AnswerType {
  "A" = 0,
  "B" = 1,
  "C" = 2,
  "D" = 3
}

export const categories = ['MANAGMENT', 'MARKETING', 'FINANCE', 'HOSPITIALITY', 'ENTREPRENEUR']

export const questions: Question[] = [
  {
    text: "1What is the primary purpose of Uber's Performance Indicators?",
    answers: [
      { text: "To measure driver performance"},
      { text: "To evaluate business metrics across different areas"},
      { text: "To track customer satisfaction"},
      { text: "To calculate employee bonuses"},
    ],
    explanation: "Uber's Performajhkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkknce Indicators are designed to evaluate various aspects of the business across different functional areas.",
      answerType: AnswerType.B,
      category: "MANAGMENT"
  },
  {
    text: "2What is the primary purpose of Uber's Performance?",
    answers: [
      { text: "To measure driver performance"},
      { text: "To evaluate business metrics across different areas"},
      { text: "To track customer satisfaction"},
      { text: "To calculate employee bonuses"},
    ],
    explanation: "Uber's Performance Indicators are designed to evaluate various aspects of the business across different functional areas.",
    answerType: AnswerType.B,
    category: "MANAGMENT"
  },
  {
    text: "3What is the primary purpose of Uber's Performance?",
    answers: [
      { text: "To measure driver performance"},
      { text: "To evaluate business metrics across different areas"},
      { text: "To track customer satisfaction"},
      { text: "To calculate employee bonuses"},
    ],
    explanation: "Uber's Performance Indicators are designed to evaluate various aspects of the business across different functional areas.",
    answerType: AnswerType.B,
    category: "MANAGMENT"
  },
  {
    text: "4What is the primary purpose of Uber's Performance?",
    answers: [
      { text: "To measure driver performance"},
      { text: "To evaluate business metrics across different areas"},
      { text: "To track customer satisfaction"},
      { text: "To calculate employee bonuses"},
    ],
    explanation: "Uber's Performance Indicators are designed to evaluate various aspects of the business across different functional areas.",
    answerType: AnswerType.B,
    category: "MANAGMENT"
  },
  {
    text: "5What is the primary purpose of Uber's Performance?",
    answers: [
      { text: "To measure driver performance"},
      { text: "To evaluate business metrics across different areas"},
      { text: "To track customer satisfaction"},
      { text: "To calculate employee bonuses"},
    ],
    explanation: "Uber's Performance Indicators are designed to evaluate various aspects of the business across different functional areas.",
    answerType: AnswerType.B,
    category: "MANAGMENT"
  }
  
]

