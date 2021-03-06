export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minmumFractionDigits: 2,
  };

  // check if there are any cents
  if (amount % 100 === 0) {
    options.minmumFractionDigits = 0;
    //options.maximumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-DE', options);
  const dollars = formatter.format(amount / 100);
  return dollars;
}
