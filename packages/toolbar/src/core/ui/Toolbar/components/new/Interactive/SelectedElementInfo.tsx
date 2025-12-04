import React, { useState } from 'react';
import { useElementSelection } from '../../../context/ElementSelectionProvider';
import { WorkflowSection } from './WorkflowSection';
import { WorkflowCard } from './WorkflowCard';
import { ChevronDownIcon } from './icons';
import * as styles from './SelectedElementInfo.module.css.ts';

export const SelectedElementInfo: React.FC = () => {
  const { selectedElementInfo } = useElementSelection();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!selectedElementInfo) {
    return null;
  }

  const { primaryIdentifier, selector, classes, dataAttributes, htmlAttributes, textContent, dimensions } =
    selectedElementInfo;

  const hasClasses = classes.length > 0;
  const hasDataAttributes = dataAttributes.length > 0;
  const hasHtmlAttributes = htmlAttributes.length > 0;

  return (
    <div className={styles.container} data-testid="selected-element-info">
      {/* Element Details */}
      <div className={styles.elementDetails}>
        <button className={styles.detailsHeader} onClick={() => setIsExpanded(!isExpanded)}>
          <code className={styles.primaryIdentifier}>{primaryIdentifier}</code>
          <span className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}>
            <ChevronDownIcon />
          </span>
        </button>

        {isExpanded && (
          <div className={styles.detailsContent}>
            {/* Selector */}
            <div className={styles.detailRow}>
              <span className={styles.label}>Selector</span>
              <span className={styles.value}>{selector}</span>
            </div>

            {/* Data Attributes */}
            {hasDataAttributes && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Data Attributes</span>
                <div className={styles.attributesList}>
                  {dataAttributes.map((attr) => (
                    <div key={attr.name} className={styles.attributeRow}>
                      <span className={styles.attributeName}>{attr.name}</span>
                      <span className={styles.attributeValue}>"{attr.value}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HTML Attributes */}
            {hasHtmlAttributes && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Attributes</span>
                <div className={styles.attributesList}>
                  {htmlAttributes.map((attr) => (
                    <div key={attr.name} className={styles.attributeRow}>
                      <span className={styles.attributeName}>{attr.name}</span>
                      <span className={styles.attributeValue}>"{attr.value}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Classes */}
            {hasClasses && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Classes</span>
                <div className={styles.classesList}>
                  {classes.map((className, index) => (
                    <span key={index} className={styles.classTag}>
                      .{className}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Text Content */}
            {textContent && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Text</span>
                <span className={styles.textPreview}>{textContent}</span>
              </div>
            )}

            {/* Dimensions */}
            <div className={styles.dimensionsRow}>
              <span>Size:</span>
              <span className={styles.dimValue}>
                {dimensions.width} × {dimensions.height}px
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.workflowsContainer}>
        <WorkflowSection title="Feature Flags">
          <WorkflowCard workflow="featureFlag" />
        </WorkflowSection>

        <WorkflowSection title="Events & Analytics">
          <WorkflowCard workflow="clickTracking" disabled />
        </WorkflowSection>
      </div>
    </div>
  );
};
