# Program: Report Card Generator

# Step 1: Input subject names and marks
subjects = []
marks = []

for i in range(5):
    subject = input(f"Enter subject {i+1} name: ")
    mark = float(input(f"Enter marks obtained in {subject} (out of 100): "))
    subjects.append(subject)
    marks.append(mark)

# Step 2: Calculate total and percentage
total_marks = sum(marks)
percentage = total_marks / 5

# Step 3: Determine grade based on percentage
if percentage >= 85:
    grade = "A+"
elif percentage >= 75:
    grade = "A"
elif percentage >= 65:
    grade = "B"
elif percentage >= 55:
    grade = "C"
elif percentage >= 50:
    grade = "D"
else:
    grade = "Fail"

# Step 4: Display Report Card
print("\n---------- REPORT CARD ----------")
print("Subject\t\tMarks")
for i in range(5):
    print(f"{subjects[i]}\t\t{marks[i]}")
print("----------------------------------")
print(f"Total Marks: {total_marks}/500")
print(f"Percentage: {percentage:.2f}%")
print(f"Grade: {grade}")
print("----------------------------------")
