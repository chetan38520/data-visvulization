# Program to merge two lists of words, remove duplicates, and return a sorted list

# Input two lists of words
list1 = input("Enter first list of words (separated by spaces): ").split()
list2 = input("Enter second list of words (separated by spaces): ").split()

# Merge the two lists
merged_list = list1 + list2

# Remove duplicates using set, then convert back to list
unique_words = list(set(merged_list))

# Sort the list alphabetically
unique_words.sort()

print("\nMerged, unique, and sorted list of words:")
print(unique_words)
