import numpy
import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

import MiscFuncs as mc

"""
Store object used to model grocery stores.
Stores have a name, width, length, and departments.
"""
class Store(object):
	# The default length, width, and area for a Store
	STORE_LENGTH = 100 # X-Dimenstion
	STORE_WIDTH = 150 # Y-Dimension
	STORE_AREA = STORE_LENGTH * STORE_WIDTH

	"""
	init

	Initializes a new Store object

	@input	name	The name of the store
	@input	width	The width of the store (Default = STORE_WIDTH)
	@input	length	The length of the store (Default = STORE_LENGTH)

	@return	None
	"""
	def __init__(self, name, width=STORE_WIDTH, length=STORE_LENGTH):
		self.name = name

		self.width = width
		self.length = length

		# The departments in the store
		# Keys are the names of the departments, 
		# while the values are the objects themselves
		self.departments = {}

	"""
	str

	Returns a string describing the Store object

	@input	None

	@return	A string describing the Store object
	"""
	def __str__(self):
		retStr = ("Store Name: %s, Width: %d, Length: %d" % (self.name, self.width, self.length))
		for department in self.departments:
			retStr += "\n\t"
			retStr += self.departments[department].__str__().replace("\n", "\n\t")

		return(retStr)

	"""
	addDepartment

	Adds the given Department to the Store

	@input	departmentObj	The Department to add to the list

	@return	None
	"""
	def addDepartment(self, departmentObj):
		self.departments[departmentObj.getName()] = departmentObj

	"""
	getDepartments

	Returns the diictionary of Departments in the store

	@input	None

	@return	The dictionary of Departments in the store
	"""
	def getDepartments(self):
		return(self.departments)
		
	"""
	compDistance

	Compares the distance/similarity between this Store object and
	the given store. Performs the similarity calculation by
	comparing the amound of similar Departments between the two Stores
	along with the Departments areas and locations. A value of 0
	means that the two stores are identical, while a 1 means that they
	are completely different.

	@input	storeObj	The Store to compare with

	@return	The distance/similarity between the two Stores (0 = Identical, 1 = Very different)
	"""
	def compDistance(self, storeObj):
		# First, get the list of departments that the two stores have in common
		sameDepartments = set(self.departments.keys()).intersection(storeObj.getDepartments().getKeys())

		# Loop through all the common Departments and compare their locations and areas					
		averageAreaDiff = 0
		averageDist = 0
		for name in sameDepartments:
			# Get the two departments to compare
			department1 = self.departments[name]
			department2 = storeObj.getDepartments()[name]
			
			# Compare how close the two Departments are in area
			areaDiff = department1.getArea() / department2.getArea()
			if areaDiff > 1:
				areaDiff = 1 / areaDiff
			averageAreaDiff += areaDiff			
			
			# Compare how close the two Departments are in the Store
			averageDist += mc.distBetweenPoints(department1.getCentrePoint(), department2.getCentrePoint()) / mc.distBetweenPoints((0, 0), (self.STORE_LENGTH, self.STORE_WIDTH))
			
		# Compute the three difference metrics as percentags
		averageAreaDiff = 1 - (averageAreaDiff / len(sameDepartments))
		averageDist = averageDist / len(sameDepartments)
		percentSameDepartments = 1 - (len(sameDepartments) / len(self.departments.keys()))
		
		# Return the average difference
		return((averageAreaDiff + averageDist + percentSameDepartments) / 3)

	"""
	getAllItems

	Returns a list of all the items in the Store. Does this by getting
	all the items in each Department.

	@input	None

	@return	The list of all items in the Store
	"""
	def getAllItems(self):
		items = []

		for departmentName in self.departments:
			for item in self.departments[departmentName].getAllItems():
				items.append(item)

		return(items)

	"""
	getName

	Returns the name of the Store

	@input	None

	@return	The name of the Store
	"""
	def getName(self):
		return(self.name)