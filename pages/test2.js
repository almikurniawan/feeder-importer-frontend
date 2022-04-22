const Test = () => {

    const divide = (kata, divider) => {
        let result = "";
        let temp = "";
        let count = 1;

        for(let i=0; i<kata.length; i++){
            let tiga_kata_sekarang = kata.substring(i, i+divider);
            for (let index = i+divider; index < kata.length; index++) {
                let tiga_kata_selanjutnya = kata.substring(index, index+divider);
                if(tiga_kata_sekarang==tiga_kata_selanjutnya){
                    count++;
                }else{
                    break;
                }
            }
            if(count>1){
                result += count + tiga_kata_sekarang;
                i+=divider;
            }else{
                result += kata[i];
            }
        }

        return result;
    }

    const s = "xxxxxxxxxxyyy";
    let answer = [];
    for (let index = 0; index < s.length; index++) {
        answer = divide(s, index+1);
    }


    result = 1000000;

    answer.forEach(element => {
        if(result>element.length){
            result = element.length;
        }
    });

    console.log(result);

    return (<h4>tes</h4>);
}

export default Test;