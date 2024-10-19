// Function to create an AST from the rule string
function createAST(ruleString) {
    const tokens = ruleString.split(/\s+(AND|OR)\s+/); // Split based on AND/OR
    let ast = null;
    let currentNode = null;
  
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
  
        if (token === "AND" || token === "OR") {
            currentNode = new Node(token); // Create operator node
            if (ast) {
                currentNode.left = ast; 
                ast = currentNode; // Update AST to current operator node
            }
        } else {
            const [key, operator, value] = parseCondition(token);
            const operandNode = new Node("operand", null, null, { key, operator, value });
            if (currentNode) {
                currentNode.right = operandNode;
                ast = currentNode; // Update AST after attaching the operand
                currentNode = null; // Reset the current operator
            } else {
                ast = operandNode; // Set root if it's the first operand
            }
        }
    }
    return ast;
  }
  
  // Improved condition parsing to handle both numbers and strings
  function parseCondition(condition) {
    // Match both numbers and strings (e.g., department = 'Sales')
    const match = condition.match(/(\w+)\s*([<>!=]=?|=)\s*(\d+|'[^']+')/);
    if (match) {
        const value = match[3].startsWith("'") ? match[3].replace(/'/g, '') : parseInt(match[3], 10); // Handle string or number
        return [match[1], match[2], value];
    }
    throw new Error("Invalid condition format: " + condition);
  }
  
  // AST Node class
  class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; 
        this.left = left; 
        this.right = right; 
        this.value = value; 
    }
  }
  
  // Function to evaluate the AST based on the input data
  function evaluateRule(ast, data) {
    if (!ast) return false;
  
    if (ast.type === "operand") {
        const { key, operator, value } = ast.value;
        console.log(`Evaluating: ${key} ${operator} ${value} against ${data[key]}`);
        return evaluateCondition(data[key], operator, value);
    }
  
    if (ast.type === "AND") {
        const leftResult = evaluateRule(ast.left, data);
        const rightResult = evaluateRule(ast.right, data);
        console.log(`AND result: ${leftResult} AND ${rightResult}`);
        return leftResult && rightResult;
    }
  
    if (ast.type === "OR") {
        const leftResult = evaluateRule(ast.left, data);
        const rightResult = evaluateRule(ast.right, data);
        console.log(`OR result: ${leftResult} OR ${rightResult}`);
        return leftResult || rightResult;
    }
  
    return false;
  }
  
  // Helper function to evaluate conditions (numbers or strings)
  function evaluateCondition(attributeValue, operator, conditionValue) {
    if (attributeValue === undefined) {
        console.log(`Attribute ${attributeValue} is undefined!`);
        return false;
    }
  
    switch (operator) {
        case '>':
            return attributeValue > conditionValue;
        case '<':
            return attributeValue < conditionValue;
        case '=':
            return attributeValue == conditionValue; // Loose comparison for strings or numbers
        case '!=':
            return attributeValue != conditionValue;
        case '>=':
            return attributeValue >= conditionValue;
        case '<=':
            return attributeValue <= conditionValue;
        default:
            console.log(`Unknown operator: ${operator}`);
            return false;
    }
  }
  
  // Event handler for rule form submission
  document.getElementById('ruleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const ruleString = document.getElementById('ruleInput').value;
    const ast = createAST(ruleString);
    console.log('Created AST:', JSON.stringify(ast, null, 2)); // Log the AST structure
    localStorage.setItem('ruleAST', JSON.stringify(ast));
    alert('Rule created successfully!');
  });
  
  // Event handler for evaluation form submission
  document.getElementById('evalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const dataInput = document.getElementById('dataInput').value;
  
    let data;
    try {
        data = JSON.parse(dataInput);
    } catch (error) {
        alert('Invalid JSON data format!');
        return;
    }
  
    const ruleAST = JSON.parse(localStorage.getItem('ruleAST'));
    console.log('Evaluating rule against data:', ruleAST, data);
    const isEligible = evaluateRule(ruleAST, data);
    document.getElementById('result').innerText = isEligible ? 'Eligible' : 'Not Eligible';
  });
  