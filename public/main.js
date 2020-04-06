/* eslint-disable no-unused-vars */

const deleteProducer = clickedId => {
    fetch('admin', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clickedId }),
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            console.log(data)
            window.location.reload(true)
        })
}

const deleteProduct = clickedProduct => {
    const producerName = document.getElementById('producername').innerText
    fetch('/producer', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: clickedProduct, producerName }),
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            window.location.reload(true)
            console.log(data)
        })
}

const refillProduct = clickedName => {
    const amount = document.getElementsByName(clickedName)[0].value
    const producerName = document.getElementById('producername').innerText
    if (amount == '') {
        alert('Fyll i ett värde!')
    } else {
        fetch('/producer', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stock: amount, product: clickedName, producerName }),
        })
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(data => {
                window.location.reload(true)
                console.log(data)
            })
    }
}

let candyList = []
let egg = {}


const pushToList = (name, amount) => {


    candyList.push({
        name: name
    })

    for (let i = 0; i < candyList.length; i++) {
        if (candyList[i].name == name) {
            candyList[i].amount = amount
        }        
    }
    console.log(candyList)
}

const addToEgg = () => {
    
    let newList = candyList.filter((item, index) => {
        
        console.log(item.name)
        
        candyList.indexOf(item) == index
    })
    console.log(newList)
}

