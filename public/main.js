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

const deleteProduct = clickedName => {
    fetch('producer', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: clickedName }),
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
    let amount = document.getElementsByName(clickedName)[0].value
    if (amount == '') {
        alert('Fyll i ett värde!')
    } else {
        fetch('producer', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stock: amount, product: clickedName }),
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
