import { PreferredIde } from '../../../../utils/localStorage';
import { copyToClipboard } from '../../../../utils/clipboard';

export interface IdeConfig {
  id: PreferredIde;
  label: string;
  icon: 'cursor' | 'windsurf' | 'vscode' | 'github-copilot';
}

export const IDE_CONFIGS: IdeConfig[] = [
  { id: 'cursor', label: 'Cursor', icon: 'cursor' },
  { id: 'windsurf', label: 'Windsurf', icon: 'windsurf' },
  { id: 'vscode', label: 'VS Code', icon: 'vscode' },
  { id: 'github-copilot', label: 'GitHub Copilot', icon: 'github-copilot' },
];

/**
 * Minify a prompt for URL encoding by removing unnecessary whitespace
 * while preserving the actual content and readability.
 * This can reduce URL length by 40-60%.
 */
export function minifyPromptForUrl(prompt: string): string {
  return (
    prompt
      // Remove leading/trailing whitespace from each line
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      // Collapse multiple blank lines into single blank line
      .replace(/\n{3,}/g, '\n\n')
      // Remove blank lines after headers (## Header\n\n -> ## Header\n)
      .replace(/(^#{1,6} .+)\n\n/gm, '$1\n')
      // Remove blank lines before/after code blocks
      .replace(/\n\n```/g, '\n```')
      .replace(/```\n\n/g, '```\n')
      // Remove blank lines after list items that continue
      .replace(/^([-*] .+)\n\n(?=[-*] )/gm, '$1\n')
      // Remove --- separator lines (visual only)
      .replace(/^---+$/gm, '')
      // Collapse resulting multiple newlines again
      .replace(/\n{3,}/g, '\n\n')
      // Trim the whole thing
      .trim()
  );
}

/**
 * Open Cursor IDE with the prompt in composer
 * Cursor uses cursor://anysphere.cursor-deeplink/prompt?text=<encoded_prompt>
 * @returns true if the protocol handler was likely successful
 */
export function openInCursor(prompt: string): boolean {
  const encodedPrompt = encodeURIComponent(prompt);
  const opened = window.open(`cursor://anysphere.cursor-deeplink/prompt?text=${encodedPrompt}`, '_blank');
  return opened !== null && opened !== undefined;
}

/**
 * Open Windsurf IDE with the prompt
 * Windsurf uses windsurf://cascade?prompt=<encoded_prompt>
 * @returns true if the protocol handler was likely successful, false if blocked
 */
export function openInWindsurf(prompt: string): boolean {
  const encodedPrompt = encodeURIComponent(prompt);
  const opened = window.open(`windsurf://cascade?prompt=${encodedPrompt}`, '_blank');
  return opened !== null && opened !== undefined;
}

/**
 * Open VS Code with the prompt
 * VS Code doesn't have a direct prompt protocol, so we just open it
 * and the user will need to paste the prompt
 * @returns true if the protocol handler was likely successful, false if blocked
 */
export function openInVSCode(_prompt: string): boolean {
  // VS Code doesn't support direct prompt injection
  // Just open VS Code - the prompt will be in clipboard
  const opened = window.open('vscode://', '_blank');
  return opened !== null && opened !== undefined;
}

/**
 * Maximum URL length for GitHub Copilot (8KB limit)
 */
const MAX_URL_LENGTH = 8000;

/**
 * Open GitHub Copilot with the prompt
 * GitHub Copilot uses https://github.com/copilot/agents?prompt=<encoded_prompt>
 * Uses minified prompt, and if still too long, the caller should provide a condensed version.
 * @param prompt - The prompt to use (should be condensed if full prompt is too long)
 * @returns true if the link was opened successfully
 */
export function openInGitHubCopilot(prompt: string): boolean {
  const minifiedPrompt = minifyPromptForUrl(prompt);
  const encodedPrompt = encodeURIComponent(minifiedPrompt);
  const fullUrl = `https://github.com/copilot/agents?prompt=${encodedPrompt}`;

  if (fullUrl.length > MAX_URL_LENGTH) {
    console.warn(`[GitHub Copilot] URL exceeds ${MAX_URL_LENGTH} chars, may be truncated`);
  }

  const opened = window.open(fullUrl, '_blank');
  return opened !== null && opened !== undefined;
}

/**
 * Get the URL length for a prompt (after minification and encoding)
 * Useful for debugging URL length issues
 */
export function getGitHubCopilotUrlLength(prompt: string): number {
  const minifiedPrompt = minifyPromptForUrl(prompt);
  const encodedPrompt = encodeURIComponent(minifiedPrompt);
  return `https://github.com/copilot/agents?prompt=${encodedPrompt}`.length;
}

/**
 * Open the specified IDE with the prompt
 * @returns true if the protocol handler was likely successful, false if blocked
 */
export function openInIde(prompt: string, ide: PreferredIde): boolean {
  switch (ide) {
    case 'cursor':
      return openInCursor(prompt);
    case 'windsurf':
      return openInWindsurf(prompt);
    case 'vscode':
      return openInVSCode(prompt);
    case 'github-copilot':
      return openInGitHubCopilot(prompt);
  }
}

/**
 * Copy prompt to clipboard and open in the specified IDE
 * @param prompt - Full prompt to copy to clipboard
 * @param ide - The IDE to open
 * @param urlPrompt - Optional condensed prompt for URL-based IDEs (GitHub Copilot). If not provided, uses full prompt.
 * @returns true if both copy and IDE open were successful, false otherwise
 */
export async function copyAndOpenInIde(prompt: string, ide: PreferredIde, urlPrompt?: string): Promise<boolean> {
  const copied = await copyToClipboard(prompt);
  if (!copied) {
    return false;
  }
  // For GitHub Copilot, use the condensed URL prompt if provided
  const promptForIde = ide === 'github-copilot' && urlPrompt ? urlPrompt : prompt;
  const opened = openInIde(promptForIde, ide);
  return opened;
}
