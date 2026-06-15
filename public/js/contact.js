/* Contact page client-side submission */

(function () {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('contactNote');
  if (!form) return;

  function setNote(msg, isError) {
    if (!note) return;
    note.textContent = msg || '';
    note.style.color = isError ? 'rgba(255,79,216,.95)' : 'var(--muted)';
  }

  async function postContact(payload) {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ ok: false, message: 'Request failed.' }));
    if (!res.ok) throw new Error(data?.message || 'Request failed.');
    return data;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value?.trim();
    const email = document.getElementById('contactEmail')?.value?.trim();
    const message = document.getElementById('contactMessage')?.value?.trim();

    if (!name || name.length < 2) return setNote('Please enter your name.', true);
    if (!email) return setNote('Please enter your email.', true);
    if (!message || message.length < 8) return setNote('Message must be at least 8 characters.', true);

    try {
      setNote('Sending message…');
      const data = await postContact({ name, email, message });
      if (data?.ok) {
        setNote('Message sent successfully. We’ll get back to you soon.');
        form.reset();
      } else {
        setNote(data?.message || 'Could not send message.', true);
      }
    } catch (err) {
      setNote(err.message || 'Could not send message.', true);
    }
  });
})();

