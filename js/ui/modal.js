import { el, clearElement } from '../utils/dom.js';

export function showModal(contentFn) {
  const modal = document.getElementById('modalContent');
  if (!modal) return;
  clearElement(modal);
  contentFn(modal);
  document.getElementById('modalOverlay').classList.add('active');
}

export function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

export function showExerciseInfo(exercise) {
  if (!exercise || !exercise.info) return;
  const info = exercise.info;

  showModal(modal => {
    const closeBtn = el('button', {
      className: 'modal-close',
      textContent: '\u2715',
      onClick: closeModal,
      'aria-label': 'Schließen',
    });

    const title = el('h2', { textContent: exercise.name });

    const sections = [
      { heading: 'Warum es funktioniert', text: info.why },
      { heading: 'Wissenschaftlicher Hintergrund', text: info.evidence },
      { heading: 'Beste Zeit', text: info.best },
    ];

    modal.appendChild(closeBtn);
    modal.appendChild(title);

    for (const section of sections) {
      if (!section.text) continue;
      modal.appendChild(el('h3', {
        textContent: section.heading,
        style: { marginTop: '16px', color: 'var(--accent2)' },
      }));
      modal.appendChild(el('p', {
        textContent: section.text,
        style: { color: 'var(--text2)', lineHeight: '1.6' },
      }));
    }
  });
}

export function showExerciseComplete(exercise, onBack) {
  showModal(modal => {
    const closeBtn = el('button', {
      className: 'modal-close',
      textContent: '\u2715',
      onClick: closeModal,
      'aria-label': 'Schließen',
    });

    const title = el('h2', { textContent: 'Übung abgeschlossen!' });
    const desc = el('p', {
      textContent: `Sie haben ${exercise.name} erfolgreich abgeschlossen.`,
      style: { color: 'var(--text2)', marginTop: '16px', textAlign: 'center', fontSize: '16px' },
    });

    const backBtn = el('button', {
      textContent: 'Zurück zur Startseite',
      onClick: () => { closeModal(); onBack(); },
      style: {
        marginTop: '20px', padding: '12px 24px', background: 'var(--accent)',
        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%',
      },
    });

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(desc);
    modal.appendChild(backBtn);
  });
}
