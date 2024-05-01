var stripe = Stripe(
    "pk_live_51PBLteEBCAgwgTMtU7towoFhUWQPHTz3pneiKCPEkwXvyaJ3RvjULhHdheWM80OjfhkUYpH0mDPdLcdDB2WD3wb200qaY7HEhe"
);

var elements = stripe.elements();
var cardElement = elements.create("card", { hidePostalCode: true });
var video = document.getElementById("goober-video");
var token;

document.getElementById("close-pay").addEventListener("click", function () {
    document.getElementById("card-element-container").classList.remove("show");
});

video.addEventListener("ended", function () {
    this.currentTime = 0;
});

video.addEventListener("click", function () {
    document.getElementById("card-element-container").classList.add("show");
    cardElement.mount("#card-element");
});

document.getElementById("pay-video").addEventListener("click", function () {
    
    fetch("https://gyatt.uk/api/create-checkout-session", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("loading").style.display = "block"
            token = data.token;
            stripe
                .confirmCardPayment(data.client_secret, {
                    payment_method: {
                        card: cardElement,
                    },
                })
                .then(function (result) {
                    console.log(result);
                    if (result.error) {
                        console.log(result.error.message);
                        document.getElementById("loading").style.display = "none"
                    } else {
                        if (result.paymentIntent.status === "succeeded") {
                            console.log("Payment successful");
                            fetch("https://gyatt.uk/api/payment-successful", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ token: token }),
                            }).then(function (response) {
                                try {
                                    document.getElementById("loading").style.display = "none"
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                document.getElementById("card-element-container").classList.remove("show");
                                video.src = "https://gyatt.uk/api/video?token=" + token;
                                video.load();
                                video.play();
                            });
                        }
                    }
                });
        });
});