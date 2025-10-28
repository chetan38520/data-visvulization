# Program to count the number of vowels in a given sentence

sentence = input("Enter a sentence: ")
count = 0
vowels = "aeiouAEIOU"

for char in sentence:
    if char in vowels:
        count += 1

print("Number of vowels in the sentence:", count)
    