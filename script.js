// Theme Switcher Logic
const savedTheme = localStorage.getItem('sushi_theme') || 'cyberpunk';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themePalette = document.getElementById('themePalette');
const themeBtns = document.querySelectorAll('.theme-btn');

if (themeToggleBtn && themePalette) {
  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themePalette.style.display = themePalette.style.display === 'none' ? 'flex' : 'none';
  });

  document.addEventListener('click', () => {
    themePalette.style.display = 'none';
  });

  themePalette.addEventListener('click', (e) => e.stopPropagation());

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('sushi_theme', theme);
      themePalette.style.display = 'none';
    });
    
    btn.addEventListener('mouseenter', () => btn.style.background = 'var(--border-color)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');
  });
}

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

// SPA, Hash Routing, and Auto-TOC logic
const pages = document.querySelectorAll('.page');
const allLinks = document.querySelectorAll('a[data-target]');

function switchPage(targetId) {
  if (!targetId) return;
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
  
  document.querySelectorAll('.sidebar__link, .sidebar__sublink').forEach(l => {
    l.classList.remove('active');
    if (l.dataset.target === targetId && !l.dataset.wiki) l.classList.add('active');
  });
  window.scrollTo(0, 0);
  
  if (window.innerWidth <= 950) {
    document.body.classList.add('sidebar-closed');
  }
}

function loadWiki(pluginName) {
  const contentArea = document.getElementById('wikiContentArea');
  const tocArea = document.getElementById('tocLinks');
  if (!contentArea || !tocArea) return;
  
  if (typeof wikiData !== 'undefined' && wikiData[pluginName]) {
    contentArea.innerHTML = wikiData[pluginName];
  } else {
    contentArea.innerHTML = `<h2>Đang xây dựng...</h2><p>Tài liệu cho ${pluginName} chưa được cập nhật.</p>`;
  }
  
  // Highlight active sidebar sublink
  document.querySelectorAll('.sidebar__sublink').forEach(l => {
    if(l.dataset.wiki === pluginName) l.classList.add('active');
    else l.classList.remove('active');
  });
  
  // Auto-TOC Generation
  tocArea.innerHTML = '';
  const headings = contentArea.querySelectorAll('h2, h3');
  headings.forEach((heading, index) => {
    if(!heading.id) heading.id = 'heading-' + index;
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    if (heading.tagName.toLowerCase() === 'h3') {
      a.classList.add('toc-h3');
    }
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const targetOffset = heading.offsetTop - 80;
      window.scrollTo({ top: targetOffset, behavior: 'smooth' });
    });
    tocArea.appendChild(a);
  });
  
  // Re-attach Copy events
  const copyBtns = contentArea.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.parentElement.nextElementSibling?.querySelector('code');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
          const originalText = btn.innerText;
          btn.innerText = '✅ Đã Copy';
          setTimeout(() => { btn.innerText = originalText; }, 2000);
        });
      }
    });
  });
}

function handleRouting() {
  const hash = window.location.hash;
  if (!hash || hash === '#') {
    switchPage('page-home');
    return;
  }
  
  if (hash.startsWith('#wiki/')) {
    const pluginName = hash.replace('#wiki/', '');
    switchPage('page-wiki');
    loadWiki(pluginName);
  } else {
    // Normal tools
    const target = hash.replace('#', 'page-');
    if (document.getElementById(target)) {
      switchPage(target);
    } else {
      switchPage('page-home');
    }
  }
}

// Intercept link clicks
allLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.dataset.target;
    const wiki = link.dataset.wiki;
    if (wiki) {
      e.preventDefault();
      window.location.hash = 'wiki/' + wiki;
    } else if (target) {
      e.preventDefault();
      window.location.hash = target.replace('page-', '');
    }
  });
});

window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);

// ScrollSpy for TOC
window.addEventListener('scroll', () => {
  if (document.getElementById('page-wiki')?.classList.contains('active')) {
    const headings = document.getElementById('wikiContentArea')?.querySelectorAll('h2, h3');
    const tocLinks = document.querySelectorAll('#tocLinks a');
    if (!headings || !tocLinks) return;
    
    let current = '';
    headings.forEach(h => {
      if (window.pageYOffset >= h.offsetTop - 150) {
        current = h.id;
      }
    });
    
    tocLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }
});

const appToggle = document.getElementById('appToggle');
const sidebarToggleInner = document.getElementById('sidebarToggleInner');

function toggleSidebar() {
  document.body.classList.toggle('sidebar-closed');
}

if (appToggle) appToggle.addEventListener('click', toggleSidebar);
if (sidebarToggleInner) sidebarToggleInner.addEventListener('click', toggleSidebar);

// Universal Group Toggle
const sidebarGroups = document.querySelectorAll('.sidebar__group');
sidebarGroups.forEach(group => {
  const title = group.querySelector('.sidebar__group-title');
  const container = group.querySelector('.sidebar__sublinks-container');
  const icon = group.querySelector('.wiki-toggle-icon');
  
  if (title && container && icon) {
    title.addEventListener('click', () => {
      container.classList.toggle('collapsed');
      icon.classList.toggle('collapsed');
    });
  }
});



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
// SERVER INFO (MOTD VIEWER & SUGGESTIONS)
// ==========================================
const siIpInput = document.getElementById('siIpInput');
const siSuggestions = document.getElementById('siSuggestions');
const siSubmitBtn = document.getElementById('siSubmitBtn');
const siLoading = document.getElementById('siLoading');
const siError = document.getElementById('siError');
const siResultContainer = document.getElementById('siResultContainer');

// Hardcoded database of popular servers
const popularServers = [
  { ip: 'mc.hypixel.net', name: 'Hypixel Network', players: 45000 },
  { ip: 'donutsmp.net', name: 'Donut SMP', players: 15000 },
  { ip: 'play.complexgaming.com', name: 'Complex Gaming', players: 4000 },
  { ip: 'play.wynncraft.com', name: 'Wynncraft', players: 1200 },
  { ip: '2b2t.org', name: '2b2t', players: 1000 },
  { ip: 'play.earthmc.net', name: 'EarthMC', players: 800 },
  { ip: 'play.aovn.net', name: 'AOVN', players: 300 },
  { ip: 'mc.heromc.net', name: 'HeroMC', players: 250 },
  { ip: 'hub.mcs.vn', name: 'MineHot', players: 200 },
  { ip: 'play.manacube.com', name: 'ManaCube', players: 1800 }
];

if (siIpInput && siSuggestions) {
  siIpInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    siSuggestions.innerHTML = '';
    
    if (!val) {
      siSuggestions.style.display = 'none';
      return;
    }
    
    // Lọc server theo tên hoặc IP
    const matches = popularServers.filter(s => 
      s.name.toLowerCase().includes(val) || s.ip.toLowerCase().includes(val)
    );
    
    // Sắp xếp theo lượng người chơi giảm dần và lấy top 5
    matches.sort((a, b) => b.players - a.players);
    const topMatches = matches.slice(0, 5);
    
    if (topMatches.length > 0) {
      topMatches.forEach(server => {
        const div = document.createElement('div');
        div.className = 'si-suggestion-item';
        div.innerHTML = `<div><span class="si-suggestion-name">${server.name}</span> <span class="si-suggestion-ip">(${server.ip})</span></div> <div class="si-suggestion-players">👤 ~${server.players.toLocaleString()}</div>`;
        div.addEventListener('click', () => {
          siIpInput.value = server.ip;
          siSuggestions.style.display = 'none';
          siSubmitBtn.click();
        });
        siSuggestions.appendChild(div);
      });
      siSuggestions.style.display = 'block';
    } else {
      siSuggestions.style.display = 'none';
    }
  });

  // Ẩn gợi ý khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (e.target !== siIpInput && e.target !== siSuggestions) {
      siSuggestions.style.display = 'none';
    }
  });
}

const siBedrockToggle = document.getElementById('siBedrockToggle');
const siForcePingToggle = document.getElementById('siForcePingToggle');

function parseMinecraftColors(text) {
  const colorMap = {
    '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
    '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
    '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
    'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
  };
  let html = '';
  let openTags = 0;
  
  if (typeof text !== 'string') return '';
  text = text.replace(/\\n/g, '\n');
  let tokens = text.split(/(§[0-9a-fk-or]|&[0-9a-fk-or])/i);
  
  for (let token of tokens) {
    if (!token) continue;
    if (token.startsWith('§') || token.startsWith('&')) {
      let code = token[1].toLowerCase();
      if (colorMap[code]) {
        while(openTags > 0) { html += '</span>'; openTags--; }
        html += `<span style="color: ${colorMap[code]};">`;
        openTags++;
      } else if (code === 'l') { html += `<span style="font-weight: bold;">`; openTags++; }
      else if (code === 'o') { html += `<span style="font-style: italic;">`; openTags++; }
      else if (code === 'n') { html += `<span style="text-decoration: underline;">`; openTags++; }
      else if (code === 'm') { html += `<span style="text-decoration: line-through;">`; openTags++; }
      else if (code === 'r') { while(openTags > 0) { html += '</span>'; openTags--; } }
    } else {
      html += token.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    }
  }
  while(openTags > 0) { html += '</span>'; openTags--; }
  return html;
}

if (siSubmitBtn) {
  siSubmitBtn.addEventListener('click', async () => {
    let inputStr = siIpInput.value.trim();
    if (!inputStr) return;
    
    // Parse IP and Port
    let ip = inputStr;
    let port = '';
    if (inputStr.includes(':')) {
      const parts = inputStr.split(':');
      ip = parts[0];
      port = parts[1];
    }
    
    siSuggestions.style.display = 'none';
    siLoading.style.display = 'block';
    siError.style.display = 'none';
    siResultContainer.style.display = 'none';

    try {
      let apiData = null;
      let ping = 0;
      let isMcstatus = false;
      
      const isBedrock = siBedrockToggle && siBedrockToggle.checked;
      const isForcePing = siForcePingToggle && siForcePingToggle.checked;
      
      const mcstatusType = isBedrock ? 'bedrock' : 'java';
      const mcsrvstatType = isBedrock ? 'bedrock/3' : '3';
      const nocache = isForcePing ? `?t=${Date.now()}` : '';

      if (isForcePing) {
        // Strategy 1: minetools.eu (if Java)
        if (!isBedrock) {
          try {
            const portStr = port ? `/${port}` : '/25565';
            const res = await fetch(`https://api.minetools.eu/ping/${encodeURIComponent(ip)}${portStr}${nocache}`);
            const data = await res.json();
            if (!data.error) {
              apiData = {
                online: true,
                host: ip,
                port: port || 25565,
                players: { online: data.players.online, max: data.players.max },
                version: data.version.name,
                motd: { html: [data.description] },
                icon: data.favicon
              };
              ping = data.latency || 0;
            }
          } catch(e) {}
        }
        
        // Strategy 2: mcstatus.io with nocache
        if (!apiData) {
          try {
            const res = await fetch(`https://api.mcstatus.io/v2/status/${mcstatusType}/${encodeURIComponent(inputStr)}${nocache}`);
            const data = await res.json();
            if (data.online) {
              apiData = data;
              ping = data.roundTripLatency || 0;
              isMcstatus = true;
            }
          } catch(e) {}
        }
      } else {
        // Normal Fallback Route
        try {
          const res1 = await fetch(`https://api.mcstatus.io/v2/status/${mcstatusType}/${encodeURIComponent(inputStr)}`);
          const data1 = await res1.json();
          if (data1.online) {
            apiData = data1;
            ping = data1.roundTripLatency || 0;
            isMcstatus = true;
          }
        } catch (err) {}

        if (!apiData) {
          try {
            const res2 = await fetch(`https://api.mcsrvstat.us/${mcsrvstatType}/${encodeURIComponent(inputStr)}`);
            const data2 = await res2.json();
            if (data2.online) {
              apiData = data2;
              if (data2.debug && typeof data2.debug.ping === 'number') ping = data2.debug.ping;
            }
          } catch(e) {}
        }
      }

      if (!apiData) {
        throw new Error('Server đang Offline hoặc Tường lửa (TCPShield) quá mạnh! Hãy thử bật chế độ Ép Ping.');
      }

      // Mapping variables correctly
      const hostName = isMcstatus ? apiData.host : (apiData.hostname || apiData.ip);
      const onlinePlayers = apiData.players?.online || 0;
      const maxPlayers = apiData.players?.max || 0;
      const percent = maxPlayers > 0 ? Math.round((onlinePlayers / maxPlayers) * 100) : 0;
      let version = isMcstatus ? (apiData.version?.name_clean || apiData.version?.name_raw || 'Unknown') : (apiData.version || 'Unknown');
      if (typeof version === 'object') version = version.name || 'Unknown'; // safety for minetools
      const software = apiData.software || 'Unknown';
      
      let iconUrl = isMcstatus ? apiData.icon : (apiData.icon || `https://api.mcsrvstat.us/icon/${encodeURIComponent(inputStr)}`);
      if (!iconUrl) iconUrl = 'https://via.placeholder.com/64';

      let motdHtml = 'A Minecraft Server';
      if (apiData.motd?.html) {
        if (Array.isArray(apiData.motd.html)) {
          motdHtml = apiData.motd.html.join('<br>');
        } else {
          motdHtml = apiData.motd.html.replace(/\\n/g, '<br>');
        }
        
        // Nếu html trả về vẫn còn ký tự §, tiến hành parse thủ công
        if (motdHtml.includes('§')) {
          motdHtml = parseMinecraftColors(motdHtml);
        }
      } else if (typeof apiData.description === 'string') {
        motdHtml = parseMinecraftColors(apiData.description);
      }
      
      // Update UI
      document.getElementById('siHeaderIp').textContent = hostName;
      document.getElementById('siConnect').textContent = `${hostName}:${apiData.port || port || (isBedrock ? 19132 : 25565)}`;
      document.getElementById('siPing').textContent = ping > 0 ? `${ping}ms` : 'Không xác định';
      document.getElementById('siPlayers').textContent = `${onlinePlayers}/${maxPlayers} (${percent}%)`;
      document.getElementById('siVersion').textContent = version;
      document.getElementById('siSoftware').textContent = software;
      
      document.getElementById('siIcon').src = iconUrl;
      document.getElementById('siMotdName').textContent = hostName;
      
      let pingBars = 5;
      if (ping > 150) pingBars = 3;
      if (ping > 300) pingBars = 1;
      if (ping === 0) pingBars = 0;
      
      let pingSvg = '<svg width="18" height="18" viewBox="0 0 16 16" fill="#00aa00" style="margin-left: 5px;">';
      pingSvg += `<rect x="2" y="12" width="2" height="4" />`;
      if(pingBars >= 2) pingSvg += `<rect x="5" y="10" width="2" height="6" />`;
      if(pingBars >= 3) pingSvg += `<rect x="8" y="7" width="2" height="9" />`;
      if(pingBars >= 4) pingSvg += `<rect x="11" y="4" width="2" height="12" />`;
      if(pingBars >= 5) pingSvg += `<rect x="14" y="0" width="2" height="16" />`;
      pingSvg += '</svg>';

      document.getElementById('siMotdPlayers').innerHTML = `${onlinePlayers}/${maxPlayers} ${pingSvg}`;
      document.getElementById('siMotdDesc').innerHTML = motdHtml;
      
      // GeoIP resolving
      let realIp = ip;
      try {
        if (!ip.match(/\d+\.\d+\.\d+\.\d+/)) {
           const rawIpRes = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`);
           const rawIpData = await rawIpRes.json();
           if (rawIpData.ip) realIp = rawIpData.ip;
        }
      } catch(e) {}
      
      try {
        const geoRes = await fetch(`https://ipwho.is/${encodeURIComponent(realIp)}`);
        const geoData = await geoRes.json();
        if (geoData.success) {
          document.getElementById('siLocation').innerHTML = `🚩 ${geoData.country} — ${geoData.city}, ${geoData.region}`;
          document.getElementById('siIsp').textContent = geoData.connection?.isp || geoData.connection?.org || 'Không rõ';
        } else {
          document.getElementById('siLocation').textContent = 'Chưa xác định';
          document.getElementById('siIsp').textContent = 'Chưa xác định';
        }
      } catch (err) {
        document.getElementById('siLocation').textContent = 'Lỗi tra cứu vị trí';
        document.getElementById('siIsp').textContent = 'Lỗi mạng';
      }

      siLoading.style.display = 'none';
      siResultContainer.style.display = 'block';

    } catch (error) {
      siLoading.style.display = 'none';
      siError.textContent = error.message || 'Có lỗi xảy ra khi lấy dữ liệu server. Vui lòng thử lại sau.';
      siError.style.display = 'block';
    }
  });

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
    div.style.cssText = "display: flex; align-items: center; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 5px 8px; border: 1px solid var(--border-light);";
    div.innerHTML = `
      <input type="color" class="cg-color-picker" value="${col}" data-index="${index}" style="width: 25px; height: 25px; padding: 0; border: none; border-radius: 4px; cursor: pointer; background: transparent;">
      <input type="text" class="cg-color-hex" value="${col}" data-index="${index}" style="width: 75px; background: transparent; border: none; color: var(--text-main); margin-left: 8px; outline: none; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-size: 0.9rem;">
      ${colors.length > 2 ? `<button class="cg-color-remove" data-index="${index}" style="background: transparent; border: none; color: #ff5555; cursor: pointer; padding: 0 5px; font-size: 1.2rem; margin-left: 5px;">&times;</button>` : ''}
    `;
    cgColorStops.appendChild(div);
  });

  // Events
  document.querySelectorAll('.cg-color-picker').forEach(picker => {
    picker.addEventListener('input', (e) => {
      const index = e.target.dataset.index;
      const val = e.target.value.toUpperCase();
      colors[index] = val;
      // Chỉ cập nhật giá trị ô input Text bên cạnh, KHÔNG re-render lại toàn bộ HTML
      e.target.nextElementSibling.value = val;
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

function darkenHexColor(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  r = Math.floor(r * 0.25);
  g = Math.floor(g * 0.25);
  b = Math.floor(b * 0.25);
  
  return rgbToHex(r, g, b);
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
    const shadowC = darkenHexColor(c);
    if (format === 'minimessage') resultString = `${prefixMini}<${c}>${chars[0]}`;
    else if (format === 'legacy') resultString = `${prefixLegacy}&${c}${chars[0]}`;
    else resultString = `${prefixHex}<color:${c}>${chars[0]}`;
    previewHtml += `<span style="color:${c}; text-shadow: 3px 3px 0px ${shadowC}">${chars[0]}</span>`;
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
      const shadowCol = darkenHexColor(blendedCol);
      
      if (format === 'minimessage') resultString += `<${blendedCol}>${char}`;
      else if (format === 'legacy') resultString += `&${blendedCol}${char}`;
      else resultString += `<color:${blendedCol}>${char}`;
      
      previewHtml += `<span style="color:${blendedCol}; text-shadow: 3px 3px 0px ${shadowCol}">${char.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
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
      colors.push('var(--text-main)');
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

// ==========================================
// TRANSLATION LOGIC
// ==========================================
const transInput = document.getElementById('transInput');
const transOutput = document.getElementById('transOutput');
const transSrcLang = document.getElementById('transSrcLang');
const transTgtLang = document.getElementById('transTgtLang');
const transClearBtn = document.getElementById('transClearBtn');
const transCopyBtn = document.getElementById('transCopyBtn');

let transTimeout;

if (transInput) {
  const doTranslation = async () => {
    const text = transInput.value.trim();
    if (!text) {
      transOutput.value = '';
      return;
    }
    
    transOutput.value = 'Đang dịch...';
    const src = transSrcLang.value;
    const tgt = transTgtLang.value;
    
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      let translated = '';
      if (data && data[0]) {
        data[0].forEach(item => {
          if (item[0]) translated += item[0];
        });
      }
      transOutput.value = translated;
    } catch (e) {
      transOutput.value = 'Lỗi kết nối dịch thuật!';
      console.error(e);
    }
  };

  transInput.addEventListener('input', () => {
    clearTimeout(transTimeout);
    transTimeout = setTimeout(doTranslation, 600);
  });

  transSrcLang.addEventListener('change', doTranslation);
  transTgtLang.addEventListener('change', doTranslation);

  transClearBtn.addEventListener('click', () => {
    transInput.value = '';
    transOutput.value = '';
  });

  transCopyBtn.addEventListener('click', () => {
    if (!transOutput.value || transOutput.value === 'Đang dịch...' || transOutput.value === 'Lỗi kết nối dịch thuật!') return;
    transOutput.select();
    document.execCommand('copy');
    const oldHtml = transCopyBtn.innerHTML;
    transCopyBtn.innerHTML = '✅ Đã Sao Chép!';
    setTimeout(() => transCopyBtn.innerHTML = oldHtml, 2000);
  });
}

// ==========================================
// FILE TRANSLATOR LOGIC (YML/JSON/PROPERTIES)
// ==========================================
const ftDropZone = document.getElementById('ftDropZone');
const ftFileInput = document.getElementById('ftFileInput');
const ftProgressBox = document.getElementById('ftProgressBox');
const ftProgressBar = document.getElementById('ftProgressBar');
const ftStatusText = document.getElementById('ftStatusText');
const ftProgressText = document.getElementById('ftProgressText');
const ftResultBox = document.getElementById('ftResultBox');
const ftTransCount = document.getElementById('ftTransCount');
const ftDownloadBtn = document.getElementById('ftDownloadBtn');

if (ftDropZone && ftFileInput) {
  // Drag & Drop
  ftDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    ftDropZone.style.borderColor = 'var(--text-main)';
    ftDropZone.style.background = 'var(--border-light)';
  });
  ftDropZone.addEventListener('dragleave', () => {
    ftDropZone.style.borderColor = 'rgba(255,119,170,0.5)';
    ftDropZone.style.background = 'rgba(0,0,0,0.2)';
  });
  ftDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    ftDropZone.style.borderColor = 'rgba(255,119,170,0.5)';
    ftDropZone.style.background = 'rgba(0,0,0,0.2)';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      ftFileInput.files = e.dataTransfer.files;
      handleFileTranslation(e.dataTransfer.files[0]);
    }
  });

  ftFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileTranslation(e.target.files[0]);
    }
  });
}

function protectPlaceholders(text) {
  let placeholders = [];
  let index = 0;
  
  // Regex bắt các loại biến: %var%, {var}, <var>, &a, §a, &var(--text-main), <color:var(--text-main)>
  const regexes = [
    /&[0-9a-fk-or]/gi,          // Color codes &a
    /§[0-9a-fk-or]/gi,          // Color codes §a
    /&#[0-9a-fA-F]{6}/gi,       // Hex color &var(--text-main)
    /<#[0-9a-fA-F]{6}>/gi,      // Hex color <var(--text-main)>
    /<color:[^>]+>/gi,          // MiniMessage <color:red>
    /%[^%\s]+%/gi,              // PAPI %player%
    /\{[^}\s]+\}/gi,            // Placeholder {0}
    /<\/?(?:[a-zA-Z0-9_]+)[^>]*>/gi // XML tags / MiniMessage tags
  ];

  let protectedText = text;
  
  regexes.forEach(regex => {
    protectedText = protectedText.replace(regex, (match) => {
      placeholders.push(match);
      const token = `__${index}__`;
      index++;
      return token;
    });
  });

  return { text: protectedText, placeholders };
}

function restorePlaceholders(text, placeholders) {
  let restoredText = text;
  // Khôi phục theo thứ tự ngược lại nếu bị thay đổi, nhưng vì dùng index cụ thể nên không sao
  placeholders.forEach((placeholder, idx) => {
    const tokenRegex = new RegExp(`__${idx}__`, 'g');
    // Google dịch hay tự thêm dấu cách vào token ví dụ __ 0 __
    const spacedTokenRegex = new RegExp(`__\\s*${idx}\\s*__`, 'g');
    restoredText = restoredText.replace(tokenRegex, placeholder);
    restoredText = restoredText.replace(spacedTokenRegex, placeholder);
  });
  return restoredText;
}

async function handleFileTranslation(file) {
  ftProgressBox.style.display = 'block';
  ftResultBox.style.display = 'none';
  ftDropZone.style.display = 'none';
  ftStatusText.textContent = 'Đang đọc file...';
  ftProgressBar.style.width = '5%';
  ftProgressText.textContent = '5%';

  const text = await file.text();
  const lines = text.split('\n');
  
  const translatableItems = []; // { lineIndex, prefix, value, quoteChar, placeholders }
  
  // Phân tích dòng cần dịch
  ftStatusText.textContent = 'Đang bóc tách dữ liệu cấu hình...';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Regex cho YAML: key: "value" hoặc - "value"
    // Regex cho Properties: key=value
    // Chỉ dịch những chuỗi có vẻ là văn bản (không phải true/false/số)
    let match = line.match(/^([\s-]*[a-zA-Z0-9_.-]+:\s*)(.*)$/); // YAML key
    if (!match) match = line.match(/^([\s-]*-\s*)(.*)$/); // YAML list
    if (!match) match = line.match(/^([a-zA-Z0-9_.-]+=)(.*)$/); // Properties
    
    if (match) {
      let prefix = match[1];
      let value = match[2].trim();
      
      // Bỏ qua comments
      if (value.startsWith('#') || value.startsWith('//')) continue;
      // Bỏ qua rỗng, số, boolean
      if (!value || value === '""' || value === "''" || !isNaN(value) || value === 'true' || value === 'false') continue;
      // Bỏ qua object rỗng {} []
      if (value === '{}' || value === '[]') continue;

      let quoteChar = '';
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        quoteChar = value[0];
        value = value.substring(1, value.length - 1);
      }
      
      // Bỏ qua nếu giá trị thực sự rỗng sau khi bỏ ngoặc
      if (!value) continue;

      const prot = protectPlaceholders(value);
      
      translatableItems.push({
        lineIndex: i,
        prefix: prefix,
        originalValue: value,
        protectedValue: prot.text,
        quoteChar: quoteChar,
        placeholders: prot.placeholders
      });
    }
  }

  if (translatableItems.length === 0) {
    ftStatusText.textContent = 'Không tìm thấy dòng văn bản nào cần dịch trong file này!';
    ftProgressBar.style.width = '100%';
    setTimeout(() => {
      ftProgressBox.style.display = 'none';
      ftDropZone.style.display = 'block';
    }, 3000);
    return;
  }

  // Dịch thuật hàng loạt (Batching)
  ftStatusText.textContent = `Đang dịch ${translatableItems.length} dòng qua Google API...`;
  
  const batchSize = 30; // 30 dòng mỗi batch để tránh lỗi URL quá dài
  const tgtLang = document.getElementById('transTgtLang').value;
  const srcLang = document.getElementById('transSrcLang').value;
  
  let translatedCount = 0;

  for (let i = 0; i < translatableItems.length; i += batchSize) {
    const batch = translatableItems.slice(i, i + batchSize);
    const combinedText = batch.map(item => item.protectedValue).join(' \n||| \n'); // Dấu phân tách an toàn
    
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcLang}&tl=${tgtLang}&dt=t&q=${encodeURIComponent(combinedText)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      let translatedCombined = '';
      if (data && data[0]) {
        data[0].forEach(item => {
          if (item[0]) translatedCombined += item[0];
        });
      }
      
      // Tách lại thành mảng
      const translatedArray = translatedCombined.split(/\s*\|\|\|\s*\n?|\n\|\|\|\n?/);
      
      for (let j = 0; j < batch.length; j++) {
        let transText = translatedArray[j] ? translatedArray[j].trim() : batch[j].protectedValue;
        
        // Khôi phục placeholders
        let finalValue = restorePlaceholders(transText, batch[j].placeholders);
        
        // Gắn lại vào file
        const item = batch[j];
        const line = item.prefix + (item.quoteChar ? `${item.quoteChar}${finalValue}${item.quoteChar}` : finalValue);
        lines[item.lineIndex] = line;
        translatedCount++;
      }
      
      // Cập nhật Progress
      const percent = 5 + Math.round((translatedCount / translatableItems.length) * 95);
      ftProgressBar.style.width = `${percent}%`;
      ftProgressText.textContent = `${percent}%`;

      // Nghỉ 1s tránh spam API
      await new Promise(r => setTimeout(r, 1000));

    } catch (e) {
      console.error("Lỗi dịch một batch:", e);
      // Nếu lỗi, giữ nguyên file gốc cho batch này
    }
  }

  ftStatusText.textContent = 'Đang đóng gói file...';
  
  const finalFileText = lines.join('\n');
  const blob = new Blob([finalFileText], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  
  ftDownloadBtn.href = downloadUrl;
  
  // Giữ lại tên file gốc nhưng thêm hậu tố
  const originalName = file.name;
  const extIndex = originalName.lastIndexOf('.');
  const ext = extIndex > -1 ? originalName.substring(extIndex) : '';
  const baseName = extIndex > -1 ? originalName.substring(0, extIndex) : originalName;
  ftDownloadBtn.download = `${baseName}_vi${ext}`;
  
  ftTransCount.textContent = translatedCount;
  
  ftProgressBox.style.display = 'none';
  ftDropZone.style.display = 'block';
  ftResultBox.style.display = 'block';
  ftFileInput.value = ''; // Reset
}

// ==========================================
// PLAYER INFO LOGIC
// ==========================================
const piNameInput = document.getElementById('piNameInput');
const piSubmitBtn = document.getElementById('piSubmitBtn');
const piLoading = document.getElementById('piLoading');
const piError = document.getElementById('piError');
const piResultContainer = document.getElementById('piResultContainer');

const piSkin3D = document.getElementById('piSkin3D');
const piUsername = document.getElementById('piUsername');
const piUUID = document.getElementById('piUUID');
const piAccountType = document.getElementById('piAccountType');
const piSkinDownload = document.getElementById('piSkinDownload');
const piCapeDownload = document.getElementById('piCapeDownload');
const piCapeRow = document.getElementById('piCapeRow');

if (piSubmitBtn && piNameInput) {
  piSubmitBtn.addEventListener('click', async () => {
    const name = piNameInput.value.trim();
    if (!name) return;
    
    piLoading.style.display = 'block';
    piError.style.display = 'none';
    piResultContainer.style.display = 'none';
    
    try {
      // Ashcon API rất chuẩn để phân biệt Premium
      const res = await fetch(`https://api.ashcon.app/mojang/v2/user/${encodeURIComponent(name)}`);
      
      if (!res.ok) {
        throw new Error('Tài khoản Premium không tồn tại (Có thể là tài khoản Cracked)');
      }
      
      const data = await res.json();
      
      const uuid = data.uuid;
      const username = data.username;
      const skinUrl = data.textures?.skin?.url;
      const capeUrl = data.textures?.cape?.url;
      
      piUsername.textContent = username;
      piUUID.textContent = uuid;
      
      // Render Skin 3D đẹp mắt bằng Visage
      piSkin3D.src = `https://visage.surgeplay.com/full/512/${uuid}`;
      
      piAccountType.textContent = 'Premium (Bản Quyền)';
      piAccountType.style.background = 'rgba(0,255,0,0.15)';
      piAccountType.style.color = '#55ff55';
      
      if (skinUrl) {
        piSkinDownload.href = skinUrl;
        piSkinDownload.style.display = 'inline';
      } else {
        piSkinDownload.style.display = 'none';
      }
      
      if (capeUrl) {
        piCapeDownload.href = capeUrl;
        piCapeRow.style.display = 'block';
      } else {
        piCapeRow.style.display = 'none';
      }
      
      piLoading.style.display = 'none';
      piResultContainer.style.display = 'flex';
      
    } catch (err) {
      piLoading.style.display = 'none';
      piError.textContent = err.message || 'Không thể lấy thông tin người chơi.';
      piError.style.display = 'block';
      
      // Fallback: Tìm UUID Offline cho tài khoản Cracked
      try {
        const fallRes = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(name)}`);
        if (fallRes.ok) {
           const fallData = await fallRes.json();
           if (fallData.code === 'player.found') {
              const offlineUuid = fallData.data.player.id;
              
              piUsername.textContent = fallData.data.player.username;
              piUUID.textContent = offlineUuid;
              
              // Crafatar fallback render
              piSkin3D.src = `https://crafatar.com/renders/body/${offlineUuid}?overlay=true&default=MHF_Steve`;
              
              piAccountType.textContent = 'Cracked (Không Bản Quyền)';
              piAccountType.style.background = 'rgba(255,170,0,0.15)';
              piAccountType.style.color = '#ffaa00';
              
              piSkinDownload.href = `https://crafatar.com/skins/${offlineUuid}?default=MHF_Steve`;
              piSkinDownload.style.display = 'inline';
              piCapeRow.style.display = 'none';
              
              piError.style.display = 'none';
              piResultContainer.style.display = 'flex';
           }
        }
      } catch(e) {}
    }
  });
}

// ==========================================
// PLUGIN SCANNER (JSZIP)
// ==========================================
const scanDropZone = document.getElementById('scanDropZone');
const scanFileInput = document.getElementById('scanFileInput');
const scanProgressBox = document.getElementById('scanProgressBox');
const scanProgressBar = document.getElementById('scanProgressBar');
const scanStatusText = document.getElementById('scanStatusText');
const scanResultBox = document.getElementById('scanResultBox');
const scanRiskBadge = document.getElementById('scanRiskBadge');
const scanTotalClasses = document.getElementById('scanTotalClasses');
const scanTotalThreats = document.getElementById('scanTotalThreats');
const scanLogArea = document.getElementById('scanLogArea');

if (scanDropZone && scanFileInput) {
  scanDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    scanDropZone.classList.add('dragover');
  });
  scanDropZone.addEventListener('dragleave', () => {
    scanDropZone.classList.remove('dragover');
  });
  scanDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    scanDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleScanFile(e.dataTransfer.files[0]);
    }
  });
  scanFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleScanFile(e.target.files[0]);
    }
  });
}

const signatures = [
  // NGUY HIỂM TỘT ĐỘ (Critical Backdoors & RCE)
  { match: /LMX_API|LMX_Client|LMX_Server/, name: 'Spigot:Backdoor.LMX', desc: 'Mã độc LMX', level: 'danger' },
  { match: /ThiccIndustries|ThiccAPI/, name: 'Spigot:Backdoor.ThiccIndustries', desc: 'Mã độc ThiccIndustries', level: 'danger' },
  { match: /FakeBStats|bStats_Metrics_Stager|bStats_Stager/, name: 'FakeBStats.Stager', desc: 'Mã độc giả mạo bStats tải shell', level: 'danger' },
  { match: /Java:Downloader|PayloadDownloader/, name: 'Java:Downloader.A', desc: 'Mã độc tự động tải file', level: 'danger' },
  { match: /HostFlow|HostFlowAPI/, name: 'Spigot:Backdoor.Generic', desc: 'Backdoor HostFlow', level: 'danger' },
  { match: /java\/lang\/Runtime/, require: /exec/, name: 'RuntimeExec', desc: 'Thực thi lệnh Console (RCE)', level: 'danger' },
  { match: /java\/lang\/ProcessBuilder/, name: 'ShellExecution', desc: 'Tạo tiến trình hệ thống (Shell/Virus)', level: 'danger' },
  { match: /System/, require: /loadLibrary|load\(/, name: 'NativePayload', desc: 'Tải mã thực thi Native (.dll/.so) - Nguy cơ rễ máy (Rootkit)', level: 'danger' },
  { match: /java\/lang\/instrument\/Instrumentation/, name: 'JavaAgentInjection', desc: 'Dùng Java Agent tiêm mã độc vào RAM Server', level: 'danger' },
  { match: /cmd\.exe|\/bin\/bash|\/bin\/sh|powershell\.exe/, name: 'OSCommandString', desc: 'Chứa chuỗi lệnh tương tác hệ thống OS', level: 'danger' },
  { match: /pastebin\.com\/raw\/|githubusercontent\.com\/.*\/raw\//, name: 'RemoteDrop', desc: 'Có hành vi tải mã thực thi từ Pastebin/Github', level: 'danger' },

  // MÃ HÓA NÂNG CAO (Obfuscation - Thường dùng giấu mã độc)
  { match: /StringFog|Allatori|ZKM|ProGuard|QProtect/, name: 'Obfuscator.Tool', desc: 'Code bị mã hóa nặng, không thể đọc được (Có thể giấu mã độc)', level: 'warning' },
  { match: /sun\/misc\/Unsafe/, name: 'UnsafeMemory', desc: 'Truy cập bộ nhớ hệ thống (Bypass Java Security)', level: 'danger' },

  // NGHI NGỜ (Suspicious API Usage)
  { match: /setOp/, name: 'SetOp', desc: 'Có thể cấp quyền OP (Force OP)', level: 'warning' },
  { match: /setBanned/, name: 'SetBanned', desc: 'Có thể gỡ ban trái phép', level: 'warning' },
  { match: /javax\/script\/ScriptEngine/, name: 'ScriptEngine', desc: 'Sử dụng JS/Groovy động (Nguy cơ Backdoor cực cao)', level: 'danger' },
  { match: /java\/util\/Base64/, require: /defineClass/, name: 'Base64ClassLoader', desc: 'Tải Class ẩn từ chuỗi Base64 (Kỹ thuật giấu mã độc)', level: 'danger' },
  { match: /setDaemon/, require: /java\/net\/Socket/, name: 'DaemonSocket', desc: 'Mở Reverse Shell chạy ngầm', level: 'danger' },
  { match: /java\/net\/Socket/, name: 'Socket', desc: 'Mở cổng kết nối Socket (Dễ bị lợi dụng làm Reverse Shell)', level: 'warning' },
  { match: /java\/net\/ServerSocket/, name: 'ServerSocket', desc: 'Mở Server kết nối ẩn', level: 'warning' },
  { match: /URLClassLoader/, require: /http/, name: 'RemoteClassLoader', desc: 'Tải class từ xa qua HTTP', level: 'warning' },
  { match: /discordapp\.com\/api\/webhooks|discord\.com\/api\/webhooks/, name: 'DiscordWebhook', desc: 'Gửi dữ liệu âm thầm ra Webhook', level: 'warning' },
  { match: /api\.ipify\.org|checkip\.amazonaws\.com|ident\.me/, name: 'IPGrabber', desc: 'Lấy trộm IP máy chủ/người chơi', level: 'warning' },
  { match: /java\/net\/URL/, require: /openStream|openConnection/, name: 'UrlOpenStream', desc: 'Tải dữ liệu từ Internet', level: 'warning' },
  { match: /javassist|jdk\/internal\/org\/objectweb\/asm/, name: 'Java:BCM', desc: 'Can thiệp, sửa đổi Bytecode đang chạy', level: 'warning' },
  { match: /java\/io\/File/, require: /delete|write|FileOutputStream/, name: 'FileAccess', desc: 'Ghi/xóa file hệ thống nhạy cảm', level: 'warning' },
  { match: /PluginManager/, require: /disablePlugin/, name: 'DisablePlugin', desc: 'Tắt các Plugin khác (Dấu hiệu tắt AntiCheat)', level: 'warning' },
  { match: /AsyncPlayerChatEvent|PlayerCommandPreprocessEvent/, require: /password|login|register/i, name: 'ChatLogger/AuthMeBypass', desc: 'Theo dõi mật khẩu người chơi', level: 'warning' },

  // THÔNG TIN (Info - API hoàn toàn hợp lệ nhưng nên cẩn trọng)
  { match: /dispatchCommand/, name: 'DispatchCommand', desc: 'Ép chạy lệnh Server', level: 'info' },
  { match: /AsyncPlayerChatEvent/, name: 'AsyncPlayerChatEvent', desc: 'Lắng nghe sự kiện Chat', level: 'info' },
  { match: /java\/lang\/reflect/, name: 'Reflection', desc: 'Sử dụng Java Reflection', level: 'info' },
  { match: /System/, require: /getProperty/, name: 'SystemProperties', desc: 'Lấy thông tin hệ thống Server', level: 'info' },
  { match: /Cipher|MessageDigest|SecretKeySpec/, name: 'Crypto', desc: 'Sử dụng thuật toán mã hóa dữ liệu', level: 'info' }
];

async function handleScanFile(file) {
  if (!window.JSZip) {
    alert('Thư viện JSZip chưa được tải!');
    return;
  }
  
  if (!file.name.endsWith('.jar') && !file.name.endsWith('.zip')) {
    alert('Chỉ hỗ trợ file .jar hoặc .zip!');
    return;
  }

  scanResultBox.style.display = 'none';
  scanProgressBox.style.display = 'block';
  scanDropZone.style.display = 'none';
  scanWarningBox.style.display = 'none';
  scanStatusText.textContent = `Đang nạp file: ${file.name}...`;
  scanProgressBar.style.width = '10%';
  scanLogArea.innerHTML = '';
  
  let classFiles = [];
  let totalThreats = 0;
  let maxRisk = 'safe'; // safe, info, warning, danger
  
  // Set lưu trữ các category đã bắt được trên toàn bộ file
  let foundDangerCats = new Set();
  let foundWarningCats = new Set();
  let foundInfoCats = new Set();

  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    Object.keys(contents.files).forEach(filename => {
      if (filename.endsWith('.class') && 
          !filename.includes('org/sqlite/') && 
          !filename.includes('com/mysql/') && 
          !filename.includes('org/bstats/') &&
          !filename.includes('com/zaxxer/hikari/')) {
        classFiles.push(contents.files[filename]);
      }
    });

    scanTotalClasses.textContent = classFiles.length;
    scanStatusText.textContent = `Đang phân tích ${classFiles.length} file bytecode...`;
    
    if (classFiles.length === 0) {
      scanLogArea.innerHTML = '<div style="color:var(--text-dark);">Không tìm thấy file .class nào. Đây có thể không phải là plugin hợp lệ.</div>';
    }

    let processed = 0;
    
    for (let f of classFiles) {
      if (processed > 0 && processed % 50 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }

      const data = await f.async("string"); 
      
      let foundInFile = [];
      for (let sig of signatures) {
        let isMatch = false;
        
        if (sig.match instanceof RegExp) {
          isMatch = sig.match.test(data);
        } else {
          isMatch = data.includes(sig.match);
        }

        if (isMatch && sig.require) {
          if (sig.require instanceof RegExp) {
            isMatch = sig.require.test(data);
          } else {
            isMatch = data.includes(sig.require);
          }
        }

        if (isMatch) {
          foundInFile.push(sig);
          totalThreats++;
          
          if (sig.level === 'danger') {
            maxRisk = 'danger';
            foundDangerCats.add(sig.name);
          } else if (sig.level === 'warning') {
            if (maxRisk !== 'danger') maxRisk = 'warning';
            foundWarningCats.add(sig.name);
          } else if (sig.level === 'info') {
            if (maxRisk === 'safe') maxRisk = 'info';
            foundInfoCats.add(sig.name);
          }
        }
      }
      
      if (foundInFile.length > 0) {
        const div = document.createElement('div');
        div.className = 'scan-log-item';
        
        const fileNameDiv = document.createElement('div');
        fileNameDiv.className = 'scan-log-file';
        fileNameDiv.textContent = '📄 ' + f.name;
        div.appendChild(fileNameDiv);

        foundInFile.forEach(sig => {
           let color = sig.level === 'danger' ? '#ff5555' : (sig.level === 'warning' ? '#ffaa00' : '#77aaff');
           
           const sigDiv = document.createElement('div');
           sigDiv.style.marginLeft = '15px';
           
           const matchSpan = document.createElement('span');
           matchSpan.className = 'scan-log-match';
           matchSpan.style.color = color;
           matchSpan.textContent = `[${sig.name}] `;
           
           const descSpan = document.createElement('span');
           descSpan.className = 'scan-log-desc';
           descSpan.textContent = sig.desc;
           
           sigDiv.appendChild(matchSpan);
           sigDiv.appendChild(descSpan);
           div.appendChild(sigDiv);
        });
        scanLogArea.appendChild(div);
      }
      
      processed++;
      const percent = 10 + Math.round((processed / classFiles.length) * 90);
      scanProgressBar.style.width = `${percent}%`;
    }
    
    scanTotalThreats.textContent = totalThreats;
    
    const scanCatDanger = document.getElementById('scanCatDanger');
    const scanCatWarning = document.getElementById('scanCatWarning');
    const scanCatInfo = document.getElementById('scanCatInfo');
    
    if (scanCatDanger) scanCatDanger.innerHTML = foundDangerCats.size > 0 ? Array.from(foundDangerCats).join(', ') : 'Không';
    if (scanCatWarning) scanCatWarning.innerHTML = foundWarningCats.size > 0 ? Array.from(foundWarningCats).join(', ') : 'Không';
    if (scanCatInfo) scanCatInfo.innerHTML = foundInfoCats.size > 0 ? Array.from(foundInfoCats).join(', ') : 'Không';
    
    if (totalThreats === 0 && classFiles.length > 0) {
       scanLogArea.innerHTML = '<div style="color:#55ff55; font-weight:bold;">✅ Hoàn toàn sạch sẽ! Không tìm thấy dấu hiệu mã độc nào trong các file class.</div>';
    }
    
    scanRiskBadge.className = 'scan-badge ' + (maxRisk === 'info' ? 'safe' : maxRisk);
    if (maxRisk === 'danger') scanRiskBadge.textContent = '⛔ NGUY HIỂM CAO';
    else if (maxRisk === 'warning') scanRiskBadge.textContent = '⚠️ ĐÁNG NGỜ';
    else scanRiskBadge.textContent = '✅ AN TOÀN';
    
    setTimeout(() => {
      scanProgressBox.style.display = 'none';
      scanResultBox.style.display = 'block';
    }, 500);
    
  } catch (err) {
    scanStatusText.textContent = 'Lỗi giải nén file!';
    console.error(err);
  }
}

document.getElementById('scanResetBtn').addEventListener('click', () => {
  scanResultBox.style.display = 'none';
  scanProgressBox.style.display = 'none';
  document.getElementById('scanDropZone').style.display = 'block';
  document.getElementById('scanWarningBox').style.display = 'block';
  document.getElementById('scanFileInput').value = '';
});

/* =========================================
   DELUXEMENUS GUI GENERATOR
========================================= */
const mcMaterialsList = [
  "STONE", "GRANITE", "DIORITE", "ANDESITE", "GRASS_BLOCK", "DIRT", "COBBLESTONE", "OAK_PLANKS", "SPRUCE_PLANKS", "BIRCH_PLANKS", "JUNGLE_PLANKS", "ACACIA_PLANKS", "DARK_OAK_PLANKS", "OAK_SAPLING", "BEDROCK", "WATER", "LAVA", "SAND", "GRAVEL", "GOLD_ORE", "IRON_ORE", "COAL_ORE", "OAK_WOOD", "SPRUCE_WOOD", "BIRCH_WOOD", "LEAVES", "SPONGE", "GLASS", "LAPIS_ORE", "LAPIS_BLOCK", "SANDSTONE", "COBWEB", "GRASS", "FERN", "DEAD_BUSH", "WHITE_WOOL", "ORANGE_WOOL", "MAGENTA_WOOL", "LIGHT_BLUE_WOOL", "YELLOW_WOOL", "LIME_WOOL", "PINK_WOOL", "GRAY_WOOL", "LIGHT_GRAY_WOOL", "CYAN_WOOL", "PURPLE_WOOL", "BLUE_WOOL", "BROWN_WOOL", "GREEN_WOOL", "RED_WOOL", "BLACK_WOOL", "GOLD_BLOCK", "IRON_BLOCK", "BRICKS", "TNT", "BOOKSHELF", "MOSSY_COBBLESTONE", "OBSIDIAN", "TORCH", "FIRE", "SPAWNER", "CHEST", "DIAMOND_ORE", "DIAMOND_BLOCK", "CRAFTING_TABLE", "FURNACE", "LADDER", "SNOW", "ICE", "CACTUS", "CLAY", "NETHERRACK", "SOUL_SAND", "GLOWSTONE", "PORTAL", "JACK_O_LANTERN", "CAKE", "WHITE_STAINED_GLASS", "ORANGE_STAINED_GLASS", "MAGENTA_STAINED_GLASS", "LIGHT_BLUE_STAINED_GLASS", "YELLOW_STAINED_GLASS", "LIME_STAINED_GLASS", "PINK_STAINED_GLASS", "GRAY_STAINED_GLASS", "LIGHT_GRAY_STAINED_GLASS", "CYAN_STAINED_GLASS", "PURPLE_STAINED_GLASS", "BLUE_STAINED_GLASS", "BROWN_STAINED_GLASS", "GREEN_STAINED_GLASS", "RED_STAINED_GLASS", "BLACK_STAINED_GLASS", "EMERALD_ORE", "EMERALD_BLOCK", "NETHER_STAR", "BEACON", "ANVIL", "WHITE_STAINED_GLASS_PANE", "ORANGE_STAINED_GLASS_PANE", "MAGENTA_STAINED_GLASS_PANE", "LIGHT_BLUE_STAINED_GLASS_PANE", "YELLOW_STAINED_GLASS_PANE", "LIME_STAINED_GLASS_PANE", "PINK_STAINED_GLASS_PANE", "GRAY_STAINED_GLASS_PANE", "LIGHT_GRAY_STAINED_GLASS_PANE", "CYAN_STAINED_GLASS_PANE", "PURPLE_STAINED_GLASS_PANE", "BLUE_STAINED_GLASS_PANE", "BROWN_STAINED_GLASS_PANE", "GREEN_STAINED_GLASS_PANE", "RED_STAINED_GLASS_PANE", "BLACK_STAINED_GLASS_PANE", "SLIME_BLOCK", "BARRIER", "IRON_TRAPDOOR", "PRISMARINE", "SEA_LANTERN", "COAL", "DIAMOND", "IRON_INGOT", "GOLD_INGOT", "STICK", "BOWL", "MUSHROOM_STEW", "GOLDEN_SWORD", "GOLDEN_SHOVEL", "GOLDEN_PICKAXE", "GOLDEN_AXE", "STRING", "FEATHER", "GUNPOWDER", "WOODEN_HOE", "STONE_HOE", "IRON_HOE", "DIAMOND_HOE", "GOLDEN_HOE", "WHEAT_SEEDS", "WHEAT", "BREAD", "LEATHER_HELMET", "LEATHER_CHESTPLATE", "LEATHER_LEGGINGS", "LEATHER_BOOTS", "CHAINMAIL_HELMET", "CHAINMAIL_CHESTPLATE", "CHAINMAIL_LEGGINGS", "CHAINMAIL_BOOTS", "IRON_HELMET", "IRON_CHESTPLATE", "IRON_LEGGINGS", "IRON_BOOTS", "DIAMOND_HELMET", "DIAMOND_CHESTPLATE", "DIAMOND_LEGGINGS", "DIAMOND_BOOTS", "GOLDEN_HELMET", "GOLDEN_CHESTPLATE", "GOLDEN_LEGGINGS", "GOLDEN_BOOTS", "FLINT", "PORKCHOP", "COOKED_PORKCHOP", "PAINTING", "GOLDEN_APPLE", "ENCHANTED_GOLDEN_APPLE", "SIGN", "BUCKET", "WATER_BUCKET", "LAVA_BUCKET", "MINECART", "SADDLE", "IRON_DOOR", "REDSTONE", "SNOWBALL", "BOAT", "LEATHER", "MILK_BUCKET", "BRICK", "CLAY_BALL", "SUGAR_CANE", "PAPER", "BOOK", "SLIME_BALL", "CHEST_MINECART", "FURNACE_MINECART", "EGG", "COMPASS", "FISHING_ROD", "CLOCK", "GLOWSTONE_DUST", "COD", "SALMON", "TROPICAL_FISH", "PUFFERFISH", "COOKED_COD", "COOKED_SALMON", "INK_SAC", "RED_DYE", "GREEN_DYE", "COCOA_BEANS", "LAPIS_LAZULI", "PURPLE_DYE", "CYAN_DYE", "LIGHT_GRAY_DYE", "GRAY_DYE", "PINK_DYE", "LIME_DYE", "YELLOW_DYE", "LIGHT_BLUE_DYE", "MAGENTA_DYE", "ORANGE_DYE", "BONE_MEAL", "BONE", "SUGAR", "CAKE", "BED", "REPEATER", "COOKIE", "FILLED_MAP", "SHEARS", "MELON", "PUMPKIN_SEEDS", "MELON_SEEDS", "BEEF", "COOKED_BEEF", "CHICKEN", "COOKED_CHICKEN", "ROTTEN_FLESH", "ENDER_PEARL", "BLAZE_ROD", "GHAST_TEAR", "GOLD_NUGGET", "NETHER_WART", "POTION", "GLASS_BOTTLE", "SPIDER_EYE", "FERMENTED_SPIDER_EYE", "BLAZE_POWDER", "MAGMA_CREAM", "BREWING_STAND", "CAULDRON", "ENDER_EYE", "GLISTERING_MELON_SLICE", "SPAWN_EGG", "EXPERIENCE_BOTTLE", "FIRE_CHARGE", "WRITABLE_BOOK", "WRITTEN_BOOK", "EMERALD", "ITEM_FRAME", "FLOWER_POT", "CARROT", "POTATO", "BAKED_POTATO", "POISONOUS_POTATO", "MAP", "GOLDEN_CARROT", "SKELETON_SKULL", "WITHER_SKELETON_SKULL", "ZOMBIE_HEAD", "PLAYER_HEAD", "CREEPER_HEAD", "DRAGON_HEAD", "CARROT_ON_A_STICK", "NETHER_STAR", "PUMPKIN_PIE", "FIREWORK_ROCKET", "FIREWORK_STAR", "ENCHANTED_BOOK", "NETHER_BRICK", "QUARTZ", "TNT_MINECART", "HOPPER_MINECART", "PRISMARINE_SHARD", "PRISMARINE_CRYSTALS", "RABBIT", "COOKED_RABBIT", "RABBIT_STEW", "RABBIT_FOOT", "RABBIT_HIDE", "ARMOR_STAND", "IRON_HORSE_ARMOR", "GOLDEN_HORSE_ARMOR", "DIAMOND_HORSE_ARMOR", "LEAD", "NAME_TAG", "COMMAND_BLOCK_MINECART", "MUTTON", "COOKED_MUTTON", "BANNER", "END_CRYSTAL", "CHORUS_FRUIT", "POPPED_CHORUS_FRUIT", "BEETROOT", "BEETROOT_SEEDS", "BEETROOT_SOUP", "DRAGON_BREATH", "SPLASH_POTION", "SPECTRAL_ARROW", "TIPPED_ARROW", "LINGERING_POTION", "SHIELD", "ELYTRA", "SPRUCE_BOAT", "BIRCH_BOAT", "JUNGLE_BOAT", "ACACIA_BOAT", "DARK_OAK_BOAT", "TOTEM_OF_UNDYING", "SHULKER_SHELL", "IRON_NUGGET", "KNOWLEDGE_BOOK", "DEBUG_STICK", "MUSIC_DISC_13", "MUSIC_DISC_CAT", "MUSIC_DISC_BLOCKS", "MUSIC_DISC_CHIRP", "MUSIC_DISC_FAR", "MUSIC_DISC_MALL", "MUSIC_DISC_MELLOHI", "MUSIC_DISC_STAL", "MUSIC_DISC_STRAD", "MUSIC_DISC_WARD", "MUSIC_DISC_11", "MUSIC_DISC_WAIT"
];

const mgGrid = document.getElementById('mgGrid');
const mgRowsSelect = document.getElementById('mgRowsSelect');
const mgCurrentSlotDisplay = document.getElementById('mgCurrentSlotDisplay');
const mgPropMaterial = document.getElementById('mgPropMaterial');
const mgPropName = document.getElementById('mgPropName');
const mgPropLore = document.getElementById('mgPropLore');
const mgPropLeftCmd = document.getElementById('mgPropLeftCmd');
const mgPropRightCmd = document.getElementById('mgPropRightCmd');
const mgClearSlotBtn = document.getElementById('mgClearSlotBtn');
const mgGenerateBtn = document.getElementById('mgGenerateBtn');
const mgOutputYml = document.getElementById('mgOutputYml');
const mcMaterialsDatalist = document.getElementById('mcMaterials');

let mgSelectedSlots = [];
let mgSlotData = {}; // key: slotIndex, value: { material, name, lore, leftCmd, rightCmd }

if (mgGrid) {
  // Populate datalist
  if (mcMaterialsDatalist) {
    mcMaterialsList.forEach(mat => {
      const opt = document.createElement('option');
      opt.value = mat;
      mcMaterialsDatalist.appendChild(opt);
    });
  }

  function renderMgGrid() {
    const rows = parseInt(mgRowsSelect.value);
    const totalSlots = rows * 9;
    mgGrid.innerHTML = '';
    
    // Xóa data thừa nếu giảm row
    Object.keys(mgSlotData).forEach(key => {
      if (parseInt(key) >= totalSlots) delete mgSlotData[key];
    });

    // Remove selections out of bounds
    mgSelectedSlots = mgSelectedSlots.filter(s => s < totalSlots);

    for (let i = 0; i < totalSlots; i++) {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'mc-slot';
      if (mgSelectedSlots.includes(i)) slotDiv.classList.add('active');
      
      if (mgSlotData[i]) {
        slotDiv.classList.add('mc-slot-has-item');
        
        let matName = (mgSlotData[i].material || 'stone').toLowerCase();
        
        const img = document.createElement('img');
        img.src = `images/items/${matName}.png`;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.imageRendering = 'pixelated';
        img.style.position = 'absolute';
        img.style.top = '50%';
        img.style.left = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.zIndex = '2';
        
        const iconLabel = document.createElement('div');
        iconLabel.style.display = 'none';
        iconLabel.style.fontSize = '0.55rem';
        iconLabel.style.color = '#ffdd55';
        iconLabel.style.textAlign = 'center';
        iconLabel.style.width = '100%';
        iconLabel.style.lineHeight = '1.1';
        iconLabel.style.zIndex = '1';
        iconLabel.style.textShadow = '1px 1px 0 #000';
        
        if(matName.includes('_')) {
           let parts = matName.split('_');
           iconLabel.innerHTML = parts[0].substring(0,4) + '<br>' + (parts[1] ? parts[1].substring(0,4) : '');
        } else {
           iconLabel.innerHTML = matName.substring(0, 6).toUpperCase();
        }
        
        img.onerror = function() {
           this.style.display = 'none';
           if(this.nextElementSibling) this.nextElementSibling.style.display = 'block';
        };
        
        slotDiv.appendChild(img);
        slotDiv.appendChild(iconLabel);
      }
      
      const idxSpan = document.createElement('span');
      idxSpan.className = 'mc-slot-index';
      idxSpan.textContent = i;
      slotDiv.appendChild(idxSpan);
      
      slotDiv.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (mgSelectedSlots.includes(i)) {
            mgSelectedSlots = mgSelectedSlots.filter(s => s !== i);
          } else {
            mgSelectedSlots.push(i);
          }
        } else {
          mgSelectedSlots = [i];
        }
        
        mgSelectedSlots.sort((a,b) => a - b);
        mgCurrentSlotDisplay.textContent = mgSelectedSlots.length > 0 ? mgSelectedSlots.join(', ') : 'Trống';
        
        loadMgSlotForm(mgSelectedSlots.length > 0 ? mgSelectedSlots[0] : -1);
        renderMgGrid(); // Re-render to update active classes
      });
      
      mgGrid.appendChild(slotDiv);
    }
  }

  function loadMgSlotForm(index) {
    const data = mgSlotData[index];
    if (data) {
      mgPropMaterial.value = data.material || '';
      mgPropName.value = data.name || '';
      mgPropLore.value = data.lore ? data.lore.join('\n') : '';
      mgPropLeftCmd.value = data.leftCmd ? data.leftCmd.join('\n') : '';
      mgPropRightCmd.value = data.rightCmd ? data.rightCmd.join('\n') : '';
    } else {
      mgPropMaterial.value = '';
      mgPropName.value = '';
      mgPropLore.value = '';
      mgPropLeftCmd.value = '';
      mgPropRightCmd.value = '';
    }
  }

  function autoSaveSlots() {
    if (mgSelectedSlots.length === 0) return;
    const mat = mgPropMaterial.value.trim();
    if (!mat) return; // Không lưu nếu không có Material
    
    mgSelectedSlots.forEach(idx => {
      mgSlotData[idx] = {
        material: mat.toUpperCase(),
        name: mgPropName.value,
        lore: mgPropLore.value.split('\n').filter(l => l.trim() !== ''),
        leftCmd: mgPropLeftCmd.value.split('\n').filter(l => l.trim() !== ''),
        rightCmd: mgPropRightCmd.value.split('\n').filter(l => l.trim() !== '')
      };
    });
    renderMgGrid(); // Re-render to show item icon/name
  }

  [mgPropMaterial, mgPropName, mgPropLore, mgPropLeftCmd, mgPropRightCmd].forEach(el => {
    el.addEventListener('input', autoSaveSlots);
  });

  mgClearSlotBtn.addEventListener('click', () => {
    if (mgSelectedSlots.length === 0) return;
    mgSelectedSlots.forEach(idx => {
      delete mgSlotData[idx];
    });
    loadMgSlotForm(mgSelectedSlots.length > 0 ? mgSelectedSlots[0] : -1);
    renderMgGrid();
  });

  mgRowsSelect.addEventListener('change', renderMgGrid);

  mgGenerateBtn.addEventListener('click', () => {
    let yml = `menu_title: '&8My Custom Menu'\nopen_command: mymenu\nsize: ${parseInt(mgRowsSelect.value) * 9}\nitems:\n`;
    
    let keys = Object.keys(mgSlotData).sort((a,b) => parseInt(a) - parseInt(b));
    if (keys.length === 0) {
      mgOutputYml.value = '# Chưa có slot nào được thiết lập!';
      return;
    }
    
    keys.forEach(k => {
      const data = mgSlotData[k];
      yml += `  'item_${k}':\n`;
      yml += `    material: ${data.material}\n`;
      yml += `    slot: ${k}\n`;
      if (data.name) yml += `    display_name: '${data.name}'\n`;
      
      if (data.lore && data.lore.length > 0) {
        yml += `    lore:\n`;
        data.lore.forEach(l => yml += `    - '${l}'\n`);
      }
      
      if (data.leftCmd && data.leftCmd.length > 0) {
        yml += `    left_click_commands:\n`;
        data.leftCmd.forEach(l => yml += `    - '${l}'\n`);
      }
      
      if (data.rightCmd && data.rightCmd.length > 0) {
        yml += `    right_click_commands:\n`;
        data.rightCmd.forEach(l => yml += `    - '${l}'\n`);
      }
    });
    
    mgOutputYml.value = yml;
  });

  // Init
  renderMgGrid();
}

/* =========================================
   PLACEHOLDER API LIBRARY
========================================= */
const papiDatabase = [
  // Player
  { cat: 'Player', code: '%player_name%', desc: 'Tên hiển thị của người chơi' },
  { cat: 'Player', code: '%player_ping%', desc: 'Ping hiện tại của người chơi' },
  { cat: 'Player', code: '%player_uuid%', desc: 'Mã UUID của người chơi' },
  { cat: 'Player', code: '%player_health%', desc: 'Lượng máu hiện tại' },
  { cat: 'Player', code: '%player_max_health%', desc: 'Lượng máu tối đa' },
  { cat: 'Player', code: '%player_health_rounded%', desc: 'Máu hiện tại (làm tròn)' },
  { cat: 'Player', code: '%player_food_level%', desc: 'Mức độ no' },
  { cat: 'Player', code: '%player_level%', desc: 'Cấp độ kinh nghiệm (XP Level)' },
  { cat: 'Player', code: '%player_exp_to_level%', desc: 'XP cần để lên cấp tiếp theo' },
  { cat: 'Player', code: '%player_x%', desc: 'Tọa độ X' },
  { cat: 'Player', code: '%player_y%', desc: 'Tọa độ Y' },
  { cat: 'Player', code: '%player_z%', desc: 'Tọa độ Z' },
  { cat: 'Player', code: '%player_world%', desc: 'Tên thế giới hiện tại' },
  
  // Server
  { cat: 'Server', code: '%server_online%', desc: 'Số người chơi đang online' },
  { cat: 'Server', code: '%server_max_players%', desc: 'Giới hạn người chơi của server' },
  { cat: 'Server', code: '%server_tps_1%', desc: 'Chỉ số TPS trong 1 phút qua' },
  { cat: 'Server', code: '%server_tps_5%', desc: 'Chỉ số TPS trong 5 phút qua' },
  { cat: 'Server', code: '%server_tps_15%', desc: 'Chỉ số TPS trong 15 phút qua' },
  { cat: 'Server', code: '%server_ram_used%', desc: 'Lượng RAM đang sử dụng' },
  { cat: 'Server', code: '%server_ram_total%', desc: 'Tổng lượng RAM' },
  { cat: 'Server', code: '%server_ram_free%', desc: 'Lượng RAM còn trống' },
  { cat: 'Server', code: '%server_uptime%', desc: 'Thời gian server đã hoạt động' },

  // Vault (Economy & Permissions)
  { cat: 'Vault', code: '%vault_eco_balance%', desc: 'Số tiền hiện có (Economy)' },
  { cat: 'Vault', code: '%vault_eco_balance_formatted%', desc: 'Số tiền định dạng (VD: 1.0k, 1M)' },
  { cat: 'Vault', code: '%vault_eco_balance_fixed%', desc: 'Số tiền làm tròn 2 chữ số' },
  { cat: 'Vault', code: '%vault_rank%', desc: 'Rank (nhóm quyền) chính của người chơi' },
  { cat: 'Vault', code: '%vault_rank_capital%', desc: 'Rank chính viết hoa chữ đầu' },
  { cat: 'Vault', code: '%vault_prefix%', desc: 'Prefix nhóm quyền của người chơi' },
  { cat: 'Vault', code: '%vault_suffix%', desc: 'Suffix nhóm quyền của người chơi' },

  // Essentials
  { cat: 'Essentials', code: '%essentials_nickname%', desc: 'Biệt danh (Nick) của người chơi' },
  { cat: 'Essentials', code: '%essentials_afk%', desc: 'Trả về yes/no nếu người chơi AFK' },
  { cat: 'Essentials', code: '%essentials_godmode%', desc: 'Tình trạng Godmode (Bất tử)' },
  { cat: 'Essentials', code: '%essentials_vanished%', desc: 'Tình trạng Vanish (Tàng hình)' },

  // Math & Logic
  { cat: 'Math', code: '%math_<expression>%', desc: 'Tính toán biểu thức (VD: %math_1+1%)' },
  { cat: 'Math', code: '%math_{player_health}/2%', desc: 'Kết hợp tính toán với PAPI khác' },

  // MythicLib & MMOItems
  { cat: 'MythicLib', code: '%mythiclib_stat_attack_damage%', desc: 'Sát thương vật lý (MMO)' },
  { cat: 'MythicLib', code: '%mythiclib_stat_defense%', desc: 'Sức phòng thủ (MMO)' },
  { cat: 'MythicLib', code: '%mythiclib_stat_critical_strike_chance%', desc: 'Tỉ lệ chí mạng' },
  { cat: 'MythicLib', code: '%mythiclib_stat_critical_strike_power%', desc: 'Sát thương chí mạng' },
  { cat: 'MMOItems', code: '%mmoitems_stat_max_health%', desc: 'Máu tối đa từ MMOItems' },
  { cat: 'MMOCore', code: '%mmocore_level%', desc: 'Cấp độ MMOCore' },
  { cat: 'MMOCore', code: '%mmocore_class%', desc: 'Chức nghiệp (Class) hiện tại' },
  { cat: 'MMOCore', code: '%mmocore_mana%', desc: 'Năng lượng (Mana) hiện tại' },

  // LuckPerms
  { cat: 'LuckPerms', code: '%luckperms_primary_group_name%', desc: 'Tên nhóm quyền chính' },
  { cat: 'LuckPerms', code: '%luckperms_meta_<key>%', desc: 'Lấy giá trị Meta từ LP' },

  // Multiverse / WorldGuard
  { cat: 'World', code: '%multiverse_world_alias%', desc: 'Tên hiển thị của thế giới hiện tại' },
  { cat: 'WorldGuard', code: '%worldguard_region_name%', desc: 'Tên Region người chơi đang đứng' }
];

const papiSearchBox = document.getElementById('papiSearchBox');
const papiGrid = document.getElementById('papiGrid');
const papiPagination = document.getElementById('papiPagination');

let papiCurrentPage = 1;
const papiItemsPerPage = 12;

if (papiGrid) {
  function renderPapiList(query = '', page = 1) {
    papiGrid.innerHTML = '';
    if (papiPagination) papiPagination.innerHTML = '';
    
    const q = query.toLowerCase();
    
    const filtered = papiDatabase.filter(p => 
      p.code.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) || 
      p.cat.toLowerCase().includes(q)
    );
    
    if (filtered.length === 0) {
      papiGrid.innerHTML = '<div style="color: #ff5555; grid-column: 1 / -1; text-align: center;">Không tìm thấy Placeholder phù hợp!</div>';
      return;
    }
    
    const totalPages = Math.ceil(filtered.length / papiItemsPerPage);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    papiCurrentPage = page;
    
    const start = (page - 1) * papiItemsPerPage;
    const paginated = filtered.slice(start, start + papiItemsPerPage);
    
    paginated.forEach(p => {
      const card = document.createElement('div');
      card.className = 'papi-card';
      card.innerHTML = `
        <div class="papi-card-cat">${p.cat}</div>
        <div class="papi-card-code">${p.code}</div>
        <div class="papi-card-desc">${p.desc}</div>
        <div class="papi-copied-tooltip">✅ Đã Sao Chép!</div>
      `;
      
      card.addEventListener('click', () => {
        navigator.clipboard.writeText(p.code);
        card.classList.add('copied');
        setTimeout(() => card.classList.remove('copied'), 1500);
      });
      
      papiGrid.appendChild(card);
    });
    
    // Render pagination
    if (papiPagination && totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn--ghost';
        btn.style.padding = '6px 12px';
        if (i === papiCurrentPage) {
          btn.style.background = 'var(--accent-2)';
          btn.style.color = 'var(--text-main)';
        }
        btn.innerText = i;
        btn.addEventListener('click', () => {
          renderPapiList(papiSearchBox.value, i);
        });
        papiPagination.appendChild(btn);
      }
    }
  }

  papiSearchBox.addEventListener('input', (e) => {
    renderPapiList(e.target.value, 1);
  });
  renderPapiList();
}
/* =========================================
   MYTHICMOBS GENERATOR
========================================= */
const mmId = document.getElementById('mmId');
const mmType = document.getElementById('mmType');
const mmDisplay = document.getElementById('mmDisplay');
const mmHealth = document.getElementById('mmHealth');
const mmDamage = document.getElementById('mmDamage');
const mmArmor = document.getElementById('mmArmor');
const mmFaction = document.getElementById('mmFaction');
const mmBossBar = document.getElementById('mmBossBar');
const mmOutput = document.getElementById('mmOutput');
const mmCopyBtn = document.getElementById('mmCopyBtn');

// Options
const mmOptDespawn = document.getElementById('mmOptDespawn');
const mmOptSilent = document.getElementById('mmOptSilent');
const mmOptNoAI = document.getElementById('mmOptNoAI');
const mmOptInvincible = document.getElementById('mmOptInvincible');
const mmOptSunburn = document.getElementById('mmOptSunburn');
const mmOptCollidable = document.getElementById('mmOptCollidable');
const mmOptCombatDist = document.getElementById('mmOptCombatDist');
const mmOptAtkSpeed = document.getElementById('mmOptAtkSpeed');

// Advanced
const mmEqHead = document.getElementById('mmEqHead');
const mmEqChest = document.getElementById('mmEqChest');
const mmEqLegs = document.getElementById('mmEqLegs');
const mmEqFeet = document.getElementById('mmEqFeet');
const mmEqHand = document.getElementById('mmEqHand');
const mmEqOffhand = document.getElementById('mmEqOffhand');

// Builder Containers
const mmAIContainer = document.getElementById('mmAIContainer');
const mmBtnAddAI = document.getElementById('mmBtnAddAI');
const mmSkillsContainer = document.getElementById('mmSkillsContainer');
const mmBtnAddSkill = document.getElementById('mmBtnAddSkill');

function generateMythicMobs() {
  if (!mmOutput) return;
  const id = mmId.value.trim() || 'skeleton_king';
  const type = mmType.value.trim() || 'SKELETON';
  const display = mmDisplay.value.trim() || '&cSkeleton King';
  
  let yaml = `${id}:\n`;
  yaml += `  Type: ${type}\n`;
  yaml += `  Display: '${display}'\n`;
  yaml += `  Health: ${mmHealth.value || 100}\n`;
  yaml += `  Damage: ${mmDamage.value || 10}\n`;
  if (mmArmor.value && mmArmor.value > 0) yaml += `  Armor: ${mmArmor.value}\n`;
  if (mmFaction.value.trim()) yaml += `  Faction: ${mmFaction.value.trim()}\n`;
  
  if (mmBossBar.value === 'true') {
    yaml += `  BossBar:\n`;
    yaml += `    Enabled: true\n`;
    yaml += `    Title: '${display}'\n`;
    yaml += `    Range: 50\n`;
    yaml += `    Color: RED\n`;
    yaml += `    Style: SOLID\n`;
  }
  
  yaml += `  Options:\n`;
  yaml += `    AlwaysShowName: true\n`;
  yaml += `    MovementSpeed: 0.3\n`;
  if (mmOptDespawn.value !== 'true') yaml += `    Despawn: ${mmOptDespawn.value}\n`;
  if (mmOptSilent.value === 'true') yaml += `    Silent: true\n`;
  if (mmOptNoAI.value === 'true') yaml += `    NoAI: true\n`;
  if (mmOptInvincible.value === 'true') yaml += `    Invincible: true\n`;
  if (mmOptSunburn.value === 'true') yaml += `    PreventSunburn: true\n`;
  if (mmOptCollidable.value === 'false') yaml += `    Collidable: false\n`;
  if (mmOptCombatDist.value && mmOptCombatDist.value !== '256') yaml += `    MaxCombatDistance: ${mmOptCombatDist.value}\n`;
  if (mmOptAtkSpeed.value && mmOptAtkSpeed.value !== '1.0') yaml += `    AttackSpeed: ${mmOptAtkSpeed.value}\n`;
  
  // Equipment
  const equipment = [];
  if (mmEqHead.value.trim()) equipment.push(`  - ${mmEqHead.value.trim()} HEAD`);
  if (mmEqChest.value.trim()) equipment.push(`  - ${mmEqChest.value.trim()} CHEST`);
  if (mmEqLegs.value.trim()) equipment.push(`  - ${mmEqLegs.value.trim()} LEGS`);
  if (mmEqFeet.value.trim()) equipment.push(`  - ${mmEqFeet.value.trim()} FEET`);
  if (mmEqHand.value.trim()) equipment.push(`  - ${mmEqHand.value.trim()} HAND`);
  if (mmEqOffhand.value.trim()) equipment.push(`  - ${mmEqOffhand.value.trim()} OFFHAND`);
  
  if (equipment.length > 0) {
    yaml += `  Equipment:\n`;
    yaml += equipment.join('\n') + '\n';
  }

  // AIGoalSelectors Builder
  const aiRows = document.querySelectorAll('.ai-row');
  if (aiRows.length > 0) {
    yaml += `  AIGoalSelectors:\n`;
    if (document.getElementById('mmOptDespawn') && document.getElementById('mmOptDespawn').value === 'false') {
       // Just keeping structure clean
    }
    aiRows.forEach(row => {
      const type = row.querySelector('.ai-type').value;
      const args = row.querySelector('.ai-args').value.trim();
      if (type === 'custom') {
         if (args) yaml += `  - ${args}\n`;
      } else {
         yaml += `  - ${type}${args ? ' ' + args : ''}\n`;
      }
    });
  }

  // Skills Builder
  const skillRows = document.querySelectorAll('.skill-row');
  if (skillRows.length > 0) {
    yaml += `  Skills:\n`;
    skillRows.forEach(row => {
      const mech = row.querySelector('.sk-mech').value;
      const args = row.querySelector('.sk-args').value.trim();
      const target = row.querySelector('.sk-target').value;
      const trigger = row.querySelector('.sk-trigger').value;
      const chance = row.querySelector('.sk-chance').value.trim();
      
      let skillLine = `- `;
      if (mech === 'custom') {
         skillLine += args;
      } else {
         skillLine += `${mech}{${args}} ${target} ${trigger}`;
         if (chance) skillLine += ` ${chance}`;
      }
      yaml += `  ${skillLine}\n`;
    });
  }
  
  mmOutput.value = yaml;
}

function addAIRow() {
  if (!mmAIContainer) return;
  const row = document.createElement('div');
  row.className = 'builder-row ai-row';
  row.innerHTML = `
    <select class="cg-input ai-type" style="flex: 1 1 180px;">
      <option value="clear">clear</option>
      <option value="meleeattack">meleeattack</option>
      <option value="fleeplayers">fleeplayers</option>
      <option value="gotolocation">gotolocation</option>
      <option value="randomstroll">randomstroll</option>
      <option value="custom">Tùy chỉnh...</option>
    </select>
    <input type="text" class="cg-input ai-args" placeholder="Tham số (VD: d=5;s=1)" style="flex: 2 1 250px;">
    <button class="btn-remove-row" title="Xóa">X</button>
  `;
  
  const inputs = row.querySelectorAll('input, select');
  inputs.forEach(el => el.addEventListener('input', generateMythicMobs));
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
    generateMythicMobs();
  });
  
  mmAIContainer.appendChild(row);
  generateMythicMobs();
}

function addSkillRow() {
  if (!mmSkillsContainer) return;
  const row = document.createElement('div');
  row.className = 'builder-row skill-row';
  row.innerHTML = `
    <select class="cg-input sk-mech" style="flex: 1 1 160px;">
      <option value="skill">skill</option>
      <option value="command">command</option>
      <option value="mmodamage">mmodamage</option>
      <option value="throw">throw</option>
      <option value="effect:particles">particles</option>
      <option value="sound">sound</option>
      <option value="custom">Tùy chỉnh...</option>
    </select>
    <input type="text" class="cg-input sk-args" placeholder="Cấu hình (s=LeapBack)" style="flex: 2 1 200px;">
    <input type="text" class="cg-input sk-target" placeholder="Target (@self)" value="@self" style="flex: 1 1 120px;">
    <input type="text" class="cg-input sk-trigger" placeholder="Trigger (~onDamaged)" value="~onDamaged" style="flex: 1 1 150px;">
    <input type="text" class="cg-input sk-chance" placeholder="Tỷ lệ" style="flex: 1 1 80px;">
    <button class="btn-remove-row" title="Xóa">X</button>
  `;
  
  const inputs = row.querySelectorAll('input, select');
  inputs.forEach(el => el.addEventListener('input', generateMythicMobs));
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
    generateMythicMobs();
  });
  
  const mechSelect = row.querySelector('.sk-mech');
  const mechArgs = row.querySelector('.sk-args');
  mechSelect.addEventListener('change', () => {
    const val = mechSelect.value;
    if (val === 'sound') mechArgs.placeholder = 'VD: s=entity.zombie.ambient;v=1;p=1';
    else if (val === 'skill') mechArgs.placeholder = 'VD: s=Ten_Ky_Nang';
    else if (val === 'mmodamage') mechArgs.placeholder = 'VD: amount="<stat.attack_damage>";types=PHYSICAL';
    else if (val === 'throw') mechArgs.placeholder = 'VD: v=1.5;vY=0.5';
    else if (val === 'effect:particles') mechArgs.placeholder = 'VD: p=reddust;color=var(--text-main);a=1;size=1';
    else mechArgs.placeholder = 'Cấu hình...';
  });
  
  mmSkillsContainer.appendChild(row);
  generateMythicMobs();
}

if (mmId) {
  const mmInputs = [
    mmId, mmType, mmDisplay, mmHealth, mmDamage, mmArmor, mmFaction, mmBossBar,
    mmOptDespawn, mmOptSilent, mmOptNoAI, mmOptInvincible, mmOptSunburn, mmOptCollidable, mmOptCombatDist, mmOptAtkSpeed,
    mmEqHead, mmEqChest, mmEqLegs, mmEqFeet, mmEqHand, mmEqOffhand
  ];
  mmInputs.forEach(el => {
    if (el) {
      el.addEventListener('input', generateMythicMobs);
      el.addEventListener('change', generateMythicMobs);
    }
  });
  
  if (mmBtnAddAI) mmBtnAddAI.addEventListener('click', addAIRow);
  if (mmBtnAddSkill) mmBtnAddSkill.addEventListener('click', addSkillRow);
  
  mmCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(mmOutput.value).then(() => {
      const originalText = mmCopyBtn.innerText;
      mmCopyBtn.innerText = '✅ Đã Copy';
      setTimeout(() => { mmCopyBtn.innerText = originalText; }, 2000);
    });
  });
  
  // Initial generation
  generateMythicMobs();
}

// ==========================================
// MYTHICMOBS SKILLS GENERATOR
// ==========================================
const mmsName = document.getElementById('mmsName');
const mmsCooldown = document.getElementById('mmsCooldown');
const mmsCondContainer = document.getElementById('mmsCondContainer');
const mmsBtnAddCond = document.getElementById('mmsBtnAddCond');
const mmsMechContainer = document.getElementById('mmsMechContainer');
const mmsBtnAddMech = document.getElementById('mmsBtnAddMech');
const mmsOutput = document.getElementById('mmsOutput');
const mmsCopyBtn = document.getElementById('mmsCopyBtn');

function generateMMSkills() {
  if (!mmsOutput) return;
  const name = mmsName.value.trim() || 'CustomSkill';
  let yaml = `${name}:\n`;
  
  if (mmsCooldown.value.trim()) {
    yaml += `  Cooldown: ${mmsCooldown.value.trim()}\n`;
  }
  
  const condRows = document.querySelectorAll('.mms-cond-row');
  if (condRows.length > 0) {
    yaml += `  Conditions:\n`;
    condRows.forEach(row => {
      const cName = row.querySelector('.cond-name').value.trim();
      const cState = row.querySelector('.cond-state').value;
      if (cName) yaml += `    - ${cName} ${cState}\n`;
    });
  }
  
  const mechRows = document.querySelectorAll('.mms-mech-row');
  if (mechRows.length > 0 || condRows.length === 0) { 
    yaml += `  Skills:\n`;
    if (mechRows.length === 0) {
      yaml += `  - message{m="No skill defined"} @self\n`;
    }
    mechRows.forEach(row => {
      const mech = row.querySelector('.mech-name').value;
      const args = row.querySelector('.mech-args').value.trim();
      const target = row.querySelector('.mech-target').value.trim();
      
      if (mech === 'custom') {
         if (args) yaml += `  - ${args}\n`;
      } else {
         yaml += `  - ${mech}{${args}} ${target}\n`;
      }
    });
  }
  
  mmsOutput.value = yaml;
}

function addConditionRow() {
  if (!mmsCondContainer) return;
  const row = document.createElement('div');
  row.className = 'builder-row mms-cond-row';
  row.innerHTML = `
    <input type="text" class="cg-input cond-name" placeholder="Điều kiện (VD: onground)" style="flex: 1 1 200px;">
    <select class="cg-input cond-state" style="flex: 0 1 100px;">
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
    <button class="btn-remove-row" title="Xóa">X</button>
  `;
  const inputs = row.querySelectorAll('input, select');
  inputs.forEach(el => el.addEventListener('input', generateMMSkills));
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
    generateMMSkills();
  });
  mmsCondContainer.appendChild(row);
  generateMMSkills();
}

function addMMSkillMechanicRow() {
  if (!mmsMechContainer) return;
  const row = document.createElement('div');
  row.className = 'builder-row mms-mech-row';
  row.innerHTML = `
    <select class="cg-input mech-name" style="flex: 1 1 150px;">
      <option value="sound">sound</option>
      <option value="slash">slash</option>
      <option value="command">command</option>
      <option value="mmodamage">mmodamage</option>
      <option value="Aura">Aura</option>
      <option value="lunge">lunge</option>
      <option value="randomskill">randomskill</option>
      <option value="effect:particles">particles</option>
      <option value="custom">Tùy chỉnh...</option>
    </select>
    <input type="text" class="cg-input mech-args" placeholder="Cấu hình (VD: s=entity.illusioner...)" style="flex: 2 1 250px;">
    <input type="text" class="cg-input mech-target" placeholder="Target (@self)" value="@self" style="flex: 1 1 100px;">
    <button class="btn-remove-row" title="Xóa">X</button>
  `;
  const inputs = row.querySelectorAll('input, select');
  inputs.forEach(el => el.addEventListener('input', generateMMSkills));
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
    generateMMSkills();
  });
  
  const mechSelect = row.querySelector('.mech-name');
  const mechArgs = row.querySelector('.mech-args');
  mechSelect.addEventListener('change', () => {
    const val = mechSelect.value;
    if (val === 'sound') mechArgs.placeholder = 'VD: s=entity.zombie.ambient;v=1;p=1';
    else if (val === 'slash') mechArgs.placeholder = 'VD: y=1.5;w=5;h=4;oP=[...];oH=[...]';
    else if (val === 'mmodamage') mechArgs.placeholder = 'VD: amount="<stat.attack_damage>";types=PHYSICAL';
    else if (val === 'Aura') mechArgs.placeholder = 'VD: auraName=Buff;interval=10;duration=60';
    else if (val === 'lunge') mechArgs.placeholder = 'VD: v=1.5;vY=0.5';
    else if (val === 'effect:particles') mechArgs.placeholder = 'VD: p=reddust;color=var(--text-main);a=1;size=1';
    else mechArgs.placeholder = 'Cấu hình...';
  });
  
  mmsMechContainer.appendChild(row);
  generateMMSkills();
}

if (mmsName) {
  [mmsName, mmsCooldown].forEach(el => {
    if (el) el.addEventListener('input', generateMMSkills);
  });
  if (mmsBtnAddCond) mmsBtnAddCond.addEventListener('click', addConditionRow);
  if (mmsBtnAddMech) mmsBtnAddMech.addEventListener('click', addMMSkillMechanicRow);
  
  if (mmsCopyBtn) {
    mmsCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(mmsOutput.value).then(() => {
        const originalText = mmsCopyBtn.innerText;
        mmsCopyBtn.innerText = '✅ Đã Copy';
        setTimeout(() => { mmsCopyBtn.innerText = originalText; }, 2000);
      });
    });
  }
  generateMMSkills();
}
