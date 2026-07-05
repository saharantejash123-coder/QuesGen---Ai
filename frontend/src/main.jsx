import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './mobile.css'
import App from './App.jsx'
import { initializeDemoAccounts } from './services/schoolService'

initializeDemoAccounts()

// Google Translate (the official widget loaded in index.html) rewrites text
// nodes directly in the DOM. When it swaps a node React still thinks it owns,
// React's reconciler throws on the next render ("Failed to execute
// 'removeChild'/'insertBefore' on 'Node'") and can unmount the whole app.
// Patch both methods to no-op instead of throwing when the node Google moved
// is no longer where React expects it.
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function removeChild(child) {
    if (child.parentNode !== this) {
      if (console) console.warn('Skipped removeChild: node was already moved by Google Translate.');
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function insertBefore(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn('Skipped insertBefore: reference node was already moved by Google Translate.');
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
