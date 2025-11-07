# Program to count the number of characters in a given file

# Open the file in read mode
with open("sample.txt", "r") as file:
    # Read the entire content of the file
    file_content = file.read()

# Count the total number of characters (including spaces and newlines)
character_count = len(file_content)

print("Total number of characters in the file:", character_count)
