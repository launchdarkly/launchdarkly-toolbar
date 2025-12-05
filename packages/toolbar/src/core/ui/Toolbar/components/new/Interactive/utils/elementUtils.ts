import { TOOLBAR_DOM_ID } from '../../../../../../../types/constants';

export interface ElementAttribute {
  name: string;
  value: string;
}

export interface ElementInfo {
  tagName: string;
  id: string | null;
  classes: string[];
  textContent: string | null;
  selector: string;
  // Primary identifier string for display (e.g., "<button>#id.class1.class2")
  primaryIdentifier: string;
  // data-* attributes (very useful for AI code search)
  dataAttributes: ElementAttribute[];
  // Other relevant HTML attributes
  htmlAttributes: ElementAttribute[];
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Checks if an element is part of the LaunchDarkly toolbar or selection UI.
 * This is used to prevent selecting toolbar elements during element selection mode.
 *
 * @param element - The DOM element to check, or null
 * @returns true if the element is part of the toolbar or selection UI, false otherwise
 */
export function isToolbarElement(element: Element | null): boolean {
  if (!element) return false;

  // Check if element is part of the selection mode bar (rendered via portal)
  if (element.closest('[data-ld-selection-bar="true"]')) {
    return true;
  }

  // Check if element is the toolbar host or inside it
  const toolbarHost = document.getElementById(TOOLBAR_DOM_ID);
  if (toolbarHost && (element === toolbarHost || toolbarHost.contains(element))) {
    return true;
  }

  // Check if element is inside the toolbar's shadow DOM
  // by traversing up through shadow roots
  let current: Element | null = element;
  while (current) {
    if (current.id === TOOLBAR_DOM_ID) {
      return true;
    }
    // Check if we're in a shadow root
    const root = current.getRootNode();
    if (root instanceof ShadowRoot) {
      current = root.host;
    } else {
      current = current.parentElement;
    }
  }

  return false;
}

/**
 * Generates a CSS selector path for an element.
 * Creates a readable selector path up to 4 levels deep, prioritizing IDs for uniqueness.
 *
 * @param element - The DOM element to generate a selector for
 * @returns A CSS selector string (e.g., "div#container > button.submit-btn:nth-of-type(2)")
 */
export function getElementSelector(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    // Add ID if present
    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break; // ID is unique, no need to go further
    }

    // Add classes (limit to first 2 for readability)
    const classes = Array.from(current.classList).slice(0, 2);
    if (classes.length > 0) {
      selector += `.${classes.join('.')}`;
    }

    // Add nth-child if needed to disambiguate
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) => child.tagName === current!.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement;

    // Limit depth for readability
    if (parts.length >= 4) break;
  }

  return parts.join(' > ');
}

/**
 * Gets a short display path for the element (for the hover tag).
 * Returns a simplified identifier showing tag name, ID, or first few classes.
 *
 * @param element - The DOM element to get the display path for
 * @returns A short identifier string (e.g., "button#submit" or "div.container.header")
 */
export function getElementDisplayPath(element: Element): string {
  let selector = element.tagName.toLowerCase();

  if (element.id) {
    selector += `#${element.id}`;
  } else if (element.classList.length > 0) {
    const classes = Array.from(element.classList).slice(0, 2);
    selector += `.${classes.join('.')}`;
  }

  return selector;
}

/**
 * Some HTML attributes that are useful for AI code search
 */
const RELEVANT_HTML_ATTRIBUTES = [
  'aria-label',
  'aria-describedby',
  'aria-labelledby',
  'role',
  'type',
  'name',
  'href',
  'src',
  'alt',
  'title',
  'placeholder',
  'value',
  'for',
  'action',
  'method',
];

/**
 * Generates a primary identifier string for display
 * e.g., "<button>#submit-btn.classA.classB"
 */
function getPrimaryIdentifier(element: Element): string {
  const tagName = element.tagName.toLowerCase();
  let identifier = `<${tagName}>`;

  if (element.id) {
    identifier += `#${element.id}`;
  }

  // Add first 2-3 classes for context (avoid overwhelming with CSS module hashes)
  const classes = Array.from(element.classList).slice(0, 3);
  if (classes.length > 0) {
    identifier += `.${classes.join('.')}`;
  }

  return identifier;
}

/**
 * Extracts data-* attributes from an element
 */
function getDataAttributes(element: Element): ElementAttribute[] {
  const dataAttrs: ElementAttribute[] = [];

  // Get all attributes and filter for data-* ones
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ld-')) {
      // Skip LaunchDarkly internal data attributes
      dataAttrs.push({
        name: attr.name,
        value: attr.value,
      });
    }
  }

  // Sort by relevance - testid and component first
  return dataAttrs.sort((a, b) => {
    const priority = ['data-testid', 'data-test-id', 'data-cy', 'data-component'];
    const aIndex = priority.indexOf(a.name);
    const bIndex = priority.indexOf(b.name);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Extracts relevant HTML attributes from an element
 */
function getHtmlAttributes(element: Element): ElementAttribute[] {
  const attrs: ElementAttribute[] = [];

  for (const attrName of RELEVANT_HTML_ATTRIBUTES) {
    const value = element.getAttribute(attrName);
    if (value) {
      attrs.push({ name: attrName, value });
    }
  }

  return attrs;
}

/**
 * Extracts all relevant information about an element
 * @param element - The DOM element to extract information from
 * @returns ElementInfo object containing element details
 * @throws Error if element is null, undefined, or not an instance of Element
 */
export function getElementInfo(element: Element): ElementInfo {
  if (!element || !(element instanceof Element)) {
    throw new Error('Invalid element provided to getElementInfo. Element must be a valid DOM Element instance.');
  }

  const rect = element.getBoundingClientRect();

  // Get text content, but limit it and clean it up
  let textContent: string | null = null;
  const text = element.textContent?.trim();
  if (text && text.length > 0) {
    textContent = text.length > 80 ? text.substring(0, 80) + '...' : text;
    // Replace multiple whitespace with single space
    textContent = textContent.replace(/\s+/g, ' ');
  }

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    classes: Array.from(element.classList),
    textContent,
    selector: getElementSelector(element),
    primaryIdentifier: getPrimaryIdentifier(element),
    dataAttributes: getDataAttributes(element),
    htmlAttributes: getHtmlAttributes(element),
    dimensions: {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
  };
}

/**
 * Gets the bounding rect of an element relative to the viewport
 * @param element - The DOM element to get the bounding rect for
 * @returns DOMRect object with element position and dimensions
 * @throws Error if element is null, undefined, or not an instance of Element
 */
export function getElementRect(element: Element): DOMRect {
  if (!element || !(element instanceof Element)) {
    throw new Error('Invalid element provided to getElementRect. Element must be a valid DOM Element instance.');
  }
  return element.getBoundingClientRect();
}
