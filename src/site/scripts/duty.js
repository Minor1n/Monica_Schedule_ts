function changeDutyPage(i) {
    if (dutyPage+i < 0) return alert(`Дежурства не найдены!`);
    const newPage = dutyPage+i
    fetchAndUpdate(`duty/table?user=${user}&page=${newPage}`,"duty")
    dutyPage = newPage
}