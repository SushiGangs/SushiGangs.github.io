const wikiData = {
  sushicore: `
    <h1 class="grad-pink">SushiCore Wiki</h1>
    <p>Chào mừng đến với tài liệu hướng dẫn cấu hình và sử dụng <strong>SushiCore</strong>. Đây là "Hạt nhân" (Core Plugin) cực kỳ mạnh mẽ, cung cấp bộ API nội bộ và thay thế hoàn toàn cho các plugin như EssentialsX, CMI với độ tối ưu vượt trội dành riêng cho máy chủ Survival Việt Nam.</p>
    
    <section id="overview" class="wiki-section">
      <h2>1. Tổng Quan Hệ Sinh Thái</h2>
      <p>SushiCore tích hợp hơn 15 module tiện ích khác nhau. Mỗi module đều được lập trình dạng bật/tắt (Toggleable), nghĩa là nếu bạn tắt một module trong <code>config.yml</code>, toàn bộ RAM/CPU dành cho tính năng đó sẽ được giải phóng hoàn toàn.</p>
      <ul>
        <li><strong>Teleportation:</strong> TPA, Home, RTP (Smart RTP tránh Lava/Nước), Spawn, Back.</li>
        <li><strong>Tiện ích người chơi:</strong> Remote Craft/Anvil, Trash GUI, AFK, Stats, Death Penalty (Phạt chết).</li>
        <li><strong>Giao tiếp:</strong> Hệ thống Chat button (<code>[item]</code>, <code>[ping:player]</code>, <code>[pos]</code>), Mail offline, Msg spy.</li>
        <li><strong>Tích hợp:</strong> Hỗ trợ hoàn toàn <code>Vault</code> (trừ tiền khi tp/rtp), <code>PlaceholderAPI</code>, và <code>WorldGuard</code>.</li>
      </ul>
    </section>

    <section id="teleport" class="wiki-section">
      <h2>2. Teleport & Smart RTP (Dịch chuyển thông minh)</h2>
      
      <h3>Warmup & Combat Tag (Chống lạm dụng)</h3>
      <p>Tất cả các lệnh Teleport đều tuân thủ luật <strong>Warmup</strong> (Thời gian chờ mặc định: 3 giây). Nếu người chơi di chuyển hoặc bị nhận sát thương trong lúc chờ, lệnh Teleport sẽ lập tức bị hủy.</p>
      <p>Hệ thống <strong>Combat Tag</strong>: Khi người chơi đánh nhau, họ sẽ bị khóa Combat trong 15 giây. Mọi lệnh dịch chuyển (<code>/tpa</code>, <code>/home</code>, <code>/rtp</code>, <code>/spawn</code>,...) đều bị vô hiệu hóa để ngăn chặn tình trạng thoát PVP hèn nhát.</p>
      
      <h3>Hệ Thống Smart RTP (Quét tọa độ)</h3>
      <p>Không còn cảnh người chơi RTP rớt vào biển nham thạch hay giữa đại dương. SushiCore cung cấp hệ thống <strong>RTP Thông Minh</strong> với thuật toán quét 3D Block cực nhanh.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>rtp.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>rtp:
  # Chặn RTP vào các quần xã sinh vật nước/băng
  blocked-biomes: [OCEAN, DEEP_OCEAN, FROZEN_OCEAN, RIVER]
  # Các block nguy hiểm tuyệt đối không đáp xuống
  blocked-blocks: [LAVA, WATER, CACTUS, FIRE, MAGMA_BLOCK, POWDER_SNOW]
  # Phí dịch chuyển (Vault)
  cost: 500
  
  destinations:
    survival_world:
      world: "world"
      min-x: -5000
      max-x: 5000
      min-z: -5000
      max-z: 5000</code></pre>
      </div>
      
      <h3>RTP Trigger Zones (Cổng Không Gian)</h3>
      <p>Thay vì bắt người chơi gõ lệnh, Admin có thể tạo ra các <strong>vùng Trigger</strong> (Khu vực vô hình). Khi người chơi bước chân vào tọa độ này (Ví dụ: Cổng ở Spawn), họ sẽ tự động kích hoạt quá trình RTP.</p>
    </section>

    <section id="features" class="wiki-section">
      <h2>3. Hệ Thống Tiện Ích Đột Phá</h2>
      
      <h3>Nút bấm trong Chat (Interactive Chat)</h3>
      <p>Tạm biệt những đoạn chat nhàm chán, người chơi có thể gửi các "Nút bấm" trực tiếp lên kênh chat tổng:</p>
      <ul>
        <li><code>[item]</code>: Hiển thị tên món đồ đang cầm trên tay (Có thể di chuột vào chữ để xem thuộc tính của đồ).</li>
        <li><code>[pos]</code>: Gửi tọa độ hiện tại. Mọi người có thể click vào để xin TPA đến.</li>
      </ul>
      
      <h3>Tiện Ích Từ Xa & Thùng Rác (Remote Utilities)</h3>
      <p>Bao gồm các lệnh <code>/craft</code>, <code>/anvil</code>, <code>/echest</code>, <code>/fix</code>. Admin có thể đặt mức phí Vault hoặc tốn EXP cho mỗi thao tác. Lệnh <code>/trash</code> mở một cái hố đen (GUI rỗng) để tiêu hủy đồ đạc rác rưởi.</p>
      
      <h3>Death Penalty (Phạt Sinh Tồn)</h3>
      <p>Thêm chút "Hardcore" cho Server: Khi chết, người chơi sẽ bị mất ngẫu nhiên một vài vật phẩm trong túi đồ, hoặc rớt X% tiền Vault. Admin có thể bảo vệ các đồ VIP bằng cách thêm Lore vào danh sách <code>blacklist-lore</code> (Ví dụ: "Không thể rơi", "Đồ linh hồn").</p>
    </section>

    <section id="api" class="wiki-section">
      <h2>4. API Dành Cho Developer</h2>
      <p>SushiCore cung cấp thư viện API mở để các dev khác dễ dàng gọi các tính năng lõi mà không cần code lại từ đầu.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>Java Code (API Ví dụ)</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>// Lấy dữ liệu người chơi từ SushiCore
SushiPlayer sPlayer = SushiCore.getAPI().getPlayerManager().get(player.getUniqueId());

// Kiểm tra xem người chơi có đang trong trạng thái Combat không
if (sPlayer.isInCombat()) {
    player.sendMessage("Bạn đang trong trạng thái PVP!");
    return;
}

// Bắt đầu quá trình RTP an toàn
SushiCore.getAPI().getTeleportManager().randomTeleport(player, "survival_world");</code></pre>
      </div>
    </section>

    <section id="permissions" class="wiki-section">
      <h2>5. Lệnh & Quyền Hạn (Permissions)</h2>
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
              <td>Quyền tối cao, bỏ qua mọi thời gian chờ (warmup), cooldown, và giới hạn.</td>
              <td>OP</td>
            </tr>
            <tr>
              <td><code onclick="copyText(this)">sushicore.tpa.use</code></td>
              <td>Cho phép sử dụng <code>/tpa</code> và <code>/tpaccept</code>.</td>
              <td>Mọi người</td>
            </tr>
            <tr>
              <td><code onclick="copyText(this)">sushicore.home.limit.&lt;số&gt;</code></td>
              <td>Quy định số lượng điểm Home tối đa (VD: <code>sushicore.home.limit.5</code>).</td>
              <td>False</td>
            </tr>
            <tr>
              <td><code onclick="copyText(this)">sushicore.remote.craft</code></td>
              <td>Mở khóa lệnh <code>/craft</code> để mở bàn chế tạo mọi lúc mọi nơi.</td>
              <td>VIP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  
  sushidecor: `
    <h1 class="grad-pink">SushiDecor Wiki</h1>
    <p>Chào mừng đến với tài liệu hướng dẫn <strong>SushiDecor</strong>. Đây là "Bộ mặt" của Server bạn. SushiDecor quản lý toàn bộ các yếu tố hình ảnh và giao diện (UI) hiển thị cho người chơi, bao gồm: Scoreboard, Tablist, Hologram, BossBar và hệ thống Hiệu ứng Thẩm mỹ (Cosmetics) đồ sộ.</p>
    
    <section id="ui-modules" class="wiki-section">
      <h2>1. Hệ Thống Giao Diện (UI Modules)</h2>
      <p>Tất cả các hệ thống giao diện của SushiDecor đều hỗ trợ 100% <strong>mã màu Hex</strong>, <strong>MiniMessage (Gradient)</strong> và <strong>PlaceholderAPI</strong>. Đặc biệt, công nghệ Anti-Flicker giúp giao diện cập nhật liên tục mà không bao giờ bị chớp nháy đứt quãng.</p>
      
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Tính Năng Nổi Bật</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Scoreboard</strong></td>
              <td>Hiển thị bảng thông tin bên phải màn hình (Tối đa 15 dòng). Hỗ trợ Animation đổi chữ, chạy chữ (Scrolling text). Tốc độ làm mới (Refresh) có thể chỉnh xuống mức 1 Tick/lần.</td>
            </tr>
            <tr>
              <td><strong>Tablist</strong></td>
              <td>Tùy chỉnh Header (Đỉnh bảng) và Footer (Đáy bảng). Tự động sắp xếp người chơi theo Rank (Ví dụ: Admin đứng đầu, sau đó đến VIP, Member).</td>
            </tr>
            <tr>
              <td><strong>BossBar</strong></td>
              <td>Hiển thị thanh máu Boss khổng lồ ở góc trên màn hình. Rất hữu ích để làm thông báo Event, quảng cáo Server, hoặc hiển thị tiến độ (Progress Bar) của một sự kiện.</td>
            </tr>
            <tr>
              <td><strong>Hologram</strong></td>
              <td>Chữ nổi 3D (Holographic Displays). Hỗ trợ nhúng Item lơ lửng. Đặc biệt: <strong>Hologram có thể Click</strong> để chạy lệnh (Ví dụ: Bấm vào Hologram để mở Menu nhận quà).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="cosmetics" class="wiki-section">
      <h2>2. Hệ Thống Hiệu Ứng Thẩm Mỹ (Cosmetics)</h2>
      <p>Tính năng sinh ra để kích cầu Donate! Cung cấp cho VIP hàng tá hiệu ứng hình ảnh tuyệt đẹp khi họ di chuyển hoặc đứng yên.</p>
      
      <ul>
        <li><strong>Particles (Hạt bao quanh):</strong> Tạo hiệu ứng vầng hào quang (Halo), cánh thiên thần (Wings), hay vòng phép thuật (Magic Circle) bao quanh cơ thể.</li>
        <li><strong>Trails (Vệt sáng):</strong> Hạt kéo dài phía sau lưng giống như đuôi sao chổi khi người chơi chạy hoặc bay bằng Elytra.</li>
        <li><strong>Footstep (Dấu chân):</strong> Mỗi bước đi của người chơi sẽ để lại dấu ấn (Ví dụ: Dấu chân lửa, hoa nở dưới chân, nốt nhạc vang lên).</li>
      </ul>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>cosmetics.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>footsteps:
  fire_walker:
    name: "&cBước Chân Lửa"
    permission: "sushidecor.footstep.fire"
    # Loại hạt khi bước đi
    particle: FLAME
    # Âm thanh phát ra
    sound: BLOCK_FIRE_AMBIENT
    # Số hạt sinh ra mỗi bước
    amount: 10
    
trails:
  rainbow_dash:
    name: "&dCầu Vồng"
    permission: "sushidecor.trail.rainbow"
    particle: DUST_COLOR_TRANSITION
    colors: ["#FF0000", "#00FF00", "#0000FF"]</code></pre>
      </div>
      <p><strong>Lệnh mở Menu Mỹ Phẩm:</strong> <code>/cosmetics</code> (hoặc <code>/trails</code>, <code>/decor</code>). Có giao diện GUI tuyệt đẹp để người chơi xem trước (Preview) hiệu ứng trước khi dùng.</p>
    </section>

    <section id="config" class="wiki-section">
      <h2>3. Cấu Hình Bảng Xếp Hạng (Scoreboard)</h2>
      <p>Dưới đây là một ví dụ về cách thiết lập Bảng thông tin (Scoreboard) cực kỳ mượt mà với hoạt ảnh (Animation) chuyển màu tên Server.</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>scoreboard.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>scoreboard:
  enabled: true
  update-interval: 20 # 1 giây cập nhật 1 lần
  
  title:
    # Hoạt ảnh đổi màu liên tục cho tiêu đề
    frames:
      - "&d&lSUSHIGANGS"
      - "&f&lSUSHIGANGS"
    interval: 10 # Nửa giây đổi 1 lần
    
  lines:
    - "&7---------------------"
    - " &f👤 Cá nhân:"
    - "  &7▪ &fTên: &b%player_name%"
    - "  &7▪ &fTiền: &e%vault_eco_balance_formatted% ⛃"
    - "  &7▪ &fPing: &a%player_ping%ms"
    - ""
    - " &f🌍 Máy chủ:"
    - "  &7▪ &fOnline: &a%server_online%"
    - "  &7▪ &fTPS: &a%server_tps_1_colored%"
    - "&7---------------------"
    - "&d  play.sushigangs.vn"</code></pre>
      </div>
    </section>
  `,

  sushilove: `
    <h1 class="grad-pink">SushiLove Wiki</h1>
    <p>Tài liệu <strong>SushiLove</strong>. Plugin kết hôn, kết đôi và tương tác xã hội số 1 dành cho Server Towny/Survival. Không chỉ dừng lại ở một danh hiệu hình thức, SushiLove mang đến hệ thống thăng cấp tình cảm (Love Level) và những chỉ số Buff sức mạnh (MythicLib) cực kỳ thực tế cho các cặp đôi.</p>
    
    <section id="marry" class="wiki-section">
      <h2>1. Hệ Thống Hẹn Hò & Kết Hôn</h2>
      <p>Người chơi có thể tương tác, tán tỉnh và cuối cùng là tiến tới hôn nhân. Khi một đám cưới diễn ra, hệ thống sẽ phát thông báo toàn máy chủ kèm theo màn trình diễn pháo hoa hoành tráng.</p>
      <div class="wiki-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Lệnh (Command)</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/marry &lt;player&gt;</code></td>
              <td>Gửi nhẫn cầu hôn. Yêu cầu tốn một khoản phí (Tiền In-game).</td>
            </tr>
            <tr>
              <td><code>/marry accept/deny</code></td>
              <td>Đồng ý hoặc từ chối lời cầu hôn.</td>
            </tr>
            <tr>
              <td><code>/divorce</code></td>
              <td>Ly dị. Tốn một khoản phí cực lớn và reset Love Level về 0.</td>
            </tr>
            <tr>
              <td><code>/kiss &lt;player&gt;</code></td>
              <td>Hôn đối phương. Gửi thông báo dễ thương và văng Particle trái tim.</td>
            </tr>
            <tr>
              <td><code>/hug &lt;player&gt;</code></td>
              <td>Ôm đối phương. Cả hai sẽ nhận được hiệu ứng hồi máu nhẹ (Regen).</td>
            </tr>
            <tr>
              <td><code>/lovechat &lt;tin nhắn&gt;</code></td>
              <td>Chat riêng tư cho 2 vợ chồng (Viết tắt: <code>/lc</code>).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="love-level" class="wiki-section">
      <h2>2. Cấp Độ Tình Cảm (Love Level) & Đặc Quyền</h2>
      <p>Cặp đôi có thể cày "Điểm Tình Cảm" (Love EXP) bằng cách: Đứng gần nhau, online cùng lúc, tặng quà (Shift + Chuột phải) hoặc farm quái cùng nhau. Lên cấp càng cao, đặc quyền càng khủng!</p>
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Cấp độ (Level)</th>
              <th>Đặc Quyền (Perks Mở Khóa)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Level 1 (Mới cưới)</td>
              <td>Mở khóa lệnh <code>/lovechat</code> và được hiển thị danh hiệu cặp đôi trên đầu.</td>
            </tr>
            <tr>
              <td>Level 5 (Hẹn hò)</td>
              <td>Mở khóa <code>/kiss</code> và <code>/hug</code>. Cả hai có thể /tp tới nhau không cần chờ.</td>
            </tr>
            <tr>
              <td>Level 10 (Chung nhà)</td>
              <td>Mở khóa <code>/lovehome</code> - Set một điểm dịch chuyển (Home) xài chung cho 2 người.</td>
            </tr>
            <tr>
              <td>Level 20 (Tri kỷ)</td>
              <td><strong>EXP Share:</strong> Khi farm quái cách nhau dưới 15 block, cả 2 nhận thêm +20% Kinh nghiệm.</td>
            </tr>
            <tr>
              <td>Level 30 (Vĩnh cửu)</td>
              <td><strong>Bảo vệ:</strong> Cặp đôi không thể đánh nhau (PVP Disabled). Nhận Buff Sinh Mệnh (+2 Tim) từ MythicLib.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="mythiclib" class="wiki-section">
      <h2>3. Tích Hợp Sức Mạnh MythicLib</h2>
      <p>Điều làm nên sự khác biệt của SushiLove là sự kết hợp sâu với <strong>MythicLib / MMOItems</strong>. Bạn có thể cấu hình để các cặp đôi (ở một mốc Level nhất định) nhận được chỉ số sức mạnh thụ động khi online cùng nhau.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>buffs.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>mythiclib-buffs:
  enabled: true
  # Bán kính tối đa để nhận Buff (Block)
  radius-require: 30 
  
  levels:
    10:
      MAX_HEALTH: 10.0      # +5 Tim
      MOVEMENT_SPEED: 0.05  # Chạy nhanh hơn chút
    20:
      MAX_HEALTH: 20.0      # +10 Tim
      MOVEMENT_SPEED: 0.1
      ARMOR_TOUGHNESS: 5.0
    30:
      MAX_HEALTH: 20.0
      MOVEMENT_SPEED: 0.15
      CRITICAL_STRIKE_CHANCE: 10.0 # +10% Tỉ lệ chí mạng khi chiến đấu cùng vợ/chồng</code></pre>
      </div>
    </section>

    <section id="config" class="wiki-section">
      <h2>4. Cấu Hình Cơ Bản (config.yml)</h2>
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>marriage:
  # Phí để cưới nhau (Sử dụng Vault)
  cost: 100000
  # Phí ly dị (Nên để thật cao để tránh ly dị bừa bãi)
  divorce-cost: 500000
  # Cho phép kết hôn đồng giới
  allow-same-gender: true

love-level:
  max-level: 50
  # Số EXP tối đa nhận được mỗi ngày (Chống treo máy farm EXP)
  daily-exp-cap: 5000
  
messages:
  broadcast-marry: "&d[SushiLove] &f{player1} &avà &f{player2} &ađã chính thức trở thành vợ chồng! Xin chúc mừng!"
  divorce-announce: "&c[SushiLove] Một cuộc tình vừa tan vỡ... {player1} và {player2} đã đường ai nấy đi."</code></pre>
      </div>
    </section>
  `,

  sushimanager: `
    <h1 class="grad-pink">SushiManager Wiki</h1>
    <p>Tài liệu <strong>SushiManager</strong>. Đây là một bộ công cụ "All-in-one" dành riêng cho Quản trị viên (Admin/Staff), giúp bạn tối ưu hóa Server, dọn rác, quản lý kênh chat và trừng phạt người chơi vi phạm. Nó có thể thay thế hoàn toàn ClearLag, AutoRestart, ChatManager, và LiteBans/Essentials (Ban/Mute/Jail).</p>
    
    <section id="punishments" class="wiki-section">
      <h2>1. Hệ Thống Trừng Phạt (Punishments)</h2>
      <p>Hỗ trợ đầy đủ các lệnh cấm tạm thời hoặc vĩnh viễn với giao diện thông báo đẹp mắt (Hỗ trợ MiniMessage).</p>
      <div class="wiki-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Lệnh (Command)</th>
              <th>Quyền (Permission)</th>
              <th>Mô tả chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/ban &lt;player&gt; [lý do]</code></td>
              <td><code>sushimanager.ban</code></td>
              <td>Cấm vĩnh viễn một người chơi khỏi máy chủ.</td>
            </tr>
            <tr>
              <td><code>/tempban &lt;player&gt; &lt;time&gt; [lý do]</code></td>
              <td><code>sushimanager.tempban</code></td>
              <td>Cấm có thời hạn (VD: <code>1d</code>, <code>12h</code>, <code>30m</code>).</td>
            </tr>
            <tr>
              <td><code>/mute &lt;player&gt; &lt;time&gt; [lý do]</code></td>
              <td><code>sushimanager.mute</code></td>
              <td>Cấm chat tạm thời. Nếu chat sẽ bị cảnh báo.</td>
            </tr>
            <tr>
              <td><code>/kick &lt;player&gt; [lý do]</code></td>
              <td><code>sushimanager.kick</code></td>
              <td>Đuổi người chơi khỏi máy chủ ngay lập tức.</td>
            </tr>
            <tr>
              <td><code>/jail &lt;player&gt; &lt;time&gt;</code></td>
              <td><code>sushimanager.jail</code></td>
              <td>Giam người chơi vào nhà tù (Không thể dùng lệnh, phá block).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="clearlag" class="wiki-section">
      <h2>2. Hệ Thống Giảm Lag (ClearLag)</h2>
      <p>SushiManager tích hợp một module dọn rác thông minh, tự động phân tích và xóa các vật phẩm rơi rớt hoặc Entity gây lag mà không ảnh hưởng đến trải nghiệm người chơi.</p>
      <ul>
        <li><code>/clearlag now</code> - Ép buộc xóa rác ngay lập tức (Xóa Items, Mobs, Mỏ xe...).</li>
        <li><code>/clearlag stats</code> - Xem bảng thống kê số lượng Entity đang có mặt ở các World.</li>
      </ul>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>clearlag.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>clearlag:
  # Thời gian giữa các lần dọn rác (Giây)
  auto-interval: 300 
  # Thời điểm gửi thông báo đếm ngược trước khi xóa
  warnings: [60, 30, 10, 5, 3, 2, 1]
  # Những vật phẩm KHÔNG bao giờ bị xóa
  item-whitelist:
    - DIAMOND
    - NETHER_STAR
    - SHULKER_BOX
  mob-filter:
    remove-nametagged: false # Giữ lại quái có đặt tên (Name Tag)
    remove-tamed: false      # Giữ lại thú cưng (Chó, mèo, ngựa...)</code></pre>
      </div>
    </section>
    
    <section id="chat" class="wiki-section">
      <h2>3. Quản Lý Kênh Chat</h2>
      <p>Bảo vệ máy chủ khỏi các thế lực spammer và những người chơi văng tục.</p>
      <ul>
        <li><strong>Anti-Spam:</strong> Chặn gửi tin nhắn giống nhau liên tiếp hoặc gửi quá nhanh.</li>
        <li><strong>Anti-Swear:</strong> Lọc từ ngữ thô tục dựa trên danh sách cấu hình. Từ cấm sẽ bị che thành <code>***</code>.</li>
        <li><strong>Staff Chat:</strong> Kênh chat kín đáo dành riêng cho Ban Quản Trị: <code>/sc &lt;tin nhắn&gt;</code> (Quyền: <code>sushimanager.staffchat</code>).</li>
        <li><strong>Chat Lock:</strong> Khóa toàn bộ kênh chat của Server: <code>/chatlock</code> (Chỉ Admin/Staff mới được chat).</li>
      </ul>
    </section>

    <section id="autorestart" class="wiki-section">
      <h2>4. Auto-Restart Khởi Động Lại</h2>
      <p>Khởi động lại máy chủ một cách an toàn để làm mới bộ nhớ (RAM).</p>
      <p>Thay vì đá người chơi văng thẳng ra ngoài (Disconnect), SushiManager hỗ trợ <strong>BungeeCord / Velocity</strong>, tự động chuyển người chơi sang máy chủ Lobby trước khi Server tắt, và báo cho họ biết khi nào Server mở lại!</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>restart.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>restart:
  # Lịch khởi động lại (Theo giờ 24h)
  schedules:
    - "00:00"
    - "06:00"
    - "12:00"
    - "18:00"
  
  bungeecord:
    enabled: true
    # Đưa người chơi về server này thay vì kick
    fallback-server: "lobby"</code></pre>
      </div>
    </section>
  `,

  sushimarket: `
    <h1 class="grad-pink">SushiMarket Wiki</h1>
    <p>Tài liệu <strong>SushiMarket</strong>. Hệ thống Chợ Đen (Auction House) cao cấp được thiết kế đặc biệt cho các Server RPG/Survival. Thay thế hoàn toàn cho CrazyAuctions hay zAuctionHouse với tính năng độc quyền: <strong>Tương thích 100% MMOItems</strong>, <strong>Chống đầu cơ (Anti-flip)</strong>, và <strong>Giao diện siêu hiện đại</strong>.</p>
    
    <section id="commands" class="wiki-section">
      <h2>1. Lệnh & Quyền Cơ Bản</h2>
      <div class="wiki-table-wrapper">
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Lệnh (Command)</th>
              <th>Mô tả chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/ah</code></td>
              <td>Mở giao diện Chợ Đen chính (Trang chủ).</td>
            </tr>
            <tr>
              <td><code>/ah sell &lt;giá&gt;</code></td>
              <td>Đăng bán vật phẩm đang cầm trên tay (Ví dụ: <code>/ah sell 50000</code>).</td>
            </tr>
            <tr>
              <td><code>/ah expired</code></td>
              <td>Mở rương đồ quá hạn. Nếu vật phẩm đăng bán quá 48h không ai mua, nó sẽ tự động bị trả về đây.</td>
            </tr>
            <tr>
              <td><code>/ah search &lt;tên/loại&gt;</code></td>
              <td>Bộ máy tìm kiếm thông minh, hỗ trợ gõ một phần tên đồ.</td>
            </tr>
            <tr>
              <td><code>/ah admin</code></td>
              <td>(Dành cho Staff) Chế độ duyệt chợ, cho phép Admin gỡ bỏ vật phẩm vi phạm của người chơi khác.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="features" class="wiki-section">
      <h2>2. Tính Năng Vượt Trội (Features)</h2>
      
      <h3>Tự Động Phân Loại (Smart Categories) & MMOItems</h3>
      <p>Không như các chợ đen cũ bắt bạn phải phân loại thủ công, SushiMarket <strong>tự động đọc NBT Data</strong> của vật phẩm. Nó không chỉ nhận diện được Vũ khí (Swords), Giáp (Armors), Vật liệu (Blocks) cơ bản của Minecraft, mà còn phân tích chính xác từng <strong>Tier (Độ hiếm) của MMOItems</strong> để đưa vào đúng danh mục!</p>
      
      <h3>Chống Đầu Cơ Trục Lợi (Anti-Flip System)</h3>
      <p>Để ngăn chặn tình trạng "Thương gia" đi mua đồ rẻ của Newbie rồi bán lại với giá cắt cổ ngay lập tức, hệ thống có luật <strong>Cooldown Giao Dịch</strong>. Vật phẩm vừa mua trên chợ sẽ bị dính dòng chữ <code>&c[Đã mua bán]</code> và không thể đăng bán lại trong vòng X giờ đồng hồ.</p>
      
      <h3>Ghi Nhật Ký Lên Discord (Webhooks)</h3>
      <p>Mọi giao dịch "Khủng" (Ví dụ đồ bán giá trên 1,000,000 Xu) sẽ được bắn thông báo thẳng lên kênh Discord của Server để mọi người cùng "Trầm trồ".</p>
    </section>

    <section id="economy" class="wiki-section">
      <h2>3. Kiểm Soát Lạm Phát & Giới Hạn</h2>
      <p>SushiMarket sinh ra để bảo vệ nền kinh tế máy chủ. Bạn có thể thu phí đăng bài và đánh thuế thu nhập để làm "bốc hơi" lượng tiền ảo dư thừa.</p>
      <div class="code-wrapper">
        <div class="code-header">
          <span>config.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>economy:
  # Thu thuế 5% trên TỔNG giá trị giao dịch thành công
  # (Người mua trả 100k, người bán chỉ nhận 95k)
  tax-percentage: 5.0
  # Phí cố định để đăng bán 1 món đồ
  listing-fee: 500
  # Phí này có được trả lại nếu đồ hết hạn không?
  refund-fee-on-expire: false

limits:
  # Số món đồ tối đa được bán cùng lúc trên chợ
  # Cấu hình theo Permissions (Cực kỳ tốt để kích nạp VIP)
  default: 3   # Mặc định người thường bán được 3 món
  vip: 10      # Quyền sushimarket.limit.vip
  mvp: 20      # Quyền sushimarket.limit.mvp

anti-flip:
  enabled: true
  # Cấm bán lại vật phẩm vừa mua trong vòng 12 tiếng
  cooldown-hours: 12</code></pre>
      </div>
    </section>
  `,

  sushitags: `
    <h1 class="grad-pink">SushiTags Wiki</h1>
    <p>Tài liệu <strong>SushiTags</strong>. Quản lý danh hiệu (Prefix/Suffix) trên đầu người chơi (Nametag), trong Tablist và trong Chat. Đặc biệt, plugin này tích hợp mạnh mẽ với <strong>MythicLib / MMOItems</strong> để cung cấp các chỉ số sức mạnh (Stats Buff) khi người chơi trang bị một Danh hiệu nhất định.</p>
    
    <section id="commands" class="wiki-section">
      <h2>1. Lệnh & Quyền Cơ Bản</h2>
      <div class="wiki-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Lệnh (Command)</th>
              <th>Quyền (Permission)</th>
              <th>Mô tả chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/tags</code></td>
              <td>(Mặc định)</td>
              <td>Mở Menu GUI để người chơi tự do chọn và trang bị danh hiệu họ đã mở khóa.</td>
            </tr>
            <tr>
              <td><code>/tags admin</code></td>
              <td><code>sushitags.admin</code></td>
              <td>Mở Menu quản lý dành cho Admin (Cấp tag cho người chơi khác).</td>
            </tr>
            <tr>
              <td><code>/tags give &lt;player&gt; &lt;tagID&gt;</code></td>
              <td><code>sushitags.admin</code></td>
              <td>Mở khóa vĩnh viễn một danh hiệu cho người chơi.</td>
            </tr>
            <tr>
              <td><code>/tags reload</code></td>
              <td><code>sushitags.admin</code></td>
              <td>Tải lại file cấu hình (Config & Tags).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="placeholders" class="wiki-section">
      <h2>2. PlaceholderAPI (PAPI)</h2>
      <p>SushiTags cung cấp các biến số (Placeholder) để bạn dễ dàng dán vào các plugin Chat (như EssentialsChat, LPC, TAB). Bạn phải cài đặt PlaceholderAPI trước khi sử dụng.</p>
      <ul>
        <li><code>%sushitags_current_tag%</code> : Hiển thị Tag người chơi đang trang bị (Có màu sắc đầy đủ).</li>
        <li><code>%sushitags_current_tag_uncolored%</code> : Hiển thị Tag nhưng loại bỏ hết mã màu.</li>
        <li><code>%sushitags_has_tag_&lt;tagID&gt;%</code> : Trả về <code>true</code> hoặc <code>false</code> nếu người chơi đã sở hữu tag đó.</li>
        <li><code>%sushitags_equipped_id%</code> : Trả về ID của tag đang được trang bị.</li>
      </ul>
    </section>

    <section id="creation" class="wiki-section">
      <h2>3. Hướng Dẫn Tạo Tag (tags.yml)</h2>
      <p>Bạn có thể sử dụng mã màu Hex (<code>&#FF0000</code>), Legacy (<code>&a</code>) và MiniMessage (<code>&lt;gradient:#ff0000:#aa0000&gt;</code>) cho Tag. Dưới đây là cấu trúc đầy đủ của một Danh hiệu, bao gồm cả tích hợp <strong>MythicLib Stats</strong>.</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>tags.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>tags:
  # ---------------------------------------------
  # DANH HIỆU CƠ BẢN (KHÔNG CÓ HIỆU ỨNG STATS)
  # ---------------------------------------------
  vip_tag:
    display: "&e[VIP]"
    permission: "sushitags.tag.vip"
    gui-item: "GOLD_BLOCK"
    gui-name: "&eDanh hiệu: &fVIP"
    description:
      - "&7Danh hiệu dành riêng cho cấp bậc VIP."
      - ""
      - "&e✦ Bấm để trang bị!"

  # ---------------------------------------------
  # DANH HIỆU SỨC MẠNH (CỘNG CHỈ SỐ MYTHICLIB)
  # ---------------------------------------------
  dragon_slayer:
    display: "<gradient:#ff5555:#ff0000>⚔ Sát Long Nhân ⚔</gradient>"
    permission: "sushitags.tag.dragon"
    gui-item: "DRAGON_HEAD"
    gui-name: "&cDanh hiệu: &fSát Long Nhân"
    description:
      - "&7Chỉ những chiến binh từng đồ sát"
      - "&7Ender Dragon mới sở hữu danh hiệu này."
      - ""
      - "&c&lĐẶC QUYỀN TRANG BỊ:"
      - "&7✦ Sát thương vật lý: &c+15%"
      - "&7✦ Tốc độ di chuyển: &b+0.2"
      - ""
      - "&e✦ Bấm để trang bị!"
    # Tích hợp MythicLib: Các chỉ số này sẽ áp dụng ngay khi người chơi trang bị Tag
    mythiclib-stats:
      PHYSICAL_DAMAGE: 15.0
      MOVEMENT_SPEED: 0.2
      MAX_HEALTH: 50.0</code></pre>
      </div>
    </section>
    
    <section id="animations" class="wiki-section">
      <h2>4. Animated Tags (Danh Hiệu Động)</h2>
      <p>Nếu bạn muốn danh hiệu trên đầu người chơi đổi màu lấp lánh như cầu vồng, bạn có thể thiết lập dạng Animation (Khung hình). Tính năng này hoạt động tốt nhất từ Minecraft 1.16 trở lên.</p>
      
      <div class="code-wrapper">
        <div class="code-header">
          <span>tags.yml</span>
          <button class="copy-btn" onclick="copyCode(this)">📋 Copy</button>
        </div>
        <pre><code>tags:
  rainbow_vip:
    gui-item: "NETHER_STAR"
    permission: "sushitags.tag.rainbow"
    # Kích hoạt tính năng Animation
    animated: true
    # Chuyển đổi khung hình mỗi 10 tick (Nửa giây)
    update-interval: 10
    frames:
      - "&c[VIP]"
      - "&6[VIP]"
      - "&e[VIP]"
      - "&a[VIP]"
      - "&b[VIP]"
      - "&d[VIP]"</code></pre>
      </div>
      <p><strong>Lưu ý:</strong> Việc đổi Nametag liên tục sẽ tốn một lượng nhỏ tài nguyên xử lý mạng (Packets). Hãy cân nhắc chỉ dùng cho những Rank cao cấp nhất trên Server.</p>
    </section>
  `
};
