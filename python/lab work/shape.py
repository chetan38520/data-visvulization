
# Define the value of PI
PI = 3.1416


# --------------------- CYLINDER CLASS ---------------------
class Cylinder:
    # Constructor: initializes radius and height
    def __init__(self, radius, height):
        self.r = radius
        self.h = height

    # Function to calculate Curved Surface Area (CSA)
    def claculate_total_curved_Surface_Area(self):
        return 2 * PI * self.r * self.h

    # Function to calculate Total Surface Area (TSA)
    def claculate_total_Surface_Area(self):
        return 2 * PI * self.r * (self.r + self.h)

    # Function to calculate Volume
    def claculate_total_volume(self):
        return PI * self.r**2 * self.h


# --------------------- CONE CLASS ---------------------
class Cone:
    # Constructor: initializes radius and height and computes slant height
    def __init__(self, radius, height):
        self.r = radius
        self.h = height
        self.l = (self.r**2 + self.h**2) ** 0.5  # Slant height formula

    # Function to calculate Curved Surface Area (CSA)
    def claculate_total_curved_Surface_Area(self):
        return PI * self.r * self.l

    # Function to calculate Total Surface Area (TSA)
    def claculate_total_Surface_Area(self):
        return PI * self.r * (self.l + self.r)

    # Function to calculate Volume
    def claculate_total_volume(self):
        return (1 / 3) * PI * self.r**2 * self.h


# --------------------- CUBE CLASS ---------------------
class Cube:
    # Constructor: initializes side length
    def __init__(self, side):
        self.a = side

    # Function to calculate Curved Surface Area (CSA)
    def claculate_total_curved_Surface_Area(self):
        return 4 * self.a**2

    # Function to calculate Total Surface Area (TSA)
    def claculate_total_Surface_Area(self):
        return 6 * self.a**2

    # Function to calculate Volume
    def claculate_total_volume(self):
        return self.a**3


# --------------------- CUBOID CLASS ---------------------
class Cubiod:
    # Constructor: initializes length, breadth, and height
    def __init__(self, l, b, h):
        self.l = l
        self.b = b
        self.h = h

    # Function to calculate Curved Surface Area (CSA)
    def claculate_total_curved_Surface_Area(self):
        return 2 * self.h * (self.l + self.b)

    # Function to calculate Total Surface Area (TSA)
    def claculate_total_Surface_Area(self):
        return 2 * (self.l * self.b + self.b * self.h + self.l * self.h)

    # Function to calculate Volume
    def claculate_total_volume(self):
        return self.l * self.b * self.h


# --------------------- SPHERE CLASS ---------------------
class Sphere:
    # Constructor: initializes radius
    def __init__(self, radius):
        self.r = radius

    # Function to calculate Curved Surface Area (CSA)
    def claculate_total_curved_Surface_Area(self):
        return 4 * PI * self.r**2

    # Function to calculate Total Surface Area (TSA)
    def claculate_total_total_Surface_Area(self):
        return 4 * PI * self.r**2

    # Function to calculate Volume
    def claculate_total_volume(self):
        return (4 / 3) * PI * self.r**3


