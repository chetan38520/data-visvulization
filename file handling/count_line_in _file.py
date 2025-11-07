# Program to count the number of lines in a given file

# Open the file in read mode
with open("sample.txt", "r") as file:
    # Read all lines from the file and store them in a list
    lines = file.readlines()

# Count the total number of lines
line_count = len(lines)

print("Total number of lines in the file:", line_count)
