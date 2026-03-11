#!/usr/bin/env bash
set -e

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# Codex CLI
npm install -g @openai/codex