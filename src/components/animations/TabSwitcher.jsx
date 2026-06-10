import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion, easings } from '../../utils/animationConfig';

/**
 * TabSwitcher Component
 * Animated tab content switcher with smooth transitions
 * 
 * @param {Array} tabs - Array of { id, label, icon?, content }
 * @param {string} activeTab - Currently active tab ID
 * @param {function} onTabChange - Callback when tab is clicked
 * @param {string} className - CSS classes for container
 */
export default function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) {
  if (prefersReducedMotion()) {
    return (
      <div className={className}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 700 : 500,
                background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg2)',
                color: activeTab === tab.id ? '#fff' : 'var(--text2)',
              }}
            >
              {tab.icon && <span style={{ marginRight: '0.35rem' }}>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          {tabs.find((t) => t.id === activeTab)?.content}
        </div>
      </div>
    );
  }

  const activeTabObj = tabs.find((t) => t.id === activeTab);

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 700 : 500,
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg2)',
              color: activeTab === tab.id ? '#fff' : 'var(--text2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: easings.easeOut,
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.35,
            ease: easings.smooth,
          }}
        >
          {activeTabObj?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
