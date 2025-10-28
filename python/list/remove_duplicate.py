# Program to remove duplicates from a list
numbers = [1, 2, 2, 3, 4, 4, 5, 5]
unique = []

for num in numbers:
    if num not in unique:
        unique.append(num)

print("Original list:", numbers)
print("List after removing duplicates:", unique)
