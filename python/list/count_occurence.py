# Program to count how many times an element appears in a list
numbers = [2, 4, 2, 6, 2, 8, 4, 2]
element = int(input("Enter number to count: "))

count = numbers.count(element)

print(f"{element} appears {count} times in the list.")
