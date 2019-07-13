import Algorithm as alg

# This is the list of all valid department names
ValidDepartments = ["BAKERY",\
                    "BEER",\
                    "BULK",\
                    "CHEESE",\
                    "COFFE_AND_TEA",\
                    "FLOWERS_AND_FLORAL_ARRANGEMENTS",\
                    "GROCERY",\
                    "MEAT_AND_POULTRY",\
                    "PREPARED_FOODS",\
                    "PRODUCE",\
                    "SEAFOOD",\
                    "WINE",\
                    "WHOLE_BODY",\
                    "PETS"]

"""
Department object used to model real life departments found
in grocery stores. Departments have a name, four coordinates
showing where the department is in the store, a length and
width, and a list of aisles.
"""
class Department(object):
	# The minimum length and widths for Departments
    MIN_LENGTH = 1 # X-Dimenstion
    MIN_WIDTH = 1 # Y-Dimension

    """
    init

    Initializes a new Department object.

    @input  name        The name of the Department
    @input  topLeft     The top left coordinate of the Department
    @input  bottomRight The bottom right coordinate of the Department

    @return None
    """
    def __init__(self, name, topLeft, bottomRight):
        self.name = name

        self.topLeft = topLeft
        self.bottomRight = bottomRight

        # Calculate the length and width of the department
        self.length = self.bottomRight[0] - self.topLeft[0]
        self.width = self.bottomRight[1] - self.topLeft[1]

        # Use the length and width and known coordinates to get the unknown coordinates
        self.topRight = [topLeft[0], topLeft[1] + self.length]
        self.bottomLeft = [bottomRight[0], bottomRight[1] - self.length]

        self.aisles = []

    """
    getTopLeftVertex

    Returns the top left coordinates of the Department

    @input  None

    @return The top left coodinates
    """
    def getTopLeftVertex(self):
        return(self.topLeft)

    """
    getTopRightVertex

    Returns the top right coordinates of the Department

    @input  None

    @return The top right coordinates of the Department
    """
    def getTopRightVertex(self):
        return(self.topRight)

    """
    getBottomLeftVertex

    Returns the top left coordinates of the Department

    @input  None

    @return The bottom left coordinates of the Department
    """
    def getBottomLeftVertex(self):
        return(self.bottomLeft)

    """
    getBottomRightVertex

    Returns the bottom right coordinates of the Department

    @input  None

    @return The bottom right coordinates of the Department
    """
    def getBottomRightVertex(self):
        return(self.bottomRight)

    """
    getWidth

    Returns the width of the Department

    @input  None

    @return The width of the Department
    """
    def getWidth(self):
        return(self.width)

    """
    getLength

    Returns the length of the Department

    @input  None

    @return The length of the department
    """
    def getLength(self):
        return(self.length)

    """
    getArea

    Returns the area of the Department

    @input  None

    @return The area of the Department
    """
    def getArea(self):		
        return(self.length * self.width)

    """
    getCentrePoint

    Returns the coordinates of the centre of the department.

    @input  None

    @return The coordinates of the centre of the Department
    """
    def getCentrePoint(self):
        # Centre point is (top left x-coordinate + length / 2, top left y-coordinate + width / 2)
        x = self.topLeft[0] + self.length / 2
        y = self.topLeft[1] + self.width / 2

        return([x, y])

    """
    compDistance

    Returns the distance/similarity of this Department and the given Department.
    Performs the similarity calculation by determining the percentage of
    items the two items have in common. A value of 0 means the two
    Departments are identical and 1 means the items are completely different.

    @input  departmentObj   The Department to compare with this Department

    @return The distance/similarity of the two object (0 = identical, 1 = different)
    """
    def compDistance(self, departmentObj):
        # Get the two list of items
        itemList1 = self.getAllItems()
        itemList2 = departmentObj.getAllItems()

        # Count how many items the two have in common
        itemCount = 0
        for item in itemList1:
            if any(item.getName() == item2.getName() for item2 in itemList2):
                itemCount += 1

        # Calculate the percentage
        percentageSimilarity = itemCount / len(itemList1)

        return(1 - percentageSimilarity)
	
    """
    getName

    Returns the name of this Department.

    @input  None

    @return The name of this Department
    """
    def getName(self):
        return(self.name)

    """
    addAisle

    Adds the given aisle to the list of aisles

    @input  aisleToAdd  The aisle object to add to the list

    @return None
    """
    def addAisle(self, aisleToAdd):
        self.aisles.append(aisleToAdd)

    """
    getAllItems
    
    Returns a list of all items found inside of this Department
    in all of its internal aisles.

    @input  None

    @return A list of all items found inside of this Department
    """
    def getAllItems(self):
        items  = []

        for aisle in self.aisles:
            for item in aisle.getAllItems():
                items.append(item)

        return(items)

    """
    str

    Returns a string describing this Department object

    @input  None

    @return String describing this Department object
    """
    def __str__(self):
        strToRet = ("Department Name: %s, Top Left: %s, Top Right: %s, Bottom Left: %s, Bottom Right: %s" % 
            (self.name, self.topLeft, self.topRight, self.bottomLeft, self.bottomRight))

        for aisle in self.aisles:
            strToRet += "\n\t"
            strToRet += aisle.__str__().replace("\n", "\n\t")

        return(strToRet)