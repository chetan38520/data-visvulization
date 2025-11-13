# ---------------------------------------------------------------

# Import all shape classes from the shape module
from shape import Cylinder, Cone, Cube, Cubiod, Sphere


# ----------------------------- MAIN FUNCTION -----------------------------
def main():
    """
    This function displays a menu that allows users to select a shape,
    enter its dimensions, and calculate either the curved surface area,
    total surface area, or volume of that shape.
    """

    while True:
        # Display the main shape selection menu
        print("\n--- Select a Shape ---")
        print("1. Cylinder")
        print("2. Cone")
        print("3. Cube")
        print("4. Cuboid")
        print("5. Sphere")
        print("6. Exit")

        # Get user choice for shape
        choice = int(input("Enter your choice: "))

        # Option to exit the program
        if choice == 6:
            print("Exiting program.")
            break

        # Depending on the choice, ask for shape dimensions and create an object
        if choice == 1:
            # Cylinder requires radius and height
            r = float(input("Enter radius: "))
            h = float(input("Enter height: "))
            obj = Cylinder(r, h)

        elif choice == 2:
            # Cone requires radius and height
            r = float(input("Enter radius: "))
            h = float(input("Enter height: "))
            obj = Cone(r, h)

        elif choice == 3:
            # Cube requires only one side length
            a = float(input("Enter side length: "))
            obj = Cube(a)

        elif choice == 4:
            # Cuboid requires length, breadth, and height
            l = float(input("Enter length: "))
            b = float(input("Enter breadth: "))
            h = float(input("Enter height: "))
            obj = Cubiod(l, b, h)

        elif choice == 5:
            # Sphere requires only radius
            r = float(input("Enter radius: "))
            obj = Sphere(r)

        else:
            # Invalid shape option
            print("Invalid choice!")
            continue

        # After creating the shape object, show operation options
        print("\n--- Select Operation ---")
        print("1. Curved Surface Area (CSA)")
        print("2. Total Surface Area (TSA)")
        print("3. Volume")

        # Get user choice for operation
        op = int(input("Enter your choice: "))

        # Perform operation based on user selection
        if op == 1:
            # Call the method to calculate Curved Surface Area
            print("Curved Surface Area =", obj.claculate_total_curved_Surface_Area())

        elif op == 2:
            # Call the method to calculate Total Surface Area
            print("Total Surface Area =", obj.claculate_total_Surface_Area())

        elif op == 3:
            # Call the method to calculate Volume
            print("Volume =", obj.claculate_total_volume())

        else:
            # Invalid operation option
            print("Invalid operation!")


# ----------------------------- PROGRAM ENTRY POINT -----------------------------
# The below condition ensures that main() runs only when this file
# is executed directly, not when imported as a module.
if __name__ == "__main__":
    main()
