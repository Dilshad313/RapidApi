// Zigzag Pattern

function zigzag(){
    let rows = ["","",""];
    let direction = 1;
    let row = 0;

    for (let i=65; i<=90; i++){
        rows[row] += String.fromCharCode(i)+"\t";
        row += direction;

        if(row===0 || row===2)
        {
            direction *=-1;
        }
    }
    rows.forEach(r=>console.log(r.trim()));
}

zigzag()

// Email valid
// write a function to check if a given email is valid . A valid email:
// 1. Has exactly one @
// 2. Has atleast one . after @
// 3. Doesn't start or end with @ or .


function emailValid(email)
{
    const reg = /^(?!.*@.*@)(?![.@])[^@]+@[^@]+\.[^@.]+$/;
    return reg.test(email);
}
console.log(emailValid("hello@gmail.com"));
console.log(emailValid("hellogmail.com"));
console.log(emailValid("@hellogmail.com"));