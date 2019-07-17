import operator
import copy
import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

import DepartmentObj
from MiscFuncs import getHighestNKeysInDict

# trainingItems is a list of all known items used to train the algorithm
trainingItems = []

"""
addTrainingObject

Adds the given Item object to the list of known items.

@input	item	The Item object to add to the list

@return	None
"""
def addTrainingObject(item):
    trainingItems.append(item)

"""
estimateLoc

Estimates the given location of an Item with the given name.
Additionaly information such as the Store, Department, or Aisle
can be given to increase the accuracy of the estimation.

The location estimation is determined by performing a majority
calculation to retrieve the most likely department and aisle
tags. If the store/department/aisle is given, then the 
distance location of known items is weighed such that items
more similar to the known parameters will have a larger weight.

@input	knownItems		The list of known items
@input	itemName		The name of the item to estimate the location of
@input	storeObj		The store the item is in (Default = None)
@input	departmentObj	The department the item is in (Default = None)
@input	aisleObj		The aisle the item is in

@return	The name of the department the item is most likely in
		as well as the three most likely tags of the aisle
"""
def estimateLoc(knownItems, itemName, storeObj=None, departmentObj=None, aisleObj=None):
	# First, get the list of all items with the same name
	matchingItems = []
	for item in knownItems:
		if (item.getName() == itemName):
			matchingItems.append(item)
			
	# These two dictionaries contain the count for each department and aisle
	departmentCount = {}
	aisleTagCount = {}
	
	# Next loop through all items with same name to get the
	# most likely department names and aisle tags using a majority
	for item in matchingItems:
		# Get the location of the item
		itemLoc = item.getLoc()
		
		# Use a weight of 1 for each item by default
		storeDist = 1
		departmentDist = 1
		aisleDist = 1
		
		# If any information about the item's location has been given,
		# use it to weight the current item
		if storeObj != None:
			storeDist = item.getStore().calcDist(storeObj)
			
		if departmentObj != None:
			departmentDist = item.getDepartment().calcDist(departmentObj)
			
		if aisleObj != None:
			aisleDist = item.getAisle().calcDist(aisleObj)
			
		# Get the average weight
		weight = (storeDist + departmentDist + aisleDist) / 3
		
		# Increment the department name in the tracking dictionary
		departmentName = itemLoc.getDepartment().getName()
		if departmentName in departmentCount:
			departmentCount[departmentName] += weight
		else:
			departmentCount[departmentName] = weight
			
		tags = itemLoc.getAisle().getTags()
		
		# Increment all tags in the tracking dictionary
		for tag in tags:
			if tag in aisleTagCount:
				aisleTagCount[tag] += weight
			else:
				aisleTagCount[tag] = weight
				
	# Get the department name with the highest count
	# And three aisles with highest count
	departmentName = getHighestNKeysInDict(departmentCount, highestN = 1)
	aisleTags = getHighestNKeysInDict(aisleTagCount, highestN = 3)

	return(departmentName, aisleTags)