#!/usr/bin/env python3
"""
Documentation Structure Verification Script

This script verifies the ProductivityPro documentation structure:
1. Checks that all referenced files exist
2. Validates internal links
3. Ensures all directories have README.md files
4. Checks for broken cross-references
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Set, Tuple

# Constants
DOCS_ROOT = Path(__file__).parent.parent
IGNORE_DIRS = {'.git', '.github', 'node_modules', 'scripts', 'assets'}
IGNORE_FILES = {'LICENSE', '.gitignore', 'package.json', 'package-lock.json'}

# Regular expressions
LINK_PATTERN = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
HEADER_PATTERN = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)


def find_markdown_files(root_dir: Path) -> List[Path]:
    """Find all markdown files in the directory structure."""
    markdown_files = []
    for path in root_dir.glob('**/*.md'):
        if any(ignore_dir in path.parts for ignore_dir in IGNORE_DIRS):
            continue
        markdown_files.append(path)
    return markdown_files


def extract_links(file_path: Path) -> List[Tuple[str, str]]:
    """Extract all markdown links from a file."""
    content = file_path.read_text(encoding='utf-8')
    return LINK_PATTERN.findall(content)


def extract_headers(file_path: Path) -> Dict[str, str]:
    """Extract all headers from a file and convert to IDs."""
    content = file_path.read_text(encoding='utf-8')
    headers = {}
    for level, text in HEADER_PATTERN.findall(content):
        # Convert header to GitHub-style ID
        header_id = text.lower().replace(' ', '-')
        header_id = re.sub(r'[^\w-]', '', header_id)
        headers[header_id] = text
    return headers


def verify_links(files: List[Path]) -> List[str]:
    """Verify all links in the markdown files."""
    errors = []
    file_headers = {file: extract_headers(file) for file in files}
    file_set = {file.relative_to(DOCS_ROOT) for file in files}
    
    for file_path in files:
        rel_path = file_path.relative_to(DOCS_ROOT)
        links = extract_links(file_path)
        
        for link_text, link_target in links:
            # Skip external links and anchors
            if link_target.startswith(('http://', 'https://', '#')):
                continue
                
            # Split target into file and anchor
            if '#' in link_target:
                target_file, anchor = link_target.split('#', 1)
            else:
                target_file, anchor = link_target, None
                
            # Resolve relative path
            if target_file:
                target_path = (file_path.parent / target_file).resolve().relative_to(DOCS_ROOT)
                
                # Check if file exists
                if target_path not in file_set:
                    errors.append(f"Broken link in {rel_path}: '{link_text}' -> '{link_target}' (file not found)")
                    continue
                    
                # Check if anchor exists
                if anchor and target_path in file_set:
                    target_headers = file_headers[DOCS_ROOT / target_path]
                    if anchor not in target_headers:
                        errors.append(f"Broken link in {rel_path}: '{link_text}' -> '{link_target}' (anchor not found)")
    
    return errors


def verify_readmes(root_dir: Path) -> List[str]:
    """Verify that each directory has a README.md file."""
    errors = []
    for path in root_dir.glob('**'):
        if not path.is_dir() or path.name.startswith('.') or path.name in IGNORE_DIRS:
            continue
            
        readme_path = path / 'README.md'
        if not readme_path.exists():
            rel_path = path.relative_to(DOCS_ROOT)
            errors.append(f"Missing README.md in directory: {rel_path}")
    
    return errors


def verify_cross_references(files: List[Path]) -> List[str]:
    """Verify cross-references between task, phase, and component documentation."""
    errors = []
    
    # Extract task IDs from task files
    task_ids = set()
    task_files = [f for f in files if f.name.endswith('-tasks.md')]
    task_id_pattern = re.compile(r'## Task (T\d+\.\d+)')
    
    for task_file in task_files:
        content = task_file.read_text(encoding='utf-8')
        task_ids.update(task_id_pattern.findall(content))
    
    # Check phase files for task references
    phase_files = [f for f in files if f.name.startswith('phase') and f.name.endswith('.md')]
    task_ref_pattern = re.compile(r'- \*\*(T\d+\.\d+)\*\*')
    
    for phase_file in phase_files:
        content = phase_file.read_text(encoding='utf-8')
        refs = task_ref_pattern.findall(content)
        
        for ref in refs:
            if ref not in task_ids:
                rel_path = phase_file.relative_to(DOCS_ROOT)
                errors.append(f"Task reference in {rel_path} not found in task documentation: {ref}")
    
    return errors


def main():
    """Main function to verify documentation structure."""
    print("Verifying ProductivityPro documentation structure...")
    
    # Find all markdown files
    markdown_files = find_markdown_files(DOCS_ROOT)
    print(f"Found {len(markdown_files)} markdown files")
    
    # Verify links
    link_errors = verify_links(markdown_files)
    if link_errors:
        print("\nBroken links found:")
        for error in link_errors:
            print(f"  - {error}")
    else:
        print("\nAll links are valid")
    
    # Verify READMEs
    readme_errors = verify_readmes(DOCS_ROOT)
    if readme_errors:
        print("\nMissing README.md files:")
        for error in readme_errors:
            print(f"  - {error}")
    else:
        print("\nAll directories have README.md files")
    
    # Verify cross-references
    xref_errors = verify_cross_references(markdown_files)
    if xref_errors:
        print("\nBroken cross-references:")
        for error in xref_errors:
            print(f"  - {error}")
    else:
        print("\nAll cross-references are valid")
    
    # Summary
    total_errors = len(link_errors) + len(readme_errors) + len(xref_errors)
    if total_errors > 0:
        print(f"\nFound {total_errors} issues in documentation structure")
        return 1
    else:
        print("\nDocumentation structure verification completed successfully")
        return 0


if __name__ == "__main__":
    sys.exit(main())