from FPTreeObj import FPTree
from copy import copy

from itertools import chain, combinations

def calcSupport(itemSubset, allTransactions):
    numIncludes = 0

    for currTransaction in allTransactions:
        if (itemSubset.issubset(currTransaction)):
            numIncludes += 1

    support = float(numIncludes) / len(allTransactions)

    return support

def calcConfidence(ruleToCheck, allTransactions):
    prior = ruleToCheck.getPrior()
    antecedent = ruleToCheck.getAntecedent()

    union = antecedent.union(prior)

    numerator = calcSupport(union, allTransactions)
    denominator = calcSupport(prior, allTransactions)

    confidence = numerator / denominator

    return confidence

def constructFPtree(allTransactions):
    supportMap = {}

    for currTransaction in allTransactions:
        for item in currTransaction:
            if item not in supportMap:
                supp = calcSupport(set(item), allTransactions)
                supportMap[item] = supp

    descOrder = list(reversed(sorted(supportMap, key=lambda item: supportMap[item])))

    descOrder = ["B", "E", "A", "C", "D"]

    tree = FPTree()

    for currTransaction in allTransactions:
        sortedItem = sorted(currTransaction, key=lambda item: descOrder.index(item))

        tree.addPath(sortedItem)

    return(tree)

def powerset(iterable):
    s = list(iterable)
    return chain.from_iterable(combinations(s, r) for r in range(1, len(s)+1))

def mineTree(tree, root = True, currPath = None):
    paths = {}

    item = tree.getItem()

    if (currPath == None):
        currPath = []
        temp = currPath
    else:
        temp = copy(currPath)
        temp.append(item)

    if (root == False):
        if (item not in paths):
            paths[item] = []

        paths[item].append((tree.getCount(), currPath))

    children = tree.getChildren()
    for child in children:
        tempPaths = mineTree(child, root=False, currPath=temp)
        for item in tempPaths:
            if item in paths:
                paths[item] += tempPaths[item]
            else:
                paths[item] = tempPaths[item]

    if (root == False):
        return(paths)
    else:
        rules = set()
        for item in paths:
            for currList in paths[item]:
                currPowerset = list(powerset(currList[1]))
                currPowerset = [list(x) for x in currPowerset]
                currRuleSet = [[item] + x for x in currPowerset]
                rules.update(set(tuple(i) for i in currRuleSet))
        for rule in rules:
            print(rule)


def formatTransactions(allTransactions):
    newTransactions = []
    for transaction in allTransactions:
        newTransactions.append(set(transaction))
    return(newTransactions)

if __name__ == "__main__":
    transactions = [["B", "E", "A", "D"],
                    ["B", "C", "E"],
                    ["A", "B", "D", "E"],
                    ["A", "B", "C", "E"],
                    ["A", "B", "C", "D", "E"],
                    ["B", "C", "D"]]

    transactions = formatTransactions(transactions)

    tree = constructFPtree(transactions)

    mineTree(tree)