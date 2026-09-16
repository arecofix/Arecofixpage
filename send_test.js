async function send() {
  try {
    const res = await fetch(
      'https://graph.facebook.com/v25.0/322928504245092/messages',
      {
        method: 'POST',
        body: JSON.stringify({
          "messaging_product": "whatsapp",
          "to": "5491125960900",
          "type": "template",
          "template": {
            "name": "jaspers_market_order_confirmation_v1",
            "language": { "code": "en_US" },
            "components": [{
              "type": "body",
              "parameters": [
                { "type": "text", "text": "Ezequiel" },
                { "type": "text", "text": "123456" },
                { "type": "text", "text": "Prueba" }
              ]
            }]
          }
        }),
        headers: {
          'Authorization': 'Bearer EAARLwIJnO30BSaWZCZCsJqyfrAYNsnZA4xt6v1KkgmxQBQByU0y94rNugznrv7FEBHulUzwfpWzYItMUUA6GbP8WiXIbmK5i3NlyZCH450oEIa99TEklQJ9nikBZAg8m75Sce1I9RzkAvJyUZA77iyw586OX1BZBEYcmKER3tCtJf1vcwoWIs6NoQRJQIwff97FpoGJjJzofqqbLDMJHXqVwhwq63RZAyp1wN8hap4vGxLhcZAWCRSwStXSi23chxNxxvx58g21csF4yuFnozvM4f3jhosGxNZBgQK0NmBKAZDZD',
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

send();
