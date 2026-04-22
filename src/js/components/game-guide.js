// Game Guide Modal Handler + Full Game Flow
export function initGameGuide() {
  console.log('🎮 Initializing Game Guide...');

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

  // Kiểm tra các elements quan trọng
  console.log('📋 Elements check:', {
    modal: !!modal,
    startGameBtn: !!startGameBtn,
    videoScreen: !!videoScreen,
    introVideo: !!introVideo,
    roleScreen: !!roleScreen,
    celebrateOverlay: !!celebrateOverlay,
    celebrateCard: !!celebrateCard,
    celebrateContinueBtn: !!celebrateContinueBtn,
    roleCardsCount: roleCards.length
  });

  let selectedRole = null;

  // ==================== BACKGROUND UPDATER ====================
  function updateBackground(path) {
    const videoBackground = document.getElementById('gameVideoBackground');
    
    if (!path) {
      // Nếu không có path, hiển thị video background
      if (videoBackground) {
        videoBackground.style.display = 'block';
        videoBackground.play().catch(err => console.log('Video autoplay prevented:', err));
      }
      gameScreen.style.backgroundImage = 'none';
      return;
    }
    
    // Nếu có path ảnh, ẩn video và hiển thị ảnh
    if (videoBackground) {
      videoBackground.style.display = 'none';
      videoBackground.pause();
    }
    
    gameScreen.style.backgroundImage = `url('${path}')`;
    gameScreen.style.backgroundSize = '120%'; // Đảm bảo scale 120%
    gameScreen.style.backgroundPosition = 'center';
    gameScreen.style.backgroundRepeat = 'no-repeat';
  }
  
  // Function để bật video background cho phần 4
  function enableVideoBackground() {
    const videoBackground = ensureVideoBackground(); // Đảm bảo video đã được tạo
    if (videoBackground) {
      console.log('🎬 Enabling video background...');
      console.log('📹 Video element before display:', {
        exists: !!videoBackground,
        src: videoBackground.src,
        currentDisplay: videoBackground.style.display,
        parentElement: videoBackground.parentElement?.id,
        readyState: videoBackground.readyState,
        videoWidth: videoBackground.videoWidth,
        videoHeight: videoBackground.videoHeight
      });
      
      // Force display block với !important
      videoBackground.style.cssText = 'display: block !important;';
      
      if (videoBackground.paused) {
        videoBackground.currentTime = 0; // Chỉ reset khi bắt đầu chuỗi sự kiện mới
      }
      
      // Đảm bảo video có các thuộc tính cần thiết
      videoBackground.muted = true;
      videoBackground.loop = true;
      videoBackground.playsInline = true;
      
      // Kiểm tra computed style
      const computedStyle = window.getComputedStyle(videoBackground);
      console.log('📹 Video computed style:', {
        display: computedStyle.display,
        position: computedStyle.position,
        zIndex: computedStyle.zIndex,
        width: computedStyle.width,
        height: computedStyle.height,
        opacity: computedStyle.opacity,
        visibility: computedStyle.visibility
      });
      
      const playPromise = videoBackground.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Video playing successfully');
            console.log('📹 Video state:', {
              paused: videoBackground.paused,
              currentTime: videoBackground.currentTime,
              duration: videoBackground.duration,
              readyState: videoBackground.readyState
            });
          })
          .catch(err => {
            console.error('⚠️ Video autoplay prevented:', err);
            // Thử play lại sau một chút
            setTimeout(() => {
              videoBackground.play().catch(e => console.error('❌ Video play retry failed:', e));
            }, 100);
          });
      }
    } else {
      console.error('❌ Video background element not found');
    }
    // Ẩn background image của cả màn hình và container nội dung
    gameScreen.style.backgroundImage = 'none';
    uiContent.style.backgroundImage = 'none';
  }
  
  // Function để tắt video background khi chuyển sang phần 5
  function disableVideoBackground() {
    const videoBackground = document.getElementById('gameVideoBackground');
    if (videoBackground) {
      videoBackground.style.display = 'none';
      videoBackground.pause();
    }
  }

  // ==================== GAME STATE ====================
  let state = {
    capital: 120,
    hp: 100,
    sp: 0,
    reputation: 50,
    progress: 0,
    role: null,
    items: [],
    unlockedEventIds: [],
    usedEventIds: [], // Track events đã sử dụng
    flavorText: '',
    armorMacroUsed: false,
    turnCount: 0
  };

  const ROLE_DATA = {
    state: {
      name: 'Nhà nước',
      passive: 'ARMOR_MACRO',
      desc: 'Nội tại: HP < 35 hồi 25 HP. Giảm mọi thiệt hại Vốn từ sự kiện đi 20%.',
      img: 'public/image/role-state.png',
      cls: 'celebrate-state',
      groupName: 'Sở hữu công',
      subGroup: 'Sở hữu toàn dân',
      bgImg: 'public/image/bg-stage2-state.png'
    },
    collective: {
      name: 'Tập thể',
      passive: 'DISCOUNT_GROUP',
      desc: 'Nội tại: Giảm giá Item 20%. Cộng thêm 2 Vốn mỗi lượt chơi (Chi phí vận hành thấp).',
      img: 'public/image/role-collective.png',
      cls: 'celebrate-collective',
      groupName: 'Sở hữu công',
      subGroup: 'Sở hữu tập thể',
      bgImg: 'public/image/bg-stage2-collective.png'
    },
    private: {
      name: 'Tư nhân',
      passive: 'SPEED_RISK',
      desc: 'Nội tại: Tiến độ mỗi lượt x1.2. Sát thương trừ HP x1.25.',
      img: 'public/image/role-private.png',
      cls: 'celebrate-private',
      groupName: 'Sở hữu tư',
      subGroup: 'Sở hữu tư nhân trong nước',
      bgImg: 'public/image/bg-stage2-private.png'
    },
    fdi: {
      name: 'Vốn Nước ngoài',
      passive: 'TECH_TRANSFER',
      desc: 'Nội tại: SP += 2, Vốn +20 đầu game/ -20 cuối game. Giảm mất Uy tín 10%.',
      img: 'public/image/role-fdi.png',
      cls: 'celebrate-fdi',
      groupName: 'Sở hữu tư',
      subGroup: 'Vốn đầu tư nước ngoài',
      bgImg: 'public/image/bg-stage2-fdi.png'
    }
  };

  const ITEMS = [
    { id: 'IT01', name: 'Hệ thống Dữ liệu Bộ', tag: 'state', price: 35, img: 'public/image/item-it01-database.png' },
    { id: 'IT02', name: 'Khai thác Hạ tầng', tag: 'state', price: 35, img: 'public/image/item-it02-infrastructure.png' },
    { id: 'IT03', name: 'Đất Nông nghiệp', tag: 'collective', price: 30, img: 'public/image/item-it03-farmland.png' },
    { id: 'IT04', name: 'Dây chuyền Nông sản', tag: 'collective', price: 30, img: 'public/image/item-it04-agri-production.png' },
    { id: 'IT05', name: 'AI Chốt đơn', tag: 'private', price: 45, img: 'public/image/item-it05-ai-sales.png' },
    { id: 'IT06', name: 'Kho bãi Logistics', tag: 'private', price: 45, img: 'public/image/item-it06-logistics.png' },
    { id: 'IT07', name: 'Robot lắp ráp', tag: 'fdi', price: 45, img: 'public/image/item-it07-robot.png' },
    { id: 'IT08', name: 'Vi mạch lõi', tag: 'fdi', price: 55, img: 'public/image/item-it08-microchip.png' }
  ];

  const TAG_NAMES = {
    state: 'Nhà nước',
    collective: 'Tập thể',
    private: 'Tư nhân',
    fdi: 'Vốn Nước ngoài'
  };

  const EVENTS = {
    tier1: [
      {
        id: 'A', name: 'Tối ưu Quy trình', tier: 'Cọ xát Vi mô', bgImg: 'public/image/toi_ưu_tien_trinh.png',
        desc: 'Hệ thống vận hành cũ bộc lộ điểm nghẽn, làm giảm hiệu suất chung của toàn doanh nghiệp.',
        customLayoutBottomRight: true,
        opt1: { name: 'Mời chuyên gia', desc: '-15 Vốn, +2 Tương thích, +10 Uy tín', effect: () => { applyEffect({ capital: -15, sp: 2, reputation: 10 }); } },
        opt2: { name: 'Ép nhân viên tự làm', desc: '+15 Vốn (Cắt giảm chi phí), +15% Tiến độ, -15 Uy tín, -2 Tương thích', effect: () => { applyEffect({ capital: 15, progress: 15, reputation: -15, sp: -2 }); } }
      },
      {
        id: 'B', name: 'Thiếu Vật tư', tier: 'Cọ xát Vi mô', bgImg: 'public/image/bg-stage4-tier1.png',
        desc: 'Đối tác truyền thống gặp sự cố, trong khi đơn hàng lớn cần bàn giao gấp trong tuần tới.',
        opt1: { name: 'Mua chợ đen', desc: '-10 Vốn, +15% Tiến độ, -15 Uy tín', effect: () => { applyEffect({ capital: -10, progress: 15, reputation: -15 }); } },
        opt2: { name: 'Chờ đối tác chuẩn', desc: '+5 Vốn (Tối ưu chi phí), -5 Sức khỏe, +10 Uy tín', effect: () => { applyEffect({ capital: 5, hp: -5, reputation: 10 }); } }
      },
      {
        id: 'G', name: 'Đào tạo Nhân sự', tier: 'Cọ xát Vi mô', bgImg: 'public/image/dao_tao_nhan_su.jpg',
        desc: 'Công nghệ mới được nhập về nhưng đội ngũ hiện tại chưa đủ kỹ năng vận hành trơn tru.',
        customLayoutCenterWhite: true,
        opt1: { name: 'Mở lớp nội bộ', desc: '-10 Vốn, +1 Tương thích, +5 Uy tín', effect: () => { applyEffect({ capital: -10, sp: 1, reputation: 5 }); } },
        opt2: { name: 'Thuê ngoài', desc: '-5 Vốn, +10% Tiến độ', effect: () => { applyEffect({ capital: -5, progress: 10 }); } }
      },
      {
        id: 'J', name: 'Hạ tầng số yếu kém', tier: 'Cọ xát Vi mô', bgImg: 'public/image/ha_tang_so_yeu_kem.png',
        desc: 'Hệ thống bị lag và treo trong giờ cao điểm do hạ tầng máy chủ cũ kỹ.',
        customLayoutBottomRight: true,
        opt1: { name: 'Nâng cấp server', desc: '-15 Vốn, +1 Tương thích, +5 Uy tín', effect: () => { applyEffect({ capital: -15, sp: 1, reputation: 5 }); } },
        opt2: { name: 'Vá lỗi tạm thời', desc: '+5% Tiến độ, -5 Tương thích, -10 Sức khỏe', effect: () => { applyEffect({ progress: 5, sp: -5, hp: -10 }); } }
      },
      {
        id: 'K', name: 'Cơ hội kết nối', tier: 'Cọ xát Vi mô', bgImg: 'public/image/co_hoi_ket_noi.jpg',
        desc: 'Một hộ kinh doanh địa phương muốn tham gia vào chuỗi cung ứng của bạn.',
        customLayout: true, // Flag để positioning đặc biệt
        opt1: { name: 'Hợp tác hỗ trợ', desc: '-10 Vốn, +2 Tương thích, +5 Uy tín', effect: () => { applyEffect({ capital: -10, sp: 2, reputation: 5 }); } },
        opt2: { name: 'Từ chối', desc: '+5% Tiến độ (Tập trung nguồn lực)', effect: () => { applyEffect({ progress: 5 }); } }
      }
    ],
    tier2: [
      {
        id: 'C', name: 'Xung đột Lao động', tier: 'Đạo đức & Lợi ích', bgImg: 'public/image/bg-stage4-tier2.png',
        desc: 'Cường độ làm việc cao khiến công nhân mệt mỏi, bắt đầu xuất hiện tin đồn đình công.',
        opt1: { name: 'Tăng phúc lợi', desc: '-20 Vốn, +20 Uy tín', effect: () => { applyEffect({ capital: -20, reputation: 20 }); } },
        opt2: { name: 'Đuổi việc', desc: '+10 Vốn (Tiết kiệm lương), -20 Uy tín, -15 Sức khỏe', effect: () => { applyEffect({ capital: 10, reputation: -20, hp: -15 }); } }
      },
      {
        id: 'D', name: 'Thanh tra', tier: 'Đạo đức & Lợi ích', bgImg: 'public/image/bg-stage4-tier2.png',
        desc: 'Đoàn kiểm tra liên ngành ghé thăm đột xuất rà soát tiêu chuẩn và bảo vệ môi trường.',
        opt1: { name: 'Bôi trơn', desc: '+15% Tiến độ, -25 Vốn, -20 Uy tín', effect: () => { applyEffect({ progress: 15, capital: -25, reputation: -20 }); } },
        opt2: { name: 'Hợp tác', desc: '-10 Vốn, +10 Uy tín, +1 Tương thích', effect: () => { applyEffect({ capital: -10, reputation: 10, sp: 1 }); } }
      },
      {
        id: 'H', name: 'Scandal Truyền thông', tier: 'Đạo đức & Lợi ích', bgImg: 'public/image/bg-stage4-tier2.png',
        desc: 'Báo chí đăng tin thiếu khách quan về quy trình sản xuất của bạn, cộng đồng mạng phẫn nộ.',
        opt1: { name: 'Họp báo xin lỗi', desc: '-15 Vốn, +15 Uy tín', effect: () => { applyEffect({ capital: -15, reputation: 15 }); } },
        opt2: { name: 'Im lặng', desc: '+10 Vốn (Không tốn truyền thông), -25 Uy tín', effect: () => { applyEffect({ capital: 10, reputation: -25 }); } }
      },
      {
        id: 'L', name: 'Tiêu chuẩn Xanh', tier: 'Đạo đức & Lợi ích', bgImg: 'public/image/bg-stage4-tier2.png',
        desc: 'Quy định mới về bảo vệ môi trường yêu cầu doanh nghiệp phải có hệ thống lọc thải đạt chuẩn.',
        opt1: { name: 'Lắp bộ lọc chuẩn', desc: '-20 Vốn, +20 Uy tín (Phát triển bền vững)', effect: () => { applyEffect({ capital: -20, reputation: 20 }); } },
        opt2: { name: 'Vận động trì hoãn', desc: '+10 Vốn, -15 Uy tín, -5 Sức khỏe', effect: () => { applyEffect({ capital: 10, reputation: -15, hp: -5 }); } }
      },
      {
        id: 'M', name: 'Tối ưu Thuế', tier: 'Đạo đức & Lợi ích', bgImg: 'public/image/bg-stage4-tier2.png',
        desc: 'Kế toán trưởng đề xuất một phương án "tối ưu" thuế thông qua các kẽ hở pháp lý mới.',
        opt1: { name: 'Đóng đủ nghĩa vụ', desc: '+15 Uy tín, -15 Vốn', effect: () => { applyEffect({ reputation: 15, capital: -15 }); } },
        opt2: { name: 'Tối ưu tối đa', desc: '+20 Vốn, -25 Uy tín', effect: () => { applyEffect({ capital: 20, reputation: -25 }); } }
      }
    ],
    tier3: [
      {
        id: 'E', name: 'Siết nợ', tier: 'Khủng hoảng Vĩ mô', bgImg: 'public/image/bg-stage4-tier3.png',
        desc: 'Dòng tiền bị nghẽn mạch do nợ xấu từ đối tác, ngân hàng thắt chặt hạn mức tín dụng.',
        opt1: { name: 'Vay tín dụng đen', desc: '+30 Vốn, -30 Uy tín, -20 Sức khỏe', effect: () => { applyEffect({ capital: 30, reputation: -30, hp: -20 }); } },
        opt2: { name: 'Cắt giảm phòng thủ', desc: '-20% Tiến độ, +10 Uy tín', effect: () => { applyEffect({ progress: -20, reputation: 10 }); } }
      },
      {
        id: 'F', name: 'Bão Thị trường', tier: 'Khủng hoảng Vĩ mô', bgImg: 'public/image/bg-stage4-tier3.png',
        desc: 'Nhu cầu toàn cầu giảm sâu, hàng tồn kho bắt đầu chạm ngưỡng báo động đỏ.',
        opt1: { name: 'Phá giá hốt cú chót', desc: '+20% Tiến độ, -30 Uy tín, -25 Sức khỏe', effect: () => { applyEffect({ progress: 20, reputation: -30, hp: -25 }); } },
        opt2: { name: 'Giữ giá bảo vệ TH', desc: '-20 Vốn, +20 Uy tín', effect: () => { applyEffect({ capital: -20, reputation: 20 }); } }
      },
      {
        id: 'I', name: 'Đối thủ Phá giá', tier: 'Khủng hoảng Vĩ mô', bgImg: 'public/image/bg-stage4-tier3.png',
        desc: 'Đối thủ lớn tung chiến dịch giảm giá sốc nhằm thâu tóm toàn bộ thị phần của bạn.',
        opt1: { name: 'Giảm giá cạnh tranh', desc: '-25 Vốn, +15% Tiến độ', effect: () => { applyEffect({ capital: -25, progress: 15 }); } },
        opt2: { name: 'Giữ chất lượng', desc: '+5 Vốn (Duy trì biên lợi nhuận), -10 Sức khỏe, +15 Uy tín', effect: () => { applyEffect({ capital: 5, hp: -10, reputation: 15 }); } }
      },
      {
        id: 'N', name: 'Đứt gãy Chuỗi cung ứng', tier: 'Khủng hoảng Vĩ mô', bgImg: 'public/image/bg-stage4-tier3.png',
        desc: 'Khủng hoảng vận tải toàn cầu khiến nguyên liệu đầu vào bị đình trệ nghiêm trọng.',
        opt1: { name: 'Vận tải hàng không', desc: '-30 Vốn, +10% Tiến độ (Cứu vãn tiến độ)', effect: () => { applyEffect({ capital: -30, progress: 10 }); } },
        opt2: { name: 'Chấp nhận chờ đợi', desc: '-15% Tiến độ, +15 Uy tín (Bình ổn giá)', effect: () => { applyEffect({ progress: -15, reputation: 15 }); } }
      },
      {
        id: 'O', name: 'Cách mạng AI', tier: 'Khủng hoảng Vĩ mô', bgImg: 'public/image/bg-stage4-tier3.png',
        desc: 'Công nghệ AI bùng nổ, đối thủ đang số hóa toàn bộ quy trình để ép chết các doanh nghiệp truyền thống.',
        opt1: { name: 'Chuyển đổi tổng lực', desc: '-35 Vốn, +3 Tương thích, +20% Tiến độ', effect: () => { applyEffect({ capital: -35, sp: 3, progress: 20 }); } },
        opt2: { name: 'Thích nghi dần dần', desc: '+10% Tiến độ, -10 Vốn', effect: () => { applyEffect({ progress: 10, capital: -10 }); } }
      }
    ]
  };

  const IDEOLOGY_GROUP = {
    state: 'public',
    collective: 'public',
    private: 'private',
    fdi: 'private'
  };

  const CONTRADICTIONS = {
    state: {
      title: '🏛️🌪️ Tư hữu hoá Quá khích',
      desc: 'Tư nhân hoá điện lưới và dữ liệu bộ khiến An ninh kinh tế lung lay. Lợi nhuận cao nhưng uy tín chạm đáy.',
      bonus: { capital: 40, reputation: -40, hp: -15 },
      unlockEventId: 'HIDDEN_STATE_PRIVATIZE',
      flavor: 'Cơ sở hạ tầng đang dần chuyển sang vận hành theo mô hình lợi nhuận tư nhân.',
      bgImg: 'public/image/bg-egg-state-privatize.png'
    },
    collective: {
      title: '🤝🌪️ Hệ luỵ "Nhảy Cóc" Công nghệ',
      desc: 'Nông dân phải cày code C++ để sửa AI robot. Ngân sách Hợp tác xã thâm hụt nặng nề để trả lương kỹ sư ngoại quốc.',
      bonus: { capital: -20, hp: -30, progress: 15 },
      unlockEventId: 'HIDDEN_COLL_TECH_JUMP',
      flavor: 'Đội ngũ nông dân đang nỗ lực học lập trình để vận hành dây chuyền robot ngoại nhập.',
      bgImg: 'public/image/bg-egg-coll-tech.png'
    },
    private: {
      title: '💼🌪️ Bội thực Bộ máy',
      desc: 'Ôm đồm hạ tầng công và đất nông nghiệp khiến doanh nghiệp phình to, đánh mất tính linh hoạt vốn có.',
      bonus: { hp: -30, sp: -2, progress: -10, reputation: 20 },
      unlockEventId: 'HIDDEN_PRIV_OVERSIZE',
      flavor: 'Quy trình quản trị đang trở nên cồng kềnh do gánh vác quá nhiều hạ tầng công vật lý.',
      bgImg: 'public/image/bg-egg-priv-oversize.png'
    },
    fdi: {
      title: '🌐🌪️ Xung đột Quy trình Bản địa',
      desc: 'Bộ máy quản lý rập khuôn của tư bản va chạm mạnh với cách làm việc tại Hợp tác xã địa phương. Chảy máu nhân sự!',
      bonus: { capital: -25, hp: -20 },
      unlockEventId: 'HIDDEN_FDI_CULTURE_CLASH',
      flavor: 'Sự khác biệt văn hoá giữa quản lý ngoại quốc và nhân công bản địa đang ở mức báo động.',
      bgImg: 'public/image/bg-egg-fdi-clash.png'
    }
  };

  const HIDDEN_EVENTS = {
    HIDDEN_STATE_PRIVATIZE: {
      id: 'S1', name: 'Độc quyền Tư nhân', tier: 'Hệ luỵ Mâu thuẫn', bgImg: 'public/image/bg-event-s1.png',
      desc: 'Quá trình tư nhân hóa diễn ra quá nhanh khiến các nhóm lợi ích mới trỗi dậy, thao túng thị trường và gây lũng đoạn giá cả, tạo nên làn sóng bức xúc trong dư luận.',
      opt1: { name: 'Thanh tra lại', desc: '-20 Vốn, +20 Uy tín, -10% Tiến độ', effect: () => { applyEffect({ capital: -20, reputation: 20, progress: -10 }); } },
      opt2: { name: 'Mặc kệ thị trường', desc: '+20 Vốn, -30 Uy tín', effect: () => { applyEffect({ capital: 20, reputation: -30 }); } }
    },
    HIDDEN_COLL_TECH_JUMP: {
      id: 'S2', name: 'Chuyên gia Tống tiền', tier: 'Hệ luỵ Mâu thuẫn', bgImg: 'public/image/bg-event-s2.png',
      desc: 'Việc phụ thuộc hoàn toàn vào công nghệ ngoại nhập mà không có đội ngũ làm chủ kỹ thuật đã biến doanh nghiệp thành "con tin". Các chuyên gia nước ngoài bắt đầu đưa ra những yêu sách phí bảo trì cực kỳ phi lý.',
      opt1: { name: 'Cắn răng trả phí', desc: '-25 Vốn, +15% Tiến độ', effect: () => { applyEffect({ capital: -25, progress: 15 }); } },
      opt2: { name: 'Tự sửa bằng tay', desc: '-15 Sức khỏe, -10% Tiến độ, +10 Uy tín', effect: () => { applyEffect({ hp: -15, progress: -10, reputation: 10 }); } }
    },
    HIDDEN_PRIV_OVERSIZE: {
      id: 'S3', name: 'Đình trệ Quyết định', tier: 'Hệ luỵ Mâu thuẫn', bgImg: 'public/image/bg-event-s3.png',
      desc: 'Bộ máy quản lý phình to với quá nhiều tầng nấc trung gian khiến các quyết định kinh doanh quan trọng bị treo lại nhiều tuần, làm bỏ lỡ các cơ hội thị trường ngắn hạn.',
      opt1: { name: 'Cắt giảm bộ máy', desc: '-20 Uy tín, +15 Sức khỏe, -5% Tiến độ', effect: () => { applyEffect({ reputation: -20, hp: 15, progress: -5 }); } },
      opt2: { name: 'Giữ nguyên cấu trúc', desc: '-15% Tiến độ, -10 Vốn', effect: () => { applyEffect({ progress: -15, capital: -10 }); } }
    },
    HIDDEN_FDI_CULTURE_CLASH: {
      id: 'S4', name: 'Làn sóng Nghỉ việc', tier: 'Hệ luỵ Mâu thuẫn', bgImg: 'public/image/lan_song_nghi_viec.jpg',
      desc: 'Sự bất đồng sâu sắc về văn hóa làm việc và phong cách quản lý giữa chuyên gia nước ngoài và nhân công bản địa đã đạt tới đỉnh điểm. Một cuộc đình công và làn sóng nghỉ việc hàng loạt đang diễn ra.',
      opt1: { name: 'Tăng lương giữ người', desc: '-30 Vốn, +15 Uy tín', effect: () => { applyEffect({ capital: -30, reputation: 15 }); } },
      opt2: { name: 'Thay máu nhân sự', desc: '-15% Tiến độ, -20 Sức khỏe, +10 Vốn', effect: () => { applyEffect({ progress: -15, hp: -20, capital: 10 }); } }
    }
  };

  const EASTER_EGGS = {
    fdi: {
      state: { title: '🌐🏛️ Ưu đãi Đầu tư', desc: 'Chính phủ ưu đãi nhà đầu tư: Uy tín tăng!', bonus: { reputation: 15 }, bgImg: 'public/image/bg-egg-fdi-state.png' },
      collective: { title: '🌐🤝 CSR Nông thôn', desc: 'Trách nhiệm xã hội doanh nghiệp: Uy tín + Sức khỏe!', bonus: { reputation: 10, hp: 10 }, bgImg: 'public/image/bg-egg-fdi-coll.png' },
      private: { title: '🌐💼 Gia công Xuất khẩu', desc: 'Chuỗi cung ứng toàn cầu: Vốn + Tương thích!', bonus: { capital: 5, sp: 1 }, bgImg: 'public/image/bg-egg-fdi-priv.png' }
    }
  };

  let gameScreen = document.getElementById('gamePlayScreen');
  if (!gameScreen) {
    gameScreen = document.createElement('div');
    gameScreen.id = 'gamePlayScreen';
    gameScreen.className = 'game-play-screen';
    const gameSection = document.getElementById('game');
    if (gameSection) gameSection.appendChild(gameScreen);
  }

  // Thêm một container cho nội dung UI để không đè lên video
  let uiContent = document.getElementById('gameUIContent');
  if (!uiContent) {
    uiContent = document.createElement('div');
    uiContent.id = 'gameUIContent';
    uiContent.className = 'game-ui-content';
    uiContent.style.width = '100%';
    uiContent.style.height = '100%';
    uiContent.style.position = 'relative';
    uiContent.style.zIndex = '10'; // Đảm bảo nằm trên video
    gameScreen.appendChild(uiContent);
  }

  // Hàm helper để cập nhật nội dung game mà không xóa mất video background
  function updateGameScreenContent(html) {
    if (uiContent) {
      uiContent.innerHTML = html;
    } else {
      gameScreen.innerHTML = html;
    }
  }

  // Tạo video background element cho phần 4 (Events)
  // Đảm bảo tạo sau khi gameScreen đã tồn tại
  function ensureVideoBackground() {
    let videoBackground = document.getElementById('gameVideoBackground');
    if (!videoBackground && gameScreen) {
      console.log('🎬 Creating video background element...');
      videoBackground = document.createElement('video');
      videoBackground.id = 'gameVideoBackground';
      videoBackground.className = 'game-video-background';
      videoBackground.src = 'public/image/prosessBR.mp4';
      videoBackground.autoplay = false; // Tắt autoplay, sẽ play thủ công
      videoBackground.loop = true; // Tự động lặp lại
      videoBackground.muted = true; // Tắt tiếng
      videoBackground.playsInline = true; // Cho mobile
      videoBackground.preload = 'auto'; // Preload video
      videoBackground.style.display = 'none'; // Ẩn mặc định
      
      // Thêm vào đầu gameScreen để ở dưới cùng
      if (gameScreen.firstChild) {
        gameScreen.insertBefore(videoBackground, gameScreen.firstChild);
      } else {
        gameScreen.appendChild(videoBackground);
      }
      
      console.log('✅ Video background created and added to DOM');
      console.log('📹 Video element:', videoBackground);
      console.log('📹 Video src:', videoBackground.src);
    } else if (videoBackground) {
      console.log('✅ Video background already exists');
    }
    return videoBackground;
  }

  // ==================== STAGE MANAGEMENT ====================
  // Ensure mutual exclusivity of game screens
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
        console.log(`🚀 Switched to stage: ${stageId}`);
      } else {
        // Special case: don't hide the main play screen if we are just showing the celebrate overlay on top
        if (stageId === 'roleCelebrateOverlay' && stage.id === 'gameRoleScreen') return;

        stage.el.style.display = 'none';
        stage.el.classList.remove('active');
      }
    });

    // Cấu hình không cuộn page (khóa overflow của body và html)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Reset scroll when switching stages
    window.scrollTo(0, 0);
  }

  if (!modal || !openBtn || !closeBtn) {
    console.warn('Game guide elements not found');
    return;
  }

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (startGameBtn && navbar && videoScreen && introVideo && roleScreen) {
    startGameBtn.addEventListener('click', () => {
      resetState();
      navbar.classList.add('hidden');
      switchStage('gameVideoScreen');

      // Reset video
      introVideo.currentTime = 0;
      introVideo.load(); // Force reload video

      // Try to play video with better error handling
      const playPromise = introVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Video playing successfully');
          })
          .catch((error) => {
            console.warn('⚠️ Video failed to play, skipping to role selection:', error.name, error.message);
            showRoleSelection();
          });
      } else {
        // Fallback for older browsers
        console.warn('⚠️ Play promise not supported, skipping video');
        showRoleSelection();
      }

      // Add ended listener
      introVideo.addEventListener('ended', showRoleSelection, { once: true });

      // Add error listener for video load errors
      introVideo.addEventListener('error', (e) => {
        const errorCode = introVideo.error?.code;
        const errorMessages = {
          1: 'MEDIA_ERR_ABORTED - Video load aborted',
          2: 'MEDIA_ERR_NETWORK - Network error loading video',
          3: 'MEDIA_ERR_DECODE - Video decode error',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Video format not supported'
        };
        console.error('❌ Video load error:', errorMessages[errorCode] || 'Unknown error');
        console.error('Video src:', introVideo.currentSrc);
        showRoleSelection();
      }, { once: true });
    });
  }

  if (videoSkipBtn && introVideo) {
    videoSkipBtn.addEventListener('click', () => {
      introVideo.pause();
      showRoleSelection();
    });
  }

  function resetState() {
    state = {
      capital: 120,
      hp: 100,
      sp: 0,
      reputation: 50,
      progress: 0,
      role: null,
      items: [],
      unlockedEventIds: [],
      usedEventIds: [], // Reset events đã sử dụng
      flavorText: '',
      armorMacroUsed: false,
      turnCount: 0
    };
    selectedRole = null;

    // Reset video screen về trạng thái ban đầu
    if (videoScreen) {
      videoScreen.classList.remove('active');
      videoScreen.style.display = 'none';
    }

    // Reset game play screen
    if (gameScreen) {
      gameScreen.classList.remove('active');
      gameScreen.style.display = 'none';
    }
  }

  function showRoleSelection() {
    switchStage('gameRoleScreen');
  }

  const selectBtns = document.querySelectorAll('.role-select-btn');
  selectBtns.forEach(btn => {
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
    if (!data || !celebrateOverlay) {
      console.error('❌ showCelebrate error:', { data, celebrateOverlay, role });
      return;
    }

    console.log('✅ showCelebrate:', role, data);

    document.getElementById('celebrateRoleName').textContent = data.name;
    document.getElementById('celebratePassive').textContent = data.passive;
    document.getElementById('celebrateDesc').textContent = data.desc;
    document.getElementById('celebrateAvatarImg').src = data.img;
    document.getElementById('celebrateAvatarImg').alt = data.name;
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

    const colors = {
      'celebrate-state': '#2563EB',
      'celebrate-collective': '#16A34A',
      'celebrate-private': '#EA580C',
      'celebrate-fdi': '#9333EA'
    };
    const color = colors[cls] || '#F8BD72';

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'celebrate-particle';
      p.style.background = color;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
      p.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
      p.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(p);
    }
  }

  if (celebrateContinueBtn) {
    celebrateContinueBtn.addEventListener('click', () => {
      state.role = selectedRole;
      updateBackground(ROLE_DATA[state.role].bgImg);

      if (state.role === 'fdi') {
        state.sp += 2;
        state.capital += 20;
      }

      celebrateOverlay.classList.remove('active');
      roleScreen.classList.remove('active');

      startItemPhase();
    });
  }

  const celebrateChangeBtn = document.getElementById('celebrateChangeBtn');
  if (celebrateChangeBtn) {
    celebrateChangeBtn.addEventListener('click', () => {
      celebrateOverlay.classList.remove('active');
      roleCards.forEach(c => c.classList.remove('selected'));
      selectedRole = null;
      // Chuyển về màn hình chọn role
      switchStage('gameRoleScreen');
    });
  }

  function renderHeader() {
    const capitalClass = state.capital < 30 ? 'val-danger' : 'val-good';
    const hpClass = state.hp < 30 ? 'val-danger' : 'val-good';
    const repClass = state.reputation < 40 ? 'val-danger' : (state.reputation >= 60 ? 'val-good' : 'val-warning');
    const roleName = state.role ? ROLE_DATA[state.role].name : '—';
    
    // Đổi màu thanh tiến độ theo ngưỡng rủi ro
    let progColor = '#3b82f6'; // Blue
    if (state.progress >= 85) progColor = '#ef4444'; // Red
    else if (state.progress >= 60) progColor = '#f59e0b'; // Yellow

    return `
      <div class="gps-header">
        <div class="gps-header-left">
          <span class="gps-role-badge">${roleName}</span>
          <span class="gps-turn">Lượt ${state.turnCount}</span>
        </div>
        <div class="gps-stats-row">
          <div class="gps-stat">
            <img src="public/image/icon-capital.png" alt="Vốn" class="gps-stat-icon">
            <span class="gps-stat-label">Vốn</span>
            <span class="gps-stat-value ${capitalClass}" data-stat="capital">${Math.floor(state.capital)}</span>
          </div>
          <div class="gps-stat">
            <img src="public/image/icon-hp.png" alt="Sức khỏe" class="gps-stat-icon">
            <span class="gps-stat-label">Sức khỏe</span>
            <span class="gps-stat-value ${hpClass}" data-stat="hp">${Math.floor(state.hp)}</span>
          </div>
          <div class="gps-stat">
            <img src="public/image/icon-synergy.png" alt="Tương thích" class="gps-stat-icon">
            <span class="gps-stat-label">Tương thích</span>
            <span class="gps-stat-value val-good" data-stat="sp">${state.sp}</span>
          </div>
          <div class="gps-stat">
            <img src="public/image/icon-reputation.png" alt="Uy tín" class="gps-stat-icon">
            <span class="gps-stat-label">Uy tín</span>
            <span class="gps-stat-value ${repClass}" data-stat="reputation">${state.reputation}</span>
          </div>
          <div class="gps-stat gps-stat-progress">
            <img src="public/image/icon-progress.png" alt="Tiến độ" class="gps-stat-icon">
            <span class="gps-stat-label">Tiến độ</span>
            <span class="gps-stat-value" data-stat="progress">${Math.min(100, Math.floor(state.progress))}%</span>
            <div class="gps-progress-bar">
              <div class="gps-progress-fill" style="width: ${Math.min(100, state.progress)}%; background: ${progColor}; shadow: 0 0 10px ${progColor}55;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function updateHeaderInPlace() {
    const header = uiContent.querySelector('.gps-header');
    if (!header) return;
    header.outerHTML = renderHeader();
  }

  function showFloatingText(statName, value, overrideColor = null) {
    const statMap = { 'Vốn': 'capital', 'Sức khỏe': 'hp', 'Tương thích': 'sp', 'Uy tín': 'reputation', 'Tiến độ': 'progress' };
    const dataKey = statMap[statName];
    if (!dataKey) return;

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
    let actualDiffs = { capital: 0, hp: 0, sp: 0, reputation: 0, progress: 0 };

    if (diff.capital) actualDiffs.capital = diff.capital;
    if (diff.reputation) actualDiffs.reputation = diff.reputation;
    if (diff.sp) actualDiffs.sp = diff.sp;
    if (diff.hp) actualDiffs.hp = diff.hp;
    if (diff.progress) actualDiffs.progress = diff.progress;

    if (state.role === 'private') {
      if (actualDiffs.hp < 0) actualDiffs.hp *= 1.4;
      if (actualDiffs.progress > 0 && !diff.isTurnProgress) actualDiffs.progress *= 1.15;
    }

    if (state.role === 'state') {
      if (actualDiffs.capital < 0) actualDiffs.capital *= 0.85; // Bảo hộ vốn
    }

    if (state.role === 'fdi') {
      if (actualDiffs.reputation < 0) actualDiffs.reputation *= 0.9; // Uy tín quốc tế
    }

    if (state.role === 'state' && (state.hp + actualDiffs.hp) < 30 && !state.armorMacroUsed) {
      actualDiffs.hp += 20;
      state.armorMacroUsed = true;
      setTimeout(() => showFloatingText('Sức khỏe', '+20 Nội Tại', '#3b82f6'), 300);
    }

    state.capital += actualDiffs.capital;
    state.reputation = Math.max(0, Math.min(100, state.reputation + actualDiffs.reputation));
    state.sp = Math.max(0, Math.min(20, state.sp + actualDiffs.sp));
    state.hp += actualDiffs.hp;
    state.progress = Math.max(0, state.progress + actualDiffs.progress);

    if (actualDiffs.capital !== 0) showFloatingText('Vốn', actualDiffs.capital);
    if (actualDiffs.hp !== 0 && !diff.isTurnProgress) showFloatingText('Sức khỏe', actualDiffs.hp);
    if (actualDiffs.progress > 0 && !diff.isTurnProgress) showFloatingText('Tiến độ', '+' + actualDiffs.progress.toFixed(1) + '%');
    if (actualDiffs.progress < 0) showFloatingText('Tiến độ', actualDiffs.progress.toFixed(1) + '%');
    if (actualDiffs.reputation !== 0) showFloatingText('Uy tín', actualDiffs.reputation);
    if (actualDiffs.sp !== 0) showFloatingText('Tương thích', actualDiffs.sp);
  }

  function startItemPhase() {
    switchStage('gamePlayScreen');
    
    // Tạo video background ngay khi vào game play screen
    ensureVideoBackground();
    
    updateBackground('public/image/choItem.png');
    const isCollective = state.role === 'collective';
    let selectedItems = [];

    updateGameScreenContent(`
      ${renderHeader()}
      <div class="gps-body">
        <div class="gps-phase-header">
          <span class="gps-phase-tag">Giai đoạn 3</span>
          <h2 class="gps-phase-title">Xây dựng Lực lượng Sản xuất</h2>
          <p class="gps-phase-desc">Chọn <strong>Chính xác 2 Items</strong> từ Cửa Hàng. Items khớp vai trò sẽ cho <strong>+3 Tương thích</strong>. Hãy cẩn thận: Tham lam tiêu cạn nguồn Vốn sẽ khiến bạn phá sản ngay lập tức!</p>
        </div>
        <div class="gps-items-grid" id="gpsItemsGrid"></div>
        <div class="gps-action-row">
          <button class="gps-btn gps-btn-primary" id="gpsConfirmItems" disabled>
            Tiếp tục (đã chọn 0/2 thẻ)
          </button>
        </div>
      </div>
    `);

    const grid = document.getElementById('gpsItemsGrid');
    const confirmBtn = document.getElementById('gpsConfirmItems');

    ITEMS.forEach(it => {
      const finalPrice = isCollective ? Math.floor(it.price * 0.8) : it.price;
      const isMatch = it.tag === state.role;

      const card = document.createElement('div');
      card.className = 'gps-item-card';
      card.dataset.id = it.id;
      card.innerHTML = `
        <img src="${it.img}" alt="${it.name}" class="gps-item-icon">
        <h3 class="gps-item-name">${it.name}</h3>
        <p class="gps-item-tag ${isMatch ? 'tag-match' : ''}">${TAG_NAMES[it.tag]} ${isMatch ? '✓ Khớp' : ''}</p>
        <div class="gps-item-price">${finalPrice} Vốn</div>
        ${isCollective && it.price !== finalPrice ? `<span class="gps-item-discount">-20%</span>` : ''}
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) {
          card.classList.remove('selected');
          selectedItems = selectedItems.filter(i => i !== it.id);
          state.capital += finalPrice;
        } else {
          card.classList.add('selected');
          selectedItems.push(it.id);
          state.capital -= finalPrice;

          if (state.capital < 0) {
            showEnding('bankrupt_shop');
            return;
          }
        }

        updateHeaderInPlace();
        confirmBtn.disabled = selectedItems.length !== 2;
        confirmBtn.textContent = `Tiếp tục (đã chọn ${selectedItems.length}/2 thẻ)`;
      });

      grid.appendChild(card);
    });

    confirmBtn.addEventListener('click', () => {
      state.items = selectedItems;

      selectedItems.forEach(itemId => {
        const it = ITEMS.find(i => i.id === itemId);
        if (it.tag === state.role) state.sp += 3;
        else state.sp += 1;
      });

      const selectedItemObjs = selectedItems.map(id => ITEMS.find(i => i.id === id));
      const roleIdeo = IDEOLOGY_GROUP[state.role];
      const strictCrossItems = selectedItemObjs.filter(it => IDEOLOGY_GROUP[it.tag] !== roleIdeo);

      let easterEggs = [];

      if (strictCrossItems.length >= 2) {
        const egg = CONTRADICTIONS[state.role];
        easterEggs.push(egg);
        applyEffect(egg.bonus);

        // if (egg.bgImg) updateBackground(egg.bgImg);

        if (egg.unlockEventId) state.unlockedEventIds.push(egg.unlockEventId);
        if (egg.flavor) state.flavorText = egg.flavor;
      } else {
        const crossTags = [...new Set(selectedItemObjs.filter(it => it.tag !== state.role).map(it => it.tag))];
        crossTags.forEach(tag => {
          const egg = EASTER_EGGS[state.role]?.[tag];
          if (egg) {
            easterEggs.push(egg);
            applyEffect(egg.bonus);
            // if (egg.bgImg) updateBackground(egg.bgImg);
          }
        });
      }

      showItemConfirmation(easterEggs);
    });
  }

  function showItemConfirmation(easterEggs = []) {
    const selectedItemObjs = state.items.map(id => ITEMS.find(i => i.id === id));
    const hasEgg = easterEggs.length > 0;

    const eggHTML = hasEgg ? `
      <div class="gps-easter-egg-section">
        ${easterEggs.map(egg => `
          <div class="gps-easter-egg">
            <div class="gps-egg-title">${egg.title}</div>
            <p class="gps-egg-desc">${egg.desc}</p>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Tạo HTML cho các thẻ items với flip effect
    const itemCardsHTML = selectedItemObjs.map((item, index) => {
      const isMatch = item.tag === state.role;
      const spGain = isMatch ? 3 : 1;
      const roleName = ROLE_DATA[state.role].name;
      const itemRoleName = TAG_NAMES[item.tag];
      
      // Giải thích logic SP cho mặt sau
      let spExplanation = '';
      let spTitle = '';
      if (isMatch) {
        spTitle = `✓ Khớp vai trò ${roleName}`;
        spExplanation = `Lực lượng sản xuất phù hợp với quan hệ sản xuất → Quản lý dễ dàng, hiệu quả cao`;
      } else {
        spTitle = `⚠ Không khớp vai trò`;
        spExplanation = `${itemRoleName} ≠ ${roleName}<br><br>Phối hợp khó khăn do khác biệt về cơ chế phân phối và ra quyết định → Hiệu quả thấp hơn`;
      }
      
      return `
      <div class="gps-flip-card" style="animation-delay: ${index * 0.15}s">
        <div class="gps-flip-card-inner">
          <!-- Mặt trước -->
          <div class="gps-flip-card-front ${isMatch ? 'card-match' : 'card-mismatch'}">
            <div class="gps-card-sp-badge ${isMatch ? 'badge-match' : 'badge-mismatch'}">+${spGain} Tương thích</div>
            <img src="${item.img}" alt="${item.name}" class="gps-confirm-large-icon">
            <h3 class="gps-confirm-large-name">${item.name}</h3>
            <p class="gps-confirm-large-tag">${itemRoleName}</p>
            <div class="gps-flip-hint">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Click để xem giải thích</span>
            </div>
          </div>
          
          <!-- Mặt sau -->
          <div class="gps-flip-card-back ${isMatch ? 'card-match' : 'card-mismatch'}">
            <div class="gps-back-sp-display ${isMatch ? 'badge-match' : 'badge-mismatch'}">
              +${spGain} Tương thích
            </div>
            <h4 class="gps-back-title">${spTitle}</h4>
            <p class="gps-back-explanation">${spExplanation}</p>
            <div class="gps-flip-hint">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Click để quay lại</span>
            </div>
          </div>
        </div>
      </div>
    `}).join('');

    updateGameScreenContent(`
      ${renderHeader()}
      <div class="gps-body gps-center-body">
        <div class="gps-confirmation-layout">
          <!-- Bên trái: Các thẻ items -->
          <div class="gps-confirm-left">
            <h2 class="gps-confirm-title">${hasEgg ? 'Combo Liên ngành Phát hiện!' : 'Lực lượng sản xuất đã sẵn sàng!'}</h2>
            
            <div class="gps-confirm-cards-container">
              ${itemCardsHTML}
            </div>
            
            <!-- Di chuyển text và nút xuống dưới cards bên trái -->
            <div class="gps-confirm-action-section">
              <p class="gps-confirm-flavor">${hasEgg ? 'Bạn đã kích hoạt combo đặc biệt! Thị trường đang mở ra nhiều cơ hội mới.' : 'Thị trường đang chờ bạn. Mỗi lượt sẽ có một sự kiện — hãy đưa ra quyết định khôn ngoan.'}</p>
              
              <button class="gps-btn gps-btn-primary gps-btn-glow" id="gpsStartLoop">
                Bước vào Thị trường →
              </button>
            </div>
          </div>
          
          <!-- Bên phải: Thông tin -->
          <div class="gps-confirm-right">
            <div class="gps-confirm-info-panel">
              <h3 class="gps-info-title">THÔNG TIN GAME</h3>
              
              <div class="gps-info-stats">
                <div class="gps-info-stat-row">
                  <div class="gps-info-stat-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <span>Số thẻ đã chọn</span>
                  </div>
                  <div class="gps-info-stat-value">${selectedItemObjs.length}</div>
                </div>
                
                <div class="gps-info-stat-row highlight-row">
                  <div class="gps-info-stat-label">
                    <img src="public/image/icon-synergy.png" alt="Tương thích" width="20" height="20">
                    <span>Tương thích</span>
                  </div>
                  <div class="gps-info-stat-value highlight">${state.sp}</div>
                </div>
                
                <div class="gps-info-stat-row">
                  <div class="gps-info-stat-label">
                    <img src="public/image/icon-capital.png" alt="Vốn" width="20" height="20">
                    <span>Vốn còn lại</span>
                  </div>
                  <div class="gps-info-stat-value">${Math.floor(state.capital)}</div>
                </div>
                
                <div class="gps-info-stat-row">
                  <div class="gps-info-stat-label">
                    <img src="public/image/icon-hp.png" alt="Sức khỏe" width="20" height="20">
                    <span>Sức khỏe</span>
                  </div>
                  <div class="gps-info-stat-value">${Math.floor(state.hp)}</div>
                </div>
                
                <div class="gps-info-stat-row">
                  <div class="gps-info-stat-label">
                    <img src="public/image/icon-reputation.png" alt="Uy tín" width="20" height="20">
                    <span>Uy tín</span>
                  </div>
                  <div class="gps-info-stat-value">${state.reputation}</div>
                </div>
              </div>
              
              ${eggHTML}
            </div>
          </div>
        </div>
      </div>
    `);

    // Add flip card event listeners
    document.querySelectorAll('.gps-flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });

    document.getElementById('gpsStartLoop').addEventListener('click', () => {
      nextTurn();
    });
  }

  function checkEndGame() {
    // Kiểm tra kết thúc sớm (chỉ áp dụng cho non-FDI hoặc khi chưa đạt 100% progress)
    if (state.progress < 100 && (state.capital < 0 || state.hp <= 0)) {
      showEnding('gameover');
      return true;
    }
    
    // Kiểm tra kết thúc khi đạt 100% progress
    if (state.progress >= 100) {
      // Áp dụng cơ chế FDI: trả vốn cho công ty mẹ
      if (state.role === 'fdi') {
        state.capital -= 20;
        console.log(`🏢 FDI: Trả 20 vốn cho công ty mẹ. Vốn còn lại: ${state.capital}`);
      }
      
      // Kiểm tra phá sản sau khi trả công ty mẹ
      if (state.capital < 0 || state.hp <= 0) {
        if (state.role === 'fdi' && state.capital < 0 && state.hp > 0) {
          showEnding('fdi_strategic');
        } else {
          showEnding('gameover');
        }
        return true;
      }
      
      // Kiểm tra các ending thành công
      if (state.reputation >= 60 && state.capital >= 0 && state.hp > 20) {
        showEnding('true');
        return true;
      } else if (state.reputation < 40) {
        showEnding('bad');
        return true;
      } else {
        showEnding('normal');
        return true;
      }
    }
    return false;
  }

  // ==================== DEBUG HELPERS ====================
  function debugEventUsage() {
    console.log('📊 Event Usage Debug:');
    console.log('Current progress:', state.progress + '%');
    console.log('Used events:', state.usedEventIds);
    
    let currentTier = 'tier1';
    if (state.progress >= 36 && state.progress <= 75) currentTier = 'tier2';
    if (state.progress >= 76) currentTier = 'tier3';
    
    const tierEvents = EVENTS[currentTier].map(e => e.id);
    const usedInCurrentTier = state.usedEventIds.filter(id => tierEvents.includes(id));
    const availableInCurrentTier = tierEvents.filter(id => !state.usedEventIds.includes(id));
    
    console.log(`Current tier: ${currentTier}`);
    console.log(`Total events in tier: ${tierEvents.length}`);
    console.log(`Used in current tier: ${usedInCurrentTier.length} (${usedInCurrentTier})`);
    console.log(`Available in current tier: ${availableInCurrentTier.length} (${availableInCurrentTier})`);
  }

  function nextTurn() {
    if (checkEndGame()) return;

    // Đảm bảo video background được tạo và sẵn sàng cho Phase 4
    ensureVideoBackground();

    state.turnCount++;
    
    // Debug event usage (có thể comment out khi production)
    // debugEventUsage();

    let repFactor = 0;
    if (state.reputation >= 70) repFactor = 3;
    else if (state.reputation <= 30) repFactor = -3;

    let turnProgress = 2 + state.sp + repFactor;
    if (state.role === 'private') turnProgress *= 1.15;

    applyEffect({ progress: turnProgress, isTurnProgress: true });

    if (state.role === 'collective') {
      applyEffect({ capital: 2 });
      setTimeout(() => showFloatingText('Vốn', '+2 Nội tại', '#10b981'), 700);
    }
    
    // ==================== CƠ CHẾ DOANH THU CƠ BẢN ====================
    // Thu nhập cơ bản thấp, chủ yếu dựa vào lựa chọn chiến lược
    const basicRevenue = Math.max(1, Math.floor(state.sp * 0.5)); // Giảm từ 5+(SP*1.5) xuống SP*0.5
    applyEffect({ capital: basicRevenue });
    
    // Hiệu ứng số bay cho Doanh thu cơ bản
    if (basicRevenue > 0) {
      setTimeout(() => {
        showFloatingText('Vốn', `+${basicRevenue} Thu nhập`, '#10b981');
      }, 500);
    }

    if (checkEndGame()) return;

    let tierKey = 'tier1';
    if (state.progress >= 36 && state.progress <= 75) tierKey = 'tier2';
    if (state.progress >= 76) tierKey = 'tier3';

    let eventList = [...EVENTS[tierKey]];
    state.unlockedEventIds.forEach(id => {
      if (HIDDEN_EVENTS[id]) eventList.push(HIDDEN_EVENTS[id]);
    });

    // Lọc bỏ events đã sử dụng trong tier hiện tại
    const currentTierEventIds = eventList.map(e => e.id);
    let availableEvents = eventList.filter(event => !state.usedEventIds.includes(event.id));
    
    // Nếu tất cả events trong tier hiện tại đã được sử dụng, reset cho tier này
    if (availableEvents.length === 0) {
      console.log(`🔄 All events used in ${tierKey}, resetting available events`);
      availableEvents = [...eventList];
      // Chỉ xóa events của tier hiện tại khỏi usedEventIds
      state.usedEventIds = state.usedEventIds.filter(id => !currentTierEventIds.includes(id));
    }

    const ev = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    // Đánh dấu event đã sử dụng
    state.usedEventIds.push(ev.id);
    console.log(`🎲 Selected event: ${ev.id} (${ev.name}) | Used: ${state.usedEventIds.length} | Available: ${availableEvents.length - 1} remaining in ${tierKey}`);
    
    renderEvent(ev);
  }

  function renderEvent(ev) {
    // Sử dụng video background thay vì ảnh cho tất cả sự kiện
    console.log('🎬 renderEvent: Enabling video background for event:', ev.name);
    enableVideoBackground();

    if (window._gameKeydownHandler) {
      document.removeEventListener('keydown', window._gameKeydownHandler);
      window._gameKeydownHandler = null;
    }

    // Định nghĩa các biến cần thiết
    const eventObj = ev;
    let tierColor = '#6366f1';
    let tierLabel = ev.tier || 'Sự kiện';
    
    // Xác định màu sắc theo tier
    if (ev.tier === 'Cọ xát Vi mô') {
      tierColor = '#10b981';
    } else if (ev.tier === 'Đạo đức & Lợi ích') {
      tierColor = '#f59e0b';
    } else if (ev.tier === 'Khủng hoảng Vĩ mô') {
      tierColor = '#ef4444';
    } else if (ev.tier === 'Hệ luỵ Mâu thuẫn') {
      tierColor = '#8b5cf6';
    }

    updateGameScreenContent(`
      ${renderHeader()}
      <div class="gps-body ${ev.customLayout ? 'gps-custom-layout' : (ev.customLayoutBottomRight ? 'gps-custom-layout-bottom-right' : (ev.customLayoutCenterWhite ? 'gps-center-body' : 'gps-center-body'))}">
        <div class="gps-event-card ${ev.customLayout ? 'gps-event-card-left' : (ev.customLayoutBottomRight ? 'gps-event-card-bottom-right gps-event-theme-white' : (ev.customLayoutCenterWhite ? 'gps-event-theme-white' : ''))}">
          <div class="gps-card-top-bar" style="background: ${tierColor}"></div>
          
          <div class="gps-event-main-content">
            <div class="gps-event-tier" style="color: ${tierColor}">${tierLabel}</div>
            <h2 class="gps-event-name">${eventObj.name}</h2>
            <div class="gps-event-story">${eventObj.desc || 'Đang cập nhật bối cảnh...'}</div>
            ${state.flavorText ? `<div class="gps-event-flavor"><span class="gps-flavor-icon">⚠️</span> ${state.flavorText}</div>` : ''}
          </div>

          <div class="gps-event-sep"></div>

          <div class="gps-event-actions-area">
            <div class="gps-event-options">
              <button class="gps-event-option gps-opt-a" id="gpsOpt1">
                <span class="gps-opt-key">1</span>
                <h3>${eventObj.opt1.name}</h3>
                <p>${eventObj.opt1.desc}</p>
              </button>
              <div class="gps-event-or">HOẶC</div>
              <button class="gps-event-option gps-opt-b" id="gpsOpt2">
                <span class="gps-opt-key">2</span>
                <h3>${eventObj.opt2.name}</h3>
                <p>${eventObj.opt2.desc}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    const chooseOpt1 = () => {
      if (window._gameKeydownHandler) document.removeEventListener('keydown', window._gameKeydownHandler);
      window._gameKeydownHandler = null;
      eventObj.opt1.effect();
      updateHeaderInPlace();
      setTimeout(() => nextTurn(), 800);
    };

    const chooseOpt2 = () => {
      if (window._gameKeydownHandler) document.removeEventListener('keydown', window._gameKeydownHandler);
      window._gameKeydownHandler = null;
      eventObj.opt2.effect();
      updateHeaderInPlace();
      setTimeout(() => nextTurn(), 800);
    };

    document.getElementById('gpsOpt1').addEventListener('click', chooseOpt1);
    document.getElementById('gpsOpt2').addEventListener('click', chooseOpt2);

    window._gameKeydownHandler = (e) => {
      if (e.key === '1') chooseOpt1();
      if (e.key === '2') chooseOpt2();
    };
    document.addEventListener('keydown', window._gameKeydownHandler);
  }

  // ==================== PHASE 5: ENDINGS ====================
  function showEnding(type) {
    // Tắt video background khi chuyển sang phần 5 (Ending)
    disableVideoBackground();
    
    if (window._gameKeydownHandler) {
      document.removeEventListener('keydown', window._gameKeydownHandler);
      window._gameKeydownHandler = null;
    }

    // Cấu hình cứng không cuộn page
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const endings = {
      gameover: {
        title: 'Phá Sản',
        subtitle: 'GAME OVER',
        category: 'Thất Bại',
        desc: `Doanh nghiệp kiệt quệ tài nguyên, không thể tiếp tục hoạt động.`,
        consequences: [
          'Đóng cửa doanh nghiệp - Ngừng hoạt động sản xuất kinh doanh',
          'Thanh lý tài sản - Bán máy móc, thiết bị để trả nợ', 
          'Lao động mất việc - Công nhân thất nghiệp, mất thu nhập',
          'Nợ ngân hàng - Tài sản cá nhân có thể bị kê biên',
          'Ảnh hưởng chuỗi cung ứng - Đối tác, nhà cung cấp bị ảnh hưởng'
        ],
        lesson: 'Quản trị rủi ro kém, không cân đối giữa tăng trưởng và an toàn tài chính. Trong kinh tế xã hội chủ nghĩa, doanh nghiệp cần bảo vệ người lao động và phát triển bền vững.',
        color: '#ef4444',
        bgGrad: 'linear-gradient(135deg, rgba(127,29,29,0.4), rgba(15,23,42,0.95))',
        bgImg: 'public/image/bg-ending-gameover.png',
        useCustomLayout: true
      },
      bankrupt_shop: {
        title: 'Bẫy Lòng Tham',
        subtitle: 'TRẮNG TAY TỪ TRỨNG NƯỚC',
        category: 'Thất Bại',
        desc: `Tham lam thâu tóm quá nhiều tư liệu sản xuất khiến dòng tiền bị đứt gãy ngay từ giai đoạn đầu tư.`,
        consequences: [
          'Phá sản trước khi sản xuất - Không có vốn lưu động để vận hành',
          'Tài sản bị thanh lý - Máy móc, thiết bị phải bán tháo với giá rẻ',
          'Nợ ngân hàng chồng chất - Lãi suất tích lũy, tín dụng bị đóng băng',
          'Lao động thất nghiệp - Công nhân chưa kịp làm việc đã mất việc',
          'Mất niềm tin thị trường - Nhà đầu tư, đối tác từ chối hợp tác'
        ],
        lesson: 'Trong kinh tế xã hội chủ nghĩa, phát triển phải dựa trên khả năng thực tế, không được đầu tư ồ ạt vượt quá nguồn lực. "Vừa sức, vừa tầm" là nguyên tắc vàng.',
        color: '#ef4444',
        bgGrad: 'linear-gradient(135deg, rgba(127,29,29,0.5), rgba(15,23,42,0.95))',
        bgImg: 'public/image/Trang_tay.jpg',
        useCustomLayout: true
      },
      true: {
        title: 'Dân Giàu Nước Mạnh',
        subtitle: 'TRUE ENDING',
        category: 'Thành Công Xuất Sắc',
        desc: `Chúc mừng! Bạn đã xây dựng thành công mô hình kinh tế xã hội chủ nghĩa lý tưởng.`,
        consequences: [
          'Tăng trưởng bền vững - Tiến độ 100%, vốn dương, sức khỏe tốt',
          'Uy tín cao (≥60) - Được nhân dân và xã hội tín nhiệm',
          'Cân bằng lợi ích - Hài hòa giữa hiệu quả kinh tế và công bằng xã hội',
          'Người lao động hạnh phúc - Thu nhập ổn định, môi trường làm việc tốt',
          'Đóng góp xã hội - Nộp thuế đầy đủ, tạo việc làm, phát triển cộng đồng'
        ],
        lesson: 'Đây chính là mục tiêu "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh" của chủ nghĩa xã hội Việt Nam.',
        color: '#10b981',
        bgGrad: 'linear-gradient(135deg, rgba(6,78,59,0.4), rgba(15,23,42,0.95))',
        bgImg: 'public/image/dan_giau_nuoc_manh.jpg',
        useCustomLayout: true
      },
      bad: {
        title: 'Lợi Nhuận Lệch Hướng',
        subtitle: 'BAD ENDING',
        category: 'Thành Công Có Điều Kiện',
        desc: `Đạt mục tiêu kinh tế nhưng đánh mất giá trị xã hội chủ nghĩa.`,
        consequences: [
          'Uy tín thấp (<40) - Mất lòng tin của người lao động và xã hội',
          'Phát triển không bền vững - Chỉ chạy theo lợi nhuận, bỏ qua con người',
          'Vi phạm nguyên tắc xã hội chủ nghĩa - "Con người là trung tâm" bị lãng quên',
          'Bóc lột lao động - Lương thấp, điều kiện làm việc kém, không phúc lợi',
          'Gây bất bình xã hội - Khoảng cách giàu nghèo, mâu thuẫn lao động'
        ],
        lesson: 'Trong kinh tế xã hội chủ nghĩa, phát triển kinh tế phải gắn liền với tiến bộ và công bằng xã hội. Lợi nhuận không phải là mục tiêu duy nhất.',
        color: '#f59e0b',
        bgGrad: 'linear-gradient(135deg, rgba(120,53,15,0.4), rgba(15,23,42,0.95))',
        bgImg: 'public/image/bg-ending-bad.png',
        useCustomLayout: true
      },
      fdi_strategic: {
        title: 'Chuyển Giá Nghệ Thuật',
        subtitle: 'FDI STRATEGIC LOSS',
        category: 'Kết Quả Đặc Biệt',
        desc: `Dự án đạt 100% tiến độ nhưng báo cáo tài chính ghi nhận "Lỗ" sau khi hoàn tất chuyển vốn về nước.`,
        consequences: [
          'Thực trạng "Chuyển giá" (Transfer Pricing) - Tối ưu thuế cho tập đoàn mẹ',
          'Đưa lợi nhuận về nước ngoài - Giảm đóng góp ngân sách quốc gia',
          'Thắng về mặt kinh doanh - Hoàn thành mục tiêu của tập đoàn',
          'Gây tranh cãi về đạo đức - Vấn đề minh bạch tài chính',
          'Ảnh hưởng đến chính sách FDI - Cần giám sát chặt chẽ hơn'
        ],
        lesson: 'Đây là thực trạng phức tạp của đầu tư nước ngoài trong nền kinh tế toàn cầu hóa.',
        color: '#fbbf24',
        bgGrad: 'linear-gradient(135deg, rgba(146,64,14,0.4), rgba(15,23,42,0.95))',
        bgImg: 'public/image/fdi_ed.jpg',
        useCustomLayout: true,
        imageOnlyMode: true  // Flag đặc biệt để chỉ hiển thị ảnh
      },
      normal: {
        title: 'Tồn Tại Trung Bình',
        subtitle: 'NORMAL ENDING',
        category: 'Thành Công Cơ Bản',
        desc: `Doanh nghiệp vượt qua thử thách nhưng chưa tạo được đột phá.`,
        consequences: [
          'Hoàn thành mục tiêu cơ bản - Tiến độ 100%, không phá sản',
          'Uy tín trung bình (40-59) - Chưa được tin tưởng hoàn toàn',
          'Thiếu sự xuất sắc - Không nổi bật trong cạnh tranh thị trường',
          'Chưa tối ưu hóa - Còn nhiều tiềm năng chưa khai thác',
          'Rủi ro tiềm ẩn - Nền tảng chưa vững, dễ bị ảnh hưởng bởi biến động'
        ],
        lesson: 'Trong kinh tế xã hội chủ nghĩa, "tồn tại" chưa đủ - cần phấn đấu để phát triển mạnh mẽ, bền vững và có trách nhiệm xã hội cao hơn.',
        color: '#6366f1',
        bgGrad: 'linear-gradient(135deg, rgba(49,46,129,0.4), rgba(15,23,42,0.95))',
        bgImg: 'public/image/bg-ending-normal.png',
        useCustomLayout: true
      }
    };

    const end = endings[type];
    if (end.bgImg) updateBackground(end.bgImg);
    const roleName = state.role ? ROLE_DATA[state.role].name : '—';

    // Special layout for true ending with custom background
    const isCustomLayout = end.useCustomLayout;
    const isImageOnly = end.imageOnlyMode; // Chế độ chỉ hiển thị ảnh
    const backgroundStyle = isCustomLayout 
      ? `background-image: url('${end.bgImg}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
      : `background: ${end.bgGrad};`;

    // Nếu là imageOnlyMode, chỉ hiển thị ảnh nền với nút replay
    if (isImageOnly) {
      updateGameScreenContent(`
        <div class="gps-ending-screen" style="
          ${backgroundStyle}
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100vw; 
          height: 100vh; 
          overflow: hidden; 
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 3rem;
        ">
          <!-- Chỉ có nút replay, không có text overlay -->
          <div style="
            display: flex;
            gap: 1rem;
            z-index: 10;
          ">
            <button class="gps-btn gps-btn-primary" id="gpsReplayBtn" style="
              background: rgba(59, 130, 246, 0.95);
              backdrop-filter: blur(10px);
              border: 2px solid rgba(59, 130, 246, 0.5);
              color: white;
              padding: 1rem 2.5rem;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)'">Chơi Lại</button>
            <button class="gps-btn gps-btn-secondary" id="gpsBackToMenuBtn" style="
              background: rgba(75, 85, 99, 0.95);
              backdrop-filter: blur(10px);
              border: 2px solid rgba(75, 85, 99, 0.5);
              color: white;
              padding: 1rem 2.5rem;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(75, 85, 99, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)'">Menu Chính</button>
          </div>
        </div>
      `);
      
      // Add event listeners for image-only mode
      document.getElementById('gpsReplayBtn').addEventListener('click', () => {
        gameScreen.classList.remove('active');
        updateGameScreenContent('');
        resetState();
        startItemPhase();
      });
      
      document.getElementById('gpsBackToMenuBtn').addEventListener('click', () => {
        gameScreen.classList.remove('active');
        updateGameScreenContent('');
        navbar.classList.remove('hidden');
        resetState();
        switchStage('gameHero');
      });
      
      return; // Thoát sớm, không render phần còn lại
    }

    updateGameScreenContent(`
      <div class="gps-ending-screen" style="
        ${backgroundStyle}
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh; 
        overflow: hidden; 
        z-index: 9999;
      ">
        ${isCustomLayout ? `
          <!-- Overlay trong suốt KHÔNG blur ảnh nền -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(0,0,0,0.1) 0%,
              rgba(0,0,0,0.2) 30%,
              rgba(0,0,0,0.4) 60%,
              rgba(0,0,0,0.6) 100%
            );
            z-index: 1;
          "></div>
        ` : ''}
        <div class="gps-ending-container" style="
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          z-index: 2;
          ${isCustomLayout ? 'padding-top: 35vh;' : ''}
        ">
          <style>
            .gps-ending-container::-webkit-scrollbar { display: none; }
          </style>
          
          <!-- Header Section -->
          <div class="gps-ending-header" style="
            text-align: center;
            margin-bottom: 2rem;
            flex-shrink: 0;
            ${isCustomLayout ? 'margin-top: -15vh;' : ''}
          ">
            <div class="gps-ending-category" style="
              font-size: 0.875rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: ${end.color};
              margin-bottom: 0.5rem;
              opacity: 0.9;
              text-shadow: ${isCustomLayout ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'};
            ">${end.category}</div>
            
            <h1 class="gps-ending-title" style="
              font-size: 2.5rem;
              font-weight: 700;
              color: white;
              margin: 0 0 0.5rem 0;
              text-shadow: ${isCustomLayout ? '3px 3px 6px rgba(0,0,0,0.9)' : '2px 2px 4px rgba(0,0,0,0.5)'};
              line-height: 1.2;
            ">${end.title}</h1>
            
            <p class="gps-ending-subtitle" style="
              font-size: 1rem;
              font-weight: 500;
              color: ${end.color};
              margin: 0;
              opacity: 0.9;
              text-shadow: ${isCustomLayout ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'};
            ">${end.subtitle}</p>
          </div>

          <!-- Main Content -->
          <div class="gps-ending-main" style="
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 2rem;
            flex: 1;
            min-height: 0;
            overflow: hidden;
          ">
            
            <!-- Left Column: Description & Consequences -->
            <div class="gps-ending-left" style="
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              overflow: hidden;
            ">
              
              <!-- Description -->
              <div class="gps-ending-desc-section" style="
                background: ${isCustomLayout ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)'};
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'};
                flex-shrink: 0;
              ">
                <p style="
                  font-size: 1.125rem;
                  line-height: 1.6;
                  color: white;
                  margin: 0;
                  font-weight: 400;
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                ">${end.desc}</p>
              </div>

              <!-- Consequences -->
              <div class="gps-ending-consequences" style="
                background: ${isCustomLayout ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)'};
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'};
                flex: 1;
                overflow: hidden;
              ">
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${end.color};
                  margin: 0 0 1rem 0;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                ">${isCustomLayout ? (type === 'true' ? 'Thành Tựu Đạt Được' : type === 'bad' ? 'Vấn Đề Phát Sinh' : type === 'fdi_strategic' ? 'Phân Tích Chiến Lược' : type === 'gameover' ? 'Nguyên Nhân Thất Bại' : 'Đánh Giá Tổng Quan') : 'Hậu Quả & Tác Động'}</h3>
                
                <div class="gps-consequences-list" style="
                  display: flex;
                  flex-direction: column;
                  gap: 0.75rem;
                  max-height: 300px;
                  overflow: hidden;
                ">
                  ${end.consequences.map(consequence => `
                    <div style="
                      display: flex;
                      align-items: flex-start;
                      gap: 0.75rem;
                      padding: 0.75rem;
                      background: ${isCustomLayout ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.05)'};
                      border-radius: 8px;
                      border-left: 3px solid ${end.color};
                    ">
                      <div style="
                        width: 6px;
                        height: 6px;
                        background: ${end.color};
                        border-radius: 50%;
                        margin-top: 0.5rem;
                        flex-shrink: 0;
                      "></div>
                      <span style="
                        color: white;
                        font-size: 0.9rem;
                        line-height: 1.5;
                        font-weight: 400;
                        text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                      ">${consequence}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Lesson -->
              <div class="gps-ending-lesson" style="
                background: ${isCustomLayout ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)'};
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'};
                flex-shrink: 0;
              ">
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${end.color};
                  margin: 0 0 0.75rem 0;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                ">${isCustomLayout ? (type === 'true' ? 'Ý Nghĩa Lịch Sử' : type === 'bad' ? 'Cảnh Báo & Khuyến Nghị' : type === 'fdi_strategic' ? 'Thực Trạng Toàn Cầu' : type === 'gameover' ? 'Bài Học Đắng Cay' : 'Hướng Phát Triển') : 'Bài Học Kinh Nghiệm'}</h3>
                <p style="
                  font-size: 0.95rem;
                  line-height: 1.6;
                  color: white;
                  margin: 0;
                  font-weight: 400;
                  font-style: italic;
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                ">${end.lesson}</p>
              </div>
            </div>

            <!-- Right Column: Stats & Actions -->
            <div class="gps-ending-right" style="
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              overflow: hidden;
            ">
              
              <!-- Stats -->
              <div class="gps-ending-stats" style="
                background: ${isCustomLayout ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)'};
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 1.5rem;
                border: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'};
                flex: 1;
                overflow-y: visible;
              ">
                <h3 style="
                  font-size: 1rem;
                  font-weight: 600;
                  color: ${end.color};
                  margin: 0 0 1rem 0;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                ">Thống Kê Cuối Game</h3>
                
                <div class="gps-stats-grid" style="
                  display: flex;
                  flex-direction: column;
                  gap: 0.75rem;
                ">
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Vai trò</span>
                    <span style="color: white; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${roleName}</span>
                  </div>
                  
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Số lượt</span>
                    <span style="color: white; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${state.turnCount}</span>
                  </div>
                  
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Vốn</span>
                    <span style="color: ${state.capital < 0 ? '#ef4444' : 'white'}; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${Math.floor(state.capital)}</span>
                  </div>
                  
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Sức khỏe</span>
                    <span style="color: ${state.hp <= 0 ? '#ef4444' : 'white'}; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${Math.floor(state.hp)}</span>
                  </div>
                  
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Uy tín</span>
                    <span style="color: white; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${state.reputation}</span>
                  </div>

                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Tương thích</span>
                    <span style="color: white; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${state.sp}</span>
                  </div>
                  
                  <div class="gps-stat-row" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                  ">
                    <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">Tiến độ</span>
                    <span style="color: white; font-weight: 600; font-size: 0.9rem; text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${Math.min(100, Math.floor(state.progress))}%</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="gps-ending-actions" style="
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                flex-shrink: 0;
              ">
                <button class="gps-btn gps-btn-primary" id="gpsPlayAgain" style="
                  background: ${end.color};
                  color: white;
                  border: none;
                  padding: 0.875rem 1.5rem;
                  border-radius: 8px;
                  font-size: 1rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)'">
                  Chơi lại
                </button>
                
                <button class="gps-btn gps-btn-secondary" id="gpsBackHome" style="
                  background: ${isCustomLayout ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)'};
                  color: white;
                  border: 1px solid ${isCustomLayout ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.3)'};
                  padding: 0.875rem 1.5rem;
                  border-radius: 8px;
                  font-size: 1rem;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  backdrop-filter: blur(15px);
                  text-shadow: ${isCustomLayout ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};
                " onmouseover="this.style.background='${isCustomLayout ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.2)'}'" onmouseout="this.style.background='${isCustomLayout ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)'}'">
                  ← Về Trang Chính
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    document.getElementById('gpsPlayAgain').addEventListener('click', () => {
      // Reset overflow
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      gameScreen.classList.remove('active');
      updateGameScreenContent('');
      resetState();

      // Restart from video
      navbar.classList.add('hidden');
      switchStage('gameVideoScreen');
      introVideo.currentTime = 0;
      introVideo.play().catch(() => showRoleSelection());
      introVideo.addEventListener('ended', showRoleSelection, { once: true });
    });

    document.getElementById('gpsBackHome').addEventListener('click', () => {
      // Reset overflow
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      
      gameScreen.classList.remove('active');
      updateGameScreenContent('');
      navbar.classList.remove('hidden');
      resetState();
      
      // Switch to hero screen
      switchStage('gameHero');
    });
  }
}
