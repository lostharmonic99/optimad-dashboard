import os

# List of folder names to ignore (case insensitive check)
ignore_folders = {'.git', 'node_modules', 'venv', '__pycache__', '.venv'}

# List of specific filenames or patterns to ignore
ignore_files = {'cli', 'commands', 'metadata'}

def print_file_structure(path='.', level=0):
    """
    Recursively prints the directory structure while ignoring specified folders and files.
    
    :param path: Path to the directory to start printing from.
    :param level: Current level of recursion (used for indentation).
    """
    # List files and directories in the current directory
    try:
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            
            # If it's a directory, check if it should be ignored
            if os.path.isdir(item_path):
                # Convert folder name to lowercase for case-insensitive comparison
                if item.lower() not in ignore_folders:
                    print('  ' * level + f"[DIR] {item}")
                    print_file_structure(item_path, level + 1)  # Recurse into subdirectory
            else:
                # If it's a file, check if its name should be ignored
                if any(ignored_file.lower() in item.lower() for ignored_file in ignore_files):
                    continue  # Skip this file
                
                # Otherwise, print the file
                print('  ' * level + f"[FILE] {item}")
    except PermissionError:
        print('  ' * level + "[ACCESS DENIED]")

# Start from the current directory
print_file_structure()
