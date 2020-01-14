const MIN_SUPPORT_THRESH = 0;

class Rule {
    constructor(prior, antecedent) {
        this.prior = prior;
        this.antecedent = antecedent;
    }

    getPrior() {
        return(this.prior);
    }

    getAntecedent() {
        return(this.antecedent);
    }
}

class Node {
    constructor(item) {
        this.item = item;
        this.count = 1;
        this.children = [];
    }

    addChild(childItem) {
        var newChild = new Node(childItem);
        this.children.push(newChild);
        return(newChild);
    }
}

class FPTree {
    constructor(){
        this.root = null;
    }

    addPath(listOfItems){
        var currNode = this.root;
        while (listOfItems.length > 0) {
            var currVal = listOfItems[0];

            var ind = currNode.children.indexOf(currVal)
            if (ind === -1) {
                currNode = currNode.addChild(currVal);
            } else {
                currNode.incCount();
                currNode = currNode.children[ind];
            }
            
            listOfItems.splice(0, 1);
        }
    }
}

function calcSupport(itemSubset, allTransactions) {
    var numIncludes = 0;

    for (var i = 0; i < allTransactions.length; i++) {
        var currTransaction = allTransactions[i];
        var success = itemSubset.every(val => currTransaction.includes(val));
        if (success) {
            numIncludes += 1;
        }
    }

    var support = numIncludes / allTransactions.length;

    return(support);
}

function calcConfidence(ruleToCheck, allTransactions) {
    var prior = ruleToCheck.getPrior();
    var antecedent = ruleToCheck.getAntecedent();

    var union = antecedent.concat(prior);

    var numerator = calcSupport(union, allTransactions);
    var denominator = calcSupport(prior, allTransactions);

    var confidence = numerator / denominator;

    return(confidence);
}

function constructFPTree(allTransactions) {
    var supportMap = {};

    for (var i = 0; i < allTransactions.length; i++) {
        var currTransaction = allTransactions[i];
        for (var j = 0; j < currTransaction.length; j++) {
            var item = currTransaction[j];

            if (!(item in supportMap)) {
                var supp = calcSupport(item, allTransactions);

                supportMap[item] = supp;
            }
        }
    }

    var descOrder = [];
    for (var item in supportMap) {
        descOrder.push([item, supportMap[item]]);
    }

    descOrder.sort(function(a, b) {
        return (a[1] < b[1]) ? -1 : (a[1] > b[1]) ? 1 : 0;
    });

    var finalOrder = [];
    for (var i = 0; i < descOrder.length; i++) {
        finalOrder.push(descOrder[i]);
    }

    for (var i = 0; i < allTransactions.length; i++) {
        var currTransaction = allTransactions[i];
        
        currTransaction.sort(function(a, b) {
            var indA = finalOrder.indexOf(a);
            var indB = finalOrder.indexOf(b);

            return (indA < indB) ? -1 : (indA > indB) ? 1 : 0;
        });
    }
}