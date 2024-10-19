const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  ruleAST: Object, // AST for the rule
  createdAt: { type: Date, default: Date.now }
});

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
