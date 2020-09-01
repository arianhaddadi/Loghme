const mapEnglishToPersianNums = {
    "0":"۰",
    "1":"۱",
    "2":"۲",
    "3":"۳",
    "4":"۴",
    "5":"۵",
    "6":"۶",
    "7":"۷",
    "8":"۸",
    "9":"۹",
}


export const convertEnglishNumbersToPersian = (num) => {
    num = num.toString();
    let convertedNum = "";
    for(let i = 0; i < num.length; i++) {
        if(num[i] === '.') convertedNum += ".";
        else convertedNum += mapEnglishToPersianNums[num[i]];
    }
    return convertedNum;
}


export const calculateOrderPrice = (cartItems) => {
    let price = 0;
    for (let i = 0; i < cartItems.length; i++) {
        price += cartItems[i].food.price * cartItems[i].quantity;
    }
    return convertEnglishNumbersToPersian(price);
}

export const preventBubbling = (event) => {
    event.stopPropagation();
}

export const styleTime = (time) => {
    time = time.toString();
    if(time.length === 1) time = "0" + time;
    return time;
}

