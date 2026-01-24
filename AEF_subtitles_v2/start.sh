#!/bin/bash

# Aller dans le répertoire du script
cd "$(dirname "$0")"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé"
    echo ""
    echo "Installation:"
    echo "  1. Allez sur https://nodejs.org"
    echo "  2. Téléchargez la version LTS"
    echo "  3. Installez et relancez ce script"
    echo ""
    exit 1
fi

echo "Node.js: $(node --version)"

# Installer dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
    echo ""
fi

# Démarrer le serveur
echo "Démarrage du serveur..."
echo ""
node server.js