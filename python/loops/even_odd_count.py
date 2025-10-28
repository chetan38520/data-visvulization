# Program to count even and odd numbers in a list
numbers = [2, 7, 4, 9, 12, 3]
even = 0
odd = 0

for num in numbers:
    if num % 2 == 0:
        even += 1
    else:
        odd += 1

print("Even numbers:", even)
print("Odd numbers:", odd)
