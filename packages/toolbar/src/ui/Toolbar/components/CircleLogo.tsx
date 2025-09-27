import { motion } from 'motion/react';
import { forwardRef } from 'react';

import { ANIMATION_CONFIG } from '../constants';
import { LaunchDarklyIcon } from './icons/LaunchDarklyIcon';

import * as styles from '../LaunchDarklyToolbar.css';

interface CircleLogoProps {
  onClick: () => void;
  onMouseDown: (event: React.MouseEvent) => void;
}

export const CircleLogo = forwardRef<HTMLButtonElement, CircleLogoProps>((props, ref) => {
  const { onClick, onMouseDown } = props;

  return (
    <motion.button
      ref={ref}
      key="circle-logo"
      className={styles.circleContent}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label="Open LaunchDarkly toolbar"
      initial={{
        opacity: 0,
        x: '-50%',
        y: '-50%',
        scale: 0.9,
        rotate: 90,
      }}
      animate={{
        opacity: 1,
        x: '-50%',
        y: '-50%',
        scale: 1,
        rotate: 0,
      }}
      exit={{
        opacity: 0,
        x: '-50%',
        y: '-50%',
        scale: 0.9,
        rotate: 90,
      }}
      transition={{
        ...ANIMATION_CONFIG.circleLogo,
        opacity: {
          ...ANIMATION_CONFIG.circleLogo.opacity,
          delay: 0,
        },
      }}
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
        <LaunchDarklyIcon className={styles.circleLogo} aria-hidden="true" />
      </motion.div>
    </motion.button>
  );
});
