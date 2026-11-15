#!/usr/bin/env bash
# Publica a Trilha ENEM (rodar no WSL): copia o projeto para o clone ~/dev/trilha-enem, põe dist/index.html na raiz, commit e push.
# Antes, no Windows: node checks/check-tudo.mjs && node build.mjs
# Uso: bash ferramentas/publicar.sh "mensagem do commit"
set -euo pipefail
SRC="/mnt/c/Users/jadso/OneDrive/Documents/trilha-enem"
DST="$HOME/dev/trilha-enem"
MSG="${1:-Atualiza a Trilha ENEM}"
[ -f "$SRC/dist/index.html" ] || { echo "falta dist/index.html: rode node build.mjs no Windows"; exit 1; }
grep -q "__trilha" "$SRC/dist/index.html" && { echo "o gancho de teste vazou para dist/index.html"; exit 1; }
rsync -a --delete --exclude .git --exclude dist --exclude node_modules --exclude index.html "$SRC/" "$DST/"
cp "$SRC/dist/index.html" "$DST/index.html"
cd "$DST"
git add -A
git diff --cached --quiet && { echo "nada mudou"; exit 0; }
git commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q -u origin HEAD
echo "enviado: $(git log -1 --format='%h %s')"
