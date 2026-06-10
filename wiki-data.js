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
              <td>Quyền tối cao, bỏ qua mọi cooldown/limit. Bấm để Copy.</td>
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
            <tr>
              <td><code onclick="copyText(this)">sushicore.rtp.bypass.cooldown</code></td>
              <td>RTP không bị thời gian chờ.</td>
              <td>OP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  
  sushidecor: `
    <h1 class="grad-pink">SushiDecor Wiki</h1>
    <p>Chào mừng đến với tài liệu hướng dẫn <strong>SushiDecor</strong>. Plugin trang trí đỉnh cao với Head Database nội bộ và hệ thống Particles đa dạng.</p>
    <section id="blocks" class="wiki-section">
      <h2>Khối trang trí</h2>
      <p>Hướng dẫn sắp ra mắt...</p>
    </section>
  `,

  sushilove: `
    <h1 class="grad-pink">SushiLove Wiki</h1>
    <p>Tài liệu <strong>SushiLove</strong>. Plugin kết hôn, kết đôi và chia sẻ nhà cửa.</p>
    <section id="commands" class="wiki-section">
      <h2>Lệnh và Tính năng</h2>
      <p>Hướng dẫn sắp ra mắt...</p>
    </section>
  `,

  sushimanager: `
    <h1 class="grad-pink">SushiManager Wiki</h1>
    <p>Tài liệu <strong>SushiManager</strong>. Quản lý hệ thống máy chủ, auto-restart, clear lag.</p>
    <section id="config" class="wiki-section">
      <h2>Cấu hình ClearLag</h2>
      <p>Hướng dẫn sắp ra mắt...</p>
    </section>
  `,

  sushimarket: `
    <h1 class="grad-pink">SushiMarket Wiki</h1>
    <p>Tài liệu <strong>SushiMarket</strong>. Hệ thống chợ đấu giá và bán hàng qua GUI.</p>
    <section id="auction" class="wiki-section">
      <h2>Thị trường chợ đen</h2>
      <p>Hướng dẫn sắp ra mắt...</p>
    </section>
  `,

  sushitags: `
    <h1 class="grad-pink">SushiTags Wiki</h1>
    <p>Tài liệu <strong>SushiTags</strong>. Danh hiệu tùy chỉnh trên đầu và trong tab.</p>
    <section id="format" class="wiki-section">
      <h2>Định dạng Tag</h2>
      <p>Hướng dẫn sắp ra mắt...</p>
    </section>
  `
};
