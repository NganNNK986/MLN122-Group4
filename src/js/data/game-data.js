export const ROLE_DATA = {
    state: {
      name: 'Nhà nước',
      passive: 'ARMOR_MACRO',
      desc: 'Nội tại: HP < 35 hồi 25 HP. Giảm mọi thiệt hại Vốn từ sự kiện đi 20%.',
      img: 'public/image/role-state.webp',
      cls: 'celebrate-state',
      groupName: 'Sở hữu công cộng',
      subGroup: 'Sở hữu toàn dân',
      bgImg: 'public/image/bg-stage2-state.webp'
    },
    collective: {
      name: 'Tập thể',
      passive: 'DISCOUNT_GROUP',
      desc: 'Nội tại: Giảm giá Item 20%. Cộng thêm 2 Vốn mỗi lượt chơi (Chi phí vận hành thấp).',
      img: 'public/image/role-collective.webp',
      cls: 'celebrate-collective',
      groupName: 'Sở hữu công cộng',
      subGroup: 'Sở hữu tập thể',
      bgImg: 'public/image/bg-stage2-collective.webp'
    },
    private: {
      name: 'Tư nhân',
      passive: 'PROFIT_RISK',
      desc: 'Nội tại: Tăng 20% lượng Vốn nhận được từ các lựa chọn. Sát thương trừ HP x1.25.',
      img: 'public/image/role-private.webp',
      cls: 'celebrate-private',
      groupName: 'Sở hữu tư',
      subGroup: 'Sở hữu tư nhân trong nước',
      bgImg: 'public/image/bg-stage2-private.webp'
    }
  };
  
  export const ITEMS = [
    { id: 'IT01', name: 'Hệ thống Dữ liệu Bộ', tag: 'state', price: 35, img: 'public/image/item-it01-database.webp', desc: 'Công cụ quản lý vĩ mô và điều tiết nền kinh tế của Nhà nước.' },
    { id: 'IT02', name: 'Khai thác Hạ tầng', tag: 'state', price: 35, img: 'public/image/item-it02-infrastructure.webp', desc: 'Dự án phát triển hạ tầng chiến lược phục vụ lợi ích toàn dân.' },
    { id: 'IT03', name: 'Đất Nông nghiệp', tag: 'collective', price: 30, img: 'public/image/item-it03-farmland.webp', desc: 'Tư liệu sản xuất thuộc sở hữu chung của các thành viên Hợp tác xã.' },
    { id: 'IT04', name: 'Dây chuyền Nông sản', tag: 'collective', price: 30, img: 'public/image/item-it04-agri-production.webp', desc: 'Hệ thống sản xuất liên kết theo mô hình kinh tế tập thể tương trợ.' },
    { id: 'IT05', name: 'AI Chốt đơn', tag: 'private', price: 45, img: 'public/image/item-it05-ai-sales.webp', desc: 'Công cụ tối ưu hóa lợi nhuận và sức cạnh tranh cho doanh nghiệp tư nhân.' },
    { id: 'IT06', name: 'Kho bãi Logistics', tag: 'private', price: 45, img: 'public/image/item-it06-logistics.webp', desc: 'Hệ thống kho vận hiện đại giúp tối đa hóa chuỗi giá trị của tư nhân.' }
  ];
  
  export const QUIZ_DATA = {
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
            explanation: "Hỗ trợ của Nhà nước là cần thiết nhưng cần kết hợp with sự nỗ lực tự thân của tập thể."
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
  
  export const ENDINGS_DATA = {
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
      desc: 'Bạn đã chọn toàn bộ vật phẩm không phù hợp với vai trò của mình. Doanh nghiệp sụp đổ ngay lập tức do thiếu định hướng và mâu thuẫn cốt lõi.',
      consequences: [
        'Chiến lược sai lầm khi tư liệu sản xuất không khớp with mô hình.',
        'Nội bộ tan rã do không tìm được tiếng nói chung.',
        'Doanh nghiệp phá sản lập tức trước khi bắt đầu vận hành.'
      ],
      lesson: 'Lực lượng sản xuất phải phù hợp với Quan hệ sản xuất. Chọn sai công cụ cho mô hình sẽ dẫn đến sự sụp đổ nhanh chóng.',
      color: '#ef4444',
      bgImg: 'public/image/bg-ending-bad.webp'
    }
  };
  
  export const TAG_NAMES = {
    state: 'Nhà nước',
    collective: 'Tập thể',
    private: 'Tư nhân'
  };
