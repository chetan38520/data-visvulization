# Program to calculate Area and Perimeter of a Rectangle

# Input: Length and Breadth of the rectangle
length = float(input("Enter the length of the rectangle: "))
breadth = float(input("Enter the breadth of the rectangle: "))

# Formula for Area: length × breadth
area = length * breadth

# Formula for Perimeter: 2 × (length + breadth)
perimeter = 2 * (length + breadth)

# Display the results
print(f"\nArea of the rectangle = {area:.2f}")
print(f"Perimeter of the rectangle = {perimeter:.2f}")
