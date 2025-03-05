const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());

// Serve static files from the "html" folder
app.use(express.static(path.join(__dirname, 'html')));

// Path to data files
const shortcutsFile = path.join(__dirname, 'shortcuts', 'shortcuts.yaml');
const settingsFile = path.join(__dirname, 'config', 'settings.yaml');

console.log('Settings file path:', settingsFile);

// Helper function to ensure directories exist
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  console.log('Ensuring directory exists:', dirname);
  
  if (!fs.existsSync(dirname)) {
    console.log('Directory does not exist, creating it');
    try {
      fs.mkdirSync(dirname, { recursive: true });
      console.log('Directory created successfully');
    } catch (err) {
      console.error('Error creating directory:', err);
    }
  } else {
    console.log('Directory already exists');
  }
}

// GET endpoint to retrieve shortcuts from YAML file
app.get('/api/get-shortcuts', (req, res) => {
  if (fs.existsSync(shortcutsFile)) {
    try {
      const fileContent = fs.readFileSync(shortcutsFile, 'utf8');
      let data = fileContent ? yaml.load(fileContent) : { shortcuts: [] };
      if (!data.shortcuts) data.shortcuts = [];
      res.json({ success: true, shortcuts: data.shortcuts });
    } catch (err) {
      console.error("Error reading YAML file:", err);
      res.status(500).json({ error: 'Error reading shortcuts file' });
    }
  } else {
    res.json({ success: true, shortcuts: [] });
  }
});

// POST endpoint to add a new shortcut
app.post('/api/add-shortcut', (req, res) => {
  const { name, url, icon } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let data = { shortcuts: [] };

  if (fs.existsSync(shortcutsFile)) {
    try {
      const fileContent = fs.readFileSync(shortcutsFile, 'utf8');
      data = fileContent ? yaml.load(fileContent) : { shortcuts: [] };
      if (!data.shortcuts) data.shortcuts = [];
    } catch (err) {
      console.error("Error reading YAML file:", err);
      return res.status(500).json({ error: 'Error reading shortcuts file' });
    }
  } else {
    ensureDirectoryExists(shortcutsFile);
  }

  data.shortcuts.push({ name, url, icon });

  try {
    const newYaml = yaml.dump(data);
    fs.writeFileSync(shortcutsFile, newYaml, 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error("Error writing YAML file:", err);
    res.status(500).json({ error: 'Error writing shortcuts file' });
  }
});

// POST endpoint to delete a shortcut
app.post('/api/delete-shortcut', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Missing shortcut name' });
  }

  // Check if file exists
  if (!fs.existsSync(shortcutsFile)) {
    return res.status(404).json({ success: false, message: 'Shortcuts file not found' });
  }

  try {
    // Read the YAML file
    const fileContent = fs.readFileSync(shortcutsFile, 'utf8');
    let data = fileContent ? yaml.load(fileContent) : { shortcuts: [] };
    
    if (!data.shortcuts) {
      data.shortcuts = [];
      return res.status(404).json({ success: false, message: 'No shortcuts found' });
    }

    // Find the index of the shortcut with the matching name
    const shortcutIndex = data.shortcuts.findIndex(shortcut => shortcut.name === name);
    
    // If shortcut not found
    if (shortcutIndex === -1) {
      return res.status(404).json({ success: false, message: `Shortcut "${name}" not found` });
    }

    // Remove the shortcut from the array
    data.shortcuts.splice(shortcutIndex, 1);

    // Write the updated data back to the YAML file
    const newYaml = yaml.dump(data);
    fs.writeFileSync(shortcutsFile, newYaml, 'utf8');
    
    return res.json({ success: true, message: `Shortcut "${name}" deleted successfully` });
  } catch (err) {
    console.error("Error handling shortcut deletion:", err);
    return res.status(500).json({ success: false, message: 'Error processing shortcut deletion' });
  }
});

// GET endpoint to retrieve settings
app.get('/api/get-settings', (req, res) => {
  console.log('GET /api/get-settings - Checking if settings file exists:', settingsFile);
  if (fs.existsSync(settingsFile)) {
    console.log('Settings file exists, reading it');
    try {
      const fileContent = fs.readFileSync(settingsFile, 'utf8');
      let data = fileContent ? yaml.load(fileContent) : { settings: {} };
      if (!data.settings) data.settings = {};
      console.log('Returning settings:', data.settings);
      res.json({ success: true, settings: data.settings });
    } catch (err) {
      console.error("Error reading settings file:", err);
      res.status(500).json({ success: false, message: 'Error reading settings file' });
    }
  } else {
    console.log('Settings file does not exist, returning default settings');
    // Return default settings if file doesn't exist
    const defaultSettings = {
      userName: 'Tom',
      dashboardTitle: 'Node Dash Dashboard',
      buttonSize: 'medium',
      theme: 'blue',
      timezone: 'UTC',
      language: 'en'
    };
    res.json({ success: true, settings: defaultSettings });
  }
});

// POST endpoint to save settings
app.post('/api/save-settings', (req, res) => {
  console.log('POST /api/save-settings - Received settings data:', req.body);
  const { settings } = req.body;
  
  if (!settings) {
    console.log('No settings data provided in request');
    return res.status(400).json({ success: false, message: 'Missing settings data' });
  }

  try {
    console.log('Creating settings data object');
    const data = { settings: settings };
    
    // Ensure config directory exists
    console.log('Ensuring config directory exists for settings file');
    ensureDirectoryExists(settingsFile);
    
    // Write settings to YAML file
    console.log('Converting settings to YAML format');
    const newYaml = yaml.dump(data);
    
    console.log('Writing settings to file:', settingsFile);
    fs.writeFileSync(settingsFile, newYaml, 'utf8');
    
    // Verify file was created
    if (fs.existsSync(settingsFile)) {
      console.log('Settings file was created successfully');
      const stats = fs.statSync(settingsFile);
      console.log('File size:', stats.size, 'bytes');
    } else {
      console.log('Failed to create settings file even though no error was thrown');
    }
    
    console.log('Settings saved successfully');
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ success: false, message: 'Error saving settings: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server directory: ${__dirname}`);
  console.log(`Settings file will be saved to: ${settingsFile}`);
  
  // Check if config directory exists at startup
  const configDir = path.dirname(settingsFile);
  console.log(`Checking if config directory exists: ${configDir}`);
  if (fs.existsSync(configDir)) {
    console.log('Config directory exists');
    
    // Check directory permissions
    try {
      fs.accessSync(configDir, fs.constants.W_OK);
      console.log('Config directory is writable');
    } catch (err) {
      console.error('Config directory is not writable:', err);
    }
  } else {
    console.log('Config directory does not exist at startup');
  }
});