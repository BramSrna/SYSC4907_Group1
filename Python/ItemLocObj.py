"""
ItemLoc object used to store the locations
of each Item. Each ItemLoc object belongs to one
and only one Item. The ItemLoc object has a
Store, Department, and Aisle.
"""
class ItemLoc(object):
	"""
	init	

	Initializes a new ItemLoc object.

	@input	storeObj		The Store for this ItemLoc
	@input	departmentObj	The Department for this ItemLoc
	@input	aisleObj		The Aisle for this ItemLoc

	@return	None
	"""
	def __init__(self, storeObj, departmentObj, aisleObj):
		self.store = storeObj
		self.department = departmentObj
		self.aisle = aisleObj
		
	"""
	calcDist

	Calculates the distance/similarity between this ItemLoc
	and the given ItemLoc. Performs this calculation by
	determining the distance between the two Stores, Departments,
	and Aisles, and then determining the average of the three
	distances. A value of 0 means the two ItemLocs are the same,
	while 1 means they are completely different.

	@input	secondLoc	The ItemLoc object to compare with this ItemLoc

	@return	The distance beteen the two ItemLoc (0 = Identical, 1 = Completely different)
	"""
	def calcDist(self, secondLoc):
		storeDist = self.store.compDistance(secondLoc.getStore())		
		departmentDist = self.department.compDistance(secondLoc.getDepartment())
		aisleDist = self.aisle.compDistance(secondLoc.getAisle())
		
		return((storeDist + departmentDist + aisleDist) / 3)
		
	"""
	getStore

	Returns the Store for this ItemLoc

	@input	None
	
	@return	The Store for this ItemLoc
	"""
	def getStore(self):
		return(self.store)
		
	"""
	getDepartment

	Returns the Department for this ItemLoc

	@input	None

	@return	The Department for this ItemLoc
	"""
	def getDepartment(self):
		return(self.department)
		
	"""
	getAisle

	Returns the Aisle for this ItemLoc

	@input	None

	@return	The Aisle for this ItemLoc
	"""
	def getAisle(self):
		return(self.aisle)