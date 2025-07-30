import { useEffect, useRef } from "react";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const paypalRef = useRef();

  useEffect(() => {
    // Remove any previous PayPal buttons
    if (paypalRef.current) paypalRef.current.innerHTML = "";

    // Load PayPal script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD`;
    script.addEventListener("load", () => {
      window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal"
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amount.toString() }
            }]
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          onSuccess(details);
        },
        onError: (err) => {
          onError(err);
        }
      }).render(paypalRef.current);
    });
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = "";
    };
  }, [amount, onSuccess, onError]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton; 