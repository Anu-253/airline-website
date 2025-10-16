// Mock flight search API - purely client-side simulation

function mockSearchFlights(origin, destination, departDate, returnDate){
  // generate 6 mock flights with varying times and prices
  const carriers = ['SkyJet','BlueAir','AeroLux','CloudWings','Nimbus'];
  const results = [];
  for(let i=0;i<6;i++){
    const departHour = 6 + Math.floor(Math.random()*14);
    const duration = 3 + Math.floor(Math.random()*10); // hours
    const price = (50 + Math.floor(Math.random()*450)) + Math.random(); // USD price (float)
    const carrier = carriers[Math.floor(Math.random()*carriers.length)];
    results.push({
      id: 'FL'+Math.floor(Math.random()*90000+10000),
      carrier,
      depart: `${departHour}:00`,
      duration: duration + 'h',
      stops: Math.random()<0.6? 'Non-stop' : (Math.random()<0.5? '1 stop' : '2 stops'),
      price: price
    });
  }
  // sort by price
  results.sort((a,b)=>a.price-b.price);
  return results;
}
