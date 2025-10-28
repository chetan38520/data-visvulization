# Program to reverse every word in a given sentence but keep word order same

sentence = input("Enter a sentence: ")

# Split the sentence into words
words = sentence.split()

# Reverse each word using slicing [::-1]
reversed_words = [word[::-1] for word in words]

# Join the reversed words back into a sentence
result = ' '.join(reversed_words)

print("\nSentence after reversing each word:")
print(result)
