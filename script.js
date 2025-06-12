class CaptionStyleGenerator {
    constructor() {
        this.currentPosition = 'bottom_center';
        this.initializeElements();
        this.bindEvents();
        this.updatePreview();
    }

    initializeElements() {
        // Input elements
        this.textInput = document.getElementById('text-input');
        this.fontSize = document.getElementById('font-size');
        this.fontColor = document.getElementById('font-color');
        this.fontColorText = document.getElementById('font-color-text');
        this.enableBox = document.getElementById('enable-box');
        this.boxColor = document.getElementById('box-color');
        this.boxColorText = document.getElementById('box-color-text');
        this.boxOpacity = document.getElementById('box-opacity');
        this.boxBorder = document.getElementById('box-border');
        this.boxWidth = document.getElementById('box-width');
        this.boxPadding = document.getElementById('box-padding');

        // Display elements
        this.fontSizeValue = document.getElementById('font-size-value');
        this.boxOpacityValue = document.getElementById('box-opacity-value');
        this.boxBorderValue = document.getElementById('box-border-value');
        this.boxWidthValue = document.getElementById('box-width-value');
        this.boxPaddingValue = document.getElementById('box-padding-value');
        this.captionPreview = document.getElementById('caption-preview');
        this.styleOutput = document.getElementById('style-output');
        this.jsonOutput = document.getElementById('json-output');
        this.makecomOutput = document.getElementById('makecom-output');

        // Position options
        this.positionOptions = document.querySelectorAll('.position-option');
        
        // Preset buttons
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // Copy buttons
        this.copyButtons = {
            style: document.getElementById('copy-style'),
            json: document.getElementById('copy-json'),
            makecom: document.getElementById('copy-makecom')
        };
    }

    bindEvents() {
        // Input events
        this.textInput.addEventListener('input', () => this.updatePreview());
        this.fontSize.addEventListener('input', () => this.updateRangeValue('font-size'));
        this.fontColor.addEventListener('input', () => this.updateColorInput('font-color'));
        this.fontColorText.addEventListener('input', () => this.updateColorFromText('font-color'));
        this.enableBox.addEventListener('change', () => this.updatePreview());
        this.boxColor.addEventListener('input', () => this.updateColorInput('box-color'));
        this.boxColorText.addEventListener('input', () => this.updateColorFromText('box-color'));
        this.boxOpacity.addEventListener('input', () => this.updateRangeValue('box-opacity'));
        this.boxBorder.addEventListener('input', () => this.updateRangeValue('box-border'));
        this.boxWidth.addEventListener('input', () => this.updateRangeValue('box-width'));
        this.boxPadding.addEventListener('input', () => this.updateRangeValue('box-padding'));

        // Position events
        this.positionOptions.forEach(option => {
            option.addEventListener('click', () => this.selectPosition(option));
        });

        // Preset events
        this.presetButtons.forEach(button => {
            button.addEventListener('click', () => this.applyPreset(button.dataset.preset));
        });

        // Copy events
        this.copyButtons.style.addEventListener('click', () => this.copyToClipboard('style'));
        this.copyButtons.json.addEventListener('click', () => this.copyToClipboard('json'));
        this.copyButtons.makecom.addEventListener('click', () => this.copyToClipboard('makecom'));
    }

    updateRangeValue(inputId) {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(`${inputId}-value`);
        valueDisplay.textContent = input.value;
        this.updatePreview();
    }

    updateColorInput(inputId) {
        const colorInput = document.getElementById(inputId);
        const textInput = document.getElementById(`${inputId}-text`);
        textInput.value = colorInput.value;
        this.updatePreview();
    }

    updateColorFromText(inputId) {
        const colorInput = document.getElementById(inputId);
        const textInput = document.getElementById(`${inputId}-text`);
        
        // Validate hex color
        if (/^#[0-9A-F]{6}$/i.test(textInput.value)) {
            colorInput.value = textInput.value;
            this.updatePreview();
        }
    }

    selectPosition(option) {
        this.positionOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.currentPosition = option.dataset.position;
        this.updatePreview();
    }

    applyPreset(preset) {
        const presets = {
            corporate: {
                fontSize: 32,
                fontColor: '#003366',
                enableBox: true,
                boxColor: '#FFFFFF',
                boxOpacity: 0.9,
                boxBorder: 2,
                boxWidth: 300,
                boxPadding: 15,
                position: 'bottom_center'
            },
            gaming: {
                fontSize: 36,
                fontColor: '#FFD700',
                enableBox: true,
                boxColor: '#FF0000',
                boxOpacity: 0.7,
                boxBorder: 3,
                boxWidth: 400,
                boxPadding: 20,
                position: 'center'
            },
            elegant: {
                fontSize: 24,
                fontColor: '#FFFFFF',
                enableBox: true,
                boxColor: '#000000',
                boxOpacity: 0.3,
                boxBorder: 1,
                boxWidth: 250,
                boxPadding: 12,
                position: 'bottom_right'
            },
            bold: {
                fontSize: 40,
                fontColor: '#FF4500',
                enableBox: true,
                boxColor: '#000000',
                boxOpacity: 0.8,
                boxBorder: 4,
                boxWidth: 500,
                boxPadding: 25,
                position: 'top_center'
            },
            minimal: {
                fontSize: 20,
                fontColor: '#FFFFFF',
                enableBox: false,
                boxColor: '#000000',
                boxOpacity: 0.0,
                boxBorder: 0,
                boxWidth: 0,
                boxPadding: 0,
                position: 'bottom_center'
            }
        };

        const config = presets[preset];
        if (config) {
            this.fontSize.value = config.fontSize;
            this.fontSizeValue.textContent = config.fontSize;
            this.fontColor.value = config.fontColor;
            this.fontColorText.value = config.fontColor;
            this.enableBox.checked = config.enableBox;
            this.boxColor.value = config.boxColor;
            this.boxColorText.value = config.boxColor;
            this.boxOpacity.value = config.boxOpacity;
            this.boxOpacityValue.textContent = config.boxOpacity;
            this.boxBorder.value = config.boxBorder;
            this.boxBorderValue.textContent = config.boxBorder;
            this.boxWidth.value = config.boxWidth;
            this.boxWidthValue.textContent = config.boxWidth;
            this.boxPadding.value = config.boxPadding;
            this.boxPaddingValue.textContent = config.boxPadding;

            // Update position
            this.positionOptions.forEach(opt => opt.classList.remove('active'));
            const positionElement = document.querySelector(`[data-position="${config.position}"]`);
            if (positionElement) {
                positionElement.classList.add('active');
                this.currentPosition = config.position;
            }

            this.updatePreview();
        }
    }

    getPositionStyles(position) {
        const positions = {
            top_left: { top: '10px', left: '10px', transform: 'none' },
            top_center: { top: '10px', left: '50%', transform: 'translateX(-50%)' },
            top_right: { top: '10px', right: '10px', transform: 'none' },
            center_left: { top: '50%', left: '10px', transform: 'translateY(-50%)' },
            center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            center_right: { top: '50%', right: '10px', transform: 'translateY(-50%)' },
            bottom_left: { bottom: '10px', left: '10px', transform: 'none' },
            bottom_center: { bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
            bottom_right: { bottom: '10px', right: '10px', transform: 'none' }
        };
        return positions[position] || positions.bottom_center;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    updatePreview() {
        const text = this.textInput.value || 'Preview Text';
        const fontSize = parseInt(this.fontSize.value);
        const fontColor = this.fontColor.value;
        const enableBox = this.enableBox.checked;
        const boxColor = this.boxColor.value;
        const boxOpacity = parseFloat(this.boxOpacity.value);
        const boxBorder = parseInt(this.boxBorder.value);
        const boxWidth = parseInt(this.boxWidth.value);
        const boxPadding = parseInt(this.boxPadding.value);
        const position = this.getPositionStyles(this.currentPosition);

        // Update preview
        this.captionPreview.textContent = text;
        this.captionPreview.style.fontSize = `${Math.max(fontSize * 0.5, 12)}px`;
        this.captionPreview.style.color = fontColor;

        // Reset positioning
        ['top', 'left', 'right', 'bottom'].forEach(prop => {
            this.captionPreview.style[prop] = 'auto';
        });

        // Apply new position
        Object.keys(position).forEach(prop => {
            this.captionPreview.style[prop] = position[prop];
        });

        if (enableBox) {
            const rgb = this.hexToRgb(boxColor);
            this.captionPreview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${boxOpacity})`;
            this.captionPreview.style.padding = `${Math.max(boxPadding * 0.3, 4)}px ${Math.max(boxPadding * 0.6, 8)}px`;
            this.captionPreview.style.borderRadius = '4px';
            
            // Apply box width if specified
            if (boxWidth > 0) {
                this.captionPreview.style.width = `${Math.min(boxWidth * 0.3, 300)}px`;
                this.captionPreview.style.maxWidth = `${Math.min(boxWidth * 0.3, 300)}px`;
            } else {
                this.captionPreview.style.width = 'auto';
                this.captionPreview.style.maxWidth = 'none';
            }
            
            // Add border effect in preview
            if (boxBorder > 0) {
                this.captionPreview.style.border = `${boxBorder}px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(boxOpacity + 0.2, 1)})`;
                this.captionPreview.style.boxShadow = `0 0 ${boxBorder * 2}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${boxOpacity * 0.5})`;
            } else {
                this.captionPreview.style.border = 'none';
                this.captionPreview.style.boxShadow = 'none';
            }
        } else {
            this.captionPreview.style.backgroundColor = 'transparent';
            this.captionPreview.style.padding = '0';
            this.captionPreview.style.borderRadius = '0';
            this.captionPreview.style.border = 'none';
            this.captionPreview.style.boxShadow = 'none';
            this.captionPreview.style.width = 'auto';
            this.captionPreview.style.maxWidth = 'none';
        }

        this.updateOutputs();
    }

    updateOutputs() {
        const text = this.textInput.value || 'Welcome to our tutorial!';
        const fontSize = parseInt(this.fontSize.value);
        const fontColor = this.fontColor.value.replace('#', '');
        const enableBox = this.enableBox.checked;
        const boxColor = this.boxColor.value.replace('#', '');
        const boxOpacity = parseFloat(this.boxOpacity.value);
        const boxBorder = parseInt(this.boxBorder.value);
        const boxWidth = parseInt(this.boxWidth.value);
        const boxPadding = parseInt(this.boxPadding.value);

        // Build FFmpeg style string
        let style = `fontsize=${fontSize}:fontcolor=${fontColor}`;
        
        if (enableBox) {
            style += `:box=1:boxcolor=${boxColor}@${boxOpacity}`;
            if (boxBorder > 0) {
                style += `:boxborderw=${boxBorder}`;
            }
            if (boxWidth > 0) {
                style += `:boxw=${boxWidth}`;
            }
            if (boxPadding > 0) {
                style += `:boxpadding=${boxPadding}`;
            }
        }

        // Update outputs
        this.styleOutput.textContent = style;

        const jsonConfig = {
            text: text,
            style: style,
            position: this.currentPosition
        };

        this.jsonOutput.textContent = JSON.stringify(jsonConfig, null, 2);

        const makecomString = JSON.stringify(jsonConfig).replace(/"/g, '\\"');
        this.makecomOutput.textContent = `"${makecomString}"`;
    }

    async copyToClipboard(type) {
        let text = '';
        let button = null;

        switch (type) {
            case 'style':
                text = this.styleOutput.textContent;
                button = this.copyButtons.style;
                break;
            case 'json':
                text = this.jsonOutput.textContent;
                button = this.copyButtons.json;
                break;
            case 'makecom':
                text = this.makecomOutput.textContent;
                button = this.copyButtons.makecom;
                break;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess(button);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopySuccess(button);
        }
    }

    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CaptionStyleGenerator();
});

// Add some easter eggs and advanced features
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to copy current style
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('copy-style').click();
    }
    
    // Escape to reset to default
    if (e.key === 'Escape') {
        document.querySelector('[data-preset="elegant"]').click();
    }
});

// Add real-time color validation
document.getElementById('font-color-text').addEventListener('input', function(e) {
    const isValid = /^#[0-9A-F]{6}$/i.test(e.target.value);
    e.target.style.borderColor = isValid ? 'rgba(102, 126, 234, 0.5)' : 'rgba(239, 68, 68, 0.5)';
});

document.getElementById('box-color-text').addEventListener('input', function(e) {
    const isValid = /^#[0-9A-F]{6}$/i.test(e.target.value);
    e.target.style.borderColor = isValid ? 'rgba(102, 126, 234, 0.5)' : 'rgba(239, 68, 68, 0.5)';
});

// Add smooth transitions for better UX
const style = document.createElement('style');
style.textContent = `
    .caption-preview {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .position-option {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .preset-btn {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(style);
