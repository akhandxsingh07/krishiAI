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
