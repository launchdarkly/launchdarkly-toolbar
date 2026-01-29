import { motion } from 'motion/react';
import { forwardRef, type MouseEvent } from 'react';

import { ANIMATION_CONFIG } from '../constants';
import { LaunchDarklyIcon } from './icons/LaunchDarklyIcon';

import * as styles from '../LaunchDarklyToolbar.css';

interface CircleLogoProps {
  onMouseDown: (event: MouseEvent) => void;
}

export const CircleLogo = forwardRef<HTMLDivElement, CircleLogoProps>((props, ref) => {
  const { onMouseDown } = props;

  return (
    <motion.div
      ref={ref}
      key="circle-logo"
      className={styles.circleContent}
      onMouseDown={onMouseDown}
      tabIndex={-1}
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
    </motion.div>
  );
});
