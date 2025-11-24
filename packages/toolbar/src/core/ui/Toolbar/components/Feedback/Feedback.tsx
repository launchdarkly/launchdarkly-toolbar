import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, TextField, TextArea } from '@launchpad-ui/components';
import type { FeedbackSentiment } from '../../../../../types/analytics';
import { CheckIcon, ThumbDownIcon, ThumbUpIcon } from '../icons';
import * as styles from './Feedback.css';

interface FeedbackProps {
  onSubmit: (feedback: string, sentiment: FeedbackSentiment) => void;
  title?: string;
}

export function Feedback(props: FeedbackProps) {
  const { onSubmit, title = "How's your experience?" } = props;
  const [sentiment, setSentiment] = useState<FeedbackSentiment | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitButtonRef = useRef<HTMLDivElement | null>(null);

  const handleSentimentClick = (newSentiment: FeedbackSentiment) => {
    if (isSubmitted) return;
    setSentiment(newSentiment);
  };

  const handleSubmit = () => {
    if (!sentiment) return;

    onSubmit(comment, sentiment);
    setIsSubmitted(true);

    // Reset after delay
    resetTimeoutRef.current = setTimeout(() => {
      setIsSubmitted(false);
      setSentiment(null);
      setComment('');
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  // Scroll submit button into view when comment form appears
  useEffect(() => {
    if (sentiment && !isSubmitted && submitButtonRef.current) {
      const scrollTimeout = setTimeout(() => {
        if (submitButtonRef.current && typeof submitButtonRef.current.scrollIntoView === 'function') {
          submitButtonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [sentiment, isSubmitted]);

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.title}>{title}</div>

      <div className={styles.sentimentContainer} role="radiogroup" aria-label="Feedback sentiment">
        <button
          className={styles.sentimentButton}
          onClick={() => handleSentimentClick('positive')}
          aria-label="Positive"
          role="radio"
          aria-checked={sentiment === 'positive'}
          disabled={isSubmitted}
          data-disabled={isSubmitted}
          data-selected={sentiment === 'positive'}
          type="button"
        >
          <ThumbUpIcon />
        </button>
        <button
          className={styles.sentimentButton}
          onClick={() => handleSentimentClick('negative')}
          aria-label="Negative"
          role="radio"
          aria-checked={sentiment === 'negative'}
          disabled={isSubmitted}
          data-disabled={isSubmitted}
          data-selected={sentiment === 'negative'}
          type="button"
        >
          <ThumbDownIcon />
        </button>
      </div>

      <AnimatePresence>
        {sentiment && !isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.commentForm}
          >
            <TextField aria-label="Feedback comment" className={styles.textField}>
              <TextArea
                placeholder="Optional feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </TextField>
            <div ref={submitButtonRef}>
              <Button className={styles.submitButton} onClick={handleSubmit} variant="primary">
                Send Feedback
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.successMessage}
            role="status"
            aria-live="polite"
          >
            <div className={styles.successIcon}>
              <CheckIcon />
            </div>
            <span>Thanks! Your feedback is valuable and will help us improve.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
