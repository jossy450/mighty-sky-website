/**
 * Priority detection utility for customer service requests.
 * Analyzes question text and assigns priority based on keyword matching.
 */

type Priority = "high" | "medium" | "low";

const HIGH_PRIORITY_KEYWORDS = [
  "urgent",
  "emergency",
  "asap",
  "critical",
  "broken",
  "not working",
  "error",
  "bug",
  "crash",
  "down",
  "failed",
  "immediately",
];

const MEDIUM_PRIORITY_KEYWORDS = [
  "help",
  "issue",
  "problem",
  "question",
  "concern",
  "trouble",
  "difficulty",
  "support",
];

/**
 * Detect the priority of a customer service request based on keywords in the question.
 * @param question - The customer's question text
 * @returns The detected priority level (high, medium, or low)
 */
export function detectPriority(question: string): Priority {
  const lowerQuestion = question.toLowerCase();

  // Check for high priority keywords first
  for (const keyword of HIGH_PRIORITY_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      return "high";
    }
  }

  // Check for medium priority keywords
  for (const keyword of MEDIUM_PRIORITY_KEYWORDS) {
    if (lowerQuestion.includes(keyword)) {
      return "medium";
    }
  }

  // Default to low priority
  return "low";
}
