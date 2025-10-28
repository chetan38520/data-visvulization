# Program to find and display all palindrome words in a given sentence

sentence = input("Enter a sentence: ")

# Split the sentence into individual words
words = sentence.split()

# List to store palindrome words
palindromes = []

for word in words:
    # Remove punctuation and convert to lowercase
    clean_word = ''.join(ch for ch in word if ch.isalnum()).lower()
    
    # Check if the word is a palindrome
    if clean_word == clean_word[::-1] and clean_word != '':
        palindromes.append(word)

# Display the result
if palindromes:
    print("\nPalindrome words in the sentence:")
    for p in palindromes:
        print(p)
else:
    print("\nNo palindrome words found in the sentence.")
