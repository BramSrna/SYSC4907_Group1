"""
Aisle object used to simulate Aisles from grocery stores.
Aisles are identified using a number and list of tags.
Tags are the words you see on the signs above aisles
detailing the types of item in the aisle.
Finally, each aisle is contains a list of items found
inside of the aisle.
"""
class Aisle(object):
	"""
	init

	Initialize a new Aisle object.

	@input	aisleNum	The number of this aisle
	@input	tags		The list of tags for this aisle

	@return	None
	"""					
	def __init__(self, aisleNum, tags):
		self.aisleNum = aisleNum
		self.aisleTags = tags
		self.items = []
	
	"""
	addTag

	Adds the given tag to this aisle's list of tags.

	@input	newTag	The tag to add to the list

	@return	None
	"""
	def addTag(self, newTag):
		self.aisleTags.append(newTag)
		
	"""
	getTags

	Returns this aisle's list of tags.

	@input	None

	@return	The list of tags
	"""
	def getTags(self):
		return(self.aisleTags)

	"""
	addItem

	Adds the given item to this aisle's list of items

	@input	newItem	The item to add to the list

	@return	None
	"""
	def addItem(self, newItem):
		self.items.append(newItem)

	"""
	getNumber

	Returns this aisle's number

	@input	None

	@return	This aisle's number
	"""
	def getNumber(self):
		return(self.aisleNum)
		
	"""
	compDist

	Computes the distance (similarity) between this aisle
	and the given aisle. Performs this comparison by
	comparing the percentage of tags and items that the two aisles
	have in common. A value of 0 means the aisles are identical,
	while a value of 1 means they are completely different.

	@input	aisleObj	The aisle to compare with this aisle

	@return	The similary between the two aisles (0 = identical, 1 = Completely different)
	"""
	def compDist(self, aisleObj):
		# Check the percentage of tags the two aisles have in common
		similarTags = set(self.aisleTags).intersection(aisleObj.getTags())
		percentSimilarTags = len(similarTags) / len(self.aisleTags)

		# Check the percentage of items the two aisles have in common
		similarCount = 0
		for item in aisleObj.getAllItems():
			if any(item.getName() == item2.getName() for item2 in self.items):
				similarCount += 1
		percentSimilarItems = similarCount / len(self.items)

		# Get the average of the two percentages
		percentSimilar = (percentSimilarItems + percentSimilarTags) / 2
		
		return(1 - percentSimilar)

	"""
	str

	Returns a string describing this aisle

	@input	None

	@return	String describing this aisle
	"""
	def __str__(self):
		strToRet = ("Aisle Number: %d, Tags: %s" % (self.aisleNum, self.aisleTags))

		for item in self.items:
			strToRet += "\n\t"
			strToRet += item.__str__().replace("\n", "\n\t")

		return(strToRet)

	"""
	getAllItems

	Returns the list of items inside of this aisle

	@input	None

	@return	List of items in this aisle
	"""
	def getAllItems(self):
		return(self.items)