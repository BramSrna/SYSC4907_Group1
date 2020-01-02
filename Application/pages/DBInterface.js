import * as firebase from "firebase";

export async function registerItem(genericName, specificName, size = null, sizeUnit = null, price = null) {
    try {
       const { data } = await firebase.functions().httpsCallable('registerItem')({
          genericName: genericName,
          specificName: specificName,
          size: size,
          sizeUnit: sizeUnit,
          price: price
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}

export async function registerStore(storeName, address, map, franchiseName = null) {
    try {
       const { data } = await firebase.functions().httpsCallable('registerStore')({
            storeName: storeName,
            address: address,
            map: map,
            franchiseName: franchiseName,
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}

export async function addItemLoc(genericName, specificName, storeName, address, aisleNum, itemDepartment) {
    try {
       const { data } = await firebase.functions().httpsCallable('addItemLoc')({
            genericName: genericName,
            specificName: specificName,
            storeName: storeName,
            address: address,
            aisleNum: aisleNum,
            itemDepartment: itemDepartment
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}
