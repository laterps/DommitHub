// script.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('controls');

  // Carga la definición de controles
  fetch('commands.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(commands => {
      commands.forEach(cmd => {
        // Crea wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('control');

        // Crea checkbox (toggle)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${cmd.id}-toggle`;
        checkbox.dataset.commandOn = cmd.commandOn;
        checkbox.dataset.commandOff = cmd.commandOff;

        // Crea label asociado
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = cmd.labelOff;

        // Cuando cambie el toggle, envía el comando
        checkbox.addEventListener('change', async () => {
          const isOn = checkbox.checked;
          const command = isOn
            ? checkbox.dataset.commandOn
            : checkbox.dataset.commandOff;

          // Feedback inicial
          label.textContent = 'Enviando…';

          try {
            const res = await fetch('/.netlify/functions/dispatch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command })
            });

            if (res.ok) {
              // Actualiza texto según estado
              label.textContent = isOn
                ? cmd.labelOn
                : cmd.labelOff;
            } else {
              label.textContent = `Error ${res.status}`;
              checkbox.checked = !isOn; // Revertir estado
            }
          } catch (err) {
            console.error(err);
            label.textContent = 'Error al enviar';
            checkbox.checked = !isOn; // Revertir estado
          }
        });

        // Monta en el DOM
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
      });
    })
    .catch(err => {
      console.error('No se pudo cargar commands.json:', err);
      container.textContent = 'Error al cargar controles';
    });
});
