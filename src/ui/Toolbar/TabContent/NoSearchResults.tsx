import styles from './NoSearchResults.module.css';

export function NoSearchResults() {
  return (
    <div className={styles.noResults}>
      <p>No results found</p>
      <span>Try adjusting your search</span>
    </div>
  );
}
