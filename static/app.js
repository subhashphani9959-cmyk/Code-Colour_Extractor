document.getElementById('upload-form').onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Show image preview
    const fileInput = document.getElementById('image');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        previewContainer.style.display = 'none';
    }
    const response = await fetch('/', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    renderPalette(data.palette);
    renderGradient(data.gradient);
    renderCSS(data.css);
};

function renderPalette(palette) {
    const paletteDiv = document.getElementById('palette-result');
    paletteDiv.innerHTML = '<h2><span class="icon">🌈</span> Color Palette</h2>' +
        '<div class="palette-row">' +
        palette.map((color, i) => `<div class="palette-color" style="background:${color}" title="${color}"></div>`).join('') +
        '</div>' +
        '<div class="palette-labels">' + palette.map((color, i) => `<span class="palette-label">${color} <button class="copy-btn" onclick="copyHex('${color}')" title="Copy"><span class="icon">📋</span></button></span>`).join(' ') + '</div>';
    paletteDiv.classList.add('fade-in');
    setTimeout(() => paletteDiv.classList.remove('fade-in'), 700);
}

window.copyHex = function(hex) {
    navigator.clipboard.writeText(hex);
}

function renderGradient(gradient) {
    const gradientDiv = document.getElementById('gradient-result');
    gradientDiv.innerHTML = `<h2><span class="icon">🟪</span> Gradient Theme</h2><div class="gradient-box" style="background: ${gradient}"></div><span class="gradient-label">${gradient}</span>`;
    gradientDiv.classList.add('fade-in');
    setTimeout(() => gradientDiv.classList.remove('fade-in'), 700);
}

function renderCSS(css) {
    const cssDiv = document.getElementById('css-result');
    cssDiv.innerHTML = `<h2><span class="icon">💾</span> Download CSS</h2>
        <pre class="css-code" id="css-code-block">${css}</pre>
        <button class="download-btn" onclick="downloadCSS()"><span class="icon">⬇️</span> Download CSS</button>`;
    cssDiv.classList.add('fade-in');
    setTimeout(() => cssDiv.classList.remove('fade-in'), 700);
}

window.downloadCSS = function() {
    const css = document.getElementById('css-code-block').textContent;
    const blob = new Blob([css], { type: 'text/css' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'palette.css';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
