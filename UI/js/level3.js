const questions = document.querySelectorAll('.question');
const options = document.querySelectorAll('.option');
const categories = document.querySelectorAll('.category');

options.forEach((option) => {
  option.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', option.textContent);
    option.classList.add('draggable');
  });

  option.addEventListener('dragend', () => {
    option.classList.remove('draggable');
  });
});

categories.forEach((category) => {
  category.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  category.addEventListener('drop', (e) => {
    e.preventDefault();
    const option = document.querySelector(`.option[data-category="${category.dataset.category}"]`);
    category.appendChild(option);
  });
});