const axios = require('axios');

exports.handler = async function(event, context) {
  const mailerLiteApiKey = process.env.REACT_APP_MAILERLITE_API_KEY;
  const groupId = '130651553632618051';  // Replace this with your actual group ID

  try {
    const mailerLiteApiUrl = `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`;

    const response = await axios.get(mailerLiteApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': mailerLiteApiKey
      }
    });

    if (response.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),  // Return the list of subscribers
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to retrieve subscribers.', details: response.data }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving subscribers.', error: error.message }),
    };
  }
};
