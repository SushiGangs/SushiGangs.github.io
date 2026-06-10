const wikiData = {
  sushicore: `
    <h1 class="grad-pink">SushiCore Wiki</h1>
    <p>Chào mừng đến với tài liệu hướng dẫn cấu hình và sử dụng <strong>SushiCore</strong>. Đây là plugin cốt lõi chứa hầu hết mọi hệ thống cơ bản cần thiết cho một Server Survival, thay thế hoàn toàn cho EssentialsX với độ nhẹ nhàng và tối ưu vượt trội.</p>
    
    <section id="overview" class="wiki-section">
      <h2>1. Tổng Quan Hệ Sinh Thái</h2>
      <p>SushiCore tích hợp hơn 15 module tiện ích khác nhau, mỗi module đều có thể Bật/Tắt độc lập trong <code>config.yml</code>. Các module nổi bật bao gồm:</p>
      <ul>
        <li><strong>Teleportation:</strong> TPA, Home, RTP (Smart RTP tránh Lava/Nước), Spawn, Back.</li>
        <li><strong>Tiện ích người chơi:</strong> Remote Craft/Anvil, Trash GUI, AFK, Stats, Death Penalty.</li>
        <li><strong>Giao tiếp:</strong> Hệ thống Chat button (<code>[item]</code>, <code>[ping:player]</code>), Mail offline, Msg spy.</li>
        <li><strong>Tích hợp:</strong> Hỗ trợ hoàn toàn <code>Vault</code> (trừ tiền khi tp/rtp), <code>PlaceholderAPI</code>, và <code>WorldGuard</code> (tránh kẹt vùng cấm).</li>
      </ul>
    </section>

    <section id="teleport" class="wiki-section">
      <h2>2. Teleport, TPA & Smart RTP</h2>
      <h3>Warmup & Combat Tag</h3>
      <p>Tất cả các lệnh Teleport đều tuân thủ luật <strong>Warmup</strong> (Thời gian chờ). Khi đang chờ, nếu người chơi di chuyển hoặc bị nhận sát thương, lệnh Teleport sẽ lập tức bị hủy.</p>
      <p>Hệ thống <strong>Combat Tag</strong>: Khi người chơi đánh nhau, họ sẽ bị đánh dấu Combat trong 15 giây. Trong lúc này, mọi lệnh dịch chuyển (<code>/tpa</code>, <code>/home</code>, <code>/rtp</code>, <code>/spawn</code>,...) sẽ bị chặn đứng để tránh trốn tránh PvP.</p>
      
      <h3>Hệ Thống Smart RTP</h3>
      <p>SushiCore cung cấp hệ thống <strong>RTP Thông Minh</strong> với khả năng quét block an toàn. Bạn có thể định nghĩa nhiều khu vực đích khác nhau trong <code>config.yml</code>.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml (Mẫu cấu hình Zone)</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>rtp:
  blocked-biomes: [OCEAN, DEEP_OCEAN, RIVER]
  blocked-blocks: [LAVA, WATER, CACTUS, FIRE, MAGMA_BLOCK]
  destinations:
    overworld:
      world: world
      min-x: -3000
      max-x: 3000
      min-z: -3000
      max-z: 3000</code></pre>
      </div>
      
      <h3>RTP Trigger Zones</h3>
      <p>Thay vì phải gõ lệnh, Admin có thể tạo ra các <strong>vùng Trigger</strong>. Khi người chơi bước chân vào tọa độ này, họ sẽ bị RTP đi tự động, cực kỳ phù hợp cho cổng dịch chuyển ở Spawn.</p>
    </section>

    <section id="features" class="wiki-section">
      <h2>3. Hệ Thống Tiện Ích</h2>
      
      <h3>Nút bấm trong Chat (Chat Buttons)</h3>
      <p>Người chơi có thể tương tác trực tiếp với chat bằng cách gõ cú pháp đặc biệt. Ví dụ: gõ <code>[item]</code> để khoe món đồ đang cầm trên tay, hoặc <code>[pos]</code> để chia sẻ tọa độ hiện tại.</p>
      <p>Sử dụng lệnh <code>/cmdbutton</code> (Dành cho Admin) để tạo các nút bấm thực thi lệnh tùy chỉnh.</p>
      
      <h3>Tiện Ích Từ Xa (Remote) & Thùng Rác</h3>
      <p>Bao gồm các lệnh <code>/craft</code>, <code>/anvil</code>, <code>/echest</code>, <code>/fix</code>. Có thể đặt mức phí Vault cho từng thao tác. Người chơi có thể mở <code>/trash</code> (thùng rác) để tiêu hủy đồ đạc không dùng tới một cách an toàn.</p>
      
      <h3>Death Penalty (Phạt Sinh Tồn)</h3>
      <p>Khi người chơi chết, SushiCore có thể cấu hình để họ bị mất ngẫu nhiên 1 (hoặc nhiều) vật phẩm. Admin có thể tùy chỉnh danh sách <code>blacklist-lore</code> để không bao giờ rớt các vật phẩm "Bound" hoặc "Không thể phá hủy".</p>
    </section>

    <section id="permissions" class="wiki-section">
      <h2>4. Lệnh & Quyền Hạn (Permissions)</h2>
      <p>Dưới đây là một số lệnh và quyền hạn chính để dán vào LuckPerms hoặc cấu hình Group cho thành viên.</p>
      
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Quyền (Permission)</th>
              <th>Mô tả chức năng</th>
              <th>Mặc định</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code onclick="copyText(this)">sushicore.admin</code></td>
              <td>Quyền tối cao, bỏ qua mọi cooldown/limit.</td>
              <td>OP</td>
            </tr>
            <tr>
              <td><code onclick="copyText(this)">sushicore.tpa.use</code></td>
              <td>Quyền sử dụng lệnh TPA.</td>
              <td>True (Mọi người)</td>
            </tr>
            <tr>
              <td><code onclick="copyText(this)">sushicore.home.limit.5</code></td>
              <td>Cho phép người chơi tạo tối đa 5 Home.</td>
              <td>False</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  
  sushidecor: `
    <h1 class="grad-pink">SushiDecor Wiki</h1>
    <p>Chào mừng đến với tài liệu hướng dẫn <strong>SushiDecor</strong>. Plugin cung cấp hệ thống đầu lâu (Head Database), hạt (Particles) và nội thất (Furniture) mượt mà không cần dùng Mods.</p>
    
    <section id="heads" class="wiki-section">
      <h2>1. Hệ thống Head Database</h2>
      <p>SushiDecor tích hợp sẵn hơn 50,000 mẫu đầu lâu custom từ FreshCoal và Minecraft-Heads. Người chơi có thể mở Menu GUI để tìm kiếm và mua đầu lâu bằng tiền Vault.</p>
      <ul>
        <li><strong>Lệnh:</strong> <code>/heads</code> hoặc <code>/hdb</code> - Mở kho đầu lâu.</li>
        <li><strong>Lệnh:</strong> <code>/heads search &lt;từ khóa&gt;</code> - Tìm kiếm nhanh.</li>
        <li><strong>Quyền:</strong> <code>sushidecor.heads.use</code></li>
      </ul>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml (Giá mua Head)</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>head-database:
  enabled: true
  cost-per-head: 500
  categories:
    - ALPHABET
    - ANIMALS
    - BLOCKS
    - DECORATION</code></pre>
      </div>
    </section>

    <section id="furniture" class="wiki-section">
      <h2>2. Khối Nội Thất (Furniture)</h2>
      <p>Tạo ra bàn ghế, tủ lạnh, tivi bằng Armor Stand tàng hình kết hợp với Custom Model Data (CMD). Khi người chơi đặt block, SushiDecor sẽ tự động spawn ArmorStand và khóa tương tác.</p>
      <p>Admin có thể dùng lệnh <code>/decor give &lt;player&gt; &lt;furniture_id&gt;</code> để lấy vật phẩm.</p>
    </section>

    <section id="particles" class="wiki-section">
      <h2>3. Hiệu ứng Hạt (Particles)</h2>
      <p>Cung cấp hiệu ứng vệt sáng bay quanh người, cánh thiên thần (Wings) hoặc vòng hào quang (Halo) cực kỳ phù hợp cho hòm quay thưởng (Crates) hoặc rank VIP.</p>
      <p><strong>Lệnh:</strong> <code>/trails</code> - Mở GUI chọn hiệu ứng.</p>
    </section>
  `,

  sushilove: `
    <h1 class="grad-pink">SushiLove Wiki</h1>
    <p>Tài liệu <strong>SushiLove</strong>. Plugin kết hôn, kết đôi và chia sẻ nhà cửa - Mang lại tương tác xã hội tuyệt vời cho Server Towny/Survival.</p>
    
    <section id="marry" class="wiki-section">
      <h2>1. Hệ Thống Kết Hôn</h2>
      <p>Hai người chơi có thể cầu hôn nhau thông qua lệnh. Khi kết hôn thành công, cả Server sẽ nhận được thông báo chúc mừng kèm pháo hoa bắn lên tại vị trí của 2 người.</p>
      <ul>
        <li><code>/marry &lt;player&gt;</code> - Gửi lời cầu hôn.</li>
        <li><code>/marry accept/deny</code> - Đồng ý hoặc từ chối.</li>
        <li><code>/divorce</code> - Ly dị (Sẽ tốn một khoản phí lớn).</li>
      </ul>
    </section>

    <section id="perks" class="wiki-section">
      <h2>2. Đặc Quyền Cặp Đôi (Perks)</h2>
      <p>Tùy vào cấp độ tình cảm (Love Level), các cặp đôi sẽ mở khóa được những đặc quyền sau:</p>
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Cấp độ</th>
              <th>Đặc Quyền (Perks)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Level 1 (Mới cưới)</td>
              <td>Lệnh <code>/lovechat</code> - Kênh chat riêng tư cho 2 người.</td>
            </tr>
            <tr>
              <td>Level 5</td>
              <td>Lệnh <code>/kiss</code> và <code>/hug</code> - Gửi biểu cảm và Particle trái tim bay lên.</td>
            </tr>
            <tr>
              <td>Level 10</td>
              <td>Lệnh <code>/lovehome</code> - Một điểm dịch chuyển (Home) xài chung.</td>
            </tr>
            <tr>
              <td>Level 20</td>
              <td>EXP Share - Khi đứng gần nhau (Dưới 15 block), farm quái sẽ được nhận thêm 20% EXP.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="config" class="wiki-section">
      <h2>3. Config Mẫu</h2>
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml (Phí Ly Dị)</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>marriage:
  cost: 10000
  divorce-cost: 50000
  allow-same-gender: true
  
messages:
  broadcast-marry: "&d[SushiLove] &f{player1} &avà &f{player2} &ađã chính thức trở thành vợ chồng! Xin chúc mừng!"</code></pre>
      </div>
    </section>
  `,

  sushimanager: `
    <h1 class="grad-pink">SushiManager Wiki</h1>
    <p>Tài liệu <strong>SushiManager</strong>. Bộ công cụ quản trị Server, giảm Lag (ClearLag), Auto-Restart và tối ưu hóa TPS đỉnh cao.</p>
    
    <section id="clearlag" class="wiki-section">
      <h2>1. Hệ Thống ClearLag</h2>
      <p>Tự động dọn dẹp vật phẩm rơi rớt dưới đất, xóa quái vật dư thừa và unload các chunk không có người chơi. Thay thế hoàn toàn ClearLag cũ.</p>
      <ul>
        <li><code>/clearlag now</code> - Ép buộc xóa rác ngay lập tức.</li>
        <li><code>/clearlag stats</code> - Xem bảng thống kê số lượng Entity đang có mặt ở các World.</li>
      </ul>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>clearlag.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>clearlag:
  auto-interval: 300 # 5 phút dọn 1 lần
  warnings: [60, 30, 10, 5, 3, 2, 1]
  item-whitelist:
    - DIAMOND
    - NETHER_STAR
    - SHULKER_BOX
  mob-filter:
    remove-nametagged: false # Không xóa quái có đặt tên
    remove-tamed: false      # Không xóa thú cưng</code></pre>
      </div>
    </section>

    <section id="autorestart" class="wiki-section">
      <h2>2. Auto-Restart Khởi Động Lại</h2>
      <p>Tính năng khởi động lại máy chủ theo lịch trình. Tự động kick người chơi ra Lobby (Nếu dùng BungeeCord) thay vì ngắt kết nối họ hoàn toàn.</p>
      <p>Cấu hình lịch trình trong <code>restart.yml</code>. Bạn có thể dùng định dạng thời gian 24h (VD: <code>00:00</code>, <code>12:00</code>).</p>
    </section>
    
    <section id="chat" class="wiki-section">
      <h2>3. Quản Lý Kênh Chat</h2>
      <p>Bao gồm Anti-Spam, Anti-Swear (Lọc từ bậy), và hệ thống kênh chat cho Staff (<code>/sc &lt;tin nhắn&gt;</code>).</p>
    </section>
  `,

  sushimarket: `
    <h1 class="grad-pink">SushiMarket Wiki</h1>
    <p>Tài liệu <strong>SushiMarket</strong>. Hệ thống Chợ Đen (Auction House) mạnh mẽ với giao diện GUI thân thiện, hỗ trợ tìm kiếm và phân loại vật phẩm.</p>
    
    <section id="commands" class="wiki-section">
      <h2>1. Lệnh Cơ Bản</h2>
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Lệnh</th>
              <th>Mô tả chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/ah</code></td>
              <td>Mở giao diện Chợ Đen.</td>
            </tr>
            <tr>
              <td><code>/ah sell &lt;giá&gt;</code></td>
              <td>Bán vật phẩm đang cầm trên tay với giá chỉ định.</td>
            </tr>
            <tr>
              <td><code>/ah expired</code></td>
              <td>Mở rương chứa vật phẩm đã hết hạn hoặc bị hủy bán.</td>
            </tr>
            <tr>
              <td><code>/ah search &lt;tên&gt;</code></td>
              <td>Tìm kiếm vật phẩm trên chợ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="limits" class="wiki-section">
      <h2>2. Giới Hạn Bán (Limits & Tax)</h2>
      <p>SushiMarket cho phép thu thuế trên mỗi giao dịch để chống lạm phát tiền tệ. Ngoài ra, bạn có thể cấp quyền giới hạn số lượng slot bán cho từng Rank khác nhau.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>economy:
  tax-percentage: 5.0 # Thuế 5% khi bán thành công
  listing-fee: 10 # Phí đăng bài

limits:
  default: 3 # Mặc định bán được 3 món
  vip: 10    # Quyền sushimarket.limit.vip
  mvp: 20    # Quyền sushimarket.limit.mvp</code></pre>
      </div>
    </section>

    <section id="categories" class="wiki-section">
      <h2>3. Phân Loại Tự Động (Categories)</h2>
      <p>Khi đăng bán, SushiMarket sẽ tự động nhận diện vật phẩm và đưa vào các danh mục như: Vũ Khí, Giáp, Khối, Vật Liệu, Tiêu Hao. Chức năng này hoạt động độc lập và không cần Admin cấu hình thủ công.</p>
    </section>
  `,

  sushitags: `
    <h1 class="grad-pink">SushiTags Wiki</h1>
    <p>Tài liệu <strong>SushiTags</strong>. Quản lý danh hiệu (Prefix/Suffix) trên đầu người chơi (Nametag), trong Tablist và trong Chat.</p>
    
    <section id="format" class="wiki-section">
      <h2>1. Giao Diện Chọn Tag (GUI)</h2>
      <p>Thay vì người chơi gõ lệnh phức tạp, SushiTags cung cấp GUI <code>/tags</code>. Người chơi có thể xem toàn bộ các danh hiệu Server có, danh hiệu nào họ đã sở hữu sẽ sáng lên và có thể bấm để trang bị.</p>
      <ul>
        <li><code>/tags</code> - Mở menu chọn danh hiệu.</li>
        <li><code>/tags admin</code> - Mở menu quản lý danh hiệu.</li>
      </ul>
    </section>

    <section id="creation" class="wiki-section">
      <h2>2. Tạo Tag Mới & Format</h2>
      <p>Bạn có thể sử dụng mã màu Hex, Legacy và MiniMessage cho Tag. SushiTags hỗ trợ hoàn toàn PlaceholderAPI (<code>%sushitags_current_tag%</code>) để bạn dán vào plugin Chat (như EssentialsChat hoặc LPC).</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>tags.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>tags:
  vip:
    display: "&e[VIP]"
    permission: "sushitags.tag.vip"
    gui-item: "GOLD_BLOCK"
    description:
      - "&7Danh hiệu dành riêng cho VIP."
  
  toxic:
    display: "<gradient:#ff0000:#aa0000>[Toxic]</gradient>"
    permission: "sushitags.tag.toxic"
    gui-item: "POISONOUS_POTATO"
    description:
      - "&7Chỉ dành cho những kẻ độc hại."</code></pre>
      </div>
    </section>
    
    <section id="animations" class="wiki-section">
      <h2>3. Animated Tags (Danh hiệu động)</h2>
      <p>Bằng cách tạo một danh sách các Frame (khung hình), danh hiệu trên đầu người chơi có thể đổi màu lấp lánh (Yêu cầu Server từ 1.16+).</p>
      <p><strong>Lưu ý:</strong> Tính năng này tốn tài nguyên xử lý mạng, chỉ nên dành cho rank cao nhất.</p>
    </section>
  `
};
