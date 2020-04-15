/* eslint-disable no-unused-vars */

let newOffer = ''

const offerMessageList = document.querySelector('.offerMessageList')


document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://localhost:8081')
  
    
    socket.on('offers', (data) => {
        let item = document.createElement('li')

        item.appendChild(document.createTextNode(`Erbjudande av ${data.producer}: ${data.newOffer}`))
        offerMessageList.appendChild(item)
    })
})

const getNewOffer = function getNewOffer(producer) {
    const socket = io.connect('http://localhost:8081')
    
   
    newOffer = document.getElementById('offerMessage').value

    socket.emit('new offer', {
        producer,
        newOffer,
    })
}

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

const deleteProduct = (clickedProduct, currentProducer) => {
    fetch('/producer', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clickedProduct, currentProducer }),
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            window.location.reload(true)
            console.log(data)
        })
}

const refillProduct = (clickedProduct, currentProducer) => {
    const amountToRefill = document.getElementsByName(clickedProduct)[0].value
    if (amountToRefill == '') {
        alert('Fyll i ett värde!')
    } else {
        fetch('/producer', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amountToRefill, clickedProduct, currentProducer }),
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

function eggDisplay(array) {
    let list = document.getElementById('egglist')

    let index = array.length - 1

    let item = document.createElement('li')
    item.appendChild(document.createTextNode(`${array[index].name} ${array[index].amount} gram`))
    list.appendChild(item)

    return list
}

function calculatePrice(array) {
    let total = 0
    for (let i = 0; i < array.length; i++) {
        total += array[i].price * array[i].amount
    }
    if (total > 99) total = `${total / 100} kronor`
    else total += ' öre'
    return total
}

const pushToList = (name, amount, producer, price) => {
    const addAmount = parseInt(amount)
    const addPrice = parseInt(price)
    for (let i = 0; i < candyList.length; i++) {
        if (candyList[i].name == name) {
            candyList[i].amount += addAmount
            console.log(candyList)
            return candyList
        }
    }

    candyList.push({
        name,
        amount: addAmount,
        producer,
        price: addPrice,
    })

    console.log(candyList)
    document.getElementById('eggWindow').appendChild(eggDisplay(candyList))
    document.getElementById('price').innerHTML = `${calculatePrice(candyList)}`
}

const decreaseStock = (clickedProduct, amountToDecrease, currentProducer, price) => {
    if (amountToDecrease == '') {
        alert('Fyll i ett värde!')
    } else {
        fetch('/producerstock', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clickedProduct, amountToDecrease, currentProducer }),
        })
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(data => {
                console.log(data)
            })
        pushToList(clickedProduct, amountToDecrease, currentProducer, price)
    }
}

const postEgg = userid => {
    let eggName = ''
    eggName = document.getElementById('eggname').value

    if (eggName != '' && candyList != []) {
        egg = { name: eggName, candyList }
        console.log(candyList)
        fetch(`/addedCandy/${userid}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(egg),
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

const deleteEgg = (userid, eggName) => {
    fetch('/eggs', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid, eggName }),
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            window.location.reload(true)
            console.log(data)
        })
}

function randomEgg(candyArr) {
    for (let i = 0; i < candyArr.length; i++) {
        document.getElementById(candyArr[i]).value = Math.floor(Math.random() * 25) + 1
    }
}
