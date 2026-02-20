# 🤖 GitHub Copilot - Tips & Tricks for Ascended Social

## Quick Reference

| Action | Keyboard | Purpose |
|--------|----------|---------|
| **Chat** | `Ctrl+I` | Open Copilot chat |
| **Inline Chat** | `Ctrl+Shift+I` | Quick inline suggestion |
| **Inline Completion** | `Tab` | Accept code suggestion |
| **Explain** | `/explain` | Explain selected code |
| **Tests** | `/tests` | Generate test cases |
| **Doc** | `/doc` | Add documentation |

## 🎯 Smart Prompts for Ascended Social

### Frontend Development

**Create Chakra Component**
```
"Create a React component that displays a chakra selector with 7 buttons (root, sacral, solar plexus, heart, throat, third eye, crown). Include colors and icons."
```

**Build Energy Display**
```
"Create a React component that shows user energy points with a progress bar and current/max values. Style it with Tailwind CSS."
```

**Oracle Reading Card**
```
"Design a React component for displaying an oracle reading card with title, message, and timestamp using Radix UI components."
```

**3D Starmap Integration**
```
"Show me how to integrate React Three Fiber to display a 3D starfield with interactive user positions."
```

### Backend Development

**Create API Endpoint**
```
"Create an Express route POST /api/posts that accepts a post with title, content, and chakra. Include type validation with Zod."
```

**Database Query**
```
"Write a Drizzle ORM query to get all posts filtered by chakra with pagination (limit 10, offset by page number)."
```

**Authentication Route**
```
"Create Express routes for POST /api/auth/register and /api/auth/login with password hashing using bcrypt."
```

**Oracle Generation**
```
"Create a function that calls the OpenAI API to generate an oracle reading based on user input and their profile data."
```

### Database Tasks

**Schema Definition**
```
"Create a Drizzle ORM schema for a posts table with fields: id, title, content, chakra (enum), userId, createdAt, updatedAt."
```

**Migration**
```
"How do I create a new database migration with Drizzle to add an 'energy' column to the users table?"
```

**Seed Data**
```
"Write a database seed script that creates sample posts across all 7 chakras with different energy levels."
```

### Testing

**Component Test**
```
"Write a Cypress component test for the chakra selector that verifies all 7 buttons render and clicking changes selection."
```

**E2E Test**
```
"Create a Playwright E2E test that: (1) logs in, (2) creates a post, (3) verifies it appears in feed, (4) deletes it."
```

**Integration Test**
```
"Write a test that verifies the full flow: user registration → database entry → login → access dashboard."
```

---

## 💡 Advanced Techniques

### 1. Provide Context
**Instead of:** "Create a component"
**Better:** "Create a React component that displays energy points like the other cards in client/src/components/Cards/"

### 2. Reference Files
Use `#` to reference files in chat:
```
"Explain the #App.tsx file and suggest improvements"
```

### 3. Request Refactoring
```
"Refactor this component to use TypeScript generics and extract the logic to a custom hook"
```

### 4. Ask for Explanations
```
"This database query is slow. Why might it be slow and how can I optimize it?"
```

### 5. Generate Documentation
```
"Generate JSDoc comments for this function that explain all parameters and return value"
```

---

## 🔮 Spiritual Feature Prompts

### Chakra System
```
"Explain how the chakra categorization system works in the codebase. Which tables store chakra data?"
```

### Energy Mechanics
```
"How are energy points calculated? Show me the formula and the code that implements it."
```

### Oracle Readings
```
"Walk me through the oracle reading generation process from user request to API response."
```

### Aura Levels
```
"What determines a user's aura level? How is it calculated and displayed?"
```

### 3D Starmap
```
"Explain the React Three Fiber implementation in the starmap component. How are user positions rendered?"
```

---

## 🚀 Workflow Examples

### Example 1: Building a New Feature

1. **Ask about requirements**
   ```
   "What does the feed component need to display posts from all chakras?"
   ```

2. **Get skeleton code**
   ```
   "Create a TypeScript React component for a feeds that filters by chakra with sorting options"
   ```

3. **Add functionality**
   ```
   "Add hooks to fetch posts from /api/posts with pagination"
   ```

4. **Create tests**
   ```
   "/tests"
   ```

5. **Documentation**
   ```
   "/doc"
   ```

### Example 2: Debugging an Issue

1. **Show the error**
   ```
   "I'm getting this error: [paste error]. What's causing it?"
   ```

2. **See the code**
   ```
   "Here's the relevant code: [select code or reference file]. What's wrong?"
   ```

3. **Get solution**
   ```
   "How do I fix this?"
   ```

4. **Understand it**
   ```
   "/explain"
   ```

### Example 3: Learning About the Project

1. **Start with overview**
   ```
   "What's the overall architecture of Ascended Social?"
   ```

2. **Learn about a component**
   ```
   "#App.tsx - Explain this file and how components are organized"
   ```

3. **Understand data flow**
   ```
   "How does data flow from the database to the frontend for posts?"
   ```

4. **Get a map**
   ```
   "Create a diagram showing the relationships between User, Post, and Spark tables"
   ```

---

## 📋 Copilot Commands Cheat Sheet

| Command | Use Case | Example |
|---------|----------|---------|
| `/explain` | Understand code | Select function → `/explain` |
| `/tests` | Generate tests | Select component → `/tests` |
| `/doc` | Add documentation | Select function → `/doc` |
| `/fix` | Fix problems | Select error → `/fix` |
| `/help` | Get assistance | `/help - how do I create a route?` |

---

## 🎓 Learning Strategies

### Pair With Copilot
- Copilot writes code
- You review and understand
- Ask `/explain` if unclear
- Modify as needed

### Copilot Teaches
- Ask "How do I...?"
- Copilot explains
- Ask follow-up questions
- Request code examples

### Co-Create Features
1. Describe what you want
2. Copilot generates code
3. You test and iterate
4. Copilot refines based on feedback

---

## ⚠️ Best Practices

### Do ✅
- ✅ Verify Copilot's code before using it
- ✅ Test generated code in a branch
- ✅ Ask for explanations
- ✅ Provide context for better suggestions
- ✅ Review security implications
- ✅ Reference existing code patterns

### Don't ❌
- ❌ Use code without understanding it
- ❌ Trust Copilot for critical security code
- ❌ Ask for secrets/API keys
- ❌ Skip testing generated code
- ❌ Use without reviewing patterns in codebase

---

## 🔐 Security Notes

When using Copilot with Ascended Social:

1. **Never ask for secrets**
2. **Verify database queries** - Ensure they're parameterized
3. **Check auth logic** - Verify it's secure
4. **Review API endpoints** - Ensure proper validation
5. **API key handling** - Use environment variables
6. **SQL injection prevention** - Use ORM properly

---

## 📞 Getting Help

**Can't get good suggestions?**
1. Provide more context
2. Show relevant code or files
3. Be more specific about what you want
4. Break complex requests into smaller ones

**Copilot seems wrong?**
1. Ask it to explain its reasoning
2. Provide counter-examples
3. Ask for alternative approaches
4. Reference specific files in codebase

---

## 🌟 Pro Tips

### Tip 1: Chat History
Your chat history persists. Scroll up to see context and reference earlier discussions.

### Tip 2: Code Selection
Select code before opening chat - Copilot will reference it in suggestions.

### Tip 3: Slash Commands
Most important commands:
- `/explain` - Understand code
- `/tests` - Generate tests
- `/doc` - Add documentation

### Tip 4: Ask Questions
Copilot is great at explaining why, not just how:
- "Why would this code be slow?"
- "What could break with this approach?"
- "What are the security implications?"

### Tip 5: Request Patterns
Ask for specific patterns:
- "Use Observer pattern for..."
- "Implement Factory pattern for..."
- "Create a custom Hook that..."

---

## 📚 Common Ascended Social Questions

### Chakras
```
"Explain each of the 7 chakras and how they're used in the application"
```

### API Structure
```
"What's the structure of a POST request to create a post? Show me an example."
```

### Database Schema
```
"How are posts and sparks related in the database? Show me the schema."
```

### Authentication Flow
```
"Walk me through the complete authentication flow from registration to dashboard access"
```

### Energy System
```
"How does the energy point system work? What's the flow of earning and spending energy?"
```

---

## 🎯 Goals for Using Copilot

1. **Understand Code** - Use `/explain` frequently
2. **Write Better Code** - Ask for improvements
3. **Test Thoroughly** - Use `/tests` for coverage
4. **Document Well** - Use `/doc` for clarity
5. **Learn Patterns** - Ask about design patterns
6. **Fix Issues Fast** - Use `/fix` for errors
7. **Ship Confidently** - Verify before merging

---

**Remember: Copilot is a tool to enhance your coding, not replace your judgment.**

**Use it wisely, review thoroughly, and you'll code faster than ever! 🚀**
