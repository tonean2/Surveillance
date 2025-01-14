// Keep editor instance in global scope

console.log('syntaxHighlighter4.js loaded');
let editor4 = null;

function loadAndHighlightCode4() {
    const codeBlock4 = document.getElementById('codeBlock4');
    if (!codeBlock4) return;

    const initialCode = `function openTissueBox(box, currentTime):
if currentTime == "11:59:59 PM":
    box.open()
    return hidden_number
else:
    print("Nuh huh, can't cry yet. Wait for the right time!")
    return null
`;

    if (!editor4) {
        editor4 = CodeMirror(codeBlock4, {
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

        // Monitor code changes
        editor4.on('change', () => {
            const currentCode = editor4.getValue();
            console.log('Updated code 4:', currentCode);
            // Add your custom logic here for code changes
        });
    }

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor4) {
            editor4.refresh();
        }
    }, 5);
}

// Add custom styles with higher specificity and all transparent backgrounds
const style4 = document.createElement('style');
style4.textContent = `
    #dialogBox4 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox4 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox4 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox4 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox4 #codeBlock4 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox4 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox4 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style4);

// Show dialog function
window.showDialog4 = function() {
    const dialogBox4 = document.getElementById('dialogBox4');
    if (dialogBox4) {
        dialogBox4.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode4();
        }, 5);
    }
};

// Close dialog function
window.closeDialog4 = function() {
    const dialogBox4 = document.getElementById('dialogBox4');
    if (dialogBox4) {
        dialogBox4.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode4();
});