const EFC_FORM_STEP1 = {
  path: "/app/efc/start",
  steps: [
    {
      type: "input",
      target: "#student.firstName",
      value: "Kevin",
    },
    {
      type: "select",
      target: "#student.completingCalculator",
      value: "3",
    },
    {
      type: "select",
      target: "#student.efcFormula",
      value: "3",
    },
  ],
};

const EFC_FORM_STEP2 = {
  path: "/app/efc/dependency",
  steps: [
    {
      label: "Your year of birth",
      type: "select",
      target: "#student.birthYear",
      value: "1999",
    },
    {
      label: "College grade level in the coming school year?",
      type: "select",
      target: "#student.yearInCollege",
      value: "3",
    },
    {
      label: "Your marital status",
      type: "select",
      target: "#student.maritalStatusCode",
      value: "3",
    },
    {
      label: "Do you have any dependent children?",
      type: "radio",
      target: "",
    },
  ],
};

export const FORM_FIELDS_MAP = {
  step1: EFC_FORM_STEP1,
  step2: EFC_FORM_STEP2,
};
