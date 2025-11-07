# Program to calculate Simple Interest

# Input: Principal amount, Rate of interest, and Time period
principal_amount = float(input("Enter the principal amount: "))
rate_of_interest = float(input("Enter the rate of interest (in %): "))
time_period = float(input("Enter the time period (in years): "))

# Formula for Simple Interest: (P × R × T) / 100
simple_interest = (principal_amount * rate_of_interest * time_period) / 100

# Display the result
print(f"\nSimple Interest = {simple_interest:.2f}")
