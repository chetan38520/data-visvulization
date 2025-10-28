# Program to sort words of a sentence by their length

sentence = input("Enter a sentence: ")

# Split the sentence into words
words = sentence.split()

# Sort the list of words based on their length
sorted_words = sorted(words, key=len)

print("\nWords sorted by their length:")
print(sorted_words)
