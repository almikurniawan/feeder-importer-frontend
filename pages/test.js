const Test = () => {

    // const input = ["Enter uid1234 Spiderman", "Enter uid4567 Ironman", "Leave uid1234", "Enter uid1234 Ironman", "Change uid4567 Hulk"];
    const input = ["Enter uid1234 Spiderman", "Leave uid1234", "Enter uid1234 Hulk", "Leave uid1234"];

    let users = {};
    let output = [];

    input.forEach(element => {
        const separate = element.split(" ");
        const command = separate[0];
        const uid = separate[1];
        if(command=="Enter"){
            users[uid] = separate[2];
            output.push({
                'uid': uid,
                'action' : 'came in'
            });
        }else if(command=="Leave"){
            output.push({
                'uid': uid,
                'action' : 'has left'
            });
        }else if(command=="Change"){
            users[uid] = separate[2];
        }
    });

    let result = [];

    output.forEach(element => {
        result.push(users[element.uid]+" "+element.action);
    });

    console.log(result);

    return (<h4>tes</h4>);
}

export default Test;