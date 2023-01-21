import express from 'express';
import { calculateEFC } from './websites/efc/index.js';
import { stepData } from './websites/efc/form/steps/steps.js';

const app = express();
const PORT = 5000;

// These values will be generated from user form onboarding.

app.get('/', async (req, res) => {
  res.json(JSON.stringify(stepData));
});

app.listen(PORT || '5000', () => {
  console.log(`Running on PORT ${PORT}`);
});

calculateEFC();
