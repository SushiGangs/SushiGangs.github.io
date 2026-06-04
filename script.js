/**
 * SushiGang Studio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');

    // --- Sidebar Toggle (Mobile) ---
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // --- Login Modal Logic ---
    const openLoginModal = () => {
        loginModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLoginModal = () => {
        loginModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeLoginModal);
    }

    // Close modal when clicking outside of it
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal && !loginModal.classList.contains('hidden')) {
            closeLoginModal();
        }
    });

    // Handle form submission (Mock)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            
            // Mock authentication success
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...';
            
            setTimeout(() => {
                submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Chào mừng, ${username}!`;
                submitBtn.style.background = '#00C851'; // Green for success
                
                setTimeout(() => {
                    closeLoginModal();
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    loginForm.reset();
                }, 1500);
            }, 1000);
        });
    }

    // Add active state to sidebar links for demo purposes (only for # links)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
                this.parentElement.classList.add('active');
            }
        });
    });

    // --- Symbols Page Logic ---
    const symbolsGrid = document.getElementById('symbols-grid');
    if (symbolsGrid) {
        const rawSymbols = `☠ ☮ ☯ ♠ Ω ♤ ♣ ♧ ♥ ♡ ♦ ♢ ♔ ♕ ♚ ♛ ⚜ ★ ☆ ✮ ✯ ☄ ☾ ☽ ☼ ☀ ☁ ☂ ☃ ☻ ☺ ☹ ۞ ۩εїз Ƹ̵̡Ӝ̵̨̄Ʒ ξЖЗ εжз ☎ ☏ ¢ ☚ ☛ ☜ ☝ ☞ ☟ ✍ ✌ ☢ ☣ ♨ ๑ ❀ ✿ ψ ♆ ☪ ♪ ♩ ♫ ♬ ✄ ✂ ✆ ✉ ✦ ✧♱ ♰ ∞ ♂ ♀ ☿ ❤ ❥ ❦ ❧ ™ ® © ✖ ✗ ✘ ♒ ■ □ ▢ ▲ △ ▼ ▽ ◆ ◇ ○ ◎ ● ◯ Δ ◕ ◔ʊ ϟ ღ ツ 回 ₪ ™ © ® ¿ ¡ ½ ⅓ ⅔ ¼ ¾ ⅛ ⅜ ⅝ ⅞ ℅ № ⇨ ❝ ❞ # & ℃∃ ∧ ∠ ∨ ∩ ⊂ ⊃ ∪ ⊥ ∀ Ξ Γ ɐ ə ɘ ε β ɟ ɥ ɯ ɔ и ๏ ɹ ʁ я ʌ ʍ λ ч ∞ Σ Π➀ ➁ ➂ ➃ ➄ ➅ ➆ ➇ ➈ ➉Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ {｡^◕‿◕^} (◕^^◕) ✖✗✘♒♬✄ ✆✦✧♱♰♂♀☿❤❥❦❧ ™®©♡♦♢♔♕♚♛★ ☆✮ ✯☄☾☽ ☼☀☁☂☃☻ ☺☹ ☮۞۩ εїз☎☏¢ ☚☛☜☝☞☟✍ ✌☢☣☠☮☯ ♠♤♣♧♥ ♨๑❀✿ ψ☪☭♪ ♩♫℘ℑ ℜℵ♏ηα ʊϟღツ回 ₪™ ©®¿¡½⅓ ⅔¼¾⅛⅜⅝⅞℅ №⇨❝❞ ◠◡╭╮╯╰ ★☆⊙¤㊣ ★☆♀◆◇ ▆▇██■ ▓回□〓≡ ╝╚╔╗╬ ═╓╩ ┠┨┯┷┏ ┓┗┛┳⊥ ﹃﹄┌ ┐└┘∟「 」↑↓→ ←↘↙♀ ♂┇┅﹉﹊ ﹍﹎╭╮╰╯ *^_^* ^*^ ^-^ ^_^ ^︵^ ∵∴‖ ︱︳︴﹏ ﹋﹌♂♀ ♥♡☜☞☎ ☏⊙◎☺☻ ►◄▧▨ ♨◐◑↔↕ ▪▫☼♦▀ ▄█▌▐ ░▒▬♦◊ ◦☼♠♣▣ ▤▥▦▩ ぃ◘◙◈♫ ♬♪♩♭♪ の☆→あ ￡❤｡◕‿◕｡✎✟ஐ ≈๑۩۩.. ..۩۩๑ ๑۩۞۩๑ ✲❈➹ ~.~ ◕‿-｡ ☀☂☁ 【】┱┲❣ ✚✪✣ ✤✥ ✦❉ ❥❦❧❃ ❂❁❀✄☪ ☣☢☠☭♈ ✓✔✕ ✖㊚㊛ *.:｡ ✿*ﾟ‘ﾟ･ ⊙¤㊣★☆ ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ ⊮ ⊯ ⊰ ⊱ ⊲ ⊳ ⊴ ⊵ ⊶ ⊷ ⊸ ⊹ ⊺ ⊻ ⊼ ⊽ ⊾ ⊿ ⋀ ⋁ ⋂ ⋃ ⋄ ⋅ ⋆ ⋇ ⋈ ⋉ ⋊ ⋋ ⋌ ⋍ ⋎ ⋏ ⋐ ⋑ ⋒ ⋓ ⋔ ⋕ ⋖ ⋗ ⋘ ⋙ ⋚ ⋛ ⋜ ⋝ ⋞ ⋟ ⋠ ⋡ ⋢ ⋣ ⋤ ⋥ ⋦ ⋧ ⋨ ⋩ ⋪ ⋫ ⋬ ⋭ ⋮ ⋯ ⋰ ⋱ ⋲ ⋳ ⋴ ⋵ ⋶ ⋷ ⋸ ⋹ ⋺ ⋻ ⋼ ⋽ ⋾ ⋿ ⌀ ⌁ ⌂ ⌃ ⌄ ⌅ ⌆ ⌇ ⌈ ⌉ ⌊ ⌋`;
        
        // Clean and split the symbols
        const parts = rawSymbols.replace(/\n/g, ' ').split(/\s+/).filter(s => s.trim() !== '');
        
        let finalSymbols = [];
        parts.forEach(p => {
            // Check if the part is a kaomoji/emoticon by looking for typical punctuation.
            // If it DOES NOT contain any of these characters, and length > 1, we split it into individual characters.
            if (p.length > 1 && !/[\^_\~\(\)\{\}\[\]\.\:【】\-\*]/.test(p)) {
                finalSymbols.push(...Array.from(p));
            } else {
                finalSymbols.push(p);
            }
        });
        
        // Remove duplicates while preserving order
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

        // Render to grid
        const renderSymbols = (symbols) => {
            symbolsGrid.innerHTML = '';
            symbols.forEach(sym => {
                const div = document.createElement('div');
                div.className = 'symbol-card';
                div.textContent = sym;
                div.title = "Nhấp để sao chép";
                
                div.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(sym);
                        showToast(`Đã sao chép: ${sym}`);
                    } catch (err) {
                        // Fallback
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

        // Search functionality
        const searchInput = document.getElementById('symbol-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = uniqueSymbols.filter(s => s.toLowerCase().includes(term));
                renderSymbols(filtered);
            });
        }
    }

    // --- SmallCap Tool Logic ---
    const smallcapInput = document.getElementById('smallcap-input');
    const smallcapOutput = document.getElementById('smallcap-output');
    const copySmallcapBtn = document.getElementById('copy-smallcap-btn');

    if (smallcapInput && smallcapOutput) {
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

        smallcapInput.addEventListener('input', (e) => {
            smallcapOutput.value = convertToSmallCaps(e.target.value);
        });

        if (copySmallcapBtn) {
            copySmallcapBtn.addEventListener('click', async () => {
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
});
