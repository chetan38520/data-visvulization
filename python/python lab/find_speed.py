# Program to calculate speed

# Input: Distance traveled and time taken
distance = float(input("Enter the distance traveled (in kilometers): "))
time = float(input("Enter the time taken (in hours): "))

# Formula for Speed: speed = distance / time
# Check to avoid division by zero
if time != 0:
    speed = distance / time
    print(f"\nThe speed is {speed:.2f} km/h")
else:
    print("\nTime cannot be zero. Speed cannot be calculated.")
