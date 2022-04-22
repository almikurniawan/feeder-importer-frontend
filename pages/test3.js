const Test = () => {
    const input = [["100", "ironman", "music", "2"], ["100", "ironman", "math", "2"], ["300", "superman", "computer", "3"], ["300", "superman", "computer", "4"], ["500", "hulk", "music", "3"], ["600", "ironman", "music", "2"]];

    let nama_sama = [];
    for (let index = 0; index < input.length; index++) {
        for (let i = 0; i < input.length; i++) {
            if(i!=index){
                if(input[index][1]==input[i][1]){
                    nama_sama.push(input[index]);
                }
            }
        }
    }

    let major_sama = [];
    for (let index = 0; index < nama_sama.length; index++) {
        for (let i = 0; i < nama_sama.length; i++) {
            if(i!=index){
                if(nama_sama[index][2]==nama_sama[i][2]){
                    major_sama.push(nama_sama[index]);
                }
            }
        }
    }

    let grade_sama = [];
    for (let index = 0; index < major_sama.length; index++) {
        for (let i = 0; i < major_sama.length; i++) {
            if(i!=index){
                if(major_sama[index][2]==major_sama[i][2]){
                    grade_sama.push(major_sama[index]);
                }
            }
        }
    }

    if(grade_sama.length>0){
        console.log(3);
    }else if(major_sama.length>0){
        console.log(2);
    }else if(nama_sama.length>0){
        console.log(1);
    }

    return (<h4>tes</h4>);
}

export default Test;