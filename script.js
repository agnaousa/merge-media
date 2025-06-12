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
        this.fontFamily = document.getElementById('font-family');
        this.fontSize = document.getElementById('font-size');
        this.fontColor = document.getElementById('font-color');
        this.fontColorText = document.getElementById('font-color-text');
        this.textAlign = document.getElementById('text-align');
        this.lineSpacing = document.getElementById('line-spacing');
        
        // Text effects
        this.enableOutline = document.getElementById('enable-outline');
        this.outlineColor = document.getElementById('outline-color');
        this.outlineColorText = document.getElementById('outline-color-text');
        this.outlineWidth = document.getElementById('outline-width');
        this.enableShadow = document.getElementById('enable-shadow');
        this.shadowColor = document.getElementById('shadow-color');
        this.shadowColorText = document.getElementById('shadow-color-text');
        this.shadowX = document.getElementById('shadow-x');
        this.shadowY = document.getElementById('shadow-y');
        this.textAlpha = document.getElementById('text-alpha');
        
        // Background box
        this.enableBox = document.getElementById('enable-box');
        this.boxColor = document.getElementById('box-color');
        this.boxColorText = document.getElementById('box-color-text');
        this.boxOpacity = document.getElementById('box-opacity');
        this.boxBorder = document.getElementById('box-border');
        
        // Transform & animation
        this.textRotation = document.getElementById('text-rotation');
        this.textSpacing = document.getElementById('text-spacing');
        this.enableExpansion = document.getElementById('enable-expansion');
        this.expansionMode = document.getElementById('expansion-mode');
        this.enableFade = document.getElementById('enable-fade');
        this.fadeIn = document.getElementById('fade-in');
        this.fadeOut = document.getElementById('fade-out');
        
        // Position
        this.useCustomPosition = document.getElementById('use-custom-position');
        this.customX = document.getElementById('custom-x');
        this.customY = document.getElementById('custom-y');
        this.textPadding = document.getElementById('text-padding');

        // Display elements
        this.fontSizeValue = document.getElementById('font-size-value');
        this.lineSpacingValue = document.getElementById('line-spacing-value');
        this.outlineWidthValue = document.getElementById('outline-width-value');
        this.shadowXValue = document.getElementById('shadow-x-value');
        this.shadowYValue = document.getElementById('shadow-y-value');
        this.textAlphaValue = document.getElementById('text-alpha-value');
        this.boxOpacityValue = document.getElementById('box-opacity-value');
        this.boxBorderValue = document.getElementById('box-border-value');
        this.textRotationValue = document.getElementById('text-rotation-value');
        this.textSpacingValue = document.getElementById('text-spacing-value');
        this.fadeInValue = document.getElementById('fade-in-value');
        this.fadeOutValue = document.getElementById('fade-out-value');
        this.textPaddingValue = document.getElementById('text-padding-value');
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
        this.fontFamily.addEventListener('change', () => this.updatePreview());
        this.fontSize.addEventListener('input', () => this.updateRangeValue('font-size'));
        this.fontColor.addEventListener('input', () => this.updateColorInput('font-color'));
        this.fontColorText.addEventListener('input', () => this.updateColorFromText('font-color'));
        this.textAlign.addEventListener('change', () => this.updatePreview());
        this.lineSpacing.addEventListener('input', () => this.updateRangeValue('line-spacing'));
        
        // Text effects events
        this.enableOutline.addEventListener('change', () => this.updatePreview());
        this.outlineColor.addEventListener('input', () => this.updateColorInput('outline-color'));
        this.outlineColorText.addEventListener('input', () => this.updateColorFromText('outline-color'));
        this.outlineWidth.addEventListener('input', () => this.updateRangeValue('outline-width'));
        this.enableShadow.addEventListener('change', () => this.updatePreview());
        this.shadowColor.addEventListener('input', () => this.updateColorInput('shadow-color'));
        this.shadowColorText.addEventListener('input', () => this.updateColorFromText('shadow-color'));
        this.shadowX.addEventListener('input', () => this.updateRangeValue('shadow-x'));
        this.shadowY.addEventListener('input', () => this.updateRangeValue('shadow-y'));
        this.textAlpha.addEventListener('input', () => this.updateRangeValue('text-alpha'));
        
        // Background box events
        this.enableBox.addEventListener('change', () => this.updatePreview());
        this.boxColor.addEventListener('input', () => this.updateColorInput('box-color'));
        this.boxColorText.addEventListener('input', () => this.updateColorFromText('box-color'));
        this.boxOpacity.addEventListener('input', () => this.updateRangeValue('box-opacity'));
        this.boxBorder.addEventListener('input', () => this.updateRangeValue('box-border'));
        
        // Transform & animation events
        this.textRotation.addEventListener('input', () => this.updateRangeValue('text-rotation'));
        this.textSpacing.addEventListener('input', () => this.updateRangeValue('text-spacing'));
        this.enableExpansion.addEventListener('change', () => this.updatePreview());
        this.expansionMode.addEventListener('change', () => this.updatePreview());
        this.enableFade.addEventListener('change', () => this.updatePreview());
        this.fadeIn.addEventListener('input', () => this.updateRangeValue('fade-in'));
        this.fadeOut.addEventListener('input', () => this.updateRangeValue('fade-out'));
        
        // Position events
        this.useCustomPosition.addEventListener('change', () => this.toggleCustomPosition());
        this.customX.addEventListener('input', () => this.updatePreview());
        this.customY.addEventListener('input', () => this.updatePreview());
        this.textPadding.addEventListener('input', () => this.updateRangeValue('text-padding'));

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
                fontFamily: 'Arial',
                fontSize: 32,
                fontColor: '#003366',
                textAlign: 'center',
                lineSpacing: 0,
                enableOutline: false,
                outlineColor: '#000000',
                outlineWidth: 1,
                enableShadow: true,
                shadowColor: '#000000',
                shadowX: 2,
                shadowY: 2,
                textAlpha: 1,
                enableBox: true,
                boxColor: '#FFFFFF',
                boxOpacity: 0.9,
                boxBorder: 2,
                textRotation: 0,
                textSpacing: 0,
                enableExpansion: false,
                expansionMode: 'none',
                enableFade: false,
                fadeIn: 0,
                fadeOut: 0,
                useCustomPosition: false,
                customX: 0,
                customY: 0,
                textPadding: 15,
                position: 'bottom_center'
            },
            gaming: {
                fontFamily: 'Impact',
                fontSize: 36,
                fontColor: '#FFD700',
                textAlign: 'center',
                lineSpacing: 2,
                enableOutline: true,
                outlineColor: '#000000',
                outlineWidth: 3,
                enableShadow: true,
                shadowColor: '#FF0000',
                shadowX: 3,
                shadowY: 3,
                textAlpha: 1,
                enableBox: false,
                boxColor: '#000000',
                boxOpacity: 0.7,
                boxBorder: 0,
                textRotation: 0,
                textSpacing: 1,
                enableExpansion: false,
                expansionMode: 'none',
                enableFade: false,
                fadeIn: 0,
                fadeOut: 0,
                useCustomPosition: false,
                customX: 0,
                customY: 0,
                textPadding: 20,
                position: 'center'
            },
            elegant: {
                fontFamily: 'Georgia',
                fontSize: 24,
                fontColor: '#FFFFFF',
                textAlign: 'right',
                lineSpacing: 3,
                enableOutline: false,
                outlineColor: '#000000',
                outlineWidth: 1,
                enableShadow: true,
                shadowColor: '#333333',
                shadowX: 1,
                shadowY: 1,
                textAlpha: 0.9,
                enableBox: true,
                boxColor: '#000000',
                boxOpacity: 0.3,
                boxBorder: 1,
                textRotation: 0,
                textSpacing: 0,
                enableExpansion: false,
                expansionMode: 'none',
                enableFade: true,
                fadeIn: 1,
                fadeOut: 1,
                useCustomPosition: false,
                customX: 0,
                customY: 0,
                textPadding: 10,
                position: 'bottom_right'
            },
            bold: {
                fontFamily: 'Arial',
                fontSize: 40,
                fontColor: '#FF4500',
                textAlign: 'center',
                lineSpacing: 0,
                enableOutline: true,
                outlineColor: '#FFFFFF',
                outlineWidth: 4,
                enableShadow: true,
                shadowColor: '#000000',
                shadowX: 4,
                shadowY: 4,
                textAlpha: 1,
                enableBox: true,
                boxColor: '#000000',
                boxOpacity: 0.8,
                boxBorder: 4,
                textRotation: 0,
                textSpacing: 2,
                enableExpansion: false,
                expansionMode: 'none',
                enableFade: false,
                fadeIn: 0,
                fadeOut: 0,
                useCustomPosition: false,
                customX: 0,
                customY: 0,
                textPadding: 25,
                position: 'top_center'
            },
            minimal: {
                fontFamily: 'Helvetica',
                fontSize: 20,
                fontColor: '#FFFFFF',
                textAlign: 'left',
                lineSpacing: 0,
                enableOutline: false,
                outlineColor: '#000000',
                outlineWidth: 0,
                enableShadow: false,
                shadowColor: '#000000',
                shadowX: 0,
                shadowY: 0,
                textAlpha: 1,
                enableBox: false,
                boxColor: '#000000',
                boxOpacity: 0.0,
                boxBorder: 0,
                textRotation: 0,
                textSpacing: 0,
                enableExpansion: false,
                expansionMode: 'none',
                enableFade: false,
                fadeIn: 0,
                fadeOut: 0,
                useCustomPosition: false,
                customX: 0,
                customY: 0,
                textPadding: 5,
                position: 'bottom_center'
            }
        };

        const config = presets[preset];
        if (config) {
            // Text properties
            this.fontFamily.value = config.fontFamily;
            this.fontSize.value = config.fontSize;
            this.fontSizeValue.textContent = config.fontSize;
            this.fontColor.value = config.fontColor;
            this.fontColorText.value = config.fontColor;
            this.textAlign.value = config.textAlign;
            this.lineSpacing.value = config.lineSpacing;
            this.lineSpacingValue.textContent = config.lineSpacing;
            
            // Text effects
            this.enableOutline.checked = config.enableOutline;
            this.outlineColor.value = config.outlineColor;
            this.outlineColorText.value = config.outlineColor;
            this.outlineWidth.value = config.outlineWidth;
            this.outlineWidthValue.textContent = config.outlineWidth;
            this.enableShadow.checked = config.enableShadow;
            this.shadowColor.value = config.shadowColor;
            this.shadowColorText.value = config.shadowColor;
            this.shadowX.value = config.shadowX;
            this.shadowXValue.textContent = config.shadowX;
            this.shadowY.value = config.shadowY;
            this.shadowYValue.textContent = config.shadowY;
            this.textAlpha.value = config.textAlpha;
            this.textAlphaValue.textContent = config.textAlpha;
            
            // Background box
            this.enableBox.checked = config.enableBox;
            this.boxColor.value = config.boxColor;
            this.boxColorText.value = config.boxColor;
            this.boxOpacity.value = config.boxOpacity;
            this.boxOpacityValue.textContent = config.boxOpacity;
            this.boxBorder.value = config.boxBorder;
            this.boxBorderValue.textContent = config.boxBorder;
            
            // Transform & animation
            this.textRotation.value = config.textRotation;
            this.textRotationValue.textContent = config.textRotation;
            this.textSpacing.value = config.textSpacing;
            this.textSpacingValue.textContent = config.textSpacing;
            this.enableExpansion.checked = config.enableExpansion;
            this.expansionMode.value = config.expansionMode;
            this.enableFade.checked = config.enableFade;
            this.fadeIn.value = config.fadeIn;
            this.fadeInValue.textContent = config.fadeIn;
            this.fadeOut.value = config.fadeOut;
            this.fadeOutValue.textContent = config.fadeOut;
            
            // Position
            this.useCustomPosition.checked = config.useCustomPosition;
            this.customX.value = config.customX;
            this.customY.value = config.customY;
            this.customX.disabled = !config.useCustomPosition;
            this.customY.disabled = !config.useCustomPosition;
            this.textPadding.value = config.textPadding;
            this.textPaddingValue.textContent = config.textPadding;

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
        const fontFamily = this.fontFamily.value;
        const fontSize = parseInt(this.fontSize.value);
        const fontColor = this.fontColor.value;
        const textAlign = this.textAlign.value;
        const enableOutline = this.enableOutline.checked;
        const outlineColor = this.outlineColor.value;
        const outlineWidth = parseInt(this.outlineWidth.value);
        const enableShadow = this.enableShadow.checked;
        const shadowColor = this.shadowColor.value;
        const shadowX = parseInt(this.shadowX.value);
        const shadowY = parseInt(this.shadowY.value);
        const textAlpha = parseFloat(this.textAlpha.value);
        const enableBox = this.enableBox.checked;
        const boxColor = this.boxColor.value;
        const boxOpacity = parseFloat(this.boxOpacity.value);
        const boxBorder = parseInt(this.boxBorder.value);
        const textRotation = parseInt(this.textRotation.value);
        const textSpacing = parseInt(this.textSpacing.value);
        const useCustomPosition = this.useCustomPosition.checked;
        
        let position;
        if (useCustomPosition) {
            const customX = parseInt(this.customX.value) || 0;
            const customY = parseInt(this.customY.value) || 0;
            position = { left: `${customX}px`, top: `${customY}px`, transform: 'none' };
        } else {
            position = this.getPositionStyles(this.currentPosition);
        }

        // Update preview
        this.captionPreview.textContent = text;
        this.captionPreview.style.fontFamily = fontFamily;
        this.captionPreview.style.fontSize = `${Math.max(fontSize * 0.5, 12)}px`;
        this.captionPreview.style.color = fontColor;
        this.captionPreview.style.textAlign = textAlign;
        this.captionPreview.style.opacity = textAlpha;
        
        // Apply rotation
        let transform = `rotate(${textRotation}deg)`;
        if (position.transform && position.transform !== 'none') {
            transform = `${position.transform} rotate(${textRotation}deg)`;
        }
        this.captionPreview.style.transform = transform;
        
        // Apply letter spacing
        if (textSpacing !== 0) {
            this.captionPreview.style.letterSpacing = `${textSpacing}px`;
        } else {
            this.captionPreview.style.letterSpacing = 'normal';
        }

        // Reset positioning
        ['top', 'left', 'right', 'bottom'].forEach(prop => {
            this.captionPreview.style[prop] = 'auto';
        });

        // Apply new position
        Object.keys(position).forEach(prop => {
            if (prop !== 'transform') {
                this.captionPreview.style[prop] = position[prop];
            }
        });

        // Apply text effects
        let textShadow = '';
        let textStroke = '';
        
        if (enableShadow) {
            textShadow = `${shadowX}px ${shadowY}px 0px ${shadowColor}`;
        }
        
        if (enableOutline && outlineWidth > 0) {
            // Create outline effect using text-shadow
            const outlineSteps = [];
            for (let i = -outlineWidth; i <= outlineWidth; i++) {
                for (let j = -outlineWidth; j <= outlineWidth; j++) {
                    if (i !== 0 || j !== 0) {
                        outlineSteps.push(`${i}px ${j}px 0px ${outlineColor}`);
                    }
                }
            }
            
            if (enableShadow) {
                textShadow = outlineSteps.join(', ') + ', ' + textShadow;
            } else {
                textShadow = outlineSteps.join(', ');
            }
        }
        
        this.captionPreview.style.textShadow = textShadow;

        // Apply background box
        if (enableBox) {
            const rgb = this.hexToRgb(boxColor);
            this.captionPreview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${boxOpacity})`;
            this.captionPreview.style.padding = '8px 16px';
            this.captionPreview.style.borderRadius = '4px';
            
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
        const fontFamily = this.fontFamily.value;
        const fontSize = parseInt(this.fontSize.value);
        const fontColor = this.fontColor.value.replace('#', '');
        const textAlign = this.textAlign.value;
        const lineSpacing = parseInt(this.lineSpacing.value);
        
        // Text effects
        const enableOutline = this.enableOutline.checked;
        const outlineColor = this.outlineColor.value.replace('#', '');
        const outlineWidth = parseInt(this.outlineWidth.value);
        const enableShadow = this.enableShadow.checked;
        const shadowColor = this.shadowColor.value.replace('#', '');
        const shadowX = parseInt(this.shadowX.value);
        const shadowY = parseInt(this.shadowY.value);
        const textAlpha = parseFloat(this.textAlpha.value);
        
        // Background box
        const enableBox = this.enableBox.checked;
        const boxColor = this.boxColor.value.replace('#', '');
        const boxOpacity = parseFloat(this.boxOpacity.value);
        const boxBorder = parseInt(this.boxBorder.value);
        
        // Transform & animation
        const textRotation = parseInt(this.textRotation.value);
        const textSpacing = parseInt(this.textSpacing.value);
        const enableExpansion = this.enableExpansion.checked;
        const expansionMode = this.expansionMode.value;
        const enableFade = this.enableFade.checked;
        const fadeIn = parseFloat(this.fadeIn.value);
        const fadeOut = parseFloat(this.fadeOut.value);
        
        // Position
        const useCustomPosition = this.useCustomPosition.checked;
        const customX = parseInt(this.customX.value) || 0;
        const customY = parseInt(this.customY.value) || 0;
        const textPadding = parseInt(this.textPadding.value);

        // Build FFmpeg drawtext filter string - only include non-default values
        let style = `text='${text}':fontfile='${fontFamily}':fontsize=${fontSize}:fontcolor=${fontColor}`;
        
        // Add text alignment (only if not default 'left')
        if (textAlign !== 'left') {
            style += `:text_align=${textAlign}`;
        }
        
        // Add line spacing (only if > 0)
        if (lineSpacing > 0) {
            style += `:line_spacing=${lineSpacing}`;
        }
        
        // Add text alpha (only if < 1)
        if (textAlpha < 1) {
            style += `:alpha=${textAlpha}`;
        }
        
        // Add outline (only if enabled and width > 0)
        if (enableOutline && outlineWidth > 0) {
            style += `:borderw=${outlineWidth}:bordercolor=${outlineColor}`;
        }
        
        // Add shadow (only if enabled and has offset values)
        if (enableShadow && (shadowX !== 0 || shadowY !== 0)) {
            style += `:shadowcolor=${shadowColor}`;
            if (shadowX !== 0) style += `:shadowx=${shadowX}`;
            if (shadowY !== 0) style += `:shadowy=${shadowY}`;
        }
        
        // Add background box (only if enabled)
        if (enableBox) {
            style += `:box=1:boxcolor=${boxColor}@${boxOpacity}`;
            if (boxBorder > 0) {
                style += `:boxborderw=${boxBorder}`;
            }
        }
        
        // Add rotation (only if not 0)
        if (textRotation !== 0) {
            style += `:text_rotation=${textRotation}`;
        }
        
        // Add character spacing (only if not 0)
        if (textSpacing !== 0) {
            style += `:text_shaping=1:text_spacing=${textSpacing}`;
        }
        
        // Add expansion (only if enabled and not 'none')
        if (enableExpansion && expansionMode !== 'none') {
            style += `:expansion=${expansionMode}`;
        }
        
        // Add position
        if (useCustomPosition && (customX !== 0 || customY !== 0)) {
            if (customX !== 0) style += `:x=${customX}`;
            if (customY !== 0) style += `:y=${customY}`;
        } else if (!useCustomPosition) {
            const positionMap = {
                'top_left': 'x=10:y=10',
                'top_center': 'x=(w-text_w)/2:y=10',
                'top_right': 'x=w-text_w-10:y=10',
                'center_left': 'x=10:y=(h-text_h)/2',
                'center': 'x=(w-text_w)/2:y=(h-text_h)/2',
                'center_right': 'x=w-text_w-10:y=(h-text_h)/2',
                'bottom_left': 'x=10:y=h-text_h-10',
                'bottom_center': 'x=(w-text_w)/2:y=h-text_h-10',
                'bottom_right': 'x=w-text_w-10:y=h-text_h-10'
            };
            style += `:${positionMap[this.currentPosition] || positionMap.bottom_center}`;
        }
        
        // Add fade effects (only if enabled and values > 0)
        if (enableFade) {
            if (fadeIn > 0) {
                style += `:enable='between(t,0,${fadeIn})*fade(t,0,${fadeIn})'`;
            }
            if (fadeOut > 0) {
                style += `:enable='between(t,${fadeOut},${fadeOut + 5})*fade(t,${fadeOut},${fadeOut + 5})'`;
            }
        }

        // Update outputs
        this.styleOutput.textContent = style;

        // Build JSON config - only include non-default values
        const jsonConfig = {
            text: text,
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontColor: `#${fontColor}`,
            style: style
        };

        // Add optional properties only if they have non-default values
        if (textAlign !== 'left') {
            jsonConfig.textAlign = textAlign;
        }
        if (lineSpacing > 0) {
            jsonConfig.lineSpacing = lineSpacing;
        }
        if (textAlpha < 1) {
            jsonConfig.alpha = textAlpha;
        }
        if (enableOutline && outlineWidth > 0) {
            jsonConfig.outline = {
                enabled: true,
                color: `#${outlineColor}`,
                width: outlineWidth
            };
        }
        if (enableShadow && (shadowX !== 0 || shadowY !== 0)) {
            jsonConfig.shadow = {
                enabled: true,
                color: `#${shadowColor}`
            };
            if (shadowX !== 0) jsonConfig.shadow.x = shadowX;
            if (shadowY !== 0) jsonConfig.shadow.y = shadowY;
        }
        if (enableBox) {
            jsonConfig.box = {
                enabled: true,
                color: `#${boxColor}`,
                opacity: boxOpacity
            };
            if (boxBorder > 0) {
                jsonConfig.box.border = boxBorder;
            }
        }
        if (textRotation !== 0) {
            jsonConfig.rotation = textRotation;
        }
        if (textSpacing !== 0) {
            jsonConfig.spacing = textSpacing;
        }
        if (enableExpansion && expansionMode !== 'none') {
            jsonConfig.expansion = expansionMode;
        }
        if (enableFade && (fadeIn > 0 || fadeOut > 0)) {
            jsonConfig.fade = { enabled: true };
            if (fadeIn > 0) jsonConfig.fade.fadeIn = fadeIn;
            if (fadeOut > 0) jsonConfig.fade.fadeOut = fadeOut;
        }
        
        // Add position info
        if (useCustomPosition && (customX !== 0 || customY !== 0)) {
            jsonConfig.position = { type: 'custom' };
            if (customX !== 0) jsonConfig.position.x = customX;
            if (customY !== 0) jsonConfig.position.y = customY;
        } else if (!useCustomPosition) {
            jsonConfig.position = {
                type: 'preset',
                value: this.currentPosition
            };
        }

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

    toggleCustomPosition() {
        const isCustom = this.useCustomPosition.checked;
        this.customX.disabled = !isCustom;
        this.customY.disabled = !isCustom;
        this.updatePreview();
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

document.getElementById('outline-color-text').addEventListener('input', function(e) {
    const isValid = /^#[0-9A-F]{6}$/i.test(e.target.value);
    e.target.style.borderColor = isValid ? 'rgba(102, 126, 234, 0.5)' : 'rgba(239, 68, 68, 0.5)';
});

document.getElementById('shadow-color-text').addEventListener('input', function(e) {
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
