import { motion } from 'motion/react';

import { ANIMATION_CONFIG } from '../constants';
import { LaunchDarklyIcon } from './icons/LaunchDarklyIcon';

import styles from '../LaunchDarklyToolbar.module.css';

interface CircleLogoProps {
  hasBeenExpanded: boolean;
}

export function CircleLogo(props: CircleLogoProps) {
  const { hasBeenExpanded } = props;

  return (
    <motion.div
      key="circle-logo"
      className={styles.circleContent}
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
          delay: hasBeenExpanded ? 0.3 : 0,
        },
      }}
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
        <LaunchDarklyIcon className={styles.circleLogo} />
      </motion.div>
    </motion.div>
  );
}
