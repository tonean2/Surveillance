// Keep editor instance in global scope

console.log('syntaxHighlighter7.js loaded');
let editor7 = null;

function loadAndHighlightCode7() {
    const codeBlock7 = document.getElementById('codeBlock7');
    if (!codeBlock7) return;

    const initialCode = `// Are You Hungry?
content fridge = {
    "top_shelf": ["dragon_fruit", "golden_milk", "sparkling_water"],
    "middle_shelf": ["leftover_taco", "stinky_cheese", "expired_yogurt"],
    "bottom_shelf": ["mystery_meat", "melting_ice_cream", "frozen_pineapple_chunks"],
    "throw_away_later": ["half_empty_ketchup", "spicy_mustard", "cracked_eggs"],
    "hidden_compartment": ["glowing_energy_drink", "unlabeled_jar", "camera"]
}
`;

    if (!editor7) {
        editor7 = CodeMirror(codeBlock7, {
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
        editor7.on('change', () => {
            const currentCode = editor7.getValue();
            console.log('Updated code 4:', currentCode);
            // Add your custom logic here for code changes
        });
    }

    // Force a refresh after a short delay to ensure proper rendering
    setTimeout(() => {
        if (editor7) {
            editor7.refresh();
        }
    }, 5);
}

// Add custom styles with higher specificity and all transparent backgrounds
const style7 = document.createElement('style');
style7.textContent = `
    #dialogBox7 .code-container {
        font-family: 'Courier New', Courier, monospace !important;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent !important;
        border-radius: 5px;
        overflow: hidden;
    }
    #dialogBox7 .CodeMirror {
        height: 100% !important;
        width: 100%;
        font-family: 'Courier New', Courier, monospace !important;
        background-color: transparent !important;
        color: #D4D4D4;
        opacity: 1 !important;
        visibility: visible !important;
    }
    #dialogBox7 .CodeMirror-gutters {
        background-color: transparent !important;
    }
    #dialogBox7 .CodeMirror-linenumber {
        color: #D4D4D4 !important;
    }
    #dialogBox7 #codeBlock7 {
        height: calc(100% - 60px);
        margin-top: 20px;
        opacity: 1 !important;
        visibility: visible !important;
        background-color: transparent !important;
    }
    #dialogBox7 .CodeMirror-scroll {
        background-color: transparent !important;
    }
    #dialogBox7 .CodeMirror-sizer {
        background-color: transparent !important;
    }
`;
document.head.appendChild(style7);

// Show dialog function
window.showDialog7 = function() {
    const dialogBox7 = document.getElementById('dialogBox7');
    if (dialogBox7) {
        dialogBox7.style.display = 'block';
        // Add a slight delay before loading the code editor
        setTimeout(() => {
            loadAndHighlightCode7();
        }, 5);
    }
};

// Close dialog function
window.closeDialog7 = function() {
    const dialogBox7 = document.getElementById('dialogBox7');
    if (dialogBox7) {
        dialogBox7.style.display = 'none';
    }
};

// Initialize on page load and ensure editor is properly displayed
document.addEventListener('DOMContentLoaded', () => {
    loadAndHighlightCode7();
});