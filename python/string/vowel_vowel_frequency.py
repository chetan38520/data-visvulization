# Program to count frequency of each vowel in a given sentence

sentence = input("Enter a sentence: ")

# Convert the sentence to lowercase to handle both upper and lower case vowels
sentence = sentence.lower()

# Initialize a dictionary to store vowel counts
vowel_count = {'a': 0, 'e': 0, 'i': 0, 'o': 0, 'u': 0}

# Loop through each character in the sentence
for char in sentence:
    if char in vowel_count:
        vowel_count[char] += 1

# Display the result
print("\nFrequency of each vowel:")
for vowel, count in vowel_count.items():
    print(f"{vowel} : {count}")
