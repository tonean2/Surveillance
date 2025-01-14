//syntaxHighlighter.js
// Keep editor instance in global scope
let editor = null;
let changeTimeout = null;


function loadAndHighlightCode() {
    const codeBlock = document.getElementById('codeBlock');
    if (!codeBlock) return;

    const initialCode = `// Define the ball's position
let ballX = 10; // Random X position (0 to 100)
let ballY = 15; // Random Y position (0 to 100)
// Define the hole's position
let holeX = 80; // Fixed X position for the hole
let holeY = 20; // Fixed Y position for the hole
// Uncomment the lines below to put the ball in the hole
// ballX = holeX;
// ballY = holeY;


















//The first number is 
//4
};`;

    if (!editor) {
        editor = CodeMirror(codeBlock, {
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
        editor.on('change', () => {
            // Clear any pending timeout
            if (changeTimeout) {
                clearTimeout(changeTimeout);
            }
        
            // Set a new timeout
            changeTimeout = setTimeout(() => {
                const currentCode = editor.getValue();
                
                // Only notify game if relevant lines have changed
                const relevantChanges = hasRelevantChanges(currentCode);
                
                if (relevantChanges && window.game && typeof window.game.handleCodeChange === 'function') {
                    window.game.handleCodeChange(currentCode);
                }
            }, 250); // 250ms debounce
        });
    }

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor) {
            editor.refresh();
        }
    }, 5);
}

function hasRelevantChanges(code) {
    const lines = code.split('\n');
    return lines.some(line => {
        const trimmed = line.trim();
        return trimmed === 'ballX = holeX;' ||
               trimmed === 'ballY = holeY;' ||
               trimmed === '//The first number is' ||
               trimmed === '4' ||
               trimmed === '//4';
    });
}

// Add custom styles with higher specificity and all transparent backgrounds
const style = document.createElement('style');
style.textContent = `
    #dialogBox .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        
        visibility: visible !important;
    }
    #dialogBox .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox #codeBlock {

        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox .CodeMirror-scroll {

        background-color: transparent !important;
    }
    #dialogBox .CodeMirror-sizer {
        background-color: transparent !important;
    }

`;
document.head.appendChild(style);

// Show dialog function
window.showDialog = function() {
    const dialogBox = document.getElementById('dialogBox');
    if (dialogBox) {
        dialogBox.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode();
        }, 5);
    }
};

// Close dialog function
window.closeDialog = function() {
    const dialogBox = document.getElementById('dialogBox');
    if (dialogBox) {
        dialogBox.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode();
});