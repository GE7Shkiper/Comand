document.addEventListener('DOMContentLoaded', () => {
  // ======= НАВИГАЦИЯ ПО СЕКЦИЯМ =======
  const sectionLinks = document.querySelectorAll('a[data-section]');
  const sections = document.querySelectorAll('.content-section');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let activePlayerId = null;

  // ======= ВСПЛЫВАЮЩИЕ КАРТОЧКИ ИГРОКОВ =======
  const popup = document.getElementById('playerPopup');
  const popupAvatar = document.getElementById('popupAvatar');
  const popupName = document.getElementById('popupName');
  const popupSkills = document.getElementById('popupSkills');
  const popupExp = document.getElementById('popupExp');
  const popupWeapon = document.getElementById('popupWeapon');

  const playerData = {
    '1': { name: 'ЯША ЛАВА [№1]', skills: 'Тактическое мышление, лидерство, поддержка', experience: '3 года в киберспорте, капитан команды', weapon: 'АК-47', img: 'avatars/1.jpg' },
    '2': { name: 'absosut [Клатчер]', skills: '1v5 клатчи, тишина и точность, AWP, пиксельные выстрелы, рефлексы', experience: '2 года, король неожиданных разворотов', weapon: 'AWP', img: 'avatars/2.jpg' },
    '3': { name: 'Игорь [Пиво]', skills: 'Дробови4ек', experience: '5 лет на FACEIT, бывший AWP-командир', weapon: 'НЕТУ', img: 'avatars/3.jpg' },
    '4': { name: 'GENSUXA [Муха]', skills: 'Разведка, молниеносные врывы, B-rush мастер', experience: '1.5 года, идеально знает карты', weapon: 'MAC-10', img: 'avatars/4.jpg' },
    '5': { name: 'POWER Дрищ [ТРЕНЕР]', skills: 'Фраги, агрессия, рандомный hit', experience: '4 года в миксах и туриках', weapon: 'M4A1-S', img: 'avatars/5.jpg' }
  };

  document.querySelectorAll('.players-list li a').forEach(link => {
    const id = link.dataset.id;
    if (!id || !playerData[id]) return;
    const data = playerData[id];
    const href = link.getAttribute('href'); // берём путь из ссылки

    if (isTouch) {
      link.addEventListener('click', e => {
        if (activePlayerId !== id) {
          e.preventDefault();
          activePlayerId = id;
          showPopup(link, data, href);
        } else {
          activePlayerId = null;
        }
      });
    } else {
      link.addEventListener('mouseenter', () => showPopup(link, data, href));
      link.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
        activePlayerId = null;
      });
    }
  });

  function showPopup(link, data, href) {
    popupAvatar.src = data.img;
    popupName.textContent = data.name;
    popupName.href = href;

    popupSkills.textContent = data.skills;
    popupExp.textContent = data.experience;
    popupWeapon.textContent = data.weapon;

    const rect = link.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    popup.style.display = 'block';
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';

    if (window.innerWidth <= 768) {
      const isBottomHalf = rect.top > window.innerHeight / 2;
      popup.style.top = isBottomHalf ? `${10 + scrollY}px` : 'auto';
      popup.style.bottom = isBottomHalf ? 'auto' : '20px';
      popup.style.left = '50%';
      popup.style.transform = 'translateX(-50%)';
      popup.style.width = '90vw';
      popup.style.maxWidth = '320px';
    } else {
      let top = rect.top + scrollY;
      let left = rect.right + 20 + scrollX;
      const popupRect = popup.getBoundingClientRect();
      if (left + popupRect.width > window.innerWidth) left = rect.left - popupRect.width - 20 + scrollX;
      if (top + popupRect.height > window.innerHeight + scrollY) top = window.innerHeight + scrollY - popupRect.height - 20;
      if (top < scrollY + 10) top = scrollY + 10;

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
      popup.style.width = '';
      popup.style.maxWidth = '';
      popup.style.bottom = 'auto';
      popup.style.transform = 'none';
    }

    popup.style.opacity = '1';
    popup.style.pointerEvents = 'auto';
  }

  document.addEventListener('click', e => {
    if (
      popup.style.display === 'block' &&
      !popup.contains(e.target) &&
      !e.target.closest('.players-list')
    ) {
      popup.style.display = 'none';
      activePlayerId = null;
    }
  });

  // ======= МОДАЛКИ ГАЛЕРЕЙ =======
  let activeGalleryModal = null;

  function removeCurrentModal() {
    if (activeGalleryModal) {
      activeGalleryModal.modal.remove();
      activeGalleryModal = null;
    }
  }

  function createGalleryModal(images) {
    const modal = document.createElement('div');
    modal.className = 'imgModal';
    modal.style.cssText = `
      display:none;
      position:fixed;
      top:0; left:0; right:0; bottom:0;
      background:rgba(0,0,0,0.8);
      justify-content:center;
      align-items:center;
      z-index:9999;
      cursor:pointer;
    `;

    const modalImg = document.createElement('img');
    modalImg.style.cssText = `max-width:90vw; max-height:90vh; user-select:none; pointer-events:none;`;

    const leftZone = document.createElement('div');
    leftZone.style.cssText = `position:absolute; left:0; top:0; bottom:0; width:30%; cursor:pointer;`;
    const rightZone = document.createElement('div');
    rightZone.style.cssText = `position:absolute; right:0; top:0; bottom:0; width:30%; cursor:pointer;`;

    modal.append(leftZone, modalImg, rightZone);
    document.body.appendChild(modal);

    let currentIndex = 0;

    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;

      if (activeGalleryModal && activeGalleryModal !== modal) activeGalleryModal.style.display = 'none';
      activeGalleryModal = modal;

      modalImg.src = images[currentIndex].src;
      modal.style.display = 'flex';
    }

    images.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showImage(i));
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) { modal.style.display = 'none'; activeGalleryModal = null; return; }
      const x = e.clientX;
      if (x < window.innerWidth * 0.3) showImage(currentIndex - 1);
      else if (x > window.innerWidth * 0.7) showImage(currentIndex + 1);
      else { modal.style.display = 'none'; activeGalleryModal = null; }
    });

    leftZone.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex - 1); });
    rightZone.addEventListener('click', e => { e.stopPropagation(); showImage(currentIndex + 1); });

    let touchStartX = 0;
    modal.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
    modal.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) showImage(currentIndex - 1);
      else if (diff < -50) showImage(currentIndex + 1);
    });

    return { showImage, modal };
  }

  function setupGalleryForSection(sectionId) {
    removeCurrentModal();
    requestAnimationFrame(() => {
      const tabContent = document.getElementById(`tab-${sectionId}`);
      if (!tabContent) return;
      const images = Array.from(tabContent.querySelectorAll('.gallery img'));
      if (images.length) createGalleryModal(images);
    });
  }

  // ======= ПЕРЕКЛЮЧЕНИЕ СЕКЦИЙ =======
  function switchSection(sectionId) {
    sections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    if (sectionId === 'abi') {
      document.body.style.background = "url('123.jpg') no-repeat center center";
      document.body.style.backgroundSize = "cover";
    } else {
      document.body.style.background = "url('cs2-bg1.jpg') no-repeat center center";
      document.body.style.backgroundSize = "auto 100%";
    }

    setupGalleryForSection(sectionId);
  }

  const savedSection = localStorage.getItem('activeSection');
  if (savedSection && document.getElementById(savedSection)) switchSection(savedSection);
  else switchSection('about');

  sectionLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.section;
      if (target) {
        localStorage.setItem('activeSection', target);
        switchSection(target);
      }
    });
  });

  // ======= МЕНЮ ДЛЯ МОБИЛОК =======
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ======= ABI TABS =======
  const abiTabs = document.querySelectorAll('.abi-tab');
  const abiTabContents = document.querySelectorAll('.abi-tab-content');
  abiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      abiTabs.forEach(t => t.classList.remove('active'));
      abiTabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const content = document.getElementById(`tab-${target}`);
      if (content) content.classList.add('active');
      setupGalleryForSection(target);
    });
  });

  // ======= CS2 MAP TABS =======
  const cs2TabButtons = document.querySelectorAll('#cs2 .map-tab');
  const cs2TabContents = document.querySelectorAll('#cs2 .tab-content');
  const cs2MapCards = document.querySelectorAll('#cs2 .map-card');

  function switchMapTab(map) {
    localStorage.setItem('activeMap', map);
    cs2TabButtons.forEach(b => b.classList.remove('active'));
    cs2TabContents.forEach(c => c.style.display = 'none');
    const btn = document.querySelector(`#cs2 .map-tab[data-map="${map}"]`);
    const content = document.getElementById(`map-${map}`);
    if (btn) btn.classList.add('active');
    if (content) content.style.display = 'block';
  }

  cs2MapCards.forEach(card => {
    card.addEventListener('click', () => switchMapTab(card.dataset.map));
  });

  const savedMap = localStorage.getItem('activeMap') || 'dust2';
  if (document.getElementById('cs2').classList.contains('active')) switchMapTab(savedMap);

  const _switchSection = switchSection;
  switchSection = function (sectionId) {
    _switchSection(sectionId);
    if (sectionId === 'cs2') switchMapTab(localStorage.getItem('activeMap') || 'dust2');
  };
});



