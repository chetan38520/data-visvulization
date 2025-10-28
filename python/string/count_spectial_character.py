# Program to count special characters in a given sentence

sentence = input("Enter a sentence: ")
count = 0

for char in sentence:
    if not char.isalnum() and not char.isspace():
        count += 1

print("Number of special characters:", count)
