#!/usr/bin/env bash
set -e

# ボリューム初回作成時は root 所有のため修正
[ -O ~/.zshrc ] || sudo chown -R vscode:vscode /home/vscode

# シェル設定
cat > ~/.zshenv << 'EOF'
source /workspace/.devcontainer/aliases.sh
eval "$(direnv hook zsh)"
EOF

# ツール（未インストール時のみ）
command -v claude  &>/dev/null || curl -fsSL https://claude.ai/install.sh | bash
command -v codex   &>/dev/null || npm install -g @openai/codex
command -v direnv  &>/dev/null || (sudo apt-get update && sudo apt-get install -y direnv)

# .envrc 初期化
[ -f /workspace/.envrc ] || cp /workspace/.envrc.example /workspace/.envrc
direnv allow /workspace/.envrc
