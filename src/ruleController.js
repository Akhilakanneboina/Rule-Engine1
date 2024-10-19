const express = require('express');
const router = express.Router();
const Rule = require('./ruleModel');

// Helper class for AST
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

// Create a rule from a string (simple version)
router.post('/create', async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ruleAST = createRule(ruleString); // Assume createRule is a helper function
    const rule = new Rule({ ruleAST });
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluate a rule with input data
router.post('/evaluate', async (req, res) => {
  try {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    
    const isEligible = evaluateRule(rule.ruleAST, data);
    res.json({ eligible: isEligible });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to create AST from rule string
function createRule(ruleString) {
  // Simple example: create AST for (age > 30)
  const root = new Node("AND");
  root.left = new Node("operand", null, null, { age: "> 30" });
  root.right = new Node("operand", null, null, { salary: "> 50000" });
  return root;
}

// Helper function to evaluate AST
function evaluateRule(ast, data) {
  if (ast.type === "operand") {
    const [key, operator] = Object.entries(ast.value)[0];
    return evaluateCondition(key, operator, data[key]);
  }
  if (ast.type === "AND") {
    return evaluateRule(ast.left, data) && evaluateRule(ast.right, data);
  }
  if (ast.type === "OR") {
    return evaluateRule(ast.left, data) || evaluateRule(ast.right, data);
  }
}

function evaluateCondition(key, operator, value) {
  if (operator === ">") return value > 30;
  return true;
  if (operator === "<") return value < 30;
  return false;
}

module.exports = router;
console.log(ruleAST); // Add this line to see the generated AST

