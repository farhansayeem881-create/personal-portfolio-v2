document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const message = form.elements.message;
  const counter = document.getElementById('message-count');
  const status = document.getElementById('contact-status');

  message.addEventListener('input', () => {
    counter.textContent = `${message.value.length}/1000`;
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const text = [
      `Hello, I'm ${values.get('name')}.`,
      `Email: ${values.get('email')}`,
      `Subject: ${values.get('subject')}`,
      '',
      values.get('message')
    ].join('\n');
    const whatsappUrl = `https://wa.me/8801779279000?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    status.textContent = 'WhatsApp opened with your message. Review it there, then tap Send.';
  });
});
