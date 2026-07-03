# ShipSafe AI Guardrail CLI Package

Thank you for purchasing ShipSafe AI! This package is configured as your active local guardrail to scan and verify your repositories before publishing.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- A Unix-compatible shell (Linux, macOS, Git Bash on Windows)

### Running the Scan

1. Unzip this folder into the root of your repository.
2. Open your terminal in the repository root.
3. Make the scanner script executable (Linux/macOS):
   ```bash
   chmod +x shipsafe-scan.sh
   ```
4. Run the scanner:
   ```bash
   ./shipsafe-scan.sh
   ```

## Features
- **Exposed Secret Check**: Automatically scans code and configuration files for hardcoded API keys (Gemini, OpenAI, Stripe, AWS, etc.).
- **Local Sandbox Execution**: Your code never leaves your local machine, ensuring absolute compliance with security rules.
- **Immediate Terminal Feedback**: Generates an ANSI-colored security and compliance status report instantly.

## Commercial License Note
If you purchased the Commercial edition, you have full license to distribute this guardrail internally across your development team's continuous integration (CI/CD) pipelines. Contact enterprise support via the web console for standard integrations.

*ShipSafe AI - Bridging the Gap Between AI Coding Agents and Reality.*
