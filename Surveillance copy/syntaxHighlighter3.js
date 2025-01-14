// Keep editor instance in global scope

console.log('syntaxHighlighter3.js loaded');
let editor3 = null;

function loadAndHighlightCode3() {
    const codeBlock3 = document.getElementById('codeBlock3');
    if (!codeBlock3) return;

    const initialCode = `// The trinket responds to ancient magical phrases
def activateTrinket(code):
    // The enchanted trinket responds to the right code
    if code == "moonlight":
        return "The trinket glows faintly, but nothing else happens."
    elif code == "starlight":
        return "A soft hum fills the air, but the trinket remains closed."
    else:
        return "The trinket remains dormant, awaiting the right code."

currentCode = "????" // The trinket's code is hidden from view...
activateTrinket(currentCode)
`;

    if (!editor3) {
        editor3 = CodeMirror(codeBlock3, {
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
        editor3.on('change', () => {
            const currentCode = editor3.getValue();
            console.log('Updated code 3:', currentCode);
            // Add your custom logic here for code changes
        });
    }

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor3) {
            editor3.refresh();
        }
    }, 5);
}

// Add custom styles with higher specificity and all transparent backgrounds
const style3 = document.createElement('style');
style3.textContent = `
    #dialogBox3 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox3 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox3 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox3 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox3 #codeBlock3 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox3 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox3 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style3);

// Show dialog function
window.showDialog3 = function() {
    const dialogBox3 = document.getElementById('dialogBox3');
    if (dialogBox3) {
        dialogBox3.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode3();
        }, 5);
    }
};

// Close dialog function
window.closeDialog3 = function() {
    const dialogBox3 = document.getElementById('dialogBox3');
    if (dialogBox3) {
        dialogBox3.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode3();
});