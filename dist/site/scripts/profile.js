async function update() {
    const group = document.myForm.selectGroup.value;
    const dutyDay = document.myForm2.selectDutyDay.value;
    const name = document.myForm1.nameUpdate.value.trim();
    const refKey = document.myForm3.refKey.value.trim();
    const monthPay = document.myForm4.monthPay.value.trim();

    const requests = [
        fetch(`${u}/profile/settings/dutyDay?user=${user}&day=${dutyDay}`),
        fetch(`${u}/profile/settings/group?user=${user}&group=${group}`)
    ];

    if (name) {
        requests.push(fetch(`${u}/profile/settings/name?user=${user}&name=${name}`));
    }

    if (monthPay) {
        requests.push(
            fetch(`${u}/profile/info/monthPay?user=${user}&months=${monthPay}`)
                .then(res => res.json())
                .then(data => alert(data.alert))
        );
    }

    if (refKey) {
        requests.push(
            fetch(`${u}/profile/info/refKey?user=${user}&refKey=${refKey}`)
                .then(res => res.json())
                .then(data => alert(data.alert))
        );
    }


    await Promise.all(requests);
    await fetchAndUpdate(`profile/info/table?user=${user}`, "profile");
}