let request = new XMLHttpRequest();
request.onreadystatechange = function()
{
    if(request.readyState === 4 && request.status === 200)
    {
        parse(JSON.parse(request.responseText));
    }
};
request.open("GET", '/records_info', true);
request.send();

parse = (data) => {
    let records_table = document.getElementById('records-info');
    let records = '';
    console.log(data);
    for(let record of data){
        records += `
        <tr>
            <td>
                ${record[0]}           
            </td> 
            <td>
                ${record[1]}           
            </td> 
        </tr>
        `
    }
    records_table.innerHTML = records;

};