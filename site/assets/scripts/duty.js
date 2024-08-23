function changeDutyPage(i) {
    if (dutyPage+i < 0) return alert(`Дежурства не найдены!`);
    const newPage = dutyPage+i
    fetchAndUpdate(`duty/table?user=${user}&page=${newPage}`,"duty")
    dutyPage = newPage
}

async function dutyCheckIn(){
    const response = await fetch(`${u}/duty/checkin?user=${user}`)
    const data = await response.json();
    alert(data.alert)
    await fetchAndUpdate(`duty/table?user=${user}&page=${dutyPage}`, 'duty')
}