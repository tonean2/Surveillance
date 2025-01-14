// Keep editor instance in global scope

console.log('syntaxHighlighter2.js loaded');
let editor2 = null;

function loadAndHighlightCode2() {
    const codeBlock2 = document.getElementById('codeBlock2');
    if (!codeBlock2) return;

    const initialCode = `// Calling the Right Person
// You're only allowed one phone call

const phoneBook = {
    "Manager": {
        number: "123-456-7890",
        description: "Handles all administrative tasks. Always busy."
    },
    "Room 2": {
        number: "555-867-5309",
        description: "A meeting room. The door is often locked."
    },
    "The Basement": {
        number: "111-222-3333",
        description: "A dark and cold place, sometimes used for storage."
    },
    "Jeff": {
        number: "714-902-3000",
        description: "Friendly and helpful, but loves to prank people."
    },
    "Marissa": {
        number: "404-101-4040",
        description: "Often avaible, but always up to something in the basement"
    }
};

clue = "The answer is in the description.
now_calling = input(" ")
`;

    if (!editor2) {
        editor2 = CodeMirror(codeBlock2, {
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
        editor2.on('change', () => {
            const currentCode = editor2.getValue();
            console.log('Updated code 2:', currentCode);
            
            // Check for phone number input
            const inputMatch = currentCode.match(/now_calling\s*=\s*input\s*\(\s*["']([^"']*)["']\s*\)/);
            if (inputMatch && inputMatch[1]) {
                const inputValue = inputMatch[1];
                // Get game instance and check phone number
                const game = window.game;
                if (game && typeof game.checkPhoneNumber === 'function') {
                    game.checkPhoneNumber(inputValue);
                }
            }
        });
    }
    

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor2) {
            editor2.refresh();
        }
    }, 5);
}

// Add custom styles with higher specificity and all transparent backgrounds
const style2 = document.createElement('style');
style2.textContent = `
    #dialogBox2 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox2 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox2 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox2 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox2 #codeBlock2 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox2 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox2 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style2);

// Show dialog function
window.showDialog2 = function() {
    const dialogBox2 = document.getElementById('dialogBox2');
    if (dialogBox2) {
        dialogBox2.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode2();
        }, 5);
    }
};

// Close dialog function
window.closeDialog2 = function() {
    const dialogBox2 = document.getElementById('dialogBox2');
    if (dialogBox2) {
        dialogBox2.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode2();
});