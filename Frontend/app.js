const language = document.querySelector('#language');
const dialog = document.querySelector('#scan-dialog');
const scanForm = document.querySelector('#scan-form');
const imageInput = document.querySelector('#crop-image');
const preview = document.querySelector('#image-preview');
const uploadTitle = document.querySelector('#upload-title');
const uploadHelp = document.querySelector('#upload-help');
const previewSymbol = document.querySelector('#preview-symbol');
const toast = document.querySelector('#toast');
const scans = [
  { crop: 'Tomato', date: 'Today, 9:42 AM', result: 'Early blight risk', state: 'Attention', icon: '🍅' },
  { crop: 'Cotton', date: 'Yesterday, 5:18 PM', result: 'Crop looks healthy', state: 'Healthy', icon: '☘' },
  { crop: 'Potato', date: '24 Aug, 8:10 AM', result: 'Leaf moisture watch', state: 'Attention', icon: '🥔' }
];
const translations = { hi: { irrigation: 'आज मिट्टी में पर्याप्त नमी है। कल सुबह मिट्टी सूखी लगे तो जड़ों के पास हल्की सिंचाई करें।', advisory: 'अधिक नमी से पत्तियों की बीमारी फैल सकती है। बारिश के बाद निचली पत्तियों की जांच करें।' }, mr: { irrigation: 'आज जमिनीत पुरेसा ओलावा आहे. उद्या सकाळी माती कोरडी वाटल्यास मुळांजवळ हलके पाणी द्या.', advisory: 'जास्त आर्द्रतेमुळे पानांवरील रोग वाढू शकतात. पावसानंतर खालची पाने तपासा.' }, en: { irrigation: 'Soil moisture looks adequate today. If dry tomorrow morning, give light root-zone irrigation.', advisory: 'High humidity can spread leaf disease. Check lower leaves after rain.' } };

function renderScans() { document.querySelector('#scans-list').innerHTML = scans.slice(0, 3).map((scan) => `<div class="scan-row"><span class="crop-badge">${scan.icon}</span><div><b>${scan.crop} · ${scan.result}</b><small>${scan.date}</small></div><span class="status ${scan.state === 'Healthy' ? 'good' : ''}">${scan.state}</span></div>`).join(''); }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); }
function updateLanguage() { const copy = translations[language.value]; document.querySelector('#irrigation-copy').textContent = copy.irrigation; document.querySelector('#advisory-copy').textContent = copy.advisory; showToast(language.value === 'en' ? 'Guidance set to English' : 'Regional guidance updated'); }

document.querySelector('#open-scanner').onclick = () => dialog.showModal();
document.querySelector('#close-scanner').onclick = () => dialog.close();
document.querySelector('#mark-alerts').onclick = () => { document.querySelector('.alert-count').textContent = 'All read'; showToast('Alerts marked as read'); };
document.querySelector('#view-all').onclick = () => showToast('Showing your three most recent scans');
document.querySelectorAll('[data-toast]').forEach((button) => button.onclick = () => showToast(button.dataset.toast));
language.onchange = updateLanguage;
imageInput.onchange = () => { const file = imageInput.files[0]; if (!file) return; preview.src = URL.createObjectURL(file); preview.hidden = false; previewSymbol.hidden = true; uploadTitle.textContent = file.name; uploadHelp.textContent = 'Image ready for demo screening'; };
scanForm.onsubmit = (event) => { event.preventDefault(); const crop = document.querySelector('#crop').value; const icon = crop === 'Tomato' ? '🍅' : crop === 'Potato' ? '🥔' : '☘'; scans.unshift({ crop, date: 'Just now', result: crop === 'Tomato' ? 'Early blight risk' : 'Crop health check complete', state: 'Attention', icon }); renderScans(); dialog.close(); showToast('Demo health result added to recent scans'); };
renderScans();
const weatherCard = document.querySelector(".weather-card");

if (weatherCard) {

    /* ================================
       KRISHI AI — WEATHER + FIELD VFX
       ================================ */

    // Remove old VFX if it exists
    document.querySelectorAll(".krishi-vfx").forEach(el => el.remove());

    // ---------- VFX CSS ----------
    const vfxStyle = document.createElement("style");

    vfxStyle.textContent = `
    
    /* ===== BACKGROUND FIELD ===== */

    .krishi-field-vfx {
        position: fixed;
        left: 267px;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
        opacity: .30;
    }

    .krishi-field {
        position: absolute;
        left: -5%;
        right: -5%;
        bottom: -15px;
        height: 170px;
        overflow: hidden;
    }

    .crop {
        position: absolute;
        bottom: -20px;
        width: 3px;
        height: 150px;
        background: linear-gradient(
            to top,
            rgba(22,110,75,.65),
            rgba(120,170,75,.20)
        );
        transform-origin: bottom center;
        border-radius: 100%;
        animation: cropWind var(--speed) ease-in-out infinite alternate;
    }

    .crop::before,
    .crop::after {
        content: "";
        position: absolute;
        width: 45px;
        height: 7px;
        border-radius: 100%;
        background: rgba(80,150,75,.35);
    }

    .crop::before {
        left: -38px;
        top: 35px;
        transform: rotate(-18deg);
    }

    .crop::after {
        left: 0;
        top: 70px;
        transform: rotate(18deg);
    }

    @keyframes cropWind {
        0% {
            transform: rotate(-3deg) translateX(0);
        }
        50% {
            transform: rotate(5deg) translateX(5px);
        }
        100% {
            transform: rotate(-8deg) translateX(-4px);
        }
    }


    /* ===== WEATHER CARD ===== */

    .weather-vfx {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        border-radius: inherit;
        z-index: 0;
    }

    .weather-card > *:not(.weather-vfx) {
        position: relative;
        z-index: 2;
    }

    /* ===== SUN ===== */

    .vfx-sun {
        position: absolute;
        width: 85px;
        height: 85px;
        right: 25px;
        top: 25px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(255,221,95,.95) 0%,
            rgba(255,210,70,.65) 38%,
            rgba(255,210,70,.15) 70%,
            transparent 72%
        );
        box-shadow:
            0 0 25px rgba(255,211,75,.55),
            0 0 60px rgba(255,211,75,.25);
        animation: sunPulse 3s ease-in-out infinite;
    }

    .vfx-sun::before {
        content: "";
        position: absolute;
        inset: -22px;
        border-radius: 50%;
        border: 2px solid rgba(255,205,65,.25);
        animation: sunRotate 12s linear infinite;
    }

    @keyframes sunPulse {
        0%,100% {
            transform: scale(.95);
            opacity: .75;
        }
        50% {
            transform: scale(1.08);
            opacity: 1;
        }
    }

    @keyframes sunRotate {
        to {
            transform: rotate(360deg);
        }
    }


    /* ===== CLOUDS ===== */

    .vfx-cloud {
        position: absolute;
        width: 125px;
        height: 42px;
        border-radius: 50px;
        background: rgba(210,220,215,.72);
        filter: blur(.3px);
        box-shadow: 0 8px 20px rgba(30,70,55,.08);
        animation: cloudMove 12s linear infinite;
    }

    .vfx-cloud::before {
        content: "";
        position: absolute;
        width: 55px;
        height: 55px;
        left: 22px;
        bottom: 10px;
        border-radius: 50%;
        background: rgba(225,232,228,.82);
    }

    .vfx-cloud::after {
        content: "";
        position: absolute;
        width: 70px;
        height: 60px;
        right: 20px;
        bottom: 7px;
        border-radius: 50%;
        background: rgba(215,225,220,.82);
    }

    @keyframes cloudMove {
        0% {
            transform: translateX(150px);
        }
        100% {
            transform: translateX(-280px);
        }
    }


    /* ===== RAIN ===== */

    .rain-drop {
        position: absolute;
        width: 2px;
        height: 18px;
        border-radius: 100%;
        background: linear-gradient(
            to bottom,
            rgba(100,180,255,.05),
            rgba(65,150,235,.75)
        );
        animation: rainFall var(--rain-speed) linear infinite;
    }

    @keyframes rainFall {
        0% {
            transform: translateY(-30px) translateX(0);
            opacity: 0;
        }

        15% {
            opacity: .9;
        }

        100% {
            transform: translateY(430px) translateX(-35px);
            opacity: .05;
        }
    }


    /* ===== WIND PARTICLES ===== */

    .wind-line {
        position: absolute;
        width: 55px;
        height: 2px;
        border-radius: 10px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(70,130,100,.25),
            transparent
        );
        animation: windMove var(--wind-speed) linear infinite;
    }

    @keyframes windMove {
        from {
            transform: translateX(120px);
            opacity: 0;
        }

        20% {
            opacity: .7;
        }

        to {
            transform: translateX(-260px);
            opacity: 0;
        }
    }


    /* ===== WEATHER GLOW ===== */

    .weather-glow {
        position: absolute;
        inset: 0;
        background:
            radial-gradient(
                circle at 85% 15%,
                rgba(255,220,100,.15),
                transparent 35%
            );
        animation: glowMove 5s ease-in-out infinite alternate;
    }

    @keyframes glowMove {
        from {
            opacity: .4;
        }

        to {
            opacity: 1;
        }
    }


    /* keep content above VFX */

    .weather-card {
        position: relative;
        overflow: hidden;
    }

    `;

    document.head.appendChild(vfxStyle);


    // ---------- BACKGROUND FIELD ----------

    const fieldVfx = document.createElement("div");
    fieldVfx.className = "krishi-field-vfx krishi-vfx";

    const field = document.createElement("div");
    field.className = "krishi-field";

    for (let i = 0; i < 45; i++) {

        const crop = document.createElement("div");

        crop.className = "crop";

        crop.style.left = `${Math.random() * 105}%`;
        crop.style.height = `${80 + Math.random() * 90}px`;
        crop.style.setProperty(
            "--speed",
            `${2.5 + Math.random() * 2.5}s`
        );

        crop.style.animationDelay =
            `${Math.random() * -4}s`;

        field.appendChild(crop);
    }

    fieldVfx.appendChild(field);
    document.body.appendChild(fieldVfx);


    // ---------- WEATHER VFX ----------

    const weatherVfx = document.createElement("div");

    weatherVfx.className = "weather-vfx krishi-vfx";

    weatherCard.appendChild(weatherVfx);


    // Soft glow
    const glow = document.createElement("div");

    glow.className = "weather-glow";

    weatherVfx.appendChild(glow);


    // ---------- READ WEATHER ----------

    const weatherText =
        weatherCard.innerText.toLowerCase();


    // ---------- CLOUDS ----------

    const cloudCount =
        weatherText.includes("cloud")
            ? 3
            : 1;

    for (let i = 0; i < cloudCount; i++) {

        const cloud =
            document.createElement("div");

        cloud.className = "vfx-cloud";

        cloud.style.top =
            `${20 + i * 55}px`;

        cloud.style.right =
            `${-40 - i * 30}px`;

        cloud.style.animationDelay =
            `${i * -4}s`;

        cloud.style.opacity =
            `${0.45 + Math.random() * .35}`;

        weatherVfx.appendChild(cloud);
    }


    // ---------- SUN ----------

    if (
        weatherText.includes("sun") ||
        weatherText.includes("clear") ||
        weatherText.includes("partly")
    ) {

        const sun =
            document.createElement("div");

        sun.className = "vfx-sun";

        weatherVfx.appendChild(sun);
    }


    // ---------- RAIN ----------

    if (
        weatherText.includes("rain") ||
        weatherText.includes("drizzle") ||
        weatherText.includes("storm")
    ) {

        for (let i = 0; i < 35; i++) {

            const drop =
                document.createElement("div");

            drop.className = "rain-drop";

            drop.style.left =
                `${Math.random() * 100}%`;

            drop.style.top =
                `${Math.random() * -100}%`;

            drop.style.setProperty(
                "--rain-speed",
                `${.65 + Math.random() * .8}s`
            );

            drop.style.animationDelay =
                `${Math.random() * -2}s`;

            weatherVfx.appendChild(drop);
        }
    }


    // ---------- WIND ----------

    for (let i = 0; i < 12; i++) {

        const wind =
            document.createElement("div");

        wind.className = "wind-line";

        wind.style.top =
            `${20 + Math.random() * 75}%`;

        wind.style.left =
            `${Math.random() * 100}%`;

        wind.style.setProperty(
            "--wind-speed",
            `${3 + Math.random() * 3}s`
        );

        wind.style.animationDelay =
            `${Math.random() * -5}s`;

        weatherVfx.appendChild(wind);
    }


    console.log("🌾 KrishiAI Weather VFX loaded");

} // closes if(weatherCard)
