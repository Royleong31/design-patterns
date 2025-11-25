/**
 * INTERPRETER PATTERN - Example
 *
 * Demonstrates the Search Query interpreter in action.
 */

import {
  SearchEngine,
  createSampleData,
  formatSearchResults,
  FieldExpression,
  AndExpression,
  OrExpression,
  NotExpression,
  ComparisonExpression,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("INTERPRETER PATTERN - Search Query Parser");
  console.log("=".repeat(60));
  console.log();

  // Create search engine and load data
  console.log("1. Setting up search engine...");
  const engine = new SearchEngine();
  engine.loadData(createSampleData());
  console.log();

  // Simple field search
  console.log("2. SIMPLE FIELD SEARCH");
  console.log("-".repeat(40));
  const result1 = engine.search("author:john");
  console.log(formatSearchResults(result1));
  console.log();

  // Another field search
  console.log("3. DEPARTMENT SEARCH");
  console.log("-".repeat(40));
  const result2 = engine.search("department:Finance");
  console.log(formatSearchResults(result2));
  console.log();

  // AND expression
  console.log("4. AND EXPRESSION (author AND department)");
  console.log("-".repeat(40));
  const result3 = engine.search("author:john AND department:Finance");
  console.log(formatSearchResults(result3));
  console.log();

  // OR expression
  console.log("5. OR EXPRESSION (Engineering OR Marketing)");
  console.log("-".repeat(40));
  const result4 = engine.search("department:Engineering OR department:Marketing");
  console.log(formatSearchResults(result4));
  console.log();

  // NOT expression
  console.log("6. NOT EXPRESSION (NOT low priority)");
  console.log("-".repeat(40));
  const result5 = engine.search("NOT priority:low");
  console.log(formatSearchResults(result5));
  console.log();

  // Complex expression
  console.log("7. COMPLEX EXPRESSION");
  console.log("-".repeat(40));
  const result6 = engine.search("(department:Finance OR department:Engineering) AND priority:high");
  console.log(formatSearchResults(result6));
  console.log();

  // Comparison expression
  console.log("8. COMPARISON EXPRESSION (year >= 2024)");
  console.log("-".repeat(40));
  const result7 = engine.search("year >= 2024");
  console.log(formatSearchResults(result7));
  console.log();

  // Combined comparison
  console.log("9. COMPARISON WITH AND");
  console.log("-".repeat(40));
  const result8 = engine.search("year >= 2024 AND department:Engineering");
  console.log(formatSearchResults(result8));
  console.log();

  // All records
  console.log("10. ALL RECORDS (wildcard)");
  console.log("-".repeat(40));
  const result9 = engine.search("*");
  console.log(formatSearchResults(result9, 3));
  console.log();

  // Building expressions programmatically
  console.log("11. PROGRAMMATIC EXPRESSION BUILDING");
  console.log("-".repeat(40));
  console.log("   Building: (author:john OR author:jane) AND NOT priority:low");
  console.log();

  // Build the expression tree manually
  const authorJohn = new FieldExpression("author", "john");
  const authorJane = new FieldExpression("author", "jane");
  const lowPriority = new FieldExpression("priority", "low");

  const authorsOr = new OrExpression(authorJohn, authorJane);
  const notLow = new NotExpression(lowPriority);
  const finalExpr = new AndExpression(authorsOr, notLow);

  console.log(`   Expression: ${finalExpr.toString()}`);

  // Execute manually built expression
  const context = {
    data: createSampleData(),
    variables: new Map<string, unknown>(),
  };
  const manualResults = finalExpr.interpret(context);
  console.log(`   Results: ${manualResults.length} records`);
  manualResults.forEach((item, i) => {
    console.log(`     ${i + 1}. ${item.title} by ${item.author}`);
  });
  console.log();

  // Show grammar
  console.log("12. SUPPORTED GRAMMAR");
  console.log("-".repeat(40));
  console.log("   Terminal expressions:");
  console.log("     - field:value (contains search)");
  console.log("     - field > value (numeric comparison)");
  console.log("     - field < value (numeric comparison)");
  console.log("     - field >= value");
  console.log("     - field <= value");
  console.log("     - * (all records)");
  console.log();
  console.log("   Non-terminal expressions:");
  console.log("     - expr AND expr (intersection)");
  console.log("     - expr OR expr (union)");
  console.log("     - NOT expr (negation)");
  console.log("     - (expr) (grouping)");
  console.log();

  // Demonstrate extensibility
  console.log("13. EXTENSIBILITY");
  console.log("-".repeat(40));
  console.log("   Adding new expressions is easy:");
  console.log("   1. Create new class implementing Expression interface");
  console.log("   2. Implement interpret() method");
  console.log("   3. Update parser if needed for new syntax");
  console.log();
  console.log("   Example: Adding 'BETWEEN' expression would only require:");
  console.log("   - New BetweenExpression class");
  console.log("   - Parser update for 'field BETWEEN x AND y' syntax");
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Grammar is represented as a class hierarchy");
  console.log("- Terminal expressions handle base cases (field:value)");
  console.log("- Non-terminal expressions combine other expressions (AND, OR)");
  console.log("- Interpreter traverses the expression tree to evaluate");
  console.log("- Easy to add new expressions without changing existing ones");
  console.log("- Best for simple grammars; complex ones need parser generators");
  console.log("=".repeat(60));
}

main();

