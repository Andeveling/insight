# Quickstart: Refactor Dashboard Root

## Prerequisites
- Ensure you have the latest dependencies installed: `bun install`
- Ensure the database is running and seeded: `bun db:push && bun db:seed`

## Development Flow

1.  **Start the server**:
    ```bash
    bun dev
    ```

2.  **Navigate to Dashboard**:
    - Open `http://localhost:3000/dashboard`
    - Log in if redirected.

3.  **Verify UI**:
    - Check for the new "CyberPunk" aesthetic (dark mode, cut corners).
    - Verify "Personal Development" hero section is visible.
    - Verify "Top 5 Strengths" are displayed.

## Troubleshooting

- **Missing Styles**: Ensure `app/globals.css` is loaded and `tailwind.config.ts` includes the new component paths.
- **Data Errors**: Check server console for errors from `get-user-progress` or `get-user-strengths`.
