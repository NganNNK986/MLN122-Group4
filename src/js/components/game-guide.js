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
    capital: 150,
    hp: 100,
    reputation: 100,
    role: null,
    items: [],
    unlockedEventIds: [],
    usedEventIds: [], // Track events đã sử dụng
    currentQuizIndex: 0, // Theo dõi tiến trình Quiz
    score: 0,
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
      groupName: 'Sở hữu công cộng',
      subGroup: 'Sở hữu toàn dân',
      bgImg: 'public/image/bg-stage2-state.png'
    },
    collective: {
      name: 'Tập thể',
      passive: 'DISCOUNT_GROUP',
      desc: 'Nội tại: Giảm giá Item 20%. Cộng thêm 2 Vốn mỗi lượt chơi (Chi phí vận hành thấp).',
      img: 'public/image/role-collective.png',
      cls: 'celebrate-collective',
      groupName: 'Sở hữu công cộng',
      subGroup: 'Sở hữu tập thể',
      bgImg: 'public/image/bg-stage2-collective.png'
    },
    private: {
      name: 'Tư nhân',
      passive: 'PROFIT_RISK',
      desc: 'Nội tại: Tăng 20% lượng Vốn nhận được từ các lựa chọn. Sát thương trừ HP x1.25.',
      img: 'public/image/role-private.png',
      cls: 'celebrate-private',
      groupName: 'Sở hữu tư',
      subGroup: 'Sở hữu tư nhân trong nước',
      bgImg: 'public/image/bg-stage2-private.png'
    }
  };

  const ITEMS = [
    { id: 'IT01', name: 'Hệ thống Dữ liệu Bộ', tag: 'state', price: 35, img: 'public/image/item-it01-database.png', desc: 'Công cụ quản lý vĩ mô và điều tiết nền kinh tế của Nhà nước.' },
    { id: 'IT02', name: 'Khai thác Hạ tầng', tag: 'state', price: 35, img: 'public/image/item-it02-infrastructure.png', desc: 'Dự án phát triển hạ tầng chiến lược phục vụ lợi ích toàn dân.' },
    { id: 'IT03', name: 'Đất Nông nghiệp', tag: 'collective', price: 30, img: 'public/image/item-it03-farmland.png', desc: 'Tư liệu sản xuất thuộc sở hữu chung của các thành viên Hợp tác xã.' },
    { id: 'IT04', name: 'Dây chuyền Nông sản', tag: 'collective', price: 30, img: 'public/image/item-it04-agri-production.png', desc: 'Hệ thống sản xuất liên kết theo mô hình kinh tế tập thể tương trợ.' },
    { id: 'IT05', name: 'AI Chốt đơn', tag: 'private', price: 45, img: 'public/image/item-it05-ai-sales.png', desc: 'Công cụ tối ưu hóa lợi nhuận và sức cạnh tranh cho doanh nghiệp tư nhân.' },
    { id: 'IT06', name: 'Kho bãi Logistics', tag: 'private', price: 45, img: 'public/image/item-it06-logistics.png', desc: 'Hệ thống kho vận hiện đại giúp tối đa hóa chuỗi giá trị của tư nhân.' }
  ];

  const TAG_NAMES = {
    state: 'Nhà nước',
    collective: 'Tập thể',
    private: 'Tư nhân'
  };

  const QUIZ_DATA = {
    state: [
      {
        question: "Thị trường hàng hóa thiết yếu đang biến động mạnh, giá cả tăng cao. Bạn sẽ làm gì?",
        options: [
          { 
            text: "Để thị trường tự điều tiết theo quy luật cung cầu nhằm thu thuế cao hơn", 
            effect: { capital: 15, hp: -10, reputation: -15 },
            explanation: "Nếu chỉ vì lợi ích ngân sách mà bỏ mặc an sinh, niềm tin của nhân dân sẽ sụt giảm nghiêm trọng."
          },
          { 
            text: "Sử dụng quỹ dự trữ quốc gia để bình ổn giá, ưu tiên an sinh xã hội", 
            effect: { capital: -5, hp: 10, reputation: 15 },
            explanation: "Chính xác! Nhà nước cần can thiệp để bảo vệ đời sống nhân dân trong những thời điểm khó khăn."
          },
          { 
            text: "Nhập khẩu hàng giá rẻ ồ ạt để ép giá các doanh nghiệp tư nhân trong nước", 
            effect: { hp: -15, reputation: -10 },
            explanation: "Điều này có thể làm tê liệt sản xuất trong nước và gây mất cân đối kinh tế dài hạn."
          }
        ]
      },
      {
        question: "Ngân sách quốc gia đang dư dả một phần. Bạn ưu tiên đầu tư vào đâu?",
        options: [
          { 
            text: "Chỉ tập trung vào các đặc khu kinh tế lớn để thu lợi nhuận nhanh nhất", 
            effect: { capital: 20, hp: -10, reputation: -5 },
            explanation: "Phát triển lệch tâm sẽ tạo ra gánh nặng xã hội và di dân tự do về các đô thị lớn."
          },
          { 
            text: "Cho các doanh nghiệp Nhà nước vay ưu đãi không cần thẩm định kỹ", 
            effect: { capital: -30, reputation: -20 },
            explanation: "Sử dụng ngân sách thiếu kiểm soát sẽ dẫn đến lãng phí và nguy cơ tham nhũng cao."
          },
          { 
            text: "Xây dựng hạ tầng giao thông và viễn thông tại các vùng sâu, vùng xa", 
            effect: { capital: -10, hp: 15, reputation: 20 },
            explanation: "Tuyệt vời! Đầu tư công vào hạ tầng vùng khó khăn giúp thu hẹp khoảng cách giàu nghèo."
          }
        ]
      },
      {
        question: "Một số dự án công nghiệp gây ô nhiễm môi trường nghiêm trọng. Bạn xử lý sao?",
        options: [
          { 
            text: "Kiên quyết đình chỉ và yêu cầu xử lý triệt để dù tăng trưởng kinh tế chậm lại", 
            effect: { capital: -5, hp: 20, reputation: 15 },
            explanation: "Phát triển bền vững không thể đánh đổi môi trường lấy tăng trưởng bằng mọi giá."
          },
          { 
            text: "Nới lỏng quy định để các doanh nghiệp duy trì sản xuất và đóng góp GDP", 
            effect: { capital: 15, hp: -30, reputation: -15 },
            explanation: "Hệ lụy về sức khỏe cộng đồng và môi trường sẽ tốn kém hơn nhiều so với lợi ích kinh tế trước mắt."
          },
          { 
            text: "Chỉ phạt tiền tượng trưng để răn đe và cho phép tiếp tục hoạt động", 
            effect: { capital: 5, hp: -15, reputation: -10 },
            explanation: "Hình phạt không đủ mạnh sẽ khiến các doanh nghiệp tiếp tục coi thường pháp luật bảo vệ môi trường."
          }
        ]
      },
      {
        question: "Bạn cần nâng cao chất lượng nguồn nhân lực quốc gia. Phương án nào là tốt nhất?",
        options: [
          { 
            text: "Chỉ tập trung đào tạo chuyên gia cấp cao, để mặc lao động phổ thông tự bơi", 
            effect: { capital: -10, hp: 5, reputation: -10 },
            explanation: "Sự thiếu hụt lao động tay nghề cao ở diện rộng sẽ làm kìm hãm đà phát triển của toàn nền kinh tế."
          },
          { 
            text: "Miễn phí đào tạo nghề cho người lao động và đầu tư mạnh vào giáo dục công", 
            effect: { capital: -10, hp: 15, reputation: 15 },
            explanation: "Nhân lực là tài sản quý giá nhất. Đầu tư vào con người là khoản đầu tư sinh lời nhất của Nhà nước."
          },
          { 
            text: "Yêu cầu các doanh nghiệp tự bỏ kinh phí đào tạo, Nhà nước không hỗ trợ", 
            effect: { capital: 5, hp: -10 },
            explanation: "Thiếu sự điều tiết của Nhà nước sẽ dẫn đến sự mất cân đối về kỹ năng lao động giữa các ngành nghề."
          }
        ]
      },
      {
        question: "Dự phòng ngân sách cho các tình huống khẩn cấp. Bạn ưu tiên phân bổ thế nào?",
        options: [
          { 
            text: "Dùng để bù lỗ cho các tập đoàn Nhà nước làm ăn kém hiệu quả", 
            effect: { capital: -20, reputation: -15, hp: -10 },
            explanation: "Dùng tiền thuế của dân để nuôi dưỡng sự yếu kém sẽ gây bất mãn lớn trong xã hội."
          },
          { 
            text: "Cắt giảm thuế mạnh cho tầng lớp thượng lưu để kích cầu tiêu dùng", 
            effect: { capital: -15, reputation: -15 },
            explanation: "Chính sách này thường làm gia tăng sự bất bình đẳng xã hội thay vì giúp ích cho đa số người dân."
          },
          { 
            text: "Dành cho y tế, cứu trợ thiên tai và mạng lưới an sinh xã hội", 
            effect: { capital: -15, hp: 20, reputation: 20 },
            explanation: "An toàn của nhân dân là ưu tiên hàng đầu của một Nhà nước định hướng xã hội chủ nghĩa."
          }
        ]
      },
      {
        question: "Vị thế của kinh tế Nhà nước trong nền kinh tế nhiều thành phần nên như thế nào?",
        options: [
          { 
            text: "Giữ vai trò chủ đạo ở các ngành then chốt và dẫn dắt các thành phần khác", 
            effect: { capital: 30, hp: 10, reputation: 15 },
            explanation: "Sự dẫn dắt của Nhà nước đảm bảo nền kinh tế đi đúng hướng xã hội chủ nghĩa và ổn định."
          },
          { 
            text: "Nhà nước độc quyền toàn bộ các lĩnh vực để kiểm soát tuyệt đối", 
            effect: { capital: -15, hp: -15, reputation: -20 },
            explanation: "Sự độc quyền thái quá sẽ triệt tiêu động lực cạnh tranh và sự năng động của thị trường."
          },
          { 
            text: "Rút toàn bộ vốn khỏi thị trường, để tư nhân tự quyết định mọi thứ", 
            effect: { capital: 25, hp: -20, reputation: -25 },
            explanation: "Khi thiếu sự điều tiết của Nhà nước, lợi ích công cộng dễ bị xâm phạm bởi lòng tham lợi nhuận."
          }
        ]
      }
    ],
    collective: [
      {
        question: "Một thành viên trong tổ hợp tác chăn nuôi muốn áp dụng kỹ thuật mới nhưng các thành viên khác còn nghi ngờ hiệu quả. Bạn xử lý sao?",
        options: [
          { 
            text: "Thành viên đó tách ra làm riêng để tự chứng minh, không cần thuyết phục ai", 
            effect: { hp: -15, reputation: -10 },
            explanation: "Tư tưởng cá nhân chủ nghĩa làm suy yếu sức mạnh đoàn kết của tổ hợp tác."
          },
          { 
            text: "Báo cáo lên cơ quan khuyến nông nhà nước nhờ phân xử và ra quyết định", 
            effect: { capital: -5, reputation: 5 },
            explanation: "Quá phụ thuộc vào cơ quan bên ngoài sẽ làm giảm tính chủ động và tự chủ của tập thể."
          },
          { 
            text: "Đề xuất thí điểm trên một phần diện tích chung, sau một vụ cả tổ cùng đánh giá rồi biểu quyết", 
            effect: { capital: 10, hp: 10, reputation: 15 },
            explanation: "Tuyệt vời! Dân chủ bàn bạc và thực chứng là cách tốt nhất để tạo sự đồng thuận."
          }
        ]
      },
      {
        question: "Cuối năm Hợp tác xã (HTX) có lợi nhuận, các xã viên đang tranh luận về cách chia. Bạn chọn phương án nào?",
        options: [
          { 
            text: "Chủ nhiệm HTX quyết định mức chia theo đánh giá cá nhân", 
            effect: { hp: -10, reputation: -25 },
            explanation: "Sự độc đoán trong phân phối lợi nhuận sẽ phá vỡ niềm tin của các thành viên HTX."
          },
          { 
            text: "Chia theo tỷ lệ ngày công lao động và vốn góp của từng thành viên", 
            effect: { capital: 15, hp: 10, reputation: 10 },
            explanation: "Chính xác! Đây là nguyên tắc phân phối công bằng theo đóng góp trong kinh tế tập thể."
          },
          { 
            text: "Chia đều cho tất cả xã viên, không phân biệt công đóng góp", 
            effect: { capital: -15, reputation: 5 },
            explanation: "Tính cào bằng sẽ triệt tiêu động lực làm việc của những thành viên tích cực nhất."
          }
        ]
      },
      {
        question: "Nhóm thợ thủ công trong làng muốn cùng nhau bán hàng ra thị trường lớn hơn. Bạn tư vấn hướng đi nào?",
        options: [
          { 
            text: "Cùng góp vốn thành lập tổ hợp tác, cùng quản lý và chia lợi nhuận theo đóng góp", 
            effect: { capital: 15, hp: 15, reputation: 10 },
            explanation: "Hợp tác giúp quy tụ nguồn lực và tăng sức cạnh tranh mà vẫn giữ được quyền làm chủ."
          },
          { 
            text: "Một người bỏ vốn mở xưởng, thuê những người còn lại làm công ăn lương", 
            effect: { hp: -20, reputation: -10 },
            explanation: "Mô hình này chuyển từ kinh tế tập thể sang tư hữu, làm mất tính bình đẳng của nhóm."
          },
          { 
            text: "Đề nghị UBND xã đứng ra thành lập doanh nghiệp nhà nước quản lý làng nghề", 
            effect: { capital: -10, reputation: 15 },
            explanation: "Kinh tế tập thể cần tự đứng trên đôi chân của mình thay vì ỷ lại hoàn toàn vào Nhà nước."
          }
        ]
      },
      {
        question: "Đội tàu đánh cá của ngư dân gặp mùa biển động, sản lượng giảm mạnh. Giải pháp nào là tốt nhất?",
        options: [
          { 
            text: "Chủ tàu lớn mua lại tàu của người thua lỗ, tập trung sở hữu vào một tay", 
            effect: { hp: -25, reputation: -30 },
            explanation: "Sự thâu tóm tư bản làm mất đi tính chất tương trợ của cộng đồng ngư dân."
          },
          { 
            text: "Báo cáo lên Bộ Nông nghiệp xin hỗ trợ khẩn cấp từ ngân sách nhà nước", 
            effect: { capital: 10, reputation: 5 },
            explanation: "Hỗ trợ của Nhà nước là cần thiết nhưng cần kết hợp với sự nỗ lực tự thân của tập thể."
          },
          { 
            text: "Ngư dân cùng họp, thống nhất luân phiên ra khơi và chia sẻ sản lượng để không ai bị bỏ lại", 
            effect: { hp: 20, reputation: 25, capital: -10 },
            explanation: "Rất nhân văn! Tinh thần 'lá lành đùm lá rách' là sức mạnh cốt lõi của kinh tế tập thể."
          }
        ]
      },
      {
        question: "Liên hiệp HTX tiêu dùng muốn mở thêm điểm bán hàng ở khu dân cư mới. Cách huy động vốn nào phù hợp nhất?",
        options: [
          { 
            text: "Phát hành cổ phiếu ra công chúng để huy động vốn mở rộng nhanh", 
            effect: { capital: 30, reputation: -15 },
            explanation: "Huy động vốn đại chúng có thể làm loãng quyền kiểm soát của các thành viên lao động."
          },
          { 
            text: "Kết nạp thêm thành viên mới ở khu vực đó, để chính người dân cùng góp vốn và làm chủ", 
            effect: { capital: 20, hp: 20, reputation: 25 },
            explanation: "Tuyệt vời! Đây chính là cách phát triển HTX bền vững: Người dùng cũng chính là người chủ."
          },
          { 
            text: "Xin ngân sách nhà nước đầu tư xây dựng cơ sở vật chất", 
            effect: { capital: 10, hp: -10 },
            explanation: "Dựa quá nhiều vào bao cấp sẽ làm suy yếu năng lực cạnh tranh thực tế của HTX."
          }
        ]
      },
      {
        question: "HTX đang phát triển tốt và muốn mở rộng sản xuất. Bạn chọn nguồn lực nào?",
        options: [
          { 
            text: "Kêu gọi thêm hộ dân và người lao động tự nguyện tham gia góp vốn, mở rộng thành viên", 
            effect: { capital: 20, hp: 25, reputation: 30 },
            explanation: "Đúng nguyên tắc! Tự nguyện và bình đẳng là chìa khóa mở rộng quy mô kinh tế tập thể."
          },
          { 
            text: "Lập dự án trình Nhà nước phê duyệt, sử dụng vốn ngân sách và đầu tư công", 
            effect: { capital: 15, reputation: 15 },
            explanation: "Đầu tư công có thể giúp quy mô lớn nhanh nhưng thiếu tính linh hoạt của kinh tế thị trường."
          },
          { 
            text: "Huy động vốn từ nhà đầu tư bên ngoài, phát hành cổ phần cho người không tham gia lao động", 
            effect: { capital: 40, hp: -35, reputation: -20 },
            explanation: "Cẩn thận! Việc ưu tiên lợi nhuận vốn hơn lợi ích lao động sẽ làm hỏng bản chất của HTX."
          }
        ]
      }
    ],
    private: [
      {
        question: "Thị trường xuất hiện nhiều đối thủ mới với sản phẩm giá rẻ. Bạn sẽ làm gì để cạnh tranh?",
        options: [
          { 
            text: "Sử dụng các mối quan hệ cá nhân để gây khó dễ cho đối thủ mới", 
            effect: { capital: 10, reputation: -30 },
            explanation: "Cạnh tranh không lành mạnh sẽ hủy hoại uy tín và đạo đức kinh doanh của bạn về lâu dài."
          },
          { 
            text: "Tối ưu hóa quy trình sản xuất và không ngừng đổi mới sáng tạo để nâng cao chất lượng", 
            effect: { capital: 15, hp: 10, reputation: 10 },
            explanation: "Chính xác! Sự năng động và sáng tạo là lợi thế cạnh tranh cốt lõi của kinh tế tư nhân."
          },
          { 
            text: "Sao chép y hệt sản phẩm của đối thủ và bán với giá thấp hơn nữa", 
            effect: { capital: 5, reputation: -20 },
            explanation: "Vi phạm bản quyền và thiếu sáng tạo sẽ khiến doanh nghiệp không thể phát triển bền vững."
          }
        ]
      },
      {
        question: "Bạn cần quyết định chính sách nhân sự cho năm tới. Ưu tiên của bạn là gì?",
        options: [
          { 
            text: "Cắt giảm tối đa phúc lợi để tập trung vốn đầu tư cho máy móc hiện đại", 
            effect: { capital: 20, hp: -30, reputation: -10 },
            explanation: "Máy móc không thể thay thế hoàn toàn con người. Sự bất mãn của nhân viên sẽ dẫn đến đình công."
          },
          { 
            text: "Thay thế toàn bộ nhân công bằng robot ngay lập tức để giảm chi phí vận hành", 
            effect: { capital: 30, hp: -40, reputation: -20 },
            explanation: "Thay đổi quá đột ngột mà không có lộ trình hỗ trợ sẽ gây ra khủng hoảng xã hội nghiêm trọng."
          },
          { 
            text: "Tăng lương thưởng và cải thiện điều kiện làm việc để thu hút nhân tài", 
            effect: { capital: -15, hp: 20, reputation: 15 },
            explanation: "Con người là tài sản quý nhất. Đội ngũ hạnh phúc sẽ tạo ra năng suất lao động vượt trội."
          }
        ]
      },
      {
        question: "Một cơ hội đầu tư mạo hiểm nhưng tiềm năng lợi nhuận cực lớn xuất hiện. Bạn chọn sao?",
        options: [
          { 
            text: "Nghiên cứu kỹ lưỡng và chỉ đầu tư một phần vốn trong ngưỡng an toàn", 
            effect: { capital: 10, hp: 5, reputation: 10 },
            explanation: "Quản trị rủi ro thông minh là chìa khóa của sự thành công trong kinh doanh tư nhân."
          },
          { 
            text: "Dồn toàn bộ vốn liếng và vay mượn thêm để 'tất tay' vào một cơ hội duy nhất", 
            effect: { capital: -50, hp: -20 },
            explanation: "Tư duy cờ bạc trong kinh doanh thường dẫn đến sự sụp đổ nhanh chóng khi thị trường biến động."
          },
          { 
            text: "Chờ xem các doanh nghiệp khác làm thế nào rồi mới bắt chước theo", 
            effect: { capital: -5, reputation: -5 },
            explanation: "Sự thụ động sẽ khiến bạn luôn là người đi sau và bỏ lỡ những 'thời điểm vàng'."
          }
        ]
      },
      {
        question: "Doanh nghiệp gặp khủng hoảng truyền thông về chất lượng sản phẩm. Cách xử lý nào tốt nhất?",
        options: [
          { 
            text: "Chi tiền cho các đơn vị truyền thông để che đậy thông tin và hướng dư luận sang hướng khác", 
            effect: { capital: -15, reputation: -40 },
            explanation: "Dùng tiền để che giấu sự thật chỉ là giải pháp tạm thời và sẽ gây hậu quả tồi tệ hơn khi bị phát hiện."
          },
          { 
            text: "Công khai xin lỗi, thu hồi sản phẩm lỗi và bồi thường thỏa đáng cho khách hàng", 
            effect: { capital: -20, hp: 15, reputation: 35 },
            explanation: "Sự trung thực và trách nhiệm là cách tốt nhất để lấy lại niềm tin từ khách hàng."
          },
          { 
            text: "Giữ im lặng và hy vọng khách hàng sẽ sớm quên đi sự việc", 
            effect: { reputation: -25, hp: -10 },
            explanation: "Sự thờ ơ với quyền lợi khách hàng là con đường ngắn nhất dẫn đến sự tẩy chay của thị trường."
          }
        ]
      },
      {
        question: "Bạn có nguồn vốn nhàn rỗi lớn. Bạn sẽ sử dụng nó như thế nào?",
        options: [
          { 
            text: "Chỉ mua lại các bằng sáng chế có sẵn để tiết kiệm thời gian và rủi ro", 
            effect: { capital: -20, hp: 5 },
            explanation: "An toàn nhưng thiếu tính độc bản, bạn sẽ luôn phải phụ thuộc vào nền tảng của người khác."
          },
          { 
            text: "Dùng toàn bộ vốn để mua lại các đối thủ nhỏ nhằm độc chiếm thị trường", 
            effect: { capital: -40, reputation: -20 },
            explanation: "Độc quyền làm giảm động lực đổi mới của chính bạn và có thể vi phạm luật cạnh tranh."
          },
          { 
            text: "Đầu tư mạnh vào nghiên cứu và phát triển (R&D) để tạo ra sản phẩm đột phá", 
            effect: { capital: -25, hp: 20, reputation: 15 },
            explanation: "Sáng tạo là động lực phát triển. Doanh nghiệp dẫn đầu công nghệ sẽ dẫn đầu thị trường."
          }
        ]
      },
      {
        question: "Quan điểm của bạn về trách nhiệm xã hội của doanh nghiệp (CSR) là gì?",
        options: [
          { 
            text: "Chủ động thực hiện các dự án cộng đồng và bảo vệ môi trường như một phần chiến lược", 
            effect: { capital: -15, hp: 15, reputation: 30 },
            explanation: "Tuyệt vời! Doanh nghiệp phát triển bền vững là doanh nghiệp gắn liền với lợi ích xã hội."
          },
          { 
            text: "Chỉ thực hiện các hoạt động từ thiện khi cần làm hình ảnh quảng bá thương hiệu", 
            effect: { capital: -5, reputation: 10 },
            explanation: "CSR mang tính đối phó sẽ không tạo ra giá trị thực sự cho cả cộng đồng và doanh nghiệp."
          },
          { 
            text: "Mục tiêu duy nhất là tối đa hóa lợi nhuận, đóng thuế đầy đủ là đủ trách nhiệm", 
            effect: { capital: 20, reputation: -20 },
            explanation: "Tư duy cũ kỹ. Trong thế giới hiện đại, người tiêu dùng ưu tiên các thương hiệu có trách nhiệm xã hội."
          }
        ]
      }
    ]
  };

  const IDEOLOGY_GROUP = {
    state: 'public',
    collective: 'public',
    private: 'private'
  };

  const CONTRADICTIONS = {};
  const HIDDEN_EVENTS = {};
  const EASTER_EGGS = {};

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

    // Cấu hình không cuộn page cho các màn hình đặc thù
    if (stageId === 'gameHero') {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

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

  if (startGameBtn && videoScreen && roleScreen) {
    startGameBtn.addEventListener('click', () => {
      console.log('🚀 Start Game clicked!');
      resetState();
      
      if (navbar) navbar.classList.add('hidden');
      switchStage('gameVideoScreen');

      if (introVideo) {
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
      } else {
        showRoleSelection();
      }
    });

      // Add error listener for video load errors
      if (introVideo) {
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
      }
  }

  if (videoSkipBtn && introVideo) {
    videoSkipBtn.addEventListener('click', () => {
      introVideo.pause();
      showRoleSelection();
    });
  }

  function resetState() {
    state = {
      capital: 150,
      hp: 100,
      reputation: 100,
      role: null,
      items: [],
      unlockedEventIds: [],
      usedEventIds: [],
      currentQuizIndex: 0,
      score: 0,
      flavorText: '',
      armorMacroUsed: false,
      turnCount: 0
    };
    selectedRole = null;

    // Reset UI
    if (navbar) navbar.classList.remove('hidden');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Reset screens
    if (videoScreen) {
      videoScreen.classList.remove('active');
      videoScreen.style.display = 'none';
      if (introVideo) introVideo.pause();
    }

    if (gameScreen) {
      gameScreen.classList.remove('active');
      gameScreen.style.display = 'none';
      updateGameScreenContent('');
    }

    if (celebrateOverlay) {
      celebrateOverlay.classList.remove('active');
      celebrateOverlay.style.display = 'none';
    }

    disableVideoBackground();
  }

  function showRoleSelection() {
    if (introVideo) introVideo.pause();
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
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
      'celebrate-private': '#EA580C'
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
            <img src="public/image/icon-reputation.png" alt="Uy tín" class="gps-stat-icon">
            <span class="gps-stat-label">Uy tín</span>
            <span class="gps-stat-value ${repClass}" data-stat="reputation">${state.reputation}</span>
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
    const statMap = { 'Vốn': 'capital', 'Sức khỏe': 'hp', 'Uy tín': 'reputation' };
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
    let actualDiffs = { capital: 0, hp: 0, reputation: 0 };

    if (diff.capital) actualDiffs.capital = diff.capital;
    if (diff.reputation) actualDiffs.reputation = diff.reputation;
    if (diff.hp) actualDiffs.hp = diff.hp;

    if (state.role === 'private') {
      if (actualDiffs.hp < 0) actualDiffs.hp *= 1.25;
      if (actualDiffs.capital > 0) actualDiffs.capital *= 1.2;
    }

    if (state.role === 'state') {
      if (actualDiffs.capital < 0) actualDiffs.capital *= 0.8; // Bảo hộ vốn tốt hơn
    }

    if (state.role === 'state' && (state.hp + actualDiffs.hp) < 30 && !state.armorMacroUsed) {
      actualDiffs.hp += 20;
      state.armorMacroUsed = true;
      setTimeout(() => showFloatingText('Sức khỏe', '+20 Nội Tại', '#3b82f6'), 300);
    }

    state.capital += actualDiffs.capital;
    state.reputation = Math.max(0, Math.min(100, state.reputation + actualDiffs.reputation));
    state.hp = Math.max(0, state.hp + actualDiffs.hp);

    if (actualDiffs.capital !== 0) showFloatingText('Vốn', actualDiffs.capital);
    if (actualDiffs.hp !== 0) showFloatingText('Sức khỏe', actualDiffs.hp);
    if (actualDiffs.reputation !== 0) showFloatingText('Uy tín', actualDiffs.reputation);
  }

  function applyTurnPassives() {
    if (state.role === 'collective') {
      state.capital += 2;
      setTimeout(() => showFloatingText('Vốn', '+2 Nội tại', '#10b981'), 500);
    }
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
          <p class="gps-phase-desc">Chọn <strong>2 Items chiến lược</strong>. Hãy cẩn thận: Chọn sai Items không phù hợp với vai trò sẽ khiến doanh nghiệp <strong>khủng hoảng hoặc phá sản</strong> ngay lập tức!</p>
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
        }

        updateHeaderInPlace();
        confirmBtn.disabled = selectedItems.length !== 2;
        confirmBtn.textContent = `Tiếp tục (đã chọn ${selectedItems.length}/2 thẻ)`;
      });

      grid.appendChild(card);
    });

    confirmBtn.addEventListener('click', () => {
      state.items = selectedItems;
      const selectedItemObjs = selectedItems.map(id => ITEMS.find(i => i.id === id));
      const matchCount = selectedItemObjs.filter(it => it.tag === state.role).length;

      if (matchCount === 0) {
        // Thất bại ngay lập tức - Trừ hết chỉ số để biểu thị sự sụp đổ
        applyEffect({ capital: -state.capital, hp: -state.hp, reputation: -state.reputation });
        showItemConfirmation(0);
      } else if (matchCount === 1) {
        // Phạt nặng vì chọn sai 1 item
        applyEffect({ capital: -30, hp: -30, reputation: -20 });
        showItemConfirmation(1);
      } else {
        // Thành công tuyệt đối
        showItemConfirmation(2);
      }
    });
  }

  function showItemConfirmation(matchCount) {
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

    updateGameScreenContent(`
      ${renderHeader()}
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
    `);

    document.getElementById('gpsStartQuiz').addEventListener('click', () => {
      if (matchCount === 0) {
        showEnding('item_fail');
      } else {
        nextTurn();
      }
    });
  }

  function checkEndGame() {
    if (state.currentQuizIndex >= 6) {
      // Logic kết cục đặc thù cho Nhà nước
      if (state.role === 'state' && state.capital < 30 && state.hp > 80 && state.reputation > 60) {
        showEnding('debt_welfare');
        return true;
      }

      const isTrue = state.capital > 60 && state.hp > 60 && state.reputation > 60;
      const isBad = state.capital < 30 || state.hp < 30 || state.reputation < 30;

      if (isTrue) {
        showEnding('true');
        return true;
      } else if (isBad) {
        showEnding('bad');
        return true;
      } else {
        showEnding('normal');
        return true;
      }
    }
    
    // Đã loại bỏ kiểm tra phá sản giữa chừng để người chơi đi hết 6 câu
    return false;
  }

  function nextTurn() {
    if (checkEndGame()) return;
    
    ensureVideoBackground();
    enableVideoBackground();
    
    // Áp dụng nội tại theo lượt (ví dụ: Tập thể +2 vốn)
    applyTurnPassives();
    
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const roleQuestions = QUIZ_DATA[state.role];
    if (!roleQuestions || state.currentQuizIndex >= roleQuestions.length) {
      checkEndGame();
      return;
    }

    const q = roleQuestions[state.currentQuizIndex];
    state.turnCount = state.currentQuizIndex + 1;

    updateGameScreenContent(`
      ${renderHeader()}
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
    `);

    q.options.forEach((opt, idx) => {
      document.getElementById(`quizOpt${idx}`).addEventListener('click', () => {
        handleQuizChoice(opt);
      });
    });
  }

  function handleQuizChoice(option) {
    // Áp dụng ảnh hưởng chỉ số
    applyEffect(option.effect);
    updateHeaderInPlace();

    // Hiển thị giải thích
    updateGameScreenContent(`
      ${renderHeader()}
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
    `);

    document.getElementById('gpsNextQuiz').addEventListener('click', () => {
      state.currentQuizIndex++;
      nextTurn();
    });
  }


  // ==================== PHASE 5: ENDINGS ====================
  function showEnding(type) {
    disableVideoBackground();
    
    if (window._gameKeydownHandler) {
      document.removeEventListener('keydown', window._gameKeydownHandler);
      window._gameKeydownHandler = null;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

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
        bgImg: 'public/image/dan_giau_nuoc_manh.jpg'
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
        bgImg: 'public/image/bg-ending-normal.png'
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
        bgImg: 'public/image/bg-ending-bad.png'
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
        bgImg: 'public/image/bg-ending-debt-welfare.png'
      },
      item_fail: {
        title: 'Sai Lầm Chiến Lược',
        subtitle: 'THẤT BẠI NGAY TỪ ĐẦU',
        category: 'Thất Bại',
        desc: 'Bạn đã chọn toàn bộ vật phẩm không phù hợp với vai trò của mình. Doanh nghiệp sụp đổ ngay lập tức do thiếu định hướng và mâu thuẫn cốt lõi.',
        consequences: [
          'Chiến lược sai lầm khi tư liệu sản xuất không khớp với mô hình.',
          'Nội bộ tan rã do không tìm được tiếng nói chung.',
          'Doanh nghiệp phá sản lập tức trước khi bắt đầu vận hành.'
        ],
        lesson: 'Lực lượng sản xuất phải phù hợp với Quan hệ sản xuất. Chọn sai công cụ cho mô hình sẽ dẫn đến sự sụp đổ nhanh chóng.',
        color: '#ef4444',
        bgImg: 'public/image/bg-ending-bad.png'
      }
    };

    const end = endings[type] || endings.normal;
    const roleName = state.role ? ROLE_DATA[state.role].name : '—';

    const capitalLabel = (state.role === 'state' && state.capital < 0) ? 'Nợ công' : 'Vốn còn lại';
    const capitalDisplay = (state.role === 'state' && state.capital < 0) ? Math.abs(Math.floor(state.capital)) : Math.floor(state.capital);

    updateGameScreenContent(`
      <div class="gps-ending-screen" style="
        background: #0f172a;
        position: fixed; top: 0; left: 0; 
        width: 100vw; height: 100vh; 
        overflow: hidden; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
      ">
        <div class="gps-ending-container" style="
          display: flex; width: 90vw; height: 85vh; max-width: 1400px;
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
          overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        ">
          <!-- Left Column -->
          <div class="gps-ending-image-side" style="flex: 1.2; position: relative; overflow: hidden; border-right: 1px solid rgba(255, 255, 255, 0.1);">
            <img src="${end.bgImg}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, transparent 70%, rgba(15, 23, 42, 0.3));"></div>
          </div>

          <!-- Right Column -->
          <div class="gps-ending-content-side" style="flex: 1; display: flex; flex-direction: column; padding: 3rem; overflow-y: auto; background: rgba(15, 23, 42, 0.4);">
            <style>
              .gps-ending-content-side::-webkit-scrollbar { width: 6px; }
              .gps-ending-content-side::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
            </style>

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

              <!-- Stats Grid -->
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

              <!-- Details -->
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

              <!-- Lesson -->
              <div style="background: ${end.color}15; padding: 1.75rem; border-radius: 16px; border-left: 5px solid ${end.color}; margin-bottom: 2rem;">
                <h4 style="margin: 0 0 0.75rem 0; color: ${end.color}; font-size: 0.95rem; text-transform: uppercase; font-weight: 800;">Bài học kinh tế</h4>
                <p style="margin: 0; font-size: 1.05rem; color: rgba(255,255,255,0.95); font-style: italic; line-height: 1.6;">
                  "${end.lesson}"
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="display: flex; gap: 1rem; margin-top: auto; padding-top: 2rem;">
              <button id="gpsPlayAgain" style="flex: 1.5; padding: 1.1rem; border-radius: 12px; border: none; background: ${end.color}; color: white; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 20px -5px ${end.color}44;">
                CHƠI LẠI
              </button>
              <button id="gpsBackHome" style="flex: 1; padding: 1.1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; font-weight: 600; cursor: pointer;">
                VỀ TRANG CHỦ
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    document.getElementById('gpsPlayAgain').addEventListener('click', () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      gameScreen.classList.remove('active');
      updateGameScreenContent('');
      resetState();
      navbar.classList.add('hidden');
      switchStage('gameVideoScreen');
      introVideo.currentTime = 0;
      introVideo.play().catch(() => showRoleSelection());
      introVideo.addEventListener('ended', showRoleSelection, { once: true });
    });

    document.getElementById('gpsBackHome').addEventListener('click', () => {
      // Chuyển hướng về trang chủ thực sự của website
      window.location.href = 'index.html';
    });
  }
}
