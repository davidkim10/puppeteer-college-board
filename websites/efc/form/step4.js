export const STEP4 = {
  question1: {
    label: "Your parents' combined adjusted gross income (AGI)",
    input: {
      type: "text",
      id: "parent.agi",
    },
  },
  question2: {
    label: "Your parents' federal tax payment",
    input: {
      type: "text",
      id: "parent.federalTaxes",
    },
  },
  question3: {
    label: "Work income from one parent",
    input: {
      type: "text",
      id: "parent.parent1WorkIncome",
    },
  },
  question4: {
    label: "Taxable combat pay included in AGI",
    input: {
      type: "text",
      id: "parent.combatPay",
    },
  },
  question5: {
    label: "Educational tax credits your parents received",
    input: {
      type: "text",
      id: "parent.educationTaxCreditAmount",
    },
  },
  question6: {
    label:
      "Untaxed income, benefits, and retirement plan contributions by your parents",
    input: {
      type: "text",
      id: "parent.untaxedIncome",
    },
  },
  question7: {
    label: "Untaxed Social Security benefits",
    input: {
      type: "text",
      id: "parent.socialSecurity",
    },
  },
  question8: {
    label: "Receive federal means-tested benefits?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-2-input",
          value: "yes",
        },
        {
          id: "mat-radio-3-input",
          value: "no",
        },
      ],
    },
  },
  question9: {
    label: "Dislocated worker?",
    input: {
      type: "radio",
      id: null,
      options: [
        {
          id: "mat-radio-5-input",
          value: "yes",
        },
        {
          id: "mat-radio-6-input",
          value: "no",
        },
      ],
    },
  },
};
