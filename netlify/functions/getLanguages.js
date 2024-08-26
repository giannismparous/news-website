const axios = require('axios');

exports.handler = async function(event, context) {
  const mailerLiteApiKey = process.env.REACT_APP_MAILERLITE_API_KEY;

  try {
    // Step 1: Get Languages
    const getLanguagesUrl = 'https://connect.mailerlite.com/api/campaigns/languages';
    
    const response = await axios.get(getLanguagesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerLiteApiKey}` // Use Bearer token authentication
      }
    });

    if (response.status === 200) {
      // Extract language IDs and names from the response
      const languages = response.data.data.map(language => ({
        id: language.id,
        name: language.name
      }));
      
      return {
        statusCode: 200,
        body: JSON.stringify({ languages: languages }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Failed to fetch languages.', details: response.data }),
      };
    }
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ message: 'Error fetching languages.', error: error.response ? error.response.data : error.message }),
    };
  }
};
