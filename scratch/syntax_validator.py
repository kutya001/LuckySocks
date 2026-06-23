# scratch/syntax_validator.py
import re

files = [
    'js/store.js',
    'js/main.js',
    'js/modules/documents.js',
    'js/modules/about.js'
]

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Remove comments and strings to check only code structure
        # Strip block comments
        code_clean = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        # Strip line comments
        code_clean = re.sub(r'//.*', '', code_clean)
        # Strip template literals
        code_clean = re.sub(r'`.*?`', '``', code_clean, flags=re.DOTALL)
        # Strip single-quoted strings
        code_clean = re.sub(r"'.*?'", "''", code_clean)
        # Strip double-quoted strings
        code_clean = re.sub(r'".*?"', '""', code_clean)

        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        line_no = 1
        col_no = 1
        
        # We can also track where bracket starts
        for char in code_clean:
            if char == '\n':
                line_no += 1
                col_no = 1
                continue
            
            if char in '({[':
                stack.append((char, line_no, col_no))
            elif char in ')}]':
                if not stack:
                    print(f"Unmatched closing bracket '{char}' in {filepath} at line {line_no}, col {col_no}")
                    break
                top, l, c = stack.pop()
                if mapping[char] != top:
                    print(f"Mismatched bracket in {filepath}: expected matching for '{top}' from line {l}, col {c}, but found '{char}' at line {line_no}, col {col_no}")
                    break
            col_no += 1
        else:
            if stack:
                top, l, c = stack[-1]
                print(f"Unclosed bracket '{top}' in {filepath} from line {l}, col {c}")
            else:
                print(f"Brackets OK: {filepath}")
    except Exception as e:
        print(f"Error checking {filepath}: {e}")
