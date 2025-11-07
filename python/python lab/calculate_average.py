# Program to calculate the average of five numbers

# Input: Five numbers from the user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))
num3 = float(input("Enter third number: "))
num4 = float(input("Enter fourth number: "))
num5 = float(input("Enter fifth number: "))

# Calculate the average
average = (num1 + num2 + num3 + num4 + num5) / 5

# Display the result
print(f"\nThe average of the five numbers is: {average:.2f}")
