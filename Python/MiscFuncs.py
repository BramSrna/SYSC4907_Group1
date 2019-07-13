import math
import copy

"""
distBetweenPoints

Returns the distance between the two given cartesian
points. Uses the following formula:
	Distance = Square_Root((x2 - x1) ^ 2 + (y2 - y1) ^ 2)

@input	point1	The first cartesian coordinate
@input	point2	The second cartesian coordinate

@return	The distance between the two cartesian coordinates
"""
def distBetweenPoints(point1, point2):
	x1 = point1[0]
	y1 = point1[1]
	
	x2 = point2[0]
	y2 = point2[1]
	
	dist = math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2))
	
	return(dist)

"""
getHighestNKeysInDict

Returns the key in the dictionary that has the highest value.
	For example, if the dictionary was:
		{A: 7,
		B: -3,
		C: 16}
	This function would return C

If highestN is given, it will return the highestN 
"""
def getHighestNKeysInDict(dictToCheck, highestN = 1):
	dictCopy = copy.copy(dictToCheck)
	
	listToRet = []
	
	for _ in range(highestN):
		if dictCopy:
			key = max(dictCopy, key=dictCopy.get)
			listToRet.append(key)	
			dictCopy.pop(key)
		else:
			listToRet.append(None)
		
	return(listToRet)