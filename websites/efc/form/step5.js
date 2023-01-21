export const STEP5 = {
  question1: {
    label: "Current amount in cash, savings, and checking accounts",
    input: {
      type: "text",
      id: "parent.cashAmount",
    },
  },
  question2: {
    label: "Do your parents own a home?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-8-input",
          value: "yes",
        },
        {
          id: "mat-radio-9-input",
          value: "no",
        },
      ],
    },
  },
  question3: {
    label: "Current value of your parents' investments",
    input: {
      type: "text",
      id: "parent.investmentValueAmount",
    },
  },
  question4: {
    label: "Do your parents own a business?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-11-input",
          value: "yes",
        },
        {
          id: "mat-radio-12-input",
          value: "no",
        },
      ],
    },
  },
  question5: {
    label: "Do your parents own a farm?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-14-input",
          value: "yes",
        },
        {
          id: "mat-radio-15-input",
          value: "no",
        },
      ],
    },
  },
  question6: {
    label:
      "Do your parents own real estate other than a home, business, or farm?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-17-input",
          value: "yes",
        },
        {
          id: "mat-radio-18-input",
          value: "no",
        },
      ],
    },
  },
  question7: {
    label: "Medical and dental expenses not covered by insurance",
    input: {
      type: "text",
      id: "parent.medicalExpenseAmount",
    },
  },
};
