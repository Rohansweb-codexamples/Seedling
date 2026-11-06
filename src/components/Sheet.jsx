import { CloseIcon, LeafIcon } from './Icons';

export default function Sheet({ title, onClose, children }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <section className="sheet" role="dialog" aria-label={title} aria-modal="true">
        <header className="sheet-head wood">
          <LeafIcon className="sheet-leaf sheet-leaf-left" />
          <h2 className="sheet-title">{title}</h2>
          <LeafIcon className="sheet-leaf sheet-leaf-right" />
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            <CloseIcon width="16" height="16" />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </section>
    </>
  );
}
