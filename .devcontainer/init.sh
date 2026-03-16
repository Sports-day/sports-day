#!/usr/bin/env bash
set -e

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash

# Codex CLI
npm install -g @openai/codex

# direnv
sudo apt-get update && sudo apt-get install -y direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc

# .envrc の初期化（存在しない場合のみ）
if [ ! -f /workspace/.envrc ]; then
  cp /workspace/.envrc.example /workspace/.envrc
fi