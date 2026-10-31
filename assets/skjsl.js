function skAddToCart(id, qty, btn) {
    var originalText = btn.innerText;
    btn.innerText = 'Adding...';


    try {
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: `${id}`,
                quantity: `${qty}`
            })
        })
        .then(res => res.json())
        .then(data => {
            // Success: Update text and revert after 2 seconds
            btn.innerText = 'Added!';
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        })
        .catch(err => {
            console.log(err.message);
            // Optional: Revert text if an error occurs
            btn.innerText = originalText;
        });
    } catch (err) {
        btn.innerText = originalText;
    }
}

function skMultipleCart(arrayData){
try {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
body: JSON.stringify(arrayData)
  }).then(res => res.json()).then(data => alert('Successfully added all products to the cart!'))
  .catch(err => console.log(err.message))  
} catch (err) {}
}

function skClearCart(btn) {
  fetch('/cart/clear.js', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .then(data => {
    alert('Removed all items from the cart.')
    window.location.href = btn.dataset.url
  })
  .catch(error => console.error('Error:', error));
}

function skGetCartData() {
    fetch(`${window.Shopify.routes.root}cart.js`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const totalPrice = data.total_price;
        const currency = data.currency;


        // Using native DOM selection and setting text content
        try {
          document.getElementById("total-price").textContent = currency + totalPrice
        } catch (err) {}
      })
      .catch(error => {
        console.error('Error fetching cart.js:', error);
      });
}

function skUpdateCart(updateData){
fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updateData })
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
}

function skChangeCart(changeData) {
    try {
        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    body: JSON.stringify({ changeData })
        })
        .then(res => res.json())
        .then(data => {
            // Success: Update text and revert after 2 seconds
            setTimeout(() => {
              console.log("From changeCart : ", data);
            }, 2000);
        })
        .catch(err => {
            console.log(err.message);
        });
    } catch (err) {}
}


