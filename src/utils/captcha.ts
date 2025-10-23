/**
 * Arithmetic Captcha Generator
 * Generates random arithmetic problems for login verification
 */

export interface Captcha {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '×';
  question: string;
  answer: number;
  timestamp: number;
}

/**
 * Generate a random number based on difficulty level
 * Easy: 1-10, Medium: 1-20
 */
function getRandomNumber(difficulty: 'easy' | 'medium'): number {
  const max = difficulty === 'easy' ? 10 : 20;
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Generate a random operation
 * Returns one of: +, -, ×
 */
function getRandomOperation(): '+' | '-' | '×' {
  const operations = ['+', '-', '×'] as const;
  return operations[Math.floor(Math.random() * operations.length)];
}

/**
 * Generate a random difficulty level
 * Mix between Easy and Medium
 */
function getRandomDifficulty(): 'easy' | 'medium' {
  return Math.random() > 0.5 ? 'easy' : 'medium';
}

/**
 * Calculate the answer based on operation
 */
function calculateAnswer(num1: number, num2: number, operation: '+' | '-' | '×'): number {
  switch (operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    default:
      return 0;
  }
}

/**
 * Generate a new captcha question
 */
export function generateCaptcha(): Captcha {
  const difficulty = getRandomDifficulty();
  const num1 = getRandomNumber(difficulty);
  const num2 = getRandomNumber(difficulty);
  const operation = getRandomOperation();
  const answer = calculateAnswer(num1, num2, operation);

  // Create a unique ID for this captcha
  const id = `captcha_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const question = `What is ${num1} ${operation} ${num2}?`;

  return {
    id,
    num1,
    num2,
    operation,
    question,
    answer,
    timestamp: Date.now(),
  };
}

/**
 * Validate captcha answer
 */
export function validateCaptcha(captcha: Captcha, userAnswer: string | number): boolean {
  const answer = typeof userAnswer === 'string' ? parseInt(userAnswer, 10) : userAnswer;
  return !isNaN(answer) && answer === captcha.answer;
}

/**
 * Format captcha for display (remove sensitive data)
 */
export function formatCaptchaForDisplay(captcha: Captcha) {
  return {
    id: captcha.id,
    question: captcha.question,
    // Don't expose the answer in the display version
  };
}
