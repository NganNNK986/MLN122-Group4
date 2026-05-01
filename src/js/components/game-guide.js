import { ROLE_DATA, ITEMS, QUIZ_DATA, TAG_NAMES } from '../data/game-data.js';
import { state, resetGameState, updateState } from './game-state.js';
import * as ui from './game-ui.js';

export function initGameGuide() {
  console.log('🎮 Initializing Optimized Game Guide...');

  const modal = document.getElementById('gameGuideModal');
  const openBtn = document.getElementById('openGuideBtn');
  const closeBtn = document.getElementById('closeGuideBtn');
  const startGameBtn = document.getElementById('startGameBtn');
  const navbar = document.querySelector('.navbar');
  const videoScreen = document.getElementById('gameVideoScreen');
  const introVideo = document.getElementById('gameIntroVideo');
  const videoSkipBtn = document.getElementById('videoSkipBtn');
  const roleScreen = document.getElementById('gameRoleScreen');
  const roleCards = document.querySelectorAll('.role-selection-card');
  const celebrateOverlay = document.getElementById('roleCelebrateOverlay');
  const celebrateCard = document.getElementById('roleCelebrateCard');
  const celebrateContinueBtn = document.getElementById('celebrateContinueBtn');

  if (!modal || !openBtn || !closeBtn) {
    console.warn('Game guide elements not found');
    return;
  }

  let selectedRole = null;
  let gameScreen = document.getElementById('gamePlayScreen');
  let uiContent = document.getElementById('gameUIContent');

  if (!gameScreen) {
    gameScreen = document.createElement('div');
    gameScreen.id = 'gamePlayScreen';
    gameScreen.className = 'game-play-screen';
    document.getElementById('game')?.appendChild(gameScreen);
  }

  if (!uiContent) {
    uiContent = document.createElement('div');
    uiContent.id = 'gameUIContent';
    uiContent.className = 'game-ui-content';
    uiContent.style.cssText = 'width:100%; height:100%; position:relative; z-index:10;';
    gameScreen.appendChild(uiContent);
  }

  // ==================== BACKGROUND & VIDEO ====================
  function ensureVideoBackground() {
    let videoBackground = document.getElementById('gameVideoBackground');
    if (!videoBackground && gameScreen) {
      videoBackground = document.createElement('video');
      videoBackground.id = 'gameVideoBackground';
      videoBackground.className = 'game-video-background';
      videoBackground.dataset.src = 'public/image/prosessBR.mp4';
      videoBackground.loop = true;
      videoBackground.muted = true;
      videoBackground.playsInline = true;
      videoBackground.preload = 'none';
      videoBackground.style.display = 'none';
      gameScreen.insertBefore(videoBackground, gameScreen.firstChild);
    }
    return videoBackground;
  }

  function updateBackground(path) {
    const videoBackground = document.getElementById('gameVideoBackground');
    if (!path) {
      if (videoBackground) {
        if (!videoBackground.src) {
          videoBackground.src = videoBackground.dataset.src;
          videoBackground.load();
        }
        videoBackground.style.display = 'block';
        videoBackground.play().catch(() => {});
      }
      gameScreen.style.backgroundImage = 'none';
      return;
    }
    if (videoBackground) {
      videoBackground.style.display = 'none';
      videoBackground.pause();
    }
    gameScreen.style.backgroundImage = `url('${path}')`;
    gameScreen.style.backgroundSize = '120%';
    gameScreen.style.backgroundPosition = 'center';
    gameScreen.style.backgroundRepeat = 'no-repeat';
  }

  function enableVideoBackground() {
    const videoBackground = ensureVideoBackground();
    if (videoBackground) {
      if (!videoBackground.src) {
        videoBackground.src = videoBackground.dataset.src;
        videoBackground.load();
      }
      videoBackground.style.cssText = 'display: block !important;';
      if (videoBackground.paused) videoBackground.currentTime = 0;
      videoBackground.play().catch(() => {
        setTimeout(() => videoBackground.play(), 100);
      });
    }
    gameScreen.style.backgroundImage = 'none';
    uiContent.style.backgroundImage = 'none';
  }

  function disableVideoBackground() {
    const videoBackground = document.getElementById('gameVideoBackground');
    if (videoBackground) {
      videoBackground.style.display = 'none';
      videoBackground.pause();
    }
  }

  // ==================== STAGE MANAGEMENT ====================
  function switchStage(stageId) {
    const stages = [
      { id: 'gameHero', el: document.getElementById('gameHero') },
      { id: 'gameVideoScreen', el: videoScreen },
      { id: 'gameRoleScreen', el: roleScreen },
      { id: 'gamePlayScreen', el: gameScreen },
      { id: 'roleCelebrateOverlay', el: celebrateOverlay }
    ];

    stages.forEach(stage => {
      if (!stage.el) return;
      if (stage.id === stageId) {
        stage.el.style.display = (stageId === 'gameRoleScreen' || stageId === 'roleCelebrateOverlay') ? 'flex' : 'block';
        stage.el.classList.add('active');
      } else {
        if (stageId === 'roleCelebrateOverlay' && stage.id === 'gameRoleScreen') return;
        stage.el.style.display = 'none';
        stage.el.classList.remove('active');
      }
    });

    const isGameplay = stageId !== 'gameHero';
    document.documentElement.style.overflow = isGameplay ? 'hidden' : '';
    document.body.style.overflow = isGameplay ? 'hidden' : '';
    window.scrollTo(0, 0);
  }

  // ==================== EVENT HANDLERS ====================
  openBtn.addEventListener('click', () => modal.classList.add('active'));
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => e.target === modal && modal.classList.remove('active'));

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      resetGameState();
      if (navbar) navbar.classList.add('hidden');
      switchStage('gameVideoScreen');
      if (introVideo) {
        if (!introVideo.src) {
          introVideo.src = introVideo.getAttribute('data-src');
          introVideo.load();
        }
        introVideo.currentTime = 0;
        introVideo.play().then(() => {}).catch(() => showRoleSelection());
        introVideo.addEventListener('ended', showRoleSelection, { once: true });
      } else {
        showRoleSelection();
      }
    });
  }

  if (videoSkipBtn && introVideo) {
    videoSkipBtn.addEventListener('click', () => {
      introVideo.pause();
      showRoleSelection();
    });
  }

  function showRoleSelection() {
    if (introVideo) introVideo.pause();
    modal.classList.remove('active');
    switchStage('gameRoleScreen');
  }

  document.querySelectorAll('.role-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedRole = btn.getAttribute('data-role');
      roleCards.forEach(c => c.classList.remove('selected'));
      btn.closest('.role-selection-card').classList.add('selected');
      showCelebrate(selectedRole);
    });
  });

  function showCelebrate(role) {
    const data = ROLE_DATA[role];
    if (!data) return;

    document.getElementById('celebrateRoleName').textContent = data.name;
    document.getElementById('celebratePassive').textContent = data.passive;
    document.getElementById('celebrateDesc').textContent = data.desc;
    document.getElementById('celebrateAvatarImg').src = data.img;
    document.getElementById('celebrateGroupName').textContent = data.groupName;
    document.getElementById('celebrateSubGroup').textContent = data.subGroup;

    celebrateCard.className = `role-celebrate-card ${data.cls}`;
    spawnParticles(data.cls);
    switchStage('roleCelebrateOverlay');
  }

  function spawnParticles(cls) {
    const container = document.getElementById('celebrateParticles');
    if (!container) return;
    container.innerHTML = '';
    const colors = { 'celebrate-state': '#2563EB', 'celebrate-collective': '#16A34A', 'celebrate-private': '#EA580C' };
    const color = colors[cls] || '#F8BD72';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'celebrate-particle';
      p.style.cssText = `background:${color}; left:${Math.random()*100}%; top:${Math.random()*100}%; --tx:${(Math.random()-0.5)*200}px; --ty:${(Math.random()-0.5)*200}px; animation-delay:${Math.random()*0.5}s;`;
      container.appendChild(p);
    }
  }

  if (celebrateContinueBtn) {
    celebrateContinueBtn.addEventListener('click', () => {
      updateState({ role: selectedRole });
      updateBackground(ROLE_DATA[state.role].bgImg);
      startItemPhase();
    });
  }

  // ==================== GAMEPLAY LOGIC ====================
  function showFloatingText(statName, value, overrideColor = null) {
    const statMap = { 'Vốn': 'capital', 'Sức khỏe': 'hp', 'Uy tín': 'reputation' };
    const dataKey = statMap[statName];
    const el = uiContent.querySelector(`[data-stat="${dataKey}"]`);
    if (!el) return;

    const floater = document.createElement('div');
    const numVal = parseFloat(value);
    let color = overrideColor || (numVal < 0 ? '#ef4444' : '#10b981');
    let prefix = (numVal > 0 && typeof value === 'number') ? '+' : '';
    floater.innerText = prefix + (typeof value === 'number' ? Math.floor(value) : value);
    floater.className = 'gps-float-text';
    floater.style.color = color;
    el.parentElement.style.position = 'relative';
    el.parentElement.appendChild(floater);
    setTimeout(() => floater.remove(), 1500);
  }

  function applyEffect(diff) {
    let actualDiffs = { capital: diff.capital || 0, hp: diff.hp || 0, reputation: diff.reputation || 0 };
    if (state.role === 'private') {
      if (actualDiffs.hp < 0) actualDiffs.hp *= 1.25;
      if (actualDiffs.capital > 0) actualDiffs.capital *= 1.2;
    }
    if (state.role === 'state' && actualDiffs.capital < 0) actualDiffs.capital *= 0.8;
    if (state.role === 'state' && (state.hp + actualDiffs.hp) < 30 && !state.armorMacroUsed) {
      actualDiffs.hp += 20;
      updateState({ armorMacroUsed: true });
      setTimeout(() => showFloatingText('Sức khỏe', '+20 Nội Tại', '#3b82f6'), 300);
    }

    const nextCapital = state.capital + actualDiffs.capital;
    const nextHp = Math.max(0, state.hp + actualDiffs.hp);
    const nextRep = Math.max(0, Math.min(100, state.reputation + actualDiffs.reputation));
    
    updateState({ capital: nextCapital, hp: nextHp, reputation: nextRep });
    
    if (actualDiffs.capital !== 0) showFloatingText('Vốn', actualDiffs.capital);
    if (actualDiffs.hp !== 0) showFloatingText('Sức khỏe', actualDiffs.hp);
    if (actualDiffs.reputation !== 0) showFloatingText('Uy tín', actualDiffs.reputation);
  }

  function startItemPhase() {
    switchStage('gamePlayScreen');
    ensureVideoBackground();
    updateBackground('public/image/choItem.webp');
    uiContent.innerHTML = ui.renderItemPhase(state);

    const grid = document.getElementById('gpsItemsGrid');
    const confirmBtn = document.getElementById('gpsConfirmItems');
    let selectedItems = [];

    ITEMS.forEach(it => {
      const finalPrice = state.role === 'collective' ? Math.floor(it.price * 0.8) : it.price;
      const isMatch = it.tag === state.role;
      const card = document.createElement('div');
      card.className = 'gps-item-card';
      card.innerHTML = `
        <img src="${it.img}" alt="${it.name}" class="gps-item-icon">
        <h3 class="gps-item-name">${it.name}</h3>
        <p class="gps-item-tag ${isMatch ? 'tag-match' : ''}">${TAG_NAMES[it.tag]} ${isMatch ? '✓ Khớp' : ''}</p>
        <div class="gps-item-price">${finalPrice} Vốn</div>
        ${state.role === 'collective' && it.price !== finalPrice ? `<span class="gps-item-discount">-20%</span>` : ''}
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) {
          card.classList.remove('selected');
          selectedItems = selectedItems.filter(i => i !== it.id);
          updateState({ capital: state.capital + finalPrice });
        } else {
          card.classList.add('selected');
          selectedItems.push(it.id);
          updateState({ capital: state.capital - finalPrice });
        }
        uiContent.querySelector('.gps-header').outerHTML = ui.renderHeader(state);
        confirmBtn.disabled = selectedItems.length !== 2;
        confirmBtn.textContent = `Tiếp tục (đã chọn ${selectedItems.length}/2 thẻ)`;
      });
      grid.appendChild(card);
    });

    confirmBtn.addEventListener('click', () => {
      updateState({ items: selectedItems });
      const matchCount = selectedItems.map(id => ITEMS.find(i => i.id === id)).filter(it => it.tag === state.role).length;
      if (matchCount === 0) applyEffect({ capital: -state.capital, hp: -state.hp, reputation: -state.reputation });
      else if (matchCount === 1) applyEffect({ capital: -30, hp: -30, reputation: -20 });
      showItemConfirmation(matchCount);
    });
  }

  function showItemConfirmation(matchCount) {
    uiContent.innerHTML = ui.renderItemConfirmation(state, matchCount);
    document.getElementById('gpsStartQuiz').addEventListener('click', () => {
      if (matchCount === 0) showEnding('item_fail');
      else nextTurn();
    });
  }

  function nextTurn() {
    if (state.currentQuizIndex >= 6) {
      if (state.role === 'state' && state.capital < 30 && state.hp > 80 && state.reputation > 60) return showEnding('debt_welfare');
      const isTrue = state.capital > 60 && state.hp > 60 && state.reputation > 60;
      const isBad = state.capital < 30 || state.hp < 30 || state.reputation < 30;
      return showEnding(isTrue ? 'true' : (isBad ? 'bad' : 'normal'));
    }
    enableVideoBackground();
    if (state.role === 'collective') {
      updateState({ capital: state.capital + 2 });
      setTimeout(() => showFloatingText('Vốn', '+2 Nội tại', '#10b981'), 500);
    }
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    updateState({ turnCount: state.currentQuizIndex + 1 });
    uiContent.innerHTML = ui.renderQuizQuestion(state);
    QUIZ_DATA[state.role][state.currentQuizIndex].options.forEach((opt, idx) => {
      document.getElementById(`quizOpt${idx}`).addEventListener('click', () => {
        applyEffect(opt.effect);
        uiContent.innerHTML = ui.renderQuizAnalysis(state, opt);
        document.getElementById('gpsNextQuiz').addEventListener('click', () => {
          updateState({ currentQuizIndex: state.currentQuizIndex + 1 });
          nextTurn();
        });
      });
    });
  }

  function showEnding(type) {
    disableVideoBackground();
    uiContent.innerHTML = ui.renderEnding(state, type);
    document.getElementById('gpsPlayAgain').addEventListener('click', () => {
      resetGameState();
      switchStage('gameVideoScreen');
      if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().catch(() => showRoleSelection());
      }
    });
    document.getElementById('gpsBackHome').addEventListener('click', () => window.location.href = 'index.html');
  }
}
