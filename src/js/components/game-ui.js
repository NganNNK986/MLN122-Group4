import { ROLE_DATA, ITEMS, QUIZ_DATA, TAG_NAMES } from '../data/game-data.js';

export function renderHeader(state) {
  const capitalClass = state.capital < 30 ? 'val-danger' : 'val-good';
  const hpClass = state.hp < 30 ? 'val-danger' : 'val-good';
  const repClass = state.reputation < 40 ? 'val-danger' : (state.reputation >= 60 ? 'val-good' : 'val-warning');
  const roleName = state.role ? ROLE_DATA[state.role].name : '—';
  
  return `
    <div class="gps-header">
      <div class="gps-header-left">
        <span class="gps-role-badge">${roleName}</span>
        <span class="gps-turn">Lượt ${state.turnCount}</span>
      </div>
      <div class="gps-stats-row">
        <div class="gps-stat">
          <img src="public/image/icon-capital.webp" alt="Vốn" class="gps-stat-icon">
          <span class="gps-stat-label">Vốn</span>
          <span class="gps-stat-value ${capitalClass}" data-stat="capital">${Math.floor(state.capital)}</span>
        </div>
        <div class="gps-stat">
          <img src="public/image/icon-hp.webp" alt="Sức khỏe" class="gps-stat-icon">
          <span class="gps-stat-label">Sức khỏe</span>
          <span class="gps-stat-value ${hpClass}" data-stat="hp">${Math.floor(state.hp)}</span>
        </div>
        <div class="gps-stat">
          <img src="public/image/icon-reputation.webp" alt="Uy tín" class="gps-stat-icon">
          <span class="gps-stat-label">Uy tín</span>
          <span class="gps-stat-value ${repClass}" data-stat="reputation">${state.reputation}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderItemPhase(state) {
  return `
    ${renderHeader(state)}
    <div class="gps-body">
      <div class="gps-phase-header">
        <span class="gps-phase-tag">Giai đoạn 3</span>
        <h2 class="gps-phase-title">Xây dựng Lực lượng Sản xuất</h2>
        <p class="gps-phase-desc">Chọn <strong>2 Items chiến lược</strong>. Hãy cẩn thận: Chọn sai Items không phù hợp với vai trò sẽ khiến doanh nghiệp <strong>khủng hoảng hoặc phá sản</strong> ngay lập tức!</p>
      </div>
      <div class="gps-items-grid" id="gpsItemsGrid"></div>
      <div class="gps-action-row">
        <button class="gps-btn gps-btn-primary" id="gpsConfirmItems" disabled>
          Tiếp tục (đã chọn 0/2 thẻ)
        </button>
      </div>
    </div>
  `;
}

export function renderQuizQuestion(state) {
  const roleQuestions = QUIZ_DATA[state.role];
  const q = roleQuestions[state.currentQuizIndex];
  
  return `
    ${renderHeader(state)}
    <div class="gps-body gps-center-body">
      <div class="gps-event-card">
        <div class="gps-card-top-bar" style="background: #3b82f6"></div>
        
        <div class="gps-event-main-content">
          <div class="gps-event-tier" style="color: #3b82f6">Câu hỏi ${state.turnCount}/6</div>
          <h2 class="gps-event-name">Thử thách Chiến lược</h2>
          <div class="gps-event-story" style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem;">
            ${q.question}
          </div>
        </div>

        <div class="gps-event-sep"></div>

        <div class="gps-event-actions-area">
          <div class="gps-quiz-options" style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
            ${q.options.map((opt, idx) => `
              <button class="gps-event-option" id="quizOpt${idx}" style="text-align: left; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem;">
                <span class="gps-opt-key">${idx + 1}</span>
                <div style="font-size: 1rem; font-weight: 500;">${opt.text}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderItemConfirmation(state, matchCount) {
  const selectedItemObjs = state.items.map(id => ITEMS.find(i => i.id === id));
  
  let resultTitle = "Chuẩn bị Hoàn tất!";
  let resultDesc = "Lực lượng sản xuất đã sẵn sàng để bước vào giai đoạn vận hành thực tế.";
  let icon = "✅";
  let color = "#10b981";
  let penaltyHTML = "";

  if (matchCount === 0) {
    resultTitle = "Thất Bại Chiến Lược!";
    resultDesc = "Toàn bộ vật phẩm bạn chọn không phù hợp với vai trò hiện tại. Doanh nghiệp sụp đổ ngay lập tức do thiếu định hướng cốt lõi.";
    icon = "❌";
    color = "#ef4444";
    penaltyHTML = `
      <div class="gps-penalty-box" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: #ef4444; font-weight: bold; text-align: center;">
        HỆ QUẢ: DOANH NGHIỆP PHÁ SẢN LẬP TỨC
      </div>
    `;
  } else if (matchCount === 1) {
    resultTitle = "Cảnh báo: Sai lệch Chiến lược!";
    resultDesc = "Bạn đã chọn một Item không phù hợp với bản chất vai trò của mình. Điều này gây ra sự lãng phí và mâu thuẫn trong quản lý.";
    icon = "⚠️";
    color = "#f59e0b";
    penaltyHTML = `
      <div class="gps-penalty-box" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: #ef4444; font-weight: bold;">
        Hệ quả: Vốn -30, Sức khỏe -30, Uy tín -20
      </div>
    `;
  }

  return `
    ${renderHeader(state)}
    <div class="gps-body gps-center-body">
      <div class="gps-event-card">
        <div class="gps-card-top-bar" style="background: ${color}"></div>
        
        <div class="gps-event-main-content">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem; text-align: center;">${icon}</div>
          <h2 class="gps-event-name" style="text-align: center;">${resultTitle}</h2>
          <div class="gps-event-story" style="font-size: 1.1rem; line-height: 1.6; text-align: center; margin-bottom: 1rem;">
            ${resultDesc}
          </div>

          ${penaltyHTML}

          <div class="gps-confirm-items-list" style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem;">
            ${selectedItemObjs.map(it => {
              const isMatch = it.tag === state.role;
              return `
              <div class="gps-mini-item" style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 2px solid ${isMatch ? '#10b981' : '#ef4444'}; width: 180px; text-align: center;">
                <img src="${it.img}" style="width: 35px; height: 35px; margin-bottom: 5px;">
                <div style="font-size: 0.9rem; font-weight: bold; color: #fff;">${it.name}</div>
                <div style="font-size: 0.7rem; color: ${isMatch ? '#10b981' : '#ef4444'}; margin: 5px 0;">
                  ${isMatch ? '✓ Phù hợp vai trò' : '✗ Sai lệch vai trò'}
                </div>
                <p style="font-size: 0.75rem; font-style: italic; opacity: 0.8; margin: 0; line-height: 1.2;">
                  ${it.desc}
                </p>
              </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="gps-event-actions-area">
          <button class="gps-btn gps-btn-primary" id="gpsStartQuiz" style="width: 100%; padding: 1.1rem; font-size: 1.05rem;">
            ${matchCount === 0 ? 'Xem kết quả cuối cùng →' : 'Bắt đầu Vận hành →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderQuizAnalysis(state, option) {
  return `
    ${renderHeader(state)}
    <div class="gps-body gps-center-body">
      <div class="gps-event-card">
        <div class="gps-card-top-bar" style="background: #10b981"></div>
        
        <div class="gps-event-main-content">
          <div class="gps-event-tier" style="color: #10b981">Phân tích kết quả</div>
          <h2 class="gps-event-name">Hệ quả Quyết định</h2>
          <div class="gps-event-story" style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #10b981;">
            ${option.explanation}
          </div>
          
          <div class="gps-quiz-impacts" style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${Object.entries(option.effect).map(([key, val]) => {
              const labelMap = { capital: 'Vốn', reputation: 'Uy tín', hp: 'Sức khỏe' };
              const color = val > 0 ? '#10b981' : '#ef4444';
              const sign = val > 0 ? '+' : '';
              return `<div style="background: rgba(0,0,0,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; color: ${color}; border: 1px solid ${color}44;">
                ${labelMap[key] || key}: ${sign}${val}
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="gps-event-sep"></div>

        <div class="gps-event-actions-area" style="display: flex; justify-content: flex-end;">
          <button class="gps-btn gps-btn-primary" id="gpsNextQuiz" style="min-width: 200px;">
            ${state.currentQuizIndex >= 5 ? 'Xem kết quả cuối cùng →' : 'Câu hỏi tiếp theo →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderEnding(state, type) {
  const endings = {
    true: {
      title: 'Kỷ Nguyên Hưng Thịnh',
      subtitle: 'DÂN GIÀU - NƯỚC MẠNH',
      category: 'Thành Công Tuyệt Đối',
      desc: 'Chúc mừng! Bạn đã xây dựng thành công một mô hình kinh tế lý tưởng, nơi các thành phần kinh tế vận hành nhịp nhàng, tạo ra sự thặng dư lớn cho xã hội và sự tin tưởng tuyệt đối từ nhân dân.',
      consequences: [
        'Kinh tế tăng trưởng bền vững nhờ phân bổ nguồn lực tối ưu.',
        'Chỉ số hạnh phúc đạt đỉnh cùng sự công bằng xã hội được đảm bảo.',
        'Vị thế kinh tế quốc gia được khẳng định vững chắc trên trường quốc tế.'
      ],
      lesson: 'Sự phối hợp chặt chẽ giữa các thành phần kinh tế dưới sự điều tiết hợp lý là chìa khóa cho sự phát triển bền vững.',
      color: '#10b981',
      bgImg: 'public/image/dan_giau_nuoc_manh.webp'
    },
    normal: {
      title: 'Ổn Định & Phát Triển',
      subtitle: 'TIỀM NĂNG CÒN BỎ NGỎ',
      category: 'Thành Công Một Phần',
      desc: 'Doanh nghiệp của bạn đã vượt qua các thử thách và đạt được mức tăng trưởng ổn định. Tuy nhiên, vẫn còn những mâu thuẫn nhỏ và tiềm năng chưa được khai thác hết.',
      consequences: [
        'Duy trì thị phần và lợi nhuận ổn định qua các giai đoạn.',
        'Đời sống nhân viên và người lao động được cải thiện đáng kể.',
        'Cần thêm các chính sách cải cách mạnh mẽ để đạt bứt phá.'
      ],
      lesson: 'Trong kinh tế xã hội chủ nghĩa, "tồn tại" chưa đủ - cần không ngừng phấn đấu để phát triển mạnh mẽ và bền vững hơn.',
      color: '#3b82f6',
      bgImg: 'public/image/bg-ending-normal.webp'
    },
    bad: {
      title: 'Khủng Hoảng Suy Thoái',
      subtitle: 'BÀI HỌC VỀ SỰ MẤT CÂN ĐỐI',
      category: 'Hạn Chế',
      desc: 'Mô hình kinh tế của bạn gặp phải nhiều trục trặc nghiêm trọng. Sự thiếu hụt nguồn lực hoặc mất niềm tin từ xã hội đã đẩy doanh nghiệp vào tình trạng bế tắc.',
      consequences: [
        'Các chỉ số quan trọng rơi xuống ngưỡng nguy hiểm.',
        'Nguồn lực bị cạn kiệt hoặc sử dụng sai mục tiêu chiến lược.',
        'Cần phải thay đổi hoàn toàn tư duy quản trị để cứu vãn tình hình.'
      ],
      lesson: 'Kinh tế là sự cân bằng nghệ thuật. Sự mất cân đối quá lớn ở bất kỳ chỉ số nào cũng dẫn đến hệ quả dây chuyền tồi tệ.',
      color: '#f59e0b',
      bgImg: 'public/image/bg-ending-bad.webp'
    },
    debt_welfare: {
      title: 'Hy Sinh Vì An Sinh',
      subtitle: 'NỢ CÔNG VÌ NHÂN DÂN',
      category: 'Thành Công Nhân Văn',
      desc: 'Mặc dù ngân sách Nhà nước rơi vào tình trạng thâm hụt (nợ công), nhưng bạn đã ưu tiên tuyệt đối cho sức khỏe và phúc lợi của nhân dân. Đây là một sự đánh đổi đầy rủi ro nhưng mang tính nhân văn sâu sắc.',
      consequences: [
        'Chỉ số sức khỏe cộng đồng đạt mức ấn tượng nhờ đầu tư mạnh tay.',
        'Niềm tin của nhân dân được duy trì nhưng gánh nặng tài chính là thách thức lớn.',
        'Cần một lộ trình thắt lưng buộc bụng và cải cách thuế để cân bằng ngân sách.'
      ],
      lesson: 'Trong định hướng xã hội chủ nghĩa, con người là trung tâm. Tuy nhiên, bền vững tài chính là điều kiện cần để duy trì phúc lợi lâu dài.',
      color: '#8b5cf6',
      bgImg: 'public/image/bg-ending-debt-welfare.webp'
    },
    item_fail: {
      title: 'Sai Lầm Chiến Lược',
      subtitle: 'THẤT BẠI NGAY TỪ ĐẦU',
      category: 'Thất Bại',
      desc: 'Bạn đã chọn toàn bộ vật phẩm không phù hợp với vai trò của mình. Doanh nghiệp sụp đổ ngay lập tức do thiếu định hướng và mâu chuẫn cốt lõi.',
      consequences: [
        'Chiến lược sai lầm khi tư liệu sản xuất không khớp với mô hình.',
        'Nội bộ tan rã do không tìm được tiếng nói chung.',
        'Doanh nghiệp phá sản lập tức trước khi bắt đầu vận hành.'
      ],
      lesson: 'Lực lượng sản xuất phải phù hợp với Quan hệ sản xuất. Chọn sai công cụ cho mô hình sẽ dẫn đến sự sụp đổ nhanh chóng.',
      color: '#ef4444',
      bgImg: 'public/image/bg-ending-bad.webp'
    }
  };

  const end = endings[type] || endings.normal;
  const roleName = state.role ? ROLE_DATA[state.role].name : '—';
  const capitalLabel = (state.role === 'state' && state.capital < 0) ? 'Nợ công' : 'Vốn còn lại';
  const capitalDisplay = (state.role === 'state' && state.capital < 0) ? Math.abs(Math.floor(state.capital)) : Math.floor(state.capital);

  return `
    <div class="gps-ending-screen">
      <div class="gps-ending-container">
        <div class="gps-ending-image-side">
          <img src="${end.bgImg}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, transparent 70%, rgba(15, 23, 42, 0.3));"></div>
        </div>

        <div class="gps-ending-content-side">
          <div class="gps-ending-header" style="margin-bottom: 2rem;">
            <div style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: ${end.color}; margin-bottom: 0.5rem;">
              ${end.category}
            </div>
            <h1 style="font-size: 2.75rem; font-weight: 800; color: white; margin: 0; line-height: 1.1;">
              ${end.title}
            </h1>
            <div style="font-size: 1.1rem; font-weight: 500; color: ${end.color}; margin-top: 0.5rem; opacity: 0.8;">
              ${end.subtitle}
            </div>
          </div>

          <div class="gps-ending-scroll-content">
            <div style="margin-bottom: 2rem;">
              <p style="font-size: 1.1rem; line-height: 1.6; color: rgba(255,255,255,0.9); margin: 0;">
                ${end.desc}
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700;">Vai trò</span>
                <span style="font-size: 1.2rem; font-weight: 600; color: white;">${roleName}</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700;">Sức khỏe</span>
                <span style="font-size: 1.2rem; font-weight: 600; color: white;">${Math.floor(state.hp)}</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700;">${capitalLabel}</span>
                <span style="font-size: 1.2rem; font-weight: 600; color: ${state.capital <= 0 ? '#ef4444' : '#10b981'};">${capitalDisplay}</span>
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700;">Uy tín xã hội</span>
                <span style="font-size: 1.2rem; font-weight: 600; color: white;">${state.reputation}/100</span>
              </div>
            </div>

            <div style="margin-bottom: 2rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: white; text-transform: uppercase; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
                <span style="width: 4px; height: 16px; background: ${end.color}; border-radius: 2px;"></span>
                Phân tích kết cục
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${end.consequences.map(c => `
                  <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                    <div style="width: 8px; height: 8px; background: ${end.color}; border-radius: 50%; margin-top: 0.45rem; flex-shrink: 0;"></div>
                    <span style="font-size: 1rem; color: rgba(255,255,255,0.85); line-height: 1.5;">${c}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="background: ${end.color}15; padding: 1.75rem; border-radius: 16px; border-left: 5px solid ${end.color}; margin-bottom: 2rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: ${end.color}; font-size: 0.95rem; text-transform: uppercase; font-weight: 800;">Bài học kinh tế</h4>
              <p style="margin: 0; font-size: 1.05rem; color: rgba(255,255,255,0.95); font-style: italic; line-height: 1.6;">
                "${end.lesson}"
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: auto; padding-top: 2rem;">
            <button id="gpsPlayAgain" class="gps-btn" style="flex: 1.5; background: ${end.color}; color: white;">
              CHƠI LẠI
            </button>
            <button id="gpsBackHome" class="gps-btn" style="flex: 1; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white;">
              VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
