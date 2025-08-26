# Settings Tab by Mode

The Settings tab displays different content based on the toolbar mode:

## Dev Server Mode Settings

When `devServerUrl` is provided, the Settings tab shows:

### Dev Server Configuration

- **Project**: Dropdown selector for switching between available projects
- **Environment**: Current source environment (e.g., "production", "test")
- **Connection status**: Real-time connection status with visual indicator

### Toolbar Settings

- **Position**: Dropdown to switch between left/right positioning

## SDK Mode Settings

When no `devServerUrl` is provided, the Settings tab shows:

### Toolbar Settings

- **Position**: Dropdown to switch between left/right positioning

## Mode-Specific Features

| Setting             | Dev Server Mode                | SDK Mode     |
| ------------------- | ------------------------------ | ------------ |
| Project Selector    | ✅ Available                   | ❌ Hidden    |
| Environment Info    | ✅ Shows source environment    | ❌ Hidden    |
| Connection Status   | ✅ Shows dev server connection | ❌ Hidden    |
| Position Selector   | ✅ Available                   | ✅ Available |
| Mode Indicator      | ❌ Not shown                   | ❌ Not shown |
| Debug Plugin Status | ❌ Not applicable              | ❌ Not shown |

## Visual Differences

### Dev Server Mode Layout

```
╭─ Dev Server Configuration ─╮
│ Project      [dropdown]    │
│ Environment  production    │
│ Connection   ● Connected   │
╰───────────────────────────╯

╭─ Toolbar Settings ────────╮
│ Position     [Right ▼]    │
╰───────────────────────────╯
```

### SDK Mode Layout

```
╭─ Toolbar Settings ────────╮
│ Position      [Right ▼]   │
╰───────────────────────────╯
```

## Implementation Notes

- The settings groups and items are dynamically generated based on the current mode
- Search functionality works across all visible settings
- Mode-specific items are automatically filtered out when not applicable
- Position selector is always available in both modes under "Toolbar Settings"
- Project-related functionality is only available in Dev Server Mode
- SDK Mode currently shows only basic toolbar settings
