// Keep editor instance in global scope

console.log('syntaxHighlighter5.js loaded');
let editor5 = null;

function loadAndHighlightCode5() {
    const codeBlock5 = document.getElementById('codeBlock5');
    if (!codeBlock5) return;

    const initialCode = `// Art beauty for display - do not modify unless absolutely necessary
if (pictureColor === "blue") {
    unlock_Number();
} else {
    console.log("Access Denied");
}
`;

    if (!editor5) {
        editor5 = CodeMirror(codeBlock5, {
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
        editor5.on('change', () => {
            const currentCode = editor5.getValue();
            console.log('Updated code 4:', currentCode);
            // Add your custom logic here for code changes
        });
    }

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor5) {
            editor5.refresh();
        }
    }, 5);
}

// Add custom styles with higher specificity and all transparent backgrounds
const style5 = document.createElement('style');
style5.textContent = `
    #dialogBox5 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox5 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox5 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox5 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox5 #codeBlock5 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox5 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox5 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style5);

// Show dialog function
window.showDialog5 = function() {
    const dialogBox5 = document.getElementById('dialogBox5');
    if (dialogBox5) {
        dialogBox5.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode5();
        }, 5);
    }
};

// Close dialog function
window.closeDialog5 = function() {
    const dialogBox5 = document.getElementById('dialogBox5');
    if (dialogBox5) {
        dialogBox5.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode5();
});