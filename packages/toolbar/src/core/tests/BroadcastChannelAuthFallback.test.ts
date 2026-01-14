/**
 * @fileoverview Tests for BroadcastChannel authentication fallback.
 *
 * This tests the fallback mechanism for Chrome incognito mode where window.opener
 * is null. In this scenario, the OAuth popup uses BroadcastChannel to communicate
 * with the hidden iframe (same origin), which then relays the message to the parent
 * window via postMessage.
 *
 * Flow:
 * 1. Popup completes OAuth → window.opener is null (incognito)
 * 2. Popup sends auth message via BroadcastChannel
 * 3. Hidden iframe receives BroadcastChannel message
 * 4. Iframe relays to parent window via postMessage
 * 5. AuthProvider receives postMessage and updates auth state
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

const BROADCAST_CHANNEL_NAME = 'launchdarkly-toolbar-auth';

// Mock BroadcastChannel class that tracks all instances
class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];

  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  postMessage = vi.fn();
  close = vi.fn();

  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.instances.push(this);

    // Set up postMessage to broadcast to other channels with same name
    this.postMessage = vi.fn().mockImplementation((data: any) => {
      MockBroadcastChannel.instances
        .filter((ch) => ch.name === name && ch !== this)
        .forEach((ch) => {
          if (ch.onmessage) {
            ch.onmessage({ data } as MessageEvent);
          }
        });
    });
  }

  static reset() {
    MockBroadcastChannel.instances = [];
  }
}

describe('BroadcastChannel Auth Fallback', () => {
  let originalBroadcastChannel: typeof BroadcastChannel | undefined;

  beforeEach(() => {
    MockBroadcastChannel.reset();

    // Store original BroadcastChannel if it exists
    originalBroadcastChannel = (global as any).BroadcastChannel;

    // Install mock
    (global as any).BroadcastChannel = MockBroadcastChannel;
  });

  afterEach(() => {
    // Restore original BroadcastChannel
    if (originalBroadcastChannel) {
      (global as any).BroadcastChannel = originalBroadcastChannel;
    } else {
      delete (global as any).BroadcastChannel;
    }
    vi.clearAllMocks();
  });

  describe('Channel Communication', () => {
    test('messages are broadcast to all listeners on the same channel', () => {
      const sender = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      const receiver = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

      const receivedMessages: any[] = [];
      (receiver as any).onmessage = (event: MessageEvent) => {
        receivedMessages.push(event.data);
      };

      const testMessage = {
        type: 'toolbar-authenticated',
        accountId: 'test-account',
        memberId: 'test-member',
        targetOrigin: 'https://example.com',
      };

      sender.postMessage(testMessage);

      expect(receivedMessages).toHaveLength(1);
      expect(receivedMessages[0]).toEqual(testMessage);
    });

    test('messages are not received on different channel names', () => {
      const sender = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      const receiver = new BroadcastChannel('different-channel');

      const receivedMessages: any[] = [];
      (receiver as any).onmessage = (event: MessageEvent) => {
        receivedMessages.push(event.data);
      };

      sender.postMessage({ type: 'test' });

      expect(receivedMessages).toHaveLength(0);
    });

    test('sender does not receive its own message', () => {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

      const receivedMessages: any[] = [];
      (channel as any).onmessage = (event: MessageEvent) => {
        receivedMessages.push(event.data);
      };

      channel.postMessage({ type: 'test' });

      expect(receivedMessages).toHaveLength(0);
    });
  });

  describe('Popup to Iframe Relay Pattern', () => {
    test('simulates the full incognito fallback flow', () => {
      // This test simulates the full flow:
      // 1. Popup sends via BroadcastChannel (window.opener is null)
      // 2. Iframe receives and relays to parent via postMessage

      const mockParentPostMessage = vi.fn();

      // Simulate iframe context
      const mockParent = { postMessage: mockParentPostMessage };
      const mockWindow = {
        parent: mockParent,
        self: {},
        top: mockParent, // Different from self, so it's in an iframe
      };

      // Set up iframe relay listener (simulating toolbar-index.html behavior)
      const iframeChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      (iframeChannel as any).onmessage = (event: MessageEvent) => {
        const { targetOrigin: msgTargetOrigin, ...msgData } = event.data;
        if (mockWindow.parent && mockWindow.parent !== mockWindow) {
          mockWindow.parent.postMessage(msgData, msgTargetOrigin || '*');
        }
      };

      // Simulate popup sending auth message (window.opener is null scenario)
      const popupChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      const authMessage = {
        type: 'toolbar-authenticated',
        accountId: 'test-account',
        memberId: 'test-member',
        targetOrigin: 'https://app.example.com',
      };

      popupChannel.postMessage(authMessage);
      popupChannel.close();

      // Verify iframe relayed the message to parent
      expect(mockParentPostMessage).toHaveBeenCalledTimes(1);
      expect(mockParentPostMessage).toHaveBeenCalledWith(
        {
          type: 'toolbar-authenticated',
          accountId: 'test-account',
          memberId: 'test-member',
        },
        'https://app.example.com',
      );
    });

    test('handles api-ready message relay', () => {
      const mockParentPostMessage = vi.fn();
      const mockParent = { postMessage: mockParentPostMessage };

      // Set up iframe relay
      const iframeChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      (iframeChannel as any).onmessage = (event: MessageEvent) => {
        const { targetOrigin: msgTargetOrigin, ...msgData } = event.data;
        mockParent.postMessage(msgData, msgTargetOrigin || '*');
      };

      // Popup sends api-ready message
      const popupChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      popupChannel.postMessage({
        type: 'api-ready',
        targetOrigin: 'https://app.example.com',
      });

      expect(mockParentPostMessage).toHaveBeenCalledWith({ type: 'api-ready' }, 'https://app.example.com');
    });

    test('uses wildcard origin when targetOrigin is not provided', () => {
      const mockParentPostMessage = vi.fn();
      const mockParent = { postMessage: mockParentPostMessage };

      const iframeChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      (iframeChannel as any).onmessage = (event: MessageEvent) => {
        const { targetOrigin: msgTargetOrigin, ...msgData } = event.data;
        mockParent.postMessage(msgData, msgTargetOrigin || '*');
      };

      const popupChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      popupChannel.postMessage({
        type: 'toolbar-authenticated',
        accountId: 'test-account',
        memberId: 'test-member',
        // No targetOrigin provided
      });

      expect(mockParentPostMessage).toHaveBeenCalledWith(
        {
          type: 'toolbar-authenticated',
          accountId: 'test-account',
          memberId: 'test-member',
        },
        '*',
      );
    });
  });

  describe('Error Handling', () => {
    test('gracefully handles BroadcastChannel not being available', () => {
      // Remove BroadcastChannel to simulate unsupported browser
      delete (global as any).BroadcastChannel;

      expect(() => {
        // This should throw since BroadcastChannel doesn't exist
        new (global as any).BroadcastChannel(BROADCAST_CHANNEL_NAME);
      }).toThrow();
    });
  });
});
