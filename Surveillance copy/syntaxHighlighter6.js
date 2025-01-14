console.log('syntaxHighlighter6.js loaded');
let editor6 = null;

function loadAndHighlightCode6() {
    const codeBlock6 = document.getElementById('codeBlock6');
    if (!codeBlock6) return;

    const initialCode = `// You the twins alike
// Hint: not all twins are alike

// Sandy (Keep Unchanged)
let Twin1 = [
    ['●', ' ', '●'], // Eyes (Row 1)
    [' ', '▲', ' '], // Nose (Row 2)
    ['■', ' ', '■'], // Mouth (Row 3)
    [' ', '■', ' ']  // Mouth (Row 4)
];

// Mandy (Edit the code below)
let Twin2 = [
    ['■', ' ', '■'], // Eyes (Row 1)
    [' ', '▲', ' '], // Nose (Row 2)
    ['●', ' ', ' ']  // Mouth (Row 3)
    [' ', '■', ' ']  // Mouth (Row 4)
];
`;

    if (!editor6) {
        editor6 = CodeMirror(codeBlock6, {
            value: initialCode,
            mode: 'javascript',
            theme: 'material-darker',
            lineNumbers: true,
            tabSize: 4,
            indentWithTabs: false,
            autoCloseBrackets: true,
            matchBrackets: true,
            viewportMargin: Infinity,
        });

        editor6.on('change', () => {
            const currentCode = editor6.getValue();
            console.log('Updated code 6:', currentCode);
            checkTwin2Pattern(currentCode);
        });
    }

    setTimeout(() => {
        if (editor6) {
            editor6.refresh();
        }
    }, 5);
}

function checkTwin2Pattern(code) {
    // Create a more flexible pattern that ignores extra spaces
    const pattern = /Twin2\s*=\s*\[\s*\[\s*['"]●['"]\s*,\s*['"]\s*['"]\s*,\s*['"]●['"]\s*\]\s*,\s*\[\s*['"]\s*['"]\s*,\s*['"]▲['"]\s*,\s*['"]\s*['"]\s*\]\s*,\s*\[\s*['"]\s*['"]\s*,\s*['"]■['"]\s*,\s*['"]\s*['"]\s*\]\s*,\s*\[\s*['"]■['"]\s*,\s*['"]\s*['"]\s*,\s*['"]■['"]\s*\]/;

    // Alternative pattern that's more lenient with spaces
    const lenientPattern = /Twin2\s*=\s*\[\s*\[\s*['"]●['"][^●]*['"]●['"]\s*\][^▲]*\[\s*[^▲]*['"]▲['"][^▲]*\][^■]*\[\s*[^■]*['"]■['"][^■]*\][^■]*\[\s*['"]■['"][^■]*['"]■['"]\s*\]/;

    if (pattern.test(code) || lenientPattern.test(code)) {
        if (window.game) {
            window.game.animateFourthSquare();
        }
        return true;
    }
    return false;
}

// Rest of the styling code remains the same...

const style6 = document.createElement('style');
style6.textContent = `
    #dialogBox6 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox6 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox6 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox6 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox6 #codeBlock6 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox6 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox6 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style6);

window.showDialog6 = function() {
    const dialogBox6 = document.getElementById('dialogBox6');
    if (dialogBox6) {
        dialogBox6.style.display = 'block';
        setTimeout(() => {
            loadAndHighlightCode6();
        }, 5);
    }
};

window.closeDialog6 = function() {
    const dialogBox6 = document.getElementById('dialogBox6');
    if (dialogBox6) {
        dialogBox6.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode6();
});