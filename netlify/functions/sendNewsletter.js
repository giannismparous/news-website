const axios = require('axios');

exports.handler = async function(event, context) {
  const { articleId, title, content, imagePath } = JSON.parse(event.body);

  console.log(10)
  
  try {
    const mailerLiteApiUrl = 'https://api.mailerlite.com/api/v2/groups/130651553632618051/subscribers';
    const mailerLiteApiKey = process.env.REACT_APP_MAILERLITE_API_KEY;
    console.log(process.env.REACT_APP_MAILERLITE_API_KEY)
    const emailContent = `
      <h1>${title}</h1>
      <img src="${imagePath}" alt="${title}" style="max-width: 100%; height: auto;" />
      <div>${content}</div>
    `;

    const response = await axios.post(mailerLiteApiUrl, {
      subject: title,
      body: emailContent,
      from: {
        name: 'Syntaktes',
        email: 'syntaktes@syntaktes.com'
      },
      // Add additional payload properties as required by the MailerLite API
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': mailerLiteApiKey
      }
    });

    console.log(10)

    if (response.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Newsletter sent successfully!' }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to send newsletter.', details: response.data }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending newsletter', error: error.message }),
    };
  }
};
