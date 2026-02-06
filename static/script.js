async function loadAccordion() {
  try {
    const response = await fetch('/api/accordion');
    if (!response.ok) throw new Error('Ошибка запроса: ' + response.status);

    const data = await response.json();
    const accordion = document.getElementById('accordionExample');

    data.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'accordion-item';

      card.innerHTML = `
        <h2 class="accordion-header" id="heading${item.id}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}" aria-expanded="false" aria-controls="collapse${item.id}">
            ${item.title}
          </button>
        </h2>
        <div id="collapse${item.id}" class="accordion-collapse collapse" aria-labelledby="heading${item.id}" data-bs-parent="#accordionExample">
          <div class="accordion-body" style="white-space: pre-line;">
            ${item.content}
          </div>
        </div>
      `;

      accordion.appendChild(card);

      // Получаем кнопку и панель
      const button = card.querySelector('.accordion-button');
      const collapseDiv = card.querySelector('.accordion-collapse');

      // События раскрытия / закрытия
      collapseDiv.addEventListener('show.bs.collapse', () => {
        button.classList.add('active');
      });
      collapseDiv.addEventListener('hide.bs.collapse', () => {
        button.classList.remove('active');
      });
    });

  } catch (err) {
    console.error(err);
    const container = document.querySelector('.container');
    container.innerHTML += `<div class="alert alert-danger mt-3">Не удалось загрузить данные: ${err.message}</div>`;
  }
}

loadAccordion();
