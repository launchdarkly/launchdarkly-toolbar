import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

import ReactMountContext from '../context/ReactMountContext';
import { Feedback } from '../ui/Toolbar/components/Feedback/Feedback';

function FeedbackWrapper({ children }: { children: React.ReactNode }) {
  const [portalTarget] = React.useState(() => document.createElement('div'));

  React.useEffect(() => {
    document.body.appendChild(portalTarget);
    return () => {
      document.body.removeChild(portalTarget);
    };
  }, [portalTarget]);

  return <ReactMountContext.Provider value={portalTarget}>{children}</ReactMountContext.Provider>;
}

function renderFeedback(ui: React.ReactElement) {
  return render(<FeedbackWrapper>{ui}</FeedbackWrapper>);
}

describe('Feedback', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
  };

  describe('Sentiment Selection', () => {
    test('marks thumbs up as checked when selected', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      const thumbsUp = screen.getByRole('radio', { name: 'Positive' });
      fireEvent.click(thumbsUp);

      expect(thumbsUp).toHaveAttribute('aria-checked', 'true');
      expect(thumbsUp).toHaveAttribute('data-selected', 'true');
    });

    test('marks thumbs down as checked when selected', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      const thumbsDown = screen.getByRole('radio', { name: 'Negative' });
      fireEvent.click(thumbsDown);

      expect(thumbsDown).toHaveAttribute('aria-checked', 'true');
      expect(thumbsDown).toHaveAttribute('data-selected', 'true');
    });

    test('can change from positive to negative sentiment', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      const thumbsUp = screen.getByRole('radio', { name: 'Positive' });
      const thumbsDown = screen.getByRole('radio', { name: 'Negative' });

      fireEvent.click(thumbsUp);
      expect(thumbsUp).toHaveAttribute('aria-checked', 'true');

      fireEvent.click(thumbsDown);
      expect(thumbsDown).toHaveAttribute('aria-checked', 'true');
      expect(thumbsUp).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Feedback Submission', () => {
    test('does not show submit button without selecting sentiment', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      expect(screen.queryByText('Send Feedback')).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Optional feedback...')).not.toBeInTheDocument();
    });

    test('shows comment form after selecting sentiment', async () => {
      renderFeedback(<Feedback {...defaultProps} />);
      expect(screen.queryByText('Send Feedback')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));

      expect(await screen.findByPlaceholderText('Optional feedback...')).toBeInTheDocument();
      expect(screen.getByText('Send Feedback')).toBeInTheDocument();
    });

    test('submits positive feedback without comment', async () => {
      const onSubmit = vi.fn();
      renderFeedback(<Feedback onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith('', 'positive');
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('submits negative feedback without comment', async () => {
      const onSubmit = vi.fn();
      renderFeedback(<Feedback onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Negative' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith('', 'negative');
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('submits positive feedback with comment', async () => {
      const onSubmit = vi.fn();
      renderFeedback(<Feedback onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const textarea = await screen.findByPlaceholderText('Optional feedback...');
      fireEvent.change(textarea, { target: { value: 'Great feature!' } });
      fireEvent.click(screen.getByText('Send Feedback'));

      expect(onSubmit).toHaveBeenCalledWith('Great feature!', 'positive');
    });

    test('submits negative feedback with comment', async () => {
      const onSubmit = vi.fn();
      renderFeedback(<Feedback onSubmit={onSubmit} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Negative' }));
      const textarea = await screen.findByPlaceholderText('Optional feedback...');
      fireEvent.change(textarea, { target: { value: 'Could be better' } });
      fireEvent.click(screen.getByText('Send Feedback'));

      expect(onSubmit).toHaveBeenCalledWith('Could be better', 'negative');
    });

    test('shows success message after submission', async () => {
      renderFeedback(<Feedback {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      expect(
        await screen.findByText('Thanks! Your feedback is valuable and will help us improve.'),
      ).toBeInTheDocument();
    });

    test('hides comment form after submission', async () => {
      renderFeedback(<Feedback {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      // Wait for success message
      await screen.findByText('Thanks! Your feedback is valuable and will help us improve.');

      // Wait for comment form to be removed (AnimatePresence exit animation)
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Optional feedback...')).not.toBeInTheDocument();
        expect(screen.queryByText('Send Feedback')).not.toBeInTheDocument();
      });
    });

    test('disables sentiment buttons after submission', async () => {
      renderFeedback(<Feedback {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      // Wait for success message
      await screen.findByText('Thanks! Your feedback is valuable and will help us improve.');

      const thumbsUp = screen.getByRole('radio', { name: 'Positive' });
      const thumbsDown = screen.getByRole('radio', { name: 'Negative' });

      expect(thumbsUp).toBeDisabled();
      expect(thumbsDown).toBeDisabled();
      expect(thumbsUp).toHaveAttribute('data-disabled', 'true');
      expect(thumbsDown).toHaveAttribute('data-disabled', 'true');
    });

    test('does not call onSubmit without selecting sentiment', () => {
      const onSubmit = vi.fn();
      renderFeedback(<Feedback onSubmit={onSubmit} />);

      // Submit button should not be visible without selecting sentiment
      expect(screen.queryByText('Send Feedback')).not.toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('prevents sentiment change while in submitted state', async () => {
      renderFeedback(<Feedback {...defaultProps} />);

      const thumbsUp = screen.getByRole('radio', { name: 'Positive' });
      const thumbsDown = screen.getByRole('radio', { name: 'Negative' });

      fireEvent.click(thumbsUp);
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      // Wait for success message
      await screen.findByText('Thanks! Your feedback is valuable and will help us improve.');

      // Try to click thumbs down while in submitted state
      fireEvent.click(thumbsDown);

      // Should still be on positive and disabled
      expect(thumbsUp).toHaveAttribute('aria-checked', 'true');
      expect(thumbsDown).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Accessibility', () => {
    test('has radiogroup role for sentiment buttons', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      const radioGroup = screen.getByRole('radiogroup', { name: 'Feedback sentiment' });
      expect(radioGroup).toBeInTheDocument();
    });

    test('has radio role for thumbs up button', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      expect(screen.getByRole('radio', { name: 'Positive' })).toBeInTheDocument();
    });

    test('has radio role for thumbs down button', () => {
      renderFeedback(<Feedback {...defaultProps} />);

      expect(screen.getByRole('radio', { name: 'Negative' })).toBeInTheDocument();
    });

    test('success message has proper ARIA attributes', async () => {
      renderFeedback(<Feedback {...defaultProps} />);

      fireEvent.click(screen.getByRole('radio', { name: 'Positive' }));
      const submitButton = await screen.findByText('Send Feedback');
      fireEvent.click(submitButton);

      const successMessage = await screen.findByRole('status');
      expect(successMessage).toHaveAttribute('aria-live', 'polite');
    });
  });
});
