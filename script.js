document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const questionInput = document.getElementById('questionInput');
    const targetLanguage = document.getElementById('targetLanguage');
    const generateBtn = document.getElementById('generateBtn');
    const codeInput = document.getElementById('codeInput');
    const languageSelect = document.getElementById('languageSelect');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const pseudocodeOutput = document.getElementById('pseudocodeOutput');
    const explanationToggle = document.getElementById('explanationToggle');
    const explanationSection = document.getElementById('explanationSection');
    const explanationText = document.getElementById('explanationText');
    const copyBtn = document.getElementById('copyBtn');
    const timeComplexity = document.getElementById('timeComplexity');
    const spaceComplexity = document.getElementById('spaceComplexity');

    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        codeInput.select();
        document.execCommand('copy');
        copyBtn.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
        }, 2000);
    });

    // Sync language selectors
    targetLanguage.addEventListener('change', () => {
        languageSelect.value = targetLanguage.value;
    });

    languageSelect.addEventListener('change', () => {
        targetLanguage.value = languageSelect.value;
    });

    // AI Code Generation
    generateBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        const language = targetLanguage.value;

        if (!question) {
            alert('Please enter a question or description of what you want the code to do.');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating...';
        codeInput.value = 'Generating code...';

        try {
            // Simulate AI code generation (replace with actual API call)
            const code = await generateCode(question, language);
            codeInput.value = code;
            generateBtn.innerHTML = '<i class="fas fa-magic me-2"></i>Generate Code';
            generateBtn.disabled = false;
        } catch (error) {
            alert('Error generating code. Please try again.');
            generateBtn.innerHTML = '<i class="fas fa-magic me-2"></i>Generate Code';
            generateBtn.disabled = false;
        }
    });

    // Code to Pseudocode Conversion
    convertBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();
        const language = languageSelect.value;
        const format = formatSelect.value;
        const includeExplanation = explanationToggle.checked;

        if (!code) {
            alert('Please enter some code to convert.');
            return;
        }

        // Add loading animation
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Converting...';

        setTimeout(() => {
            const result = convertToPseudocode(code, language, format);
            
            // Display pseudocode with line numbers
            pseudocodeOutput.innerHTML = result.pseudocode;
            pseudocodeOutput.classList.add('highlight');

            // Display complexities
            const complexities = analyzeComplexity(code, language);
            timeComplexity.innerHTML = `<strong>Time Complexity:</strong> ${complexities.time}<br><small class="text-muted">${complexities.timeExplanation}</small>`;
            spaceComplexity.innerHTML = `<strong>Space Complexity:</strong> ${complexities.space}<br><small class="text-muted">${complexities.spaceExplanation}</small>`;

            // Display line-by-line explanations
            if (includeExplanation) {
                explanationText.innerHTML = result.explanation;
                explanationSection.classList.remove('d-none');
            } else {
                explanationSection.classList.add('d-none');
            }

            // Reset button
            convertBtn.disabled = false;
            convertBtn.innerHTML = 'Convert to Pseudocode';
        }, 500);
    });

    async function generateCode(question, language) {
        // This is a mock implementation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        // Example generated code (replace with actual AI generation)
        const examples = {
            'factorial': {
                python: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)`,
                javascript: `function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
                java: `public int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
                cpp: `int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`
            }
        };

        // For demo, return factorial implementation
        return examples.factorial[language] || 'Code generation not implemented for this language.';
    }

    function convertToPseudocode(code, language, format) {
        let pseudocode = '';
        let explanation = '';
        let indentLevel = 0;
        
        // Split code into lines
        const lines = code.split('\n');
        
        // Add header comment
        pseudocode += formatComment('Algorithm Analysis', format) + '\n\n';
        
        // Process each line
        const explanations = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            let convertedLine = '';
            const indent = '    '.repeat(indentLevel);
            let lineExplanation = '';
            
            // Function declaration
            if (line.includes('function') || line.includes('def ') || line.includes('void ')) {
                convertedLine = indent + convertFunction(line, format);
                lineExplanation = 'Defines a new function that encapsulates a specific task or operation';
                indentLevel++;
            }
            // Class declaration
            else if (line.includes('class ')) {
                convertedLine = indent + convertClass(line, format);
                lineExplanation = 'Creates a new class template for object-oriented programming';
                indentLevel++;
            }
            // If statement
            else if (line.includes('if ')) {
                convertedLine = indent + convertConditional(line, format);
                lineExplanation = 'Checks a condition to make a decision in the code flow';
                indentLevel++;
            }
            // Else if statement
            else if (line.includes('else if') || line.includes('elif ')) {
                indentLevel--;
                convertedLine = indent + convertElseIf(line, format);
                lineExplanation = 'Provides an alternative condition to check if the previous condition was false';
                indentLevel++;
            }
            // Else statement
            else if (line.includes('else')) {
                indentLevel--;
                convertedLine = indent + convertElse(format);
                lineExplanation = 'Executes when none of the previous conditions are true';
                indentLevel++;
            }
            // For loop
            else if (line.includes('for ')) {
                convertedLine = indent + convertLoop(line, format);
                lineExplanation = 'Repeats a block of code for a specific number of iterations';
                indentLevel++;
            }
            // While loop
            else if (line.includes('while ')) {
                convertedLine = indent + convertWhileLoop(line, format);
                lineExplanation = 'Repeats a block of code while a condition remains true';
                indentLevel++;
            }
            // Variable declaration/assignment
            else if (line.includes('=')) {
                convertedLine = indent + convertAssignment(line, format);
                lineExplanation = 'Stores or updates a value in a variable';
            }
            // Return statement
            else if (line.includes('return ')) {
                convertedLine = indent + convertReturn(line, format);
                lineExplanation = 'Sends a value back from a function to where it was called';
            }
            // Closing braces/indentation
            else if (line.includes('}') || line.includes('end') || line.endsWith(':')) {
                indentLevel = Math.max(0, indentLevel - 1);
                convertedLine = indent + 'END';
                lineExplanation = 'Marks the end of a code block';
            }
            
            pseudocode += convertedLine + '\n';
            
            // Add to explanations array
            explanations.push({
                lineNumber: i + 1,
                code: line,
                explanation: lineExplanation
            });
        }
        
        // Generate line-by-line explanation HTML
        explanation = generateLineByLineExplanation(explanations);
        
        return {
            pseudocode: formatPseudocode(pseudocode, format),
            explanation
        };
    }

    function formatComment(text, format) {
        return format === 'beginner' 
            ? '# ' + text
            : '/* ' + text + ' */';
    }

    function convertFunction(line, format) {
        const name = line.replace(/function|def|void|public|private|static/g, '').trim();
        if (format === 'beginner') {
            return '<span class="keyword">START FUNCTION</span>: ' + name;
        } else if (format === 'academic') {
            return '<span class="keyword">PROCEDURE</span> ' + name;
        } else {
            return '<span class="keyword">ALGORITHM</span> ' + name;
        }
    }

    function convertClass(line, format) {
        const name = line.replace('class', '').trim();
        if (format === 'beginner') {
            return '<span class="keyword">START CLASS</span>: ' + name;
        } else {
            return '<span class="keyword">CLASS</span> ' + name;
        }
    }

    function convertConditional(line, format) {
        const condition = line.match(/if\s*\((.*)\)/) || line.match(/if\s+(.*?):/);
        if (format === 'beginner') {
            return '<span class="keyword">CHECK IF</span> ' + (condition ? condition[1] : line);
        } else if (format === 'academic') {
            return '<span class="keyword">IF</span> ' + (condition ? condition[1] : line) + ' <span class="keyword">THEN</span>';
        } else {
            return '<span class="keyword">IF</span> (' + (condition ? condition[1] : line) + ') <span class="keyword">THEN</span>';
        }
    }

    function convertElseIf(line, format) {
        const condition = line.match(/else\s+if\s*\((.*)\)/) || line.match(/elif\s+(.*?):/);
        if (format === 'beginner') {
            return '<span class="keyword">OTHERWISE CHECK IF</span> ' + (condition ? condition[1] : line);
        } else {
            return '<span class="keyword">ELSE IF</span> ' + (condition ? condition[1] : line) + ' <span class="keyword">THEN</span>';
        }
    }

    function convertElse(format) {
        return format === 'beginner' 
            ? '<span class="keyword">OTHERWISE</span>'
            : '<span class="keyword">ELSE</span>';
    }

    function convertLoop(line, format) {
        const condition = line.match(/for\s*\((.*)\)/) || line.match(/for\s+(.*?):/);
        if (format === 'beginner') {
            return '<span class="keyword">REPEAT</span>: ' + (condition ? condition[1] : line);
        } else if (format === 'academic') {
            return '<span class="keyword">FOR</span> ' + (condition ? condition[1] : line) + ' <span class="keyword">DO</span>';
        } else {
            return '<span class="keyword">FOR EACH</span> ' + (condition ? condition[1] : line) + ' <span class="keyword">DO</span>';
        }
    }

    function convertWhileLoop(line, format) {
        const condition = line.match(/while\s*\((.*)\)/) || line.match(/while\s+(.*?):/);
        if (format === 'beginner') {
            return '<span class="keyword">KEEP DOING WHILE</span> ' + (condition ? condition[1] : line);
        } else {
            return '<span class="keyword">WHILE</span> ' + (condition ? condition[1] : line) + ' <span class="keyword">DO</span>';
        }
    }

    function convertAssignment(line, format) {
        const parts = line.split('=');
        if (format === 'beginner') {
            return '<span class="keyword">SET</span> ' + parts[0].trim() + ' <span class="keyword">TO</span> ' + parts[1].trim().replace(';', '');
        } else {
            return parts[0].trim() + ' ← ' + parts[1].trim().replace(';', '');
        }
    }

    function convertReturn(line, format) {
        const value = line.replace('return', '').replace(';', '').trim();
        return format === 'beginner'
            ? '<span class="keyword">GIVE BACK</span> ' + value
            : '<span class="keyword">RETURN</span> ' + value;
    }

    function formatPseudocode(pseudocode, format) {
        const lines = pseudocode.split('\n');
        return lines.map((line, index) => 
            `<span class="line-number">${(index + 1).toString().padStart(2, '0')}</span> ${line}`
        ).join('\n');
    }

    function generateLineByLineExplanation(explanations) {
        let html = '';
        
        explanations.forEach(({lineNumber, code, explanation}) => {
            if (!explanation) return;
            
            html += `
            <div class="line-explanation">
                <div class="line-number">${lineNumber}</div>
                <div class="line-content">
                    <div class="line-code">${code}</div>
                    <div class="line-desc">${explanation}</div>
                </div>
            </div>`;
        });
        
        return html;
    }

    function analyzeComplexity(code, language) {
        const complexityPatterns = {
            // Nested loops patterns
            nestedLoops: /for\s*\([^)]*\)[^{]*{[^}]*for\s*\([^)]*\)/i,
            // Single loop patterns
            singleLoop: /\b(for|while)\b/i,
            // Recursive function calls
            recursion: /\b\w+\s*\([^)]*\)[^{]*{[^}]*\1\s*\(/i,
            // Array/list operations
            arrayOperations: /\b(push|pop|shift|unshift|splice|slice)\b/i,
            // Hash table / dictionary operations
            hashOperations: /\b(Map|Set|Object)\b/i
        };

        let timeComplexity = 'O(1)';
        let timeExplanation = 'Constant time - no loops or recursive operations found.';
        let spaceComplexity = 'O(1)';
        let spaceExplanation = 'Constant space - no additional space grows with input size.';

        // Analyze time complexity
        if (complexityPatterns.nestedLoops.test(code)) {
            timeComplexity = 'O(n²)';
            timeExplanation = 'Quadratic time - contains nested loops.';
        } else if (complexityPatterns.recursion.test(code)) {
            timeComplexity = 'O(log n) to O(2ⁿ)';
            timeExplanation = 'Varies based on recursion pattern - check specific implementation.';
        } else if (complexityPatterns.singleLoop.test(code)) {
            timeComplexity = 'O(n)';
            timeExplanation = 'Linear time - contains single loop iteration.';
        }

        // Analyze space complexity
        if (complexityPatterns.recursion.test(code)) {
            spaceComplexity = 'O(n)';
            spaceExplanation = 'Linear space - recursive calls stack up in memory.';
        } else if (complexityPatterns.arrayOperations.test(code) || complexityPatterns.hashOperations.test(code)) {
            spaceComplexity = 'O(n)';
            spaceExplanation = 'Linear space - uses dynamic data structures.';
        }

        return {
            time: timeComplexity,
            timeExplanation: timeExplanation,
            space: spaceComplexity,
            spaceExplanation: spaceExplanation
        };
    }
});
