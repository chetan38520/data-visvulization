# Program to copy data from one file into another file

# Open the source file in read mode and the destination file in write mode
with open("source.txt", "r") as source_file, open("destination.txt", "w") as destination_file:
    # Read all contents from the source file
    file_data = source_file.read()
    
    # Write the data into the destination file
    destination_file.write(file_data)

print("Data has been successfully copied from source.txt to destination.txt.")
