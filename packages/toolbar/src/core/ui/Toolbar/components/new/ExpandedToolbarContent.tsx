import { motion } from 'motion/react';
import { ToolbarHeader } from './ToolbarHeader';
import { IconBar } from './IconBar';
import { TabBar } from './TabBar';
import { FlagList } from './FlagList';
import * as styles from './ExpandedToolbarContent.module.css';

export const ExpandedToolbarContent = () => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <ToolbarHeader />
      <IconBar />
      <TabBar />
      <div className={styles.content}>
        <FlagList />
      </div>
    </motion.div>
  );
};
