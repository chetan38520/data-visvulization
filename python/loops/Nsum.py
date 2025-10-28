# Program to find the sum of first N natural numbers
n = int(input("Enter a number: "))
total = 0

for i in range(1, n + 1):
    total += i

print("Sum of first", n, "natural numbers is:", total)
