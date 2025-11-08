Reflection
Using AI agents meaningfully accelerated scaffolding and routine boilerplate (ports, DTOs, UI components). The main time-saver was design iteration: asking for a hexagonal baseline, then incrementally refining use-cases and ports. The biggest friction arose from Node ESM details on Windows (file extensions, loaders, dev runners). Switching to tsx and enforcing explicit .ts imports eliminated most pain.

Efficiency: ~40–50% faster for scaffolding and UI polish; core domain logic still required deliberate thought and tests.
Next time: Start with tsx + ESM from the first commit, add a lint rule for explicit extensions, and expand pooling validations to enforce “deficit not worse” and “surplus not negative” invariants with property-based tests.