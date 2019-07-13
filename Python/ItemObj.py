from ItemLocObj import ItemLoc

"""
Item object used to model real life items
found inside of grocery stores. Each Item
has a name and a location given using an
ItemLoc object.
"""
class Item(object):
    """
    init

    Intitializes a new Item object.

    @input  name    The name of the Item
    @input  locationObj The location of the Item

    @return None
    """
    def __init__(self, name, locationObj):
        self.name = name
        self.location = locationObj

    """
    str

    Returns a string describing this Item object.

    @input  None

    @return A string describing this Item object.
    """
    def __str__(self):
        return("Item Name: %s" % (self.name))

    """
    getName

    Returns the name of this Item

    @input  None

    @return The name of the Item
    """
    def getName(self):
        return(self.name)
		
    """
    getLoc

    Returns the location of this Item

    @input  None

    @return The location of the Item
    """
    def getLoc(self):
        return(self.location)