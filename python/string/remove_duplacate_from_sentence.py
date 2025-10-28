# Program to remove duplicate words from a given sentence while keeping order same

sentence = input("Enter a sentence: ")

words = sentence.split()   # Split sentence into words
unique_words = []          # List to store unique words

for word in words:
    if word not in unique_words:
        unique_words.append(word)

# Join the unique words back into a sentence
result = ' '.join(unique_words)

print("\nSentence after removing duplicate words:")
print(result)
