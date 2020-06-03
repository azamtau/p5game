function showForm() {    
    stateChanged = false;
    let body = document.querySelector('body');
    
    let topBlock = document.createElement('div');
    topBlock.setAttribute('class', 'topblock');

    let form = document.createElement('form');

    let newBtn = document.createElement('button');
    newBtn.textContent = "Save";
    
    let newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Enter name to save score');
    newInput.setAttribute('maxlength', 20);
    newInput.required = true;

    let allBtn = document.createElement('button');
    allBtn.textContent = "Get TOP3";
    allBtn.setAttribute('class', 'top-btn');

    let topDiv = document.createElement('div');
    topDiv.setAttribute('class', 'top-list');

    body.appendChild(topBlock);

    topBlock.appendChild(form);
    form.appendChild(newInput);
    form.appendChild(newBtn);

    topBlock.appendChild(topDiv);
    topDiv.appendChild(allBtn);
    
    form.addEventListener('submit', (e) => {
    console.log("button pressed");
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },        
        body: JSON.stringify({name: newInput.value, score: mushroomsScore})
    })
    .then(resp => resp.json())
    .then(data => {
            console.log(data);
    })
    .catch(e => console.log(e));

    e.preventDefault();
    });

    allBtn.addEventListener('click', (event) => {
    fetch('/top/3')
        .then(resp => resp.json())
        .then(data => {
            let ol = document.createElement('ol');
            let jd = JSON.parse(data.top);
            if(topDiv.hasChildNodes()) {
                while (topDiv.firstChild) {
                topDiv.removeChild(topDiv.firstChild);
                }
                ol.remove();
            }  
            
            for (let item of jd) {
                console.log(item.username, item.score);
                let li = document.createElement('li');
                li.textContent = `${item.username}: \t${item.score}`;
                ol.appendChild(li);
            }
            topDiv.appendChild(ol);
        })
        .catch(e => console.log(e));
    });
}
  