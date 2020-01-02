import os
import sys

import ItemObj

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

class GrocList(object):
	def __init__(self, name, items=[]):
		if type(items) != list:
			raise ValueError("Error in GrocListObj: items parameter must be a list")

		self.setName(name)

		self.items = []
		for item in items:
			self.addItem(item)

	"""
	str
	Returns a string describing the Store object
	@input	None
	@return	A string describing the Store object
	"""
	def __str__(self):
		retStr = "%s:\n" % (self.name)

		for item in self.items:
			retStr += "\t%s\n" % (item.getName())

		return(retStr)

	def setName(self, newName):
		if type(newName) != str:
			raise ValueError("Error in GrocListObj: name parameter must be a string")

		self.name = newName

	def getName(self):
		return(self.name)

	def addItem(self, newItem):
		if type(newItem) != ItemObj.Item:
			raise ValueError("Error in GrocListObj: items must be Item objects")

		self.items.append(newItem)

	def getItems(self):
		return(self.items)