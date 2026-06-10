const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  toggle.classList.remove('open');
  links.classList.remove('open');
}));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .feat, .section h2, .section .eyebrow').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.3)';
  else nav.style.boxShadow = 'none';
});

// SPA and Sidebar logic
const pages = document.querySelectorAll('.page');
const allLinks = document.querySelectorAll('.sidebar__link, .nav a, .logo');

function switchPage(targetId) {
  if (!targetId) return;
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
  
  document.querySelectorAll('.sidebar__link').forEach(l => {
    if (l.dataset.target === targetId) l.classList.add('active');
    else l.classList.remove('active');
  });
  window.scrollTo(0, 0);
  
  if (window.innerWidth <= 950) {
    document.body.classList.add('sidebar-closed');
  }
}

allLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.dataset.target;
    if (target) {
      e.preventDefault();
      switchPage(target);
    }
  });
});

const appToggle = document.getElementById('appToggle');
const sidebarToggleInner = document.getElementById('sidebarToggleInner');

function toggleSidebar() {
  document.body.classList.toggle('sidebar-closed');
}

if (appToggle) appToggle.addEventListener('click', toggleSidebar);
if (sidebarToggleInner) sidebarToggleInner.addEventListener('click', toggleSidebar);

// Wiki Plugin Toggle
const wikiGroup = document.getElementById('wikiGroup');
if (wikiGroup) {
  const title = wikiGroup.querySelector('.sidebar__group-title');
  const container = wikiGroup.querySelector('.sidebar__sublinks-container');
  const icon = wikiGroup.querySelector('.wiki-toggle-icon');
  
  title.addEventListener('click', () => {
    container.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
  });
}

// Translation Tool
const transInput = document.getElementById('transInput');
const transOutput = document.getElementById('transOutput');
let transTimeout;

if (transInput && transOutput) {
  transInput.addEventListener('input', () => {
    clearTimeout(transTimeout);
    const text = transInput.value.trim();
    if (!text) {
      transOutput.value = '';
      return;
    }
    
    transTimeout = setTimeout(async () => {
      try {
        transOutput.value = 'Đang dịch...';
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        const translatedText = data[0].map(item => item[0]).join('');
        transOutput.value = translatedText;
      } catch (e) {
        transOutput.value = 'Lỗi dịch thuật: Không thể kết nối tới máy chủ.';
        console.error(e);
      }
    }, 500); // debounce 500ms
  });
}

// SmallCap Tool
const smallcapInput = document.getElementById('smallcapInput');
const smallcapOutput = document.getElementById('smallcapOutput');
const copySmallcap = document.getElementById('copySmallcap');

const normalChars = 'abcdefghijklmnopqrstuvwxyz';
const smallChars = 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ';

function toSmallCaps(str) {
  return str.split('').map(c => {
    const idx = normalChars.indexOf(c);
    return idx !== -1 ? smallChars[idx] : c;
  }).join('');
}

if (smallcapInput && smallcapOutput) {
  smallcapInput.addEventListener('input', () => {
    smallcapOutput.value = toSmallCaps(smallcapInput.value);
  });
}

if (copySmallcap) {
  copySmallcap.addEventListener('click', () => {
    const textToCopy = smallcapOutput.value;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copySmallcap.innerText;
        copySmallcap.innerText = 'Đã sao chép!';
        setTimeout(() => {
          copySmallcap.innerText = originalText;
        }, 2000);
      });
    }
  });
}

// Auth Modal Logic
const btnAuth = document.getElementById('btnAuth');
const authOverlay = document.getElementById('authOverlay');
const authClose = document.getElementById('authClose');
const authTabs = document.querySelectorAll('.auth-tab');
const authBodies = document.querySelectorAll('.auth-body');

if (btnAuth && authOverlay && authClose) {
  // Mở modal
  btnAuth.addEventListener('click', () => {
    authOverlay.classList.add('active');
  });

  // Đóng modal bằng nút X
  authClose.addEventListener('click', () => {
    authOverlay.classList.remove('active');
  });

  // Đóng modal khi click ra ngoài
  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) {
      authOverlay.classList.remove('active');
    }
  });
}

// Chuyển tab Đăng Nhập / Đăng Ký
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Xóa active khỏi tất cả tab và body
    authTabs.forEach(t => t.classList.remove('active'));
    authBodies.forEach(b => b.classList.remove('active'));
    
    // Thêm active cho tab và body được chọn
    tab.classList.add('active');
    const targetId = `auth-${tab.dataset.tab}`;
    document.getElementById(targetId).classList.add('active');
  });
});

// ==========================================
// MOCK AUTH & PROFILE LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginUsername = document.getElementById('loginUsername');
const registerUsername = document.getElementById('registerUsername');

const userMenuToggle = document.getElementById('userMenuToggle');
const userDropdown = document.getElementById('userDropdown');
const navUserName = document.getElementById('navUserName');
const navUserAvatar = document.getElementById('navUserAvatar');
const btnLogout = document.getElementById('btnLogout');
const goProfileBtn = document.getElementById('goProfileBtn');

// Default user data structure
const defaultUser = {
  username: '',
  id: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  desc: 'Chào mừng đến với hệ sinh thái SushiGangs. Đây là mô tả cá nhân của bạn.',
  joinDate: new Date().toLocaleDateString('vi-VN')
};

// Khởi tạo Auth State
function checkAuth() {
  const userStr = localStorage.getItem('sushi_user');
  const btnAuth = document.getElementById('btnAuth');
  if (userStr && btnAuth && userMenuToggle) {
    const user = JSON.parse(userStr);
    btnAuth.style.display = 'none';
    userMenuToggle.style.display = 'flex';
    navUserName.textContent = user.username;
    navUserAvatar.src = user.avatar;
    updateProfilePage(user);
  } else if (btnAuth && userMenuToggle) {
    btnAuth.style.display = 'block';
    userMenuToggle.style.display = 'none';
  }
}

// Sinh ID ngẫu nhiên (#ABCD)
function generateRandomId() {
  const chars = '0123456789ABCDEF';
  let id = '#';
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// Xử lý Form Đăng Nhập
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginUsername.value.trim();
    if (username) {
      let user = localStorage.getItem('sushi_user');
      if (!user) {
        user = { ...defaultUser, username: username, id: generateRandomId() };
      } else {
        user = JSON.parse(user);
        user.username = username;
      }
      localStorage.setItem('sushi_user', JSON.stringify(user));
      document.getElementById('authOverlay').classList.remove('active');
      loginForm.reset();
      checkAuth();
    }
  });
}

// Xử lý Form Đăng Ký
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerUsername.value.trim();
    if (username) {
      const user = { ...defaultUser, username: username, id: generateRandomId() };
      localStorage.setItem('sushi_user', JSON.stringify(user));
      document.getElementById('authOverlay').classList.remove('active');
      registerForm.reset();
      checkAuth();
    }
  });
}

// Nút Dropdown
if (userMenuToggle) {
  userMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (userDropdown && userDropdown.classList.contains('show') && !userMenuToggle.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });
}

// Nút Đăng Xuất
if (btnLogout) {
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('sushi_user');
    userDropdown.classList.remove('show');
    switchPage('page-home'); // Quay về trang chủ
    checkAuth();
  });
}

// Nút chuyển tới Profile
if (goProfileBtn) {
  goProfileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    userDropdown.classList.remove('show');
    switchPage('page-profile');
  });
}

// ==========================================
// EDIT PROFILE LOGIC
// ==========================================
const btnEditProfile = document.getElementById('btnEditProfile');
const editOverlay = document.getElementById('editOverlay');
const editClose = document.getElementById('editClose');
const editProfileForm = document.getElementById('editProfileForm');

const editNameInput = document.getElementById('editNameInput');
const editAvatarInput = document.getElementById('editAvatarInput');
const editBannerInput = document.getElementById('editBannerInput');
const editDescInput = document.getElementById('editDescInput');

if (btnEditProfile && editOverlay && editClose) {
  btnEditProfile.addEventListener('click', () => {
    const userStr = localStorage.getItem('sushi_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      editNameInput.value = user.username;
      editAvatarInput.value = user.avatar;
      editBannerInput.value = user.banner;
      editDescInput.value = user.desc;
    }
    editOverlay.classList.add('active');
  });

  editClose.addEventListener('click', () => editOverlay.classList.remove('active'));
  editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) editOverlay.classList.remove('active');
  });
}

if (editProfileForm) {
  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('sushi_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.username = editNameInput.value.trim() || user.username;
      user.avatar = editAvatarInput.value.trim() || user.avatar;
      user.banner = editBannerInput.value.trim() || user.banner;
      user.desc = editDescInput.value.trim() || user.desc;
      
      localStorage.setItem('sushi_user', JSON.stringify(user));
      updateProfilePage(user);
      
      // Update nav info
      if(navUserName) navUserName.textContent = user.username;
      if(navUserAvatar) navUserAvatar.src = user.avatar;
      
      editOverlay.classList.remove('active');
    }
  });
}

// Cập nhật giao diện Profile
function updateProfilePage(user) {
  const profileName = document.getElementById('profileName');
  const profileId = document.getElementById('profileId');
  const profileDesc = document.getElementById('profileDesc');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileBannerImg = document.getElementById('profileBannerImg');
  const statJoinDate = document.getElementById('statJoinDate');

  if (profileName) profileName.textContent = user.username;
  if (profileId) profileId.textContent = user.id;
  if (profileDesc) profileDesc.textContent = user.desc;
  if (profileAvatarImg) profileAvatarImg.src = user.avatar;
  if (profileBannerImg) profileBannerImg.src = user.banner;
  if (statJoinDate) statJoinDate.textContent = user.joinDate;
}

// Initial check
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
checkAuth();

// ==========================================
// SERVER INFO (MOTD VIEWER)
// ==========================================
const siIpInput = document.getElementById('siIpInput');
const siSubmitBtn = document.getElementById('siSubmitBtn');
const siLoading = document.getElementById('siLoading');
const siError = document.getElementById('siError');
const siResultContainer = document.getElementById('siResultContainer');

if (siSubmitBtn) {
  siSubmitBtn.addEventListener('click', async () => {
    const ip = siIpInput.value.trim();
    if (!ip) return;

    siLoading.style.display = 'block';
    siError.style.display = 'none';
    siResultContainer.style.display = 'none';

    try {
      // Lấy thông tin Minecraft từ API mcsrvstat
      const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`);
      const data = await res.json();

      if (!data.online) {
        throw new Error('Server đang Offline hoặc IP không tồn tại!');
      }

      // Điền các thông số cơ bản
      document.getElementById('siHeaderIp').textContent = data.hostname || data.ip;
      document.getElementById('siConnect').textContent = `${data.ip}:${data.port}`;
      document.getElementById('siPing').textContent = (data.debug && typeof data.debug.ping === 'number') ? `${data.debug.ping}ms` : 'Không xác định';
      
      const onlinePlayers = data.players?.online || 0;
      const maxPlayers = data.players?.max || 0;
      const percent = maxPlayers > 0 ? Math.round((onlinePlayers / maxPlayers) * 100) : 0;
      document.getElementById('siPlayers').textContent = `${onlinePlayers}/${maxPlayers} (${percent}%)`;
      
      document.getElementById('siVersion').textContent = data.version || 'Unknown';
      document.getElementById('siSoftware').textContent = data.software || 'Unknown';

      // Khối hiển thị MOTD
      document.getElementById('siIcon').src = 'https://api.mcsrvstat.us/icon/' + encodeURIComponent(ip);
      document.getElementById('siMotdName').textContent = data.hostname || data.ip;
      
      // Vẽ biểu tượng sóng Ping (SVG)
      let pingBars = 5;
      if (data.debug && typeof data.debug.ping === 'number') {
        if (data.debug.ping > 150) pingBars = 3;
        if (data.debug.ping > 300) pingBars = 1;
      }
      
      let pingSvg = '<svg width="18" height="18" viewBox="0 0 16 16" fill="#00aa00" style="margin-left: 5px;">';
      pingSvg += `<rect x="2" y="12" width="2" height="4" />`;
      if(pingBars >= 2) pingSvg += `<rect x="5" y="10" width="2" height="6" />`;
      if(pingBars >= 3) pingSvg += `<rect x="8" y="7" width="2" height="9" />`;
      if(pingBars >= 4) pingSvg += `<rect x="11" y="4" width="2" height="12" />`;
      if(pingBars >= 5) pingSvg += `<rect x="14" y="0" width="2" height="16" />`;
      pingSvg += '</svg>';

      document.getElementById('siMotdPlayers').innerHTML = `${onlinePlayers}/${maxPlayers} ${pingSvg}`;
      
      // Render MOTD HTML từ API (API đã trả sẵn dạng HTML color tag)
      if (data.motd && data.motd.html) {
        document.getElementById('siMotdDesc').innerHTML = data.motd.html.join('<br>');
      } else {
        document.getElementById('siMotdDesc').textContent = 'A Minecraft Server';
      }

      // Fetch lấy thông tin Vị trí và Mạng (Sử dụng ip-api.com)
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${encodeURIComponent(data.ip)}`);
        const geoData = await geoRes.json();
        
        if (geoData.status === 'success') {
          document.getElementById('siLocation').innerHTML = `🚩 ${geoData.country} — ${geoData.city}, ${geoData.regionName}`;
          document.getElementById('siIsp').textContent = geoData.isp || geoData.org || 'Không rõ';
        } else {
          document.getElementById('siLocation').textContent = 'Chưa xác định';
          document.getElementById('siIsp').textContent = 'Chưa xác định';
        }
      } catch (err) {
        document.getElementById('siLocation').textContent = 'Lỗi tra cứu vị trí';
        document.getElementById('siIsp').textContent = 'Lỗi tra cứu mạng';
      }

      siLoading.style.display = 'none';
      siResultContainer.style.display = 'block';
    } catch (error) {
      siLoading.style.display = 'none';
      siError.textContent = error.message || 'Có lỗi xảy ra khi lấy dữ liệu server. Vui lòng thử lại sau.';
      siError.style.display = 'block';
    }
  });

  // Enter to submit
  siIpInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      siSubmitBtn.click();
    }
  });
}

// ==========================================
// COLOR GENERATOR (RGB GRADIENT)
// ==========================================
const cgTextInput = document.getElementById('cgTextInput');
const cgFormatSelect = document.getElementById('cgFormatSelect');
const cgOutputBox = document.getElementById('cgOutputBox');
const cgPreviewBox = document.getElementById('cgPreviewBox');
const cgColorStops = document.getElementById('cgColorStops');
const cgAddColorBtn = document.getElementById('cgAddColorBtn');
const cgCopyBtn = document.getElementById('cgCopyBtn');

// Toggles
const formatToggles = {
  bold: document.getElementById('cgBold'),
  italic: document.getElementById('cgItalic'),
  underline: document.getElementById('cgUnderline'),
  strikethrough: document.getElementById('cgStrikethrough'),
};

let colors = ['#FF0000', '#0000FF'];

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function interpolateColor(color1, color2, factor) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
  return rgbToHex(r, g, b);
}

function renderColorStops() {
  if (!cgColorStops) return;
  cgColorStops.innerHTML = '';
  colors.forEach((col, index) => {
    const div = document.createElement('div');
    div.className = 'cg-color-item';
    div.innerHTML = `
      <input type="color" class="cg-color-picker" value="${col}" data-index="${index}">
      <input type="text" class="cg-input cg-color-hex" value="${col}" data-index="${index}" style="padding: 8px;">
      ${colors.length > 2 ? `<button class="cg-color-remove" data-index="${index}">&times;</button>` : ''}
    `;
    cgColorStops.appendChild(div);
  });

  // Events
  document.querySelectorAll('.cg-color-picker').forEach(picker => {
    picker.addEventListener('input', (e) => {
      colors[e.target.dataset.index] = e.target.value.toUpperCase();
      renderColorStops();
      generateGradient();
    });
  });

  document.querySelectorAll('.cg-color-hex').forEach(input => {
    input.addEventListener('change', (e) => {
      let val = e.target.value;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        colors[e.target.dataset.index] = val.toUpperCase();
      }
      renderColorStops();
      generateGradient();
    });
  });

  document.querySelectorAll('.cg-color-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      colors.splice(e.target.dataset.index, 1);
      renderColorStops();
      generateGradient();
    });
  });
}

function generateGradient() {
  if (!cgTextInput) return;
  const text = cgTextInput.value;
  const format = cgFormatSelect.value;
  
  if (text.length === 0) {
    cgOutputBox.value = '';
    cgPreviewBox.innerHTML = '';
    return;
  }

  // Lấy các prefix tùy chỉnh định dạng
  let prefixMini = '';
  let prefixLegacy = '';
  let prefixHex = '';
  let htmlStyles = '';

  if (formatToggles.bold.checked) {
    prefixMini += '<bold>'; prefixLegacy += '&l'; prefixHex += '<bold>';
    htmlStyles += 'font-weight: bold; ';
  }
  if (formatToggles.italic.checked) {
    prefixMini += '<italic>'; prefixLegacy += '&o'; prefixHex += '<italic>';
    htmlStyles += 'font-style: italic; ';
  }
  if (formatToggles.underline.checked) {
    prefixMini += '<underlined>'; prefixLegacy += '&n'; prefixHex += '<underlined>';
    htmlStyles += 'text-decoration: underline; ';
  }
  if (formatToggles.strikethrough.checked) {
    prefixMini += '<strikethrough>'; prefixLegacy += '&m'; prefixHex += '<strikethrough>';
    htmlStyles += 'text-decoration: line-through; ';
  }

  let resultString = '';
  let previewHtml = `<span style="${htmlStyles}">`;
  
  const chars = text.split('');
  const numColors = colors.length;
  
  // Chỉ có 1 chữ cái
  if (chars.length === 1) {
    const c = colors[0];
    if (format === 'minimessage') resultString = `${prefixMini}<${c}>${chars[0]}`;
    else if (format === 'legacy') resultString = `${prefixLegacy}&${c}${chars[0]}`;
    else resultString = `${prefixHex}<color:${c}>${chars[0]}`;
    previewHtml += `<span style="color:${c}">${chars[0]}</span>`;
  } else {
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      // Nếu là khoảng trắng có thể bỏ qua chuyển màu để rút gọn code
      if (char === ' ') {
        resultString += ' ';
        previewHtml += ' ';
        continue;
      }
      
      const ratio = i / (chars.length - 1);
      // Tìm 2 màu tương ứng để nội suy
      const segment = ratio * (numColors - 1);
      const index1 = Math.floor(segment);
      const index2 = Math.min(index1 + 1, numColors - 1);
      const factor = segment - index1;
      
      const blendedCol = interpolateColor(colors[index1], colors[index2], factor);
      
      if (format === 'minimessage') resultString += `<${blendedCol}>${char}`;
      else if (format === 'legacy') resultString += `&${blendedCol}${char}`;
      else resultString += `<color:${blendedCol}>${char}`;
      
      previewHtml += `<span style="color:${blendedCol}">${char.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
    }
    
    // Ghép prefix ở đầu
    if (format === 'minimessage' && prefixMini) resultString = prefixMini + resultString;
    else if (format === 'legacy' && prefixLegacy) resultString = prefixLegacy + resultString;
    else if (format === 'hex' && prefixHex) resultString = prefixHex + resultString;
  }
  
  previewHtml += '</span>';

  cgOutputBox.value = resultString;
  cgPreviewBox.innerHTML = previewHtml;
}

if (cgTextInput) {
  // Listeners
  cgTextInput.addEventListener('input', generateGradient);
  cgFormatSelect.addEventListener('change', generateGradient);
  Object.values(formatToggles).forEach(cb => cb.addEventListener('change', generateGradient));
  
  if (cgAddColorBtn) {
    cgAddColorBtn.addEventListener('click', () => {
      colors.push('#FFFFFF');
      renderColorStops();
      generateGradient();
    });
  }

  if (cgCopyBtn) {
    cgCopyBtn.addEventListener('click', () => {
      cgOutputBox.select();
      document.execCommand('copy');
      const oldText = cgCopyBtn.innerHTML;
      cgCopyBtn.innerHTML = '✅ Copied!';
      setTimeout(() => cgCopyBtn.innerHTML = oldText, 2000);
    });
  }

  // Init
  renderColorStops();
  generateGradient();
}
