# Program to display Fibonacci series up to n terms
n = int(input("Enter number of terms: "))
a, b = 0, 1

print("Fibonacci Series:", end=" ")
for i in range(n):
    print(a, end=" ")
    a, b = b, a + b
