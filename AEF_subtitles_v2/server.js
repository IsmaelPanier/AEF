const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configuration par défaut
const DEFAULT_CONFIG = {
    couleur: '#802B36',
    position: 'bas',
    taille: '50',
    titre_message: '',
    titre_active: false,
    is_hidden: false,
    propresenter_api: 'http://192.168.1.22:49196'
};

// Charger ou créer la configuration
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Erreur lecture config:', err);
    }
    return { ...DEFAULT_CONFIG };
}

// Sauvegarder la configuration
function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
        console.log('[CONFIG] Sauvegardé:', config);
        return true;
    } catch (err) {
        console.error('[ERREUR] Sauvegarde:', err);
        return false;
    }
}

let currentConfig = loadConfig();

// ==================== ROUTES API ====================

// GET /api/config - Lire la configuration
app.get('/api/config', (req, res) => {
    res.json(currentConfig);
});

// POST /api/config - Écrire la configuration
app.post('/api/config', (req, res) => {
    console.log('[UPDATE] Config:', req.body);
    currentConfig = { ...currentConfig, ...req.body };
    
    if (saveConfig(currentConfig)) {
        res.json({ success: true, config: currentConfig });
    } else {
        res.status(500).json({ success: false, error: 'Erreur sauvegarde' });
    }
});

// GET /api/config/reset - Réinitialiser
app.get('/api/config/reset', (req, res) => {
    console.log('[RESET] Configuration');
    currentConfig = { ...DEFAULT_CONFIG };
    saveConfig(currentConfig);
    res.json({ success: true, config: currentConfig });
});

// ==================== SERVEUR ====================

app.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log('  REGIE VIRTUELLE v4.0 - SERVEUR');
    console.log('========================================');
    console.log('');
    console.log('Serveur démarré sur le port', PORT);
    console.log('');
    console.log('URLs:');
    console.log('  Configuration: http://localhost:' + PORT + '/config.html');
    console.log('  Affichage OBS: http://localhost:' + PORT + '/display.html');
    console.log('');
    console.log('API ProPresenter par défaut:');
    console.log('  ' + currentConfig.propresenter_api);
    console.log('');
    
    const os = require('os');
    const interfaces = os.networkInterfaces();
    console.log('Accès réseau:');
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log('  http://' + iface.address + ':' + PORT + '/config.html');
            }
        }
    }
    console.log('');
});