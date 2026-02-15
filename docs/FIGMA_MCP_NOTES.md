# Figma MCP Notes

Frontend design work in this repository follows the `figma` skill workflow.

## Current environment status
- Figma MCP resource discovery returned no connected resources/templates in this session.
- Because no Figma node URL/context was available, the frontend was redesigned using the project design system as a fallback.

## To run true Figma-driven implementation
1. Connect/configure the Figma MCP server for this environment.
2. Provide a Figma frame/layer URL (or node ID) for the target screen.
3. Use MCP flow in order:
   - `get_design_context`
   - `get_screenshot`
   - then implementation.
