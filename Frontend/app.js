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
renderScans();

/* =====================================================
   KRISHI AI — LIVE WEATHER + ANIMATED VFX
===================================================== */

const weatherCard = document.querySelector(".weather-card");

if (weatherCard) {

    /* ---------------------------------------------
       VFX STYLES
    --------------------------------------------- */

    const style = document.createElement("style");

    style.textContent = `

        .krishi-vfx {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            border-radius: inherit;
        }

        .weather-card {
            position: relative;
            overflow: hidden;
        }

        .weather-card > *:not(.krishi-vfx) {
            position: relative;
            z-index: 5;
        }

        /* ===============================
           BACKGROUND CROPS
        =============================== */

        .field-vfx {
            position: fixed;
            left: 267px;
            right: 0;
            bottom: 0;
            height: 230px;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
            opacity: .22;
        }

        .crop {
            position: absolute;
            bottom: -30px;
            width: 4px;
            height: var(--height);
            background: linear-gradient(
                to top,
                rgba(30,110,70,.7),
                rgba(100,170,80,.15)
            );
            border-radius: 100%;
            transform-origin: bottom center;
            animation: cropWind var(--speed) ease-in-out infinite alternate;
        }

        .crop::before,
        .crop::after {
            content: "";
            position: absolute;
            width: 45px;
            height: 8px;
            border-radius: 100%;
            background: rgba(70,145,75,.45);
        }

        .crop::before {
            left: -40px;
            top: 35px;
            transform: rotate(-20deg);
        }

        .crop::after {
            left: 0;
            top: 70px;
            transform: rotate(20deg);
        }

        @keyframes cropWind {
            0% {
                transform: rotate(-4deg);
            }

            50% {
                transform: rotate(7deg);
            }

            100% {
                transform: rotate(-8deg);
            }
        }


        /* ===============================
           SUN
        =============================== */

        .weather-sun {
            position: absolute;
            width: 85px;
            height: 85px;
            right: 25px;
            top: 25px;
            border-radius: 50%;

            background:
                radial-gradient(
                    circle,
                    rgba(255,225,100,1) 0%,
                    rgba(255,215,70,.75) 35%,
                    rgba(255,215,70,.15) 70%,
                    transparent 72%
                );

            box-shadow:
                0 0 30px rgba(255,215,70,.65),
                0 0 70px rgba(255,215,70,.3);

            animation: sunPulse 3s ease-in-out infinite;
        }

        .weather-sun::before {
            content: "";
            position: absolute;
            inset: -20px;
            border: 2px solid rgba(255,215,70,.3);
            border-radius: 50%;
            animation: sunRotate 10s linear infinite;
        }

        @keyframes sunPulse {
            0%,100% {
                transform: scale(.92);
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


        /* ===============================
           CLOUD
        =============================== */

        .weather-cloud {
            position: absolute;
            width: 125px;
            height: 42px;
            border-radius: 50px;

            background: rgba(185,200,195,.72);

            box-shadow:
                0 8px 25px rgba(20,60,50,.12);

            animation: cloudMove 14s linear infinite;
        }

        .weather-cloud::before {
            content: "";
            position: absolute;
            width: 55px;
            height: 55px;
            left: 20px;
            bottom: 10px;
            border-radius: 50%;
            background: rgba(215,225,220,.85);
        }

        .weather-cloud::after {
            content: "";
            position: absolute;
            width: 65px;
            height: 58px;
            right: 18px;
            bottom: 8px;
            border-radius: 50%;
            background: rgba(205,218,213,.85);
        }

        @keyframes cloudMove {
            from {
                transform: translateX(170px);
            }

            to {
                transform: translateX(-320px);
            }
        }


        /* ===============================
           RAIN
        =============================== */

        .weather-rain {
            position: absolute;
            width: 2px;
            height: 20px;

            background: linear-gradient(
                to bottom,
                transparent,
                rgba(60,150,240,.85)
            );

            border-radius: 50%;

            animation:
                rainFall var(--rain-speed)
                linear infinite;
        }

        @keyframes rainFall {

            0% {
                transform:
                    translateY(-40px)
                    translateX(0);

                opacity: 0;
            }

            15% {
                opacity: .9;
            }

            100% {
                transform:
                    translateY(500px)
                    translateX(-45px);

                opacity: 0;
            }
        }


        /* ===============================
           WIND LINES
        =============================== */

        .weather-wind {
            position: absolute;

            width: 65px;
            height: 2px;

            background: linear-gradient(
                90deg,
                transparent,
                rgba(80,150,110,.28),
                transparent
            );

            animation:
                windMove var(--wind-speed)
                linear infinite;
        }

        @keyframes windMove {

            from {
                transform: translateX(150px);
                opacity: 0;
            }

            20% {
                opacity: .7;
            }

            to {
                transform: translateX(-300px);
                opacity: 0;
            }
        }


        /* ===============================
           WEATHER GLOW
        =============================== */

        .weather-glow {
            position: absolute;
            inset: 0;

            background:
                radial-gradient(
                    circle at 85% 15%,
                    rgba(255,220,100,.18),
                    transparent 40%
                );

            animation:
                glowPulse 5s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {

            from {
                opacity: .4;
            }

            to {
                opacity: 1;
            }
        }

    `;

    document.head.appendChild(style);


    /* =====================================================
       BACKGROUND FIELD
    ===================================================== */

    const fieldVfx = document.createElement("div");

    fieldVfx.className = "field-vfx krishi-vfx";

    for (let i = 0; i < 55; i++) {

        const crop = document.createElement("div");

        crop.className = "crop";

        crop.style.left =
            `${Math.random() * 105}%`;

        crop.style.setProperty(
            "--height",
            `${90 + Math.random() * 130}px`
        );

        crop.style.setProperty(
            "--speed",
            `${2 + Math.random() * 2.5}s`
        );

        crop.style.animationDelay =
            `${Math.random() * -4}s`;

        fieldVfx.appendChild(crop);
    }

    document.body.appendChild(fieldVfx);


    /* =====================================================
       WEATHER VFX CONTAINER
    ===================================================== */

    const weatherVfx =
        document.createElement("div");

    weatherVfx.className =
        "krishi-vfx";

    weatherVfx.style.zIndex = "1";

    weatherCard.appendChild(weatherVfx);


    /* =====================================================
       LIVE WEATHER
    ===================================================== */

    async function loadWeather() {

        try {

            console.log("🌦️ Loading live weather...");

            const response =
                await fetch(
                    "http://localhost:5000/api/weather"
                );

            if (!response.ok) {
                throw new Error(
                    `Weather request failed: ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(
                "🌦️ LIVE WEATHER:",
                data
            );


            if (
                !data.success ||
                !data.weather
            ) {
                throw new Error(
                    "Invalid weather data"
                );
            }


            const weather =
                data.weather;


            /* =========================================
               SAVE WEATHER DATA
            ========================================= */

            const condition =
                weather.condition.toLowerCase();

            const temperature =
                weather.temperature;

            const feelsLike =
                weather.feelsLike;

            const humidity =
                weather.humidity;

            const wind =
                weather.windSpeed;

            const rainChance =
                weather.rainChance;


            console.log(
                `🌡️ ${temperature}°C | ${condition}`
            );


            /* =========================================
               UPDATE WEATHER TEXT
            ========================================= */

            const allText =
                weatherCard.querySelectorAll(
                    "p, span, strong, b, div"
                );


            /*
             * Find the large temperature element.
             * We don't destroy your existing layout.
             */

            let temperatureElement = null;

            allText.forEach(element => {

                const text =
                    element.textContent.trim();

                if (
                    /^\d+(\.\d+)?°$/.test(text)
                ) {
                    temperatureElement =
                        element;
                }

            });


            if (temperatureElement) {

                temperatureElement.textContent =
                    `${Math.round(temperature)}°`;

            }


            /* =========================================
               UPDATE CONDITION TEXT
            ========================================= */

            allText.forEach(element => {

                const text =
                    element.textContent.trim()
                        .toLowerCase();

                if (
                    text === "partly cloudy" ||
                    text === "cloudy" ||
                    text === "clear" ||
                    text === "rain" ||
                    text === "drizzle" ||
                    text === "rain showers"
                ) {

                    element.textContent =
                        weather.condition;

                }

            });


            /* =========================================
               CLEAR OLD WEATHER VFX
            ========================================= */

            weatherVfx.innerHTML = "";


            /* =========================================
               GLOW
            ========================================= */

            const glow =
                document.createElement("div");

            glow.className =
                "weather-glow";

            weatherVfx.appendChild(glow);


            /* =========================================
               CLOUDS
            ========================================= */

            if (
                condition.includes("cloud")
            ) {

                for (let i = 0; i < 3; i++) {

                    const cloud =
                        document.createElement("div");

                    cloud.className =
                        "weather-cloud";

                    cloud.style.top =
                        `${25 + i * 55}px`;

                    cloud.style.right =
                        `${-50 - i * 40}px`;

                    cloud.style.animationDelay =
                        `${i * -4}s`;

                    weatherVfx.appendChild(
                        cloud
                    );

                }

            }


            /* =========================================
               SUN
            ========================================= */

            if (
                condition.includes("clear") ||
                condition.includes("partly")
            ) {

                const sun =
                    document.createElement("div");

                sun.className =
                    "weather-sun";

                weatherVfx.appendChild(
                    sun
                );

            }


            /* =========================================
               RAIN
            ========================================= */

            if (
                condition.includes("rain") ||
                condition.includes("drizzle") ||
                condition.includes("storm")
            ) {

                for (
                    let i = 0;
                    i < 45;
                    i++
                ) {

                    const drop =
                        document.createElement(
                            "div"
                        );

                    drop.className =
                        "weather-rain";

                    drop.style.left =
                        `${Math.random() * 100}%`;

                    drop.style.top =
                        `${Math.random() * -100}%`;

                    drop.style.setProperty(
                        "--rain-speed",
                        `${.55 + Math.random() * .7}s`
                    );

                    drop.style.animationDelay =
                        `${Math.random() * -2}s`;

                    weatherVfx.appendChild(
                        drop
                    );

                }

            }


            /* =========================================
               WIND
            ========================================= */

            const windCount =
                Math.min(
                    18,
                    Math.max(
                        6,
                        Math.round(wind / 2)
                    )
                );


            for (
                let i = 0;
                i < windCount;
                i++
            ) {

                const line =
                    document.createElement(
                        "div"
                    );

                line.className =
                    "weather-wind";

                line.style.top =
                    `${10 + Math.random() * 85}%`;

                line.style.left =
                    `${Math.random() * 100}%`;

                line.style.setProperty(
                    "--wind-speed",
                    `${2 + Math.random() * 3}s`
                );

                line.style.animationDelay =
                    `${Math.random() * -4}s`;

                weatherVfx.appendChild(
                    line
                );

            }


            /* =========================================
               DEBUG
            ========================================= */

            console.log(
                "🌾 KrishiAI weather VFX:",
                condition
            );

        }

        catch (error) {

            console.error(
                "❌ Weather error:",
                error
            );

        }

    }


    /* Load immediately */
    loadWeather();


    /* Refresh every 10 minutes */
    setInterval(
        loadWeather,
        10 * 60 * 1000
    );

}