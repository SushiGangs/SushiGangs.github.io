const fs = require('fs');
const https = require('https');
const path = require('path');

const jsContent = fs.readFileSync('script.js', 'utf8');
const match = jsContent.match(/const mcMaterialsList = \[\s*([\s\S]*?)\s*\];/);
if (!match) {
    console.error("Could not find list");
    process.exit(1);
}

const items = match[1].replace(/"/g, '').split(',').map(s => s.trim()).filter(Boolean);
console.log(`Found ${items.length} items to download`);

const dir = path.join(__dirname, 'images', 'items');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`Status ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        });
        req.on('error', reject);
    });
}

async function run() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i].toLowerCase();
        const url1 = `https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/item/${item}.png`;
        const url2 = `https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/block/${item}.png`;
        const dest = path.join(dir, `${item}.png`);
        
        try {
            await downloadFile(url1, dest);
            // console.log(`Downloaded ${item} (item)`);
        } catch (e) {
            try {
                await downloadFile(url2, dest);
                // console.log(`Downloaded ${item} (block)`);
            } catch (e2) {
                console.log(`Failed ${item}`);
            }
        }
    }
    console.log("Download complete!");
}

run();
