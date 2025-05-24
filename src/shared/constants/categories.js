/**
 * Activity categories
 */
const CATEGORIES = {
  PRODUCTIVE: 'productive',
  NEUTRAL: 'neutral',
  DISTRACTING: 'distracting',
};

/**
 * Default category mappings
 */
const DEFAULT_CATEGORY_MAPPINGS = {
  [CATEGORIES.PRODUCTIVE]: [
    'code', 'visual studio', 'intellij', 'pycharm', 'webstorm', 'phpstorm', 'rubymine',
    'terminal', 'cmd', 'powershell', 'bash', 'zsh', 'iterm',
    'word', 'excel', 'powerpoint', 'outlook', 'onenote', 'access',
    'google docs', 'google sheets', 'google slides', 'google drive',
    'notion', 'evernote', 'trello', 'asana', 'jira', 'confluence',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'indesign',
    'zoom', 'teams', 'slack', 'discord', 'skype', 'webex',
  ],
  [CATEGORIES.NEUTRAL]: [
    'chrome', 'firefox', 'safari', 'edge', 'opera', 'brave',
    'finder', 'explorer', 'file explorer', 'files',
    'calculator', 'calendar', 'clock', 'weather',
    'mail', 'messages', 'telegram', 'whatsapp', 'signal',
    'spotify', 'apple music', 'itunes', 'music',
    'settings', 'system preferences', 'control panel',
  ],
  [CATEGORIES.DISTRACTING]: [
    'youtube', 'netflix', 'hulu', 'disney+', 'prime video', 'twitch',
    'facebook', 'instagram', 'twitter', 'tiktok', 'reddit', 'pinterest',
    'games', 'steam', 'epic games', 'battle.net', 'origin', 'uplay',
    'minecraft', 'fortnite', 'league of legends', 'valorant', 'apex legends',
    'shopping', 'amazon', 'ebay', 'etsy', 'walmart', 'target',
  ],
};

/**
 * Category colors
 */
const CATEGORY_COLORS = {
  [CATEGORIES.PRODUCTIVE]: '#4caf50', // Green
  [CATEGORIES.NEUTRAL]: '#2196f3',    // Blue
  [CATEGORIES.DISTRACTING]: '#f44336', // Red
};

module.exports = {
  CATEGORIES,
  DEFAULT_CATEGORY_MAPPINGS,
  CATEGORY_COLORS,
};