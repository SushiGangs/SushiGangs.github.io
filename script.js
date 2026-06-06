/**
 * SushiGang Studio Logic - Single Page Application (SPA)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    initCoreUI();
    initPageLogics();
    initRouter();
    triggerStaggerAnimations();

});

// --- CORE UI (Sidebar, Modals, TOC) ---
function initCoreUI() {
    // --- Elements ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');

    // --- Sidebar Toggle (Mobile) ---
    if (sidebarToggle && !sidebarToggle.dataset.initialized) {
        sidebarToggle.dataset.initialized = "true";
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // --- Login Modal Logic ---
    if (loginModal && !loginModal.dataset.initialized) {
        loginModal.dataset.initialized = "true";
        const openLoginModal = () => {
            loginModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const closeLoginModal = () => {
            loginModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
        if (closeModal) closeModal.addEventListener('click', closeLoginModal);
        
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
                closeLoginModal();
            }
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Chào mừng, ${username}!`;
                    submitBtn.style.background = '#00C851';
                    
                    setTimeout(() => {
                        closeLoginModal();
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        loginForm.reset();
                    }, 1500);
                }, 1000);
            });
        }
    }

    // --- Sidebar Section Toggles ---
    const sectionHeaders = document.querySelectorAll('.nav-section-header');
    sectionHeaders.forEach(header => {
        if (header.dataset.initialized) return;
        header.dataset.initialized = "true";
        header.addEventListener('click', () => {
            const toggleBtn = header.querySelector('.nav-section-toggle');
            const items = header.nextElementSibling;
            if (toggleBtn && items) {
                toggleBtn.classList.toggle('collapsed');
                items.classList.toggle('collapsed');
            }
        });
    });

    const subSectionToggles = document.querySelectorAll('.nav-subsection-toggle');
    subSectionToggles.forEach(toggle => {
        if (toggle.dataset.initialized) return;
        toggle.dataset.initialized = "true";
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const items = toggle.parentElement.nextElementSibling;
            if (items && items.classList.contains('nav-subsection-items')) {
                toggle.classList.toggle('collapsed');
                items.classList.toggle('collapsed');
            }
        });
    });

    initTOCLogic();
}

function initTOCLogic() {
    const tocToggleBtn = document.querySelector('.toc-toggle-btn');
    const tocListWrapper = document.querySelector('.toc-list-wrapper');
    if (tocToggleBtn && tocListWrapper) {
        // Remove existing listener to avoid duplicates during SPA navigation
        const newBtn = tocToggleBtn.cloneNode(true);
        tocToggleBtn.parentNode.replaceChild(newBtn, tocToggleBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newBtn.classList.toggle('collapsed');
            tocListWrapper.classList.toggle('collapsed');
        });

        const tocHeader = document.querySelector('.toc-header');
        if (tocHeader) {
            const newHeader = tocHeader.cloneNode(true);
            tocHeader.parentNode.replaceChild(newHeader, tocHeader);
            newHeader.addEventListener('click', () => {
                newBtn.classList.toggle('collapsed');
                tocListWrapper.classList.toggle('collapsed');
            });
        }
    }
}

// --- PAGE SPECIFIC LOGIC ---
function initPageLogics() {
    initSymbolsLogic();
    initSmallCapLogic();
}

function initSymbolsLogic() {
    const symbolsGrid = document.getElementById('symbols-grid');
    if (!symbolsGrid || symbolsGrid.dataset.initialized) return;
    symbolsGrid.dataset.initialized = "true";

    const rawSymbols = `☠ ☮ ☯ ♠ Ω ♤ ♣ ♧ ♥ ♡ ♦ ♢ ♔ ♕ ♚ ♛ ⚜ ★ ☆ ✮ ✯ ☄ ☾ ☽ ☼ ☀ ☁ ☂ ☃ ☻ ☺ ☹ ۞ ۩εїз Ƹ̵̡Ӝ̵̨̄Ʒ ξЖЗ εжз ☎ ☏ ¢ ☚ ☛ ☜ ☝ ☞ ☟ ✍ ✌ ☢ ☣ ♨ ๑ ❀ ✿ ψ ♆ ☪ ♪ ♩ ♫ ♬ ✄ ✂ ✆ ✉ ✦ ✧♱ ♰ ∞ ♂ ♀ ☿ ❤ ❥ ❦ ❧ ™ ® © ✖ ✗ ✘ ♒ ■ □ ▢ ▲ △ ▼ ▽ ◆ ◇ ○ ◎ ● ◯ Δ ◕ ◔ʊ ϟ ღ ツ 回 ₪ ™ © ® ¿ ¡ ½ ⅓ ⅔ ¼ ¾ ⅛ ⅜ ⅝ ⅞ ℅ № ⇨ ❝ ❞ # & ℃∃ ∧ ∠ ∨ ∩ ⊂ ⊃ ∪ ⊥ ∀ Ξ Γ ɐ ə ɘ ε β ɟ ɥ ɯ ɔ и ๏ ɹ ʁ я ʌ ʍ λ ч ∞ Σ Π➀ ➁ ➂ ➃ ➄ ➅ ➆ ➇ ➈ ➉Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ {｡^◕‿◕^} (◕^^◕) ✖✗✘♒♬✄ ✆✦✧♱♰♂♀☿❤❥❦❧ ™®©♡♦♢♔♕♚♛★ ☆✮ ✯☄☾☽ ☼☀☁☂☃☻ ☺☹ ☮۞۩ εїз☎☏¢ ☚☛☜☝☞☟✍ ✌☢☣☠☮☯ ♠♤♣♧♥ ♨๑❀✿ ψ☪☭♪ ♩♫℘ℑ ℜℵ♏ηα ʊϟღツ回 ₪™ ©®¿¡½⅓ ⅔¼¾⅛⅜⅝⅞℅ №⇨❝❞ ◠◡╭╮╯╰ ★☆⊙¤㊣ ★☆♀◆◇ ▆▇██■ ▓回□〓≡ ╝╚╔╗╬ ═╓╩ ┠┨┯┷┏ ┓┗┛┳⊥ ﹃﹄┌ ┐└┘∟「 」↑↓→ ←↘↙♀ ♂┇┅﹉﹊ ﹍﹎╭╮╰╯ *^_^* ^*^ ^-^ ^_^ ^︵^ ∵∴‖ ︱︳︴﹏ ﹋﹌♂♀ ♥♡☜☞☎ ☏⊙◎☺☻ ►◄▧▨ ♨◐◑↔↕ ▪▫☼♦▀ ▄█▌▐ ░▒▬♦◊ ◦☼♠♣▣ ▤▥▦▩ ぃ◘◙◈♫ ♬♪♩♭♪ の☆→あ ￡❤｡◕‿◕｡✎✟ஐ ≈๑۩۩.. ..۩۩๑ ๑۩۞۩๑ ✲❈➹ ~.~ ◕‿-｡ ☀☂☁ 【】┱┲❣ ✚✪✣ ✤✥ ✦❉ ❥❦❧❃ ❂❁❀✄☪ ☣☢☠☭♈ ✓✔✕ ✖㊚㊛ *.:｡ ✿*ﾟ‘ﾟ･ ⊙¤㊣★☆ ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ ⊮ ⊯ ⊰ ⊱ ⊲ ⊳ ⊴ ⊵ ⊶ ⊷ ⊸ ⊹ ⊺ ⊻ ⊼ ⊽ ⊾ ⊿ ⋀ ⋁ ⋂ ⋃ ⋄ ⋅ ⋆ ⋇ ⋈ ⋉ ⋊ ⋋ ⋌ ⋍ ⋎ ⋏ ⋐ ⋑ ⋒ ⋓ ⋔ ⋕ ⋖ ⋗ ⋘ ⋙ ⋚ ⋛ ⋜ ⋝ ⋞ ⋟ ⋠ ⋡ ⋢ ⋣ ⋤ ⋥ ⋦ ⋧ ⋨ ⋩ ⋪ ⋫ ⋬ ⋭ ⋮ ⋯ ⋰ ⋱ ⋲ ⋳ ⋴ ⋵ ⋶ ⋷ ⋸ ⋹ ⋺ ⋻ ⋼ ⋽ ⋾ ⋿ ⌀ ⌁ ⌂ ⌃ ⌄ ⌅ ⌆ ⌇ ⌈ ⌉ ⌊ ⌋`;
    
    const parts = rawSymbols.replace(/\n/g, ' ').split(/\s+/).filter(s => s.trim() !== '');
    let finalSymbols = [];
    parts.forEach(p => {
        if (p.length > 1 && !/[\^_\~\(\)\{\}\[\]\.\:【】\-\*]/.test(p)) {
            finalSymbols.push(...Array.from(p));
        } else {
            finalSymbols.push(p);
        }
    });
    
    const uniqueSymbols = [...new Set(finalSymbols)];
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    const showToast = (message) => {
        if(toastMessage) toastMessage.textContent = message;
        if(toast) toast.classList.remove('hidden');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            if(toast) toast.classList.add('hidden');
        }, 2500);
    };

    const renderSymbols = (symbols) => {
        symbolsGrid.innerHTML = '';
        symbols.forEach(sym => {
            const div = document.createElement('div');
            div.className = 'symbol-card stagger-item';
            div.textContent = sym;
            div.title = "Nhấp để sao chép";
            div.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(sym);
                    showToast(`Đã sao chép: ${sym}`);
                } catch (err) {
                    const textArea = document.createElement("textarea");
                    textArea.value = sym;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    showToast(`Đã sao chép: ${sym}`);
                }
            });
            symbolsGrid.appendChild(div);
        });
    };

    renderSymbols(uniqueSymbols);

    const searchInput = document.getElementById('symbol-search');
    if (searchInput) {
        const newSearch = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearch, searchInput);
        newSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = uniqueSymbols.filter(s => s.toLowerCase().includes(term));
            renderSymbols(filtered);
        });
    }
}

function initSmallCapLogic() {
    const smallcapInput = document.getElementById('smallcap-input');
    const smallcapOutput = document.getElementById('smallcap-output');
    const copySmallcapBtn = document.getElementById('copy-smallcap-btn');

    if (smallcapInput && smallcapOutput && !smallcapInput.dataset.initialized) {
        smallcapInput.dataset.initialized = "true";
        const smallCapsMap = {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
            'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
            's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
        };

        const convertToSmallCaps = (text) => {
            return text.split('').map(char => {
                const lowerChar = char.toLowerCase();
                if (lowerChar >= 'a' && lowerChar <= 'z') {
                    return smallCapsMap[lowerChar] || char;
                }
                return char;
            }).join('');
        };

        const newInput = smallcapInput.cloneNode(true);
        smallcapInput.parentNode.replaceChild(newInput, smallcapInput);
        newInput.addEventListener('input', (e) => {
            smallcapOutput.value = convertToSmallCaps(e.target.value);
        });

        if (copySmallcapBtn) {
            const newBtn = copySmallcapBtn.cloneNode(true);
            copySmallcapBtn.parentNode.replaceChild(newBtn, copySmallcapBtn);
            newBtn.addEventListener('click', async () => {
                const textToCopy = smallcapOutput.value;
                if (!textToCopy) return;

                const toast = document.getElementById('toast');
                const toastMessage = document.getElementById('toast-message');
                let toastTimeout;

                const showToast = (message) => {
                    if(toastMessage) toastMessage.textContent = message;
                    if(toast) toast.classList.remove('hidden');
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        if(toast) toast.classList.add('hidden');
                    }, 2500);
                };

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showToast('Đã sao chép toàn bộ!');
                } catch (err) {
                    smallcapOutput.select();
                    document.execCommand('copy');
                    showToast('Đã sao chép toàn bộ!');
                }
            });
        }
    }
}

// --- SPA ROUTER & ANIMATIONS ---
let currentPath = window.location.pathname;

function initRouter() {
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return; // Ignore external links & anchors

        e.preventDefault();
        navigateTo(href);
    });

    window.addEventListener('popstate', () => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            navigateTo(window.location.pathname.split('/').pop() || 'index.html', false);
        }
    });
}

async function navigateTo(url, pushState = true) {
    const mainContent = document.querySelector('main.main-content');
    if (!mainContent) return;

    // Start exit animation
    mainContent.classList.add('page-fade-out');

    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract new main content
        const newMain = doc.querySelector('main.main-content');
        const newTitle = doc.title;

        if (newMain) {
            // Update History
            if (pushState) {
                history.pushState(null, newTitle, url);
                currentPath = window.location.pathname;
            }
            document.title = newTitle;

            // Wait for fade out
            setTimeout(() => {
                mainContent.innerHTML = newMain.innerHTML;
                
                // Re-initialize logic
                initTOCLogic();
                initPageLogics();
                updateNavigationState(url);
                triggerStaggerAnimations();

                // Start enter animation
                mainContent.classList.remove('page-fade-out');
                mainContent.classList.add('page-fade-in');
                
                setTimeout(() => {
                    mainContent.classList.remove('page-fade-in');
                }, 400); // match CSS transition duration
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300); // slight delay for smooth fade
        }
    } catch (err) {
        console.error("Lỗi khi tải trang:", err);
        window.location.href = url; // Fallback
    }
}

function updateNavigationState(url) {
    const filename = url.split('?')[0].split('#')[0] || 'index.html';

    // Update Sidebar
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.nav-links a, .nav-subsection-header a').forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === filename) {
            a.classList.add('active');
            if (a.parentElement.tagName === 'LI') {
                a.parentElement.classList.add('active');
            }
        }
    });

    // Update Topbar
    document.querySelectorAll('.topbar-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === filename) {
            link.classList.add('active');
        } else if (filename.startsWith('sushilib') && link.getAttribute('href').startsWith('sushilib')) {
            link.classList.add('active'); // Keep SushiLib active if browsing subpages
        }
    });
}

function triggerStaggerAnimations() {
    const itemsToStagger = document.querySelectorAll('.mechanic-card, .landing-card, .module-card');
    itemsToStagger.forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.animationDelay = `${index * 0.1}s`;
    });
}
