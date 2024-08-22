async function changeReplacementPage(i) {
    if (replacementPage+i < 0)return alert(`Замены не найдены!`);
    const newPage = replacementPage+i
    const response = await fetch(`${u}/home/replacement/table?page=${newPage}`)
    const data = await response.json();
    if(data.table==='null')return alert('Замены не найдены')
    document.getElementById("replacement").innerHTML = `<table>${data.table}</table>`
    replacementPage = newPage
}

function changeSchedule() {
    const selectedValue = document.myForm.selectGroup.value;
    fetchAndUpdate(`home/schedule/update?group=${selectedValue}`,"schedule")
}