# AI Agent Workflow Log
This project was developed using a **multi-agent workflow**, where different AI tools were used for different stages of design, implementation, debugging, and refinement. The goal was to leverage each agent’s strengths while keeping human judgment in control.
---
## Agents Used & Roles
| Agent / Tool | Purpose | Strengths Used |
|-------------|---------|----------------|
| **ChatGPT (GPT-5)** | System architecture, backend implementation, complex debugging | High-level reasoning, code generation, hexagonal architecture guidance |
| **Google Gemini (Flash 2.5 / AI Studio)** | Regulatory methodology interpretation and CB formula reference extraction | Strong document reasoning & summarization from PDF |
| **GitHub Copilot** | Inline frontend UI suggestion & refactoring | Quick boilerplate React/Tailwind autocomplete |
| **VSCode + TypeScript Compiler** | Final static checking & validation | Ensured correctness & alignment of types |
> Human oversight was used at every step to verify correctness, adjust calculations, and keep code aligned to project goals.
---
## Prompt → Output → Validation Log

### 1) *Understanding the FuelEU Regulation Methodology (PDF Reference)*
**Agent:** Gemini  
**Task:** Extract formulas & definitions from the provided FuelEU methodology PDF.
**Output Highlights:**
- Verified formula for **GHG Intensity** (gCO₂e/MJ)
- Confirmed **41,000 MJ/t** as standard LCV assumption
- Clarified **Compliance Balance = (Target - Actual) × Energy in Scope**
**Validation:**  
Cross-checked values with assignment brief → matched.  
Used this to justify formulas in backend **`compliance.ts`** & README.
---
### 2) *Backend Architecture & Domain Layer Setup*
**Agent:** ChatGPT (GPT-5)
**Prompt Example:**
Set up a hexagonal backend structure with domain models and Prisma repository adapters
**Generated Output:**
- `core/domain`
- `core/application/usecases`
- `adapters/outbound/postgres`
- `infrastructure/server/index.ts`
**Human Review:**  
Verified imports, renamed `RoutesRepo` interfaces for clarity, created seed data manually.
---
### 3) *Database Connection & Prisma Client Errors*
**Agent:** ChatGPT (GPT-5)
**Problem:**
`@prisma/client did not initialize yet`
**Fix Suggested:**
npx prisma migrate dev --name init
npx prisma generate
**Result:**  
Backend connected successfully to database (later migrated to local server for reliability).
---
### 4) *Frontend API Integration & State Management*
**Agent:** GitHub Copilot (assisted inline)
**Used For:**
- React `useQuery` and `useMutation` hooks
- Tailwind UI structuring for Dashboard
**Validation:**  
Used browser DevTools + network inspector to verify data binding.
---
## Corrections & Human Validation
- Compared API responses with UI expectations and corrected data shapes (`comparisonQ.data.comparisons` → `comparisonQ.data.comparisons`).
- Ensured **CORS policy compliance** and aligned frontend to backend base URL.
- Adjusted pooling algorithm to ensure **poolSum ≥ 0** condition per FuelEU.
---
## Observations & Insights
| Area | Effect of AI Assistance |
|------|------------------------|
| Architecture & Data Flow | **Greatly accelerated** planning & setup |
| Regulatory clarity (PDF) | **Much clearer** with Gemini summary |
| Debugging | GPT-5 helped resolve Prisma + CORS efficiently |
| Frontend refactoring | Copilot saved time but required careful validation |
| Where Human Judgment Mattered | CB formula tuning, pool validation, UI integration |
---
## Best Practices Followed
- Broke work into **small agent-friendly subtasks**
- Tested output **immediately** after each AI suggestion
- Re-prompted with context instead of long single prompts
- Maintained commit history with meaningful messages
## Overall Summary
Using AI agents **did not replace development**, but **augmented** it:
- GPT-5 → architecture & backend reasoning
- Gemini → regulatory interpretation
- Copilot → faster UI flow and typing
- Human → validation, corrections, final integration
This resulted in a **faster**, **clearer**, and **more structured** implementation aligned with FuelEU compliance rules.

 