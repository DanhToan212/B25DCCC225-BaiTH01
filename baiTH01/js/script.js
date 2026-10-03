const body = document.body;
const themeToggle = document.querySelector('#themeToggle');
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
const form = document.querySelector('#contactForm');
const statusBox = document.querySelector('#formStatus');
const projectSearch = document.querySelector('#projectSearch');
const projectTagFilter = document.querySelector('#projectTagFilter');
const projectResults = document.querySelector('#projectResults');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

if (form && statusBox) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      statusBox.textContent = 'Vui lòng điền đầy đủ thông tin.';
      statusBox.className = 'form-status error';
      return;
    }

    if (!emailPattern.test(email)) {
      statusBox.textContent = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
      statusBox.className = 'form-status error';
      return;
    }

    if (message.length < 10) {
      statusBox.textContent = 'Nội dung tin nhắn phải có ít nhất 10 ký tự.';
      statusBox.className = 'form-status error';
      return;
    }

    statusBox.textContent = 'Gửi tin nhắn thành công! Tôi sẽ phản hồi sớm.';
    statusBox.className = 'form-status success';
    form.reset();
  });
}

if (projectSearch && projectTagFilter && projectResults) {
  const projectCards = [...document.querySelectorAll('.project-card')];
  const projectTags = [...new Set(projectCards.flatMap((card) =>
    [...card.querySelectorAll('.project-tags span')].map((tag) => tag.textContent.trim())
  ))];

  const normalizeText = (text) => text
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

  projectTags.forEach((tag) => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    projectTagFilter.append(option);
  });

  const filterProjects = () => {
    const keyword = normalizeText(projectSearch.value.trim());
    const selectedTag = normalizeText(projectTagFilter.value);
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const matchesKeyword = normalizeText(card.textContent).includes(keyword);
      const matchesTag = !selectedTag || [...card.querySelectorAll('.project-tags span')]
        .some((tag) => normalizeText(tag.textContent.trim()) === selectedTag);
      const isVisible = matchesKeyword && matchesTag;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    projectResults.textContent = visibleCount
      ? `Đang hiển thị ${visibleCount}/${projectCards.length} dự án.`
      : 'Không tìm thấy dự án phù hợp.';
  };

  projectSearch.addEventListener('input', filterProjects);
  projectTagFilter.addEventListener('change', filterProjects);
  filterProjects();
}
