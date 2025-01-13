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

export const categories = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']

export const questions: Question[] = [
  {
    text: "What type of business ownership should Jean, Keisha, and Kyle consider if they are concerned about the higher tax rate for corporations as well as double taxation on corporate profits and dividends paid to stockholders?",
    answers: [
      { text: "'S' corporation"},
      { text: "Partnership"},
      { text: "Open corporation"},
      { text: "Close corporation"}
    ],
    explanation: "'S' corporation. This form of business ownership limits personal liability and offers a lower rate of taxation. Profits go directly to stockholders who pay taxes as individuals. This avoids the problem of double taxation on corporate profits.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Brandon has been given a 385-page report and does not have time to review the entire document, but he does need to understand specific information that is included in the report. What section of the report will guide Brandon to the information he needs?",
    answers: [
      { text: "Analysis"},
      { text: "Bibliography"},
      { text: "Appendices"},
      { text: "Table of contents"}
    ],
    explanation: "Table of contents. When trying to locate specific information from a lengthy document or a book, it often saves time to first look at the table of contents. The table of contents is the portion of the text in which the sections are listed with their page numbers for easy access.",
    answerType: AnswerType.D,
    category: "MANAGEMENT"
  },
  {
    text: "To be reimbursed for business expenses, Luke must obtain and complete an expense-reimbursement form, attach the original transaction receipts to the completed form, and submit the documentation to his manager for approval. What is Luke doing?",
    answers: [
      { text: "Following company procedures"},
      { text: "Developing company policies"},
      { text: "Evaluating company feedback"},
      { text: "Assessing company guidelines"}
    ],
    explanation: "Following company procedures. Policies are the general rules to be followed by company personnel. A procedure is the step-by-step process that personnel follow in performing a specific task.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What should employees do to help their company maintain its competitive advantage?",
    answers: [
      { text: "Set personal goals"},
      { text: "Follow business trends"},
      { text: "Control internal resources"},
      { text: "Monitor the competition"}
    ],
    explanation: "Monitor the competition. To maintain a competitive advantage, businesses need to know what their competitors are doing. This involves analyzing competitors' products, prices, distribution methods, and promotional activities.",
    answerType: AnswerType.D,
    category: "MANAGEMENT"
  },
  {
    text: "A business's employees are more likely to achieve optimal productivity levels when they",
    answers: [
      { text: "Work independently"},
      { text: "Share common goals"},
      { text: "Avoid taking risks"},
      { text: "Follow strict rules"}
    ],
    explanation: "Share common goals. When employees share common goals, they understand the company's objectives and work together to achieve them. This helps create a positive work environment and increases productivity.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "When establishing security procedures for computer systems, businesses should",
    answers: [
      { text: "Limit accessibility"},
      { text: "Share passwords"},
      { text: "Allow remote access"},
      { text: "Update software annually"}
    ],
    explanation: "Limit accessibility. To protect computer systems and data, businesses should limit access to authorized personnel only. This helps prevent unauthorized use and protects sensitive information.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a reason why businesses often provide employees with instruction manuals:",
    answers: [
      { text: "To reduce expenses"},
      { text: "To ensure consistency"},
      { text: "To increase production"},
      { text: "To minimize competition"}
    ],
    explanation: "To ensure consistency. Instruction manuals help ensure that all employees follow the same procedures and standards, which leads to consistent quality in products and services.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "A retail store has a policy that requires employees to greet customers within 30 seconds of entering the store. This is an example of a(n)",
    answers: [
      { text: "Operating procedure"},
      { text: "Quality standard"},
      { text: "Production goal"},
      { text: "Service objective"}
    ],
    explanation: "Service objective. A service objective is a specific goal related to customer service. The 30-second greeting policy is designed to ensure prompt customer acknowledgment and service.",
    answerType: AnswerType.D,
    category: "MANAGEMENT"
  },
  {
    text: "What type of business activity involves obtaining resources from vendors?",
    answers: [
      { text: "Marketing"},
      { text: "Purchasing"},
      { text: "Production"},
      { text: "Distribution"}
    ],
    explanation: "Purchasing. The purchasing function involves acquiring the resources (materials, supplies, equipment) needed by the business from vendors or suppliers.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "A manager who delegates work effectively is likely to",
    answers: [
      { text: "Increase productivity"},
      { text: "Reduce communication"},
      { text: "Eliminate training"},
      { text: "Lower standards"}
    ],
    explanation: "Increase productivity. Effective delegation allows managers to focus on more important tasks while empowering employees, which typically leads to increased overall productivity.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "A primary reason why businesses hold staff meetings is to",
    answers: [
      { text: "Share information"},
      { text: "Reduce expenses"},
      { text: "Monitor competitors"},
      { text: "Increase sales"}
    ],
    explanation: "Share information. Staff meetings are primarily held to communicate important information, updates, and changes to employees, ensuring everyone is informed and aligned.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is one way that businesses can protect their confidential information?",
    answers: [
      { text: "Store data in multiple locations"},
      { text: "Require nondisclosure agreements"},
      { text: "Allow unrestricted access"},
      { text: "Share passwords freely"}
    ],
    explanation: "Require nondisclosure agreements. NDAs are legal documents that prohibit employees from sharing confidential business information with unauthorized parties.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective business goals:",
    answers: [
      { text: "Complex"},
      { text: "Measurable"},
      { text: "Unrealistic"},
      { text: "Indefinite"}
    ],
    explanation: "Measurable. Effective business goals should be measurable so progress can be tracked and success can be determined objectively.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "A company's organizational chart primarily shows",
    answers: [
      { text: "Work schedules"},
      { text: "Reporting relationships"},
      { text: "Employee benefits"},
      { text: "Production processes"}
    ],
    explanation: "Reporting relationships. An organizational chart illustrates the hierarchy and reporting relationships between different positions and departments within a company.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of maintaining business records?",
    answers: [
      { text: "To track information"},
      { text: "To increase sales"},
      { text: "To motivate employees"},
      { text: "To reduce expenses"}
    ],
    explanation: "To track information. Business records are maintained to document and track important information about business operations, transactions, and activities.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is an example of a business expense?",
    answers: [
      { text: "Revenue"},
      { text: "Profit"},
      { text: "Utilities"},
      { text: "Income"}
    ],
    explanation: "Utilities. Utility costs are operating expenses that businesses must pay to maintain their operations.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What type of business risk involves the possibility of property damage?",
    answers: [
      { text: "Financial"},
      { text: "Physical"},
      { text: "Market"},
      { text: "Human"}
    ],
    explanation: "Physical. Physical risks involve potential damage to tangible assets such as buildings, equipment, and inventory.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "A company's mission statement should describe its",
    answers: [
      { text: "Daily tasks"},
      { text: "Basic purpose"},
      { text: "Employee benefits"},
      { text: "Production methods"}
    ],
    explanation: "Basic purpose. A mission statement outlines the fundamental purpose and primary objectives of the organization.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a business plan?",
    answers: [
      { text: "To guide operations"},
      { text: "To increase taxes"},
      { text: "To reduce competition"},
      { text: "To eliminate risk"}
    ],
    explanation: "To guide operations. A business plan serves as a roadmap for the company, outlining goals, strategies, and operational plans.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective leadership?",
    answers: [
      { text: "Avoiding decisions"},
      { text: "Clear communication"},
      { text: "Limited delegation"},
      { text: "Restricted feedback"}
    ],
    explanation: "Clear communication. Effective leaders must be able to communicate clearly with their team to ensure understanding and proper execution of tasks.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which factor most influences a business's organizational structure?",
    answers: [
      { text: "Location"},
      { text: "Strategy"},
      { text: "Equipment"},
      { text: "Competition"}
    ],
    explanation: "Strategy. A company's organizational structure should align with and support its business strategy and goals.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "A company implements a new quality control system. This is an example of",
    answers: [
      { text: "Business process improvement"},
      { text: "Market research"},
      { text: "Financial planning"},
      { text: "Human resource development"}
    ],
    explanation: "Business process improvement. Implementing new quality control measures is a way to improve business processes and operations.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a budget?",
    answers: [
      { text: "To plan spending"},
      { text: "To increase sales"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To plan spending. Budgets are financial planning tools used to allocate resources and control spending.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is an example of a fixed cost?",
    answers: [
      { text: "Raw materials"},
      { text: "Sales commissions"},
      { text: "Rent payments"},
      { text: "Shipping charges"}
    ],
    explanation: "Rent payments. Fixed costs remain constant regardless of production or sales volume, and rent is a typical fixed cost.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What type of software would a business use to track inventory?",
    answers: [
      { text: "Word processing"},
      { text: "Presentation"},
      { text: "Database"},
      { text: "Graphics"}
    ],
    explanation: "Database. Database software is used to store and track inventory data and other business records.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "A business's code of ethics should address",
    answers: [
      { text: "Expected behavior"},
      { text: "Production quotas"},
      { text: "Marketing strategies"},
      { text: "Sales goals"}
    ],
    explanation: "Expected behavior. A code of ethics outlines the expected standards of behavior and conduct for employees.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of performance evaluations?",
    answers: [
      { text: "To reduce wages"},
      { text: "To assess work"},
      { text: "To increase sales"},
      { text: "To eliminate jobs"}
    ],
    explanation: "To assess work. Performance evaluations are used to assess employee performance and provide feedback.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which management function involves directing and motivating employees?",
    answers: [
      { text: "Planning"},
      { text: "Organizing"},
      { text: "Leading"},
      { text: "Controlling"}
    ],
    explanation: "Leading. The leading function involves directing, motivating, and influencing employees to achieve organizational goals.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a company policy manual?",
    answers: [
      { text: "To document rules"},
      { text: "To increase profits"},
      { text: "To reduce expenses"},
      { text: "To track inventory"}
    ],
    explanation: "To document rules. A policy manual documents company rules, procedures, and guidelines for employees.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a benefit of teamwork?",
    answers: [
      { text: "Reduced communication"},
      { text: "Increased efficiency"},
      { text: "Lower quality"},
      { text: "Less creativity"}
    ],
    explanation: "Increased efficiency. Effective teamwork typically leads to increased efficiency and productivity.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a SWOT analysis?",
    answers: [
      { text: "To evaluate business conditions"},
      { text: "To increase sales revenue"},
      { text: "To reduce operating costs"},
      { text: "To track inventory levels"}
    ],
    explanation: "To evaluate business conditions. SWOT analysis examines Strengths, Weaknesses, Opportunities, and Threats facing a business.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational structure groups workers by function?",
    answers: [
      { text: "Matrix"},
      { text: "Functional"},
      { text: "Divisional"},
      { text: "Network"}
    ],
    explanation: "Functional. A functional structure groups employees by their specialized function or department.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the first step in the planning process?",
    answers: [
      { text: "Implementing actions"},
      { text: "Setting objectives"},
      { text: "Evaluating results"},
      { text: "Developing budgets"}
    ],
    explanation: "Setting objectives. The planning process begins with establishing clear objectives or goals.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective goals?",
    answers: [
      { text: "Vague"},
      { text: "Unrealistic"},
      { text: "Time-bound"},
      { text: "Unmeasurable"}
    ],
    explanation: "Time-bound. Effective goals should have a specific timeframe for completion.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What type of power comes from a person's position in an organization?",
    answers: [
      { text: "Personal"},
      { text: "Expert"},
      { text: "Legitimate"},
      { text: "Referent"}
    ],
    explanation: "Legitimate. Legitimate power comes from one's formal position or authority in an organization.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of delegation?",
    answers: [
      { text: "To avoid responsibility"},
      { text: "To increase efficiency"},
      { text: "To reduce communication"},
      { text: "To eliminate training"}
    ],
    explanation: "To increase efficiency. Delegation helps increase organizational efficiency by distributing work appropriately.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which control method involves comparing actual performance to standards?",
    answers: [
      { text: "Feedforward"},
      { text: "Concurrent"},
      { text: "Feedback"},
      { text: "Preventive"}
    ],
    explanation: "Feedback. Feedback control involves measuring actual performance against predetermined standards.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of job descriptions?",
    answers: [
      { text: "To define responsibilities"},
      { text: "To increase wages"},
      { text: "To reduce turnover"},
      { text: "To eliminate training"}
    ],
    explanation: "To define responsibilities. Job descriptions outline the duties and responsibilities of specific positions.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which leadership style involves sharing decision-making with subordinates?",
    answers: [
      { text: "Autocratic"},
      { text: "Participative"},
      { text: "Laissez-faire"},
      { text: "Directive"}
    ],
    explanation: "Participative. Participative leadership involves including employees in decision-making processes.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of an organizational chart?",
    answers: [
      { text: "To show relationships"},
      { text: "To increase profits"},
      { text: "To reduce costs"},
      { text: "To track inventory"}
    ],
    explanation: "To show relationships. Organizational charts illustrate reporting relationships and hierarchy within an organization.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of project management?",
    answers: [
      { text: "To coordinate resources"},
      { text: "To increase sales"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To coordinate resources. Project management focuses on coordinating resources, time, and activities to achieve specific project goals.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a short-term business goal?",
    answers: [
      { text: "Market expansion"},
      { text: "Increase monthly sales"},
      { text: "Industry leadership"},
      { text: "Brand development"}
    ],
    explanation: "Increase monthly sales. Short-term goals are typically achievable within a year or less.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is a primary benefit of effective time management?",
    answers: [
      { text: "Reduced productivity"},
      { text: "Increased efficiency"},
      { text: "Lower quality"},
      { text: "More stress"}
    ],
    explanation: "Increased efficiency. Good time management leads to better efficiency and productivity.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational culture emphasizes stability and control?",
    answers: [
      { text: "Adhocracy"},
      { text: "Clan"},
      { text: "Hierarchy"},
      { text: "Market"}
    ],
    explanation: "Hierarchy. Hierarchical cultures emphasize order, stability, and control through clear structures and procedures.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a contingency plan?",
    answers: [
      { text: "To handle emergencies"},
      { text: "To increase profits"},
      { text: "To reduce expenses"},
      { text: "To motivate employees"}
    ],
    explanation: "To handle emergencies. Contingency plans are backup plans for dealing with unexpected situations or emergencies.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which management function involves measuring performance against standards?",
    answers: [
      { text: "Planning"},
      { text: "Organizing"},
      { text: "Leading"},
      { text: "Controlling"}
    ],
    explanation: "Controlling. The controlling function involves monitoring and measuring performance against established standards.",
    answerType: AnswerType.D,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of an employee handbook?",
    answers: [
      { text: "To communicate policies"},
      { text: "To increase sales"},
      { text: "To reduce costs"},
      { text: "To track inventory"}
    ],
    explanation: "To communicate policies. Employee handbooks communicate company policies, procedures, and expectations to employees.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective feedback?",
    answers: [
      { text: "Vague"},
      { text: "Specific"},
      { text: "Delayed"},
      { text: "Personal"}
    ],
    explanation: "Specific. Effective feedback should be specific and focused on behaviors or performance.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a budget variance analysis?",
    answers: [
      { text: "To identify differences"},
      { text: "To increase spending"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To identify differences. Budget variance analysis identifies differences between planned and actual results.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a benefit of diversity in the workplace?",
    answers: [
      { text: "Reduced creativity"},
      { text: "Increased perspectives"},
      { text: "Lower productivity"},
      { text: "Less innovation"}
    ],
    explanation: "Increased perspectives. Workplace diversity brings different perspectives and ideas, enhancing creativity and problem-solving.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a mission statement?",
    answers: [
      { text: "Define purpose"},
      { text: "Track inventory"},
      { text: "Reduce costs"},
      { text: "Increase sales"}
    ],
    explanation: "Define purpose. A mission statement defines the fundamental purpose and goals of an organization.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which leadership style is best suited for experienced, skilled employees?",
    answers: [
      { text: "Autocratic"},
      { text: "Delegative"},
      { text: "Directive"},
      { text: "Coercive"}
    ],
    explanation: "Delegative. Delegative leadership works well with experienced employees who can work independently.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of performance standards?",
    answers: [
      { text: "To measure results"},
      { text: "To increase costs"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To measure results. Performance standards provide benchmarks for measuring and evaluating results.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational structure is most flexible?",
    answers: [
      { text: "Matrix"},
      { text: "Hierarchical"},
      { text: "Bureaucratic"},
      { text: "Traditional"}
    ],
    explanation: "Matrix. Matrix structures are more flexible and can adapt quickly to changing conditions.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of job rotation?",
    answers: [
      { text: "To develop skills"},
      { text: "To reduce wages"},
      { text: "To increase costs"},
      { text: "To eliminate positions"}
    ],
    explanation: "To develop skills. Job rotation helps employees develop new skills and understand different aspects of the organization.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective goals?",
    answers: [
      { text: "Realistic"},
      { text: "Vague"},
      { text: "Unmeasurable"},
      { text: "Open-ended"}
    ],
    explanation: "Realistic. Effective goals should be achievable and realistic within given constraints.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of an organizational structure?",
    answers: [
      { text: "To coordinate work"},
      { text: "To increase costs"},
      { text: "To reduce profits"},
      { text: "To eliminate jobs"}
    ],
    explanation: "To coordinate work. Organizational structure helps coordinate work activities and reporting relationships.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a benefit of written communication?",
    answers: [
      { text: "Permanent record"},
      { text: "Immediate feedback"},
      { text: "Personal touch"},
      { text: "Nonverbal cues"}
    ],
    explanation: "Permanent record. Written communication provides a permanent record for future reference.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a business plan?",
    answers: [
      { text: "Guide operations"},
      { text: "Increase taxes"},
      { text: "Reduce staff"},
      { text: "Eliminate competition"}
    ],
    explanation: "Guide operations. A business plan provides direction and guidance for business operations and strategy.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which management style emphasizes employee involvement in decision-making?",
    answers: [
      { text: "Autocratic"},
      { text: "Participative"},
      { text: "Directive"},
      { text: "Authoritarian"}
    ],
    explanation: "Participative. Participative management involves employees in decision-making processes.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of project management?",
    answers: [
      { text: "To coordinate resources"},
      { text: "To increase sales"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To coordinate resources. Project management focuses on coordinating resources, time, and activities to achieve specific project goals.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a short-term business goal?",
    answers: [
      { text: "Market expansion"},
      { text: "Increase monthly sales"},
      { text: "Industry leadership"},
      { text: "Brand development"}
    ],
    explanation: "Increase monthly sales. Short-term goals are typically achievable within a year or less.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is a primary benefit of effective time management?",
    answers: [
      { text: "Reduced productivity"},
      { text: "Increased efficiency"},
      { text: "Lower quality"},
      { text: "More stress"}
    ],
    explanation: "Increased efficiency. Good time management leads to better efficiency and productivity.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational culture emphasizes stability and control?",
    answers: [
      { text: "Adhocracy"},
      { text: "Clan"},
      { text: "Hierarchy"},
      { text: "Market"}
    ],
    explanation: "Hierarchy. Hierarchical cultures emphasize order, stability, and control through clear structures and procedures.",
    answerType: AnswerType.C,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a contingency plan?",
    answers: [
      { text: "To handle emergencies"},
      { text: "To increase profits"},
      { text: "To reduce expenses"},
      { text: "To motivate employees"}
    ],
    explanation: "To handle emergencies. Contingency plans are backup plans for dealing with unexpected situations or emergencies.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which management function involves measuring performance against standards?",
    answers: [
      { text: "Planning"},
      { text: "Organizing"},
      { text: "Leading"},
      { text: "Controlling"}
    ],
    explanation: "Controlling. The controlling function involves monitoring and measuring performance against established standards.",
    answerType: AnswerType.D,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of an employee handbook?",
    answers: [
      { text: "To communicate policies"},
      { text: "To increase sales"},
      { text: "To reduce costs"},
      { text: "To track inventory"}
    ],
    explanation: "To communicate policies. Employee handbooks communicate company policies, procedures, and expectations to employees.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective feedback?",
    answers: [
      { text: "Vague"},
      { text: "Specific"},
      { text: "Delayed"},
      { text: "Personal"}
    ],
    explanation: "Specific. Effective feedback should be specific and focused on behaviors or performance.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a budget variance analysis?",
    answers: [
      { text: "To identify differences"},
      { text: "To increase spending"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To identify differences. Budget variance analysis identifies differences between planned and actual results.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a benefit of diversity in the workplace?",
    answers: [
      { text: "Reduced creativity"},
      { text: "Increased perspectives"},
      { text: "Lower productivity"},
      { text: "Less innovation"}
    ],
    explanation: "Increased perspectives. Workplace diversity brings different perspectives and ideas, enhancing creativity and problem-solving.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the purpose of a mission statement?",
    answers: [
      { text: "Define purpose"},
      { text: "Track inventory"},
      { text: "Reduce costs"},
      { text: "Increase sales"}
    ],
    explanation: "Define purpose. A mission statement defines the fundamental purpose and goals of an organization.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which leadership style is best suited for experienced, skilled employees?",
    answers: [
      { text: "Autocratic"},
      { text: "Delegative"},
      { text: "Directive"},
      { text: "Coercive"}
    ],
    explanation: "Delegative. Delegative leadership works well with experienced employees who can work independently.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of performance standards?",
    answers: [
      { text: "To measure results"},
      { text: "To increase costs"},
      { text: "To reduce staff"},
      { text: "To eliminate competition"}
    ],
    explanation: "To measure results. Performance standards provide benchmarks for measuring and evaluating results.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational structure is most flexible?",
    answers: [
      { text: "Matrix"},
      { text: "Hierarchical"},
      { text: "Bureaucratic"},
      { text: "Traditional"}
    ],
    explanation: "Matrix. Matrix structures are more flexible and can adapt quickly to changing conditions.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of job rotation?",
    answers: [
      { text: "To develop skills"},
      { text: "To reduce wages"},
      { text: "To increase costs"},
      { text: "To eliminate positions"}
    ],
    explanation: "To develop skills. Job rotation helps employees develop new skills and understand different aspects of the organization.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a characteristic of effective goals?",
    answers: [
      { text: "Realistic"},
      { text: "Vague"},
      { text: "Unmeasurable"},
      { text: "Open-ended"}
    ],
    explanation: "Realistic. Effective goals should be achievable and realistic within given constraints.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of an organizational structure?",
    answers: [
      { text: "To coordinate work"},
      { text: "To increase costs"},
      { text: "To reduce profits"},
      { text: "To eliminate jobs"}
    ],
    explanation: "To coordinate work. Organizational structure helps coordinate work activities and reporting relationships.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which of the following is a benefit of written communication?",
    answers: [
      { text: "Permanent record"},
      { text: "Immediate feedback"},
      { text: "Personal touch"},
      { text: "Nonverbal cues"}
    ],
    explanation: "Permanent record. Written communication provides a permanent record for future reference.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a business plan?",
    answers: [
      { text: "Guide operations"},
      { text: "Increase taxes"},
      { text: "Reduce staff"},
      { text: "Eliminate competition"}
    ],
    explanation: "Guide operations. A business plan provides direction and guidance for business operations and strategy.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which management style emphasizes employee involvement in decision-making?",
    answers: [
      { text: "Autocratic"},
      { text: "Participative"},
      { text: "Directive"},
      { text: "Authoritarian"}
    ],
    explanation: "Participative. Participative management involves employees in decision-making processes.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of management by objectives (MBO)?",
    answers: [
      { text: "Set mutual goals"},
      { text: "Reduce employees"},
      { text: "Increase costs"},
      { text: "Eliminate feedback"}
    ],
    explanation: "Set mutual goals. MBO involves managers and employees jointly setting objectives and evaluating progress.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which leadership trait is most important for innovation?",
    answers: [
      { text: "Risk aversion"},
      { text: "Creativity"},
      { text: "Rigidity"},
      { text: "Conformity"}
    ],
    explanation: "Creativity. Creative leadership is essential for fostering innovation in organizations.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of a balanced scorecard?",
    answers: [
      { text: "Measure performance"},
      { text: "Increase costs"},
      { text: "Reduce staff"},
      { text: "Eliminate planning"}
    ],
    explanation: "Measure performance. Balanced scorecards measure organizational performance across multiple dimensions.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational change is most comprehensive?",
    answers: [
      { text: "Incremental"},
      { text: "Transformational"},
      { text: "Technical"},
      { text: "Structural"}
    ],
    explanation: "Transformational. Transformational change involves fundamental shifts in strategy, culture, and operations.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of succession planning?",
    answers: [
      { text: "Ensure continuity"},
      { text: "Reduce wages"},
      { text: "Increase turnover"},
      { text: "Eliminate positions"}
    ],
    explanation: "Ensure continuity. Succession planning ensures leadership continuity by developing future leaders.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which decision-making approach is best for complex problems?",
    answers: [
      { text: "Intuitive"},
      { text: "Rational"},
      { text: "Impulsive"},
      { text: "Random"}
    ],
    explanation: "Rational. Rational decision-making is best for analyzing complex problems systematically.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of organizational development?",
    answers: [
      { text: "Improve effectiveness"},
      { text: "Reduce employees"},
      { text: "Increase costs"},
      { text: "Eliminate training"}
    ],
    explanation: "Improve effectiveness. Organizational development aims to improve organizational effectiveness and health.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of power relies on rewards?",
    answers: [
      { text: "Coercive"},
      { text: "Reward"},
      { text: "Expert"},
      { text: "Legitimate"}
    ],
    explanation: "Reward. Reward power is based on the ability to provide valued rewards to others.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of a disaster recovery plan?",
    answers: [
      { text: "Ensure business continuity"},
      { text: "Increase profits"},
      { text: "Reduce costs"},
      { text: "Eliminate competition"}
    ],
    explanation: "Ensure business continuity. Disaster recovery plans ensure business operations can continue after disasters.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which management style emphasizes rules and procedures?",
    answers: [
      { text: "Laissez-faire"},
      { text: "Bureaucratic"},
      { text: "Democratic"},
      { text: "Transformational"}
    ],
    explanation: "Bureaucratic. Bureaucratic management emphasizes following established rules and procedures.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of benchmarking?",
    answers: [
      { text: "Compare performance"},
      { text: "Increase costs"},
      { text: "Reduce staff"},
      { text: "Eliminate competition"}
    ],
    explanation: "Compare performance. Benchmarking compares performance against industry best practices.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of organizational structure best supports innovation?",
    answers: [
      { text: "Bureaucratic"},
      { text: "Organic"},
      { text: "Hierarchical"},
      { text: "Mechanical"}
    ],
    explanation: "Organic. Organic structures are flexible and adaptable, supporting innovation.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of conflict management?",
    answers: [
      { text: "Resolve differences"},
      { text: "Increase tension"},
      { text: "Avoid interaction"},
      { text: "Eliminate diversity"}
    ],
    explanation: "Resolve differences. Conflict management aims to resolve differences constructively.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which leadership style focuses on future vision?",
    answers: [
      { text: "Transactional"},
      { text: "Transformational"},
      { text: "Autocratic"},
      { text: "Bureaucratic"}
    ],
    explanation: "Transformational. Transformational leadership focuses on inspiring a vision for the future.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of change management?",
    answers: [
      { text: "Facilitate transition"},
      { text: "Increase resistance"},
      { text: "Reduce communication"},
      { text: "Eliminate feedback"}
    ],
    explanation: "Facilitate transition. Change management helps organizations transition through changes effectively.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which type of goal setting is most effective?",
    answers: [
      { text: "Vague"},
      { text: "SMART"},
      { text: "Unrealistic"},
      { text: "Open-ended"}
    ],
    explanation: "SMART. SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) are most effective.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the primary purpose of knowledge management?",
    answers: [
      { text: "Share information"},
      { text: "Restrict access"},
      { text: "Reduce learning"},
      { text: "Eliminate collaboration"}
    ],
    explanation: "Share information. Knowledge management facilitates sharing and using organizational knowledge.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which communication channel is best for complex messages?",
    answers: [
      { text: "Text message"},
      { text: "Face-to-face"},
      { text: "Memo"},
      { text: "Email"}
    ],
    explanation: "Face-to-face. Face-to-face communication is best for conveying complex information.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  },
  {
    text: "What is the main purpose of strategic alliances?",
    answers: [
      { text: "Share resources"},
      { text: "Increase competition"},
      { text: "Reduce cooperation"},
      { text: "Eliminate partners"}
    ],
    explanation: "Share resources. Strategic alliances allow organizations to share resources and capabilities.",
    answerType: AnswerType.A,
    category: "MANAGEMENT"
  },
  {
    text: "Which control type focuses on financial measures?",
    answers: [
      { text: "Operational"},
      { text: "Financial"},
      { text: "Behavioral"},
      { text: "Cultural"}
    ],
    explanation: "Financial. Financial controls monitor and evaluate financial performance measures.",
    answerType: AnswerType.B,
    category: "MANAGEMENT"
  }
  
  
  
]

