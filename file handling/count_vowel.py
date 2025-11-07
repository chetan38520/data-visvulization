# Program to count the number of vowels in a given file

# Define a set of vowels (both uppercase and lowercase)
vowels = "aeiouAEIOU"

# Initialize vowel count to zero
vowel_count = 0

# Open the file in read mode
with open("sample.txt", "r") as file:
    # Read the file line by line
    for line in file:
        # Check each character in the line
        for char in line:
            # If the character is a vowel, increase the count
            if char in vowels:
                vowel_count += 1

print("Total number of vowels in the file:", vowel_count)
