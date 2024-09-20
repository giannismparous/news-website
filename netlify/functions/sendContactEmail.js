const axios = require('axios');

exports.handler = async function(event, context) {
  const mailerLiteApiKey = process.env.REACT_APP_MAILERLITE_API_KEY;

  // Extract data from the request body
  const { name, email, message, groupIds } = JSON.parse(event.body);

  try {
    // Step 1: Create a Campaign
    const createCampaignUrl = 'https://connect.mailerlite.com/api/campaigns';
    
    const campaignPayload = {
      name: "Μύνημα από - "+name, // Change to a dynamic name if needed
      type: "regular", // or "ab" or "resend" depending on your needs
      emails: [{
        subject: "Μύνημα από - "+name, // Use provided subject or default
        from_name: 'Syntaktes', // Use provided sender name or default
        from: 'syntaktes@syntaktes.gr', // Use provided sender email or default
        // content: '<p>Test Content</p>', // Use provided content or default HTML
        content: `
  <div class="newsletter-container" style="box-sizing: border-box; display: flex; justify-content: center; padding: 0 5%; max-width: 650px; margin: auto;">
    <div style="width: 100%;">
      <h1 style="margin-bottom: 10px; font-size: 2em;">Ο χρήστης ${name} έγραψε:</h1>
      <p style="font-size: 1em; line-height: 1.6; margin-bottom: 20px;">
        ${message}
      </p>
      <p style="font-size: 1em; line-height: 1.6; margin-bottom: 20px;">
        Email Επικοινωνίας: ${email}
      </p>

      <div style="font-size: 1em; margin-bottom: 20px;">
        <a href="https://syntaktes.gr/articles/${id}" style="text-decoration: none; color: rgb(9,194,105);">
          Διαβάστε όλο το άρθρο <strong>εδώ</strong>
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

      <div style="font-size: 1em; display: flex; align-items: center; justify-content: center; gap: 15px; text-align: center; flex-wrap: wrap;">
        <a href="https://syntaktes.gr" style="text-decoration: none; color: #000;">Αρχική</a> |
        <a href="https://syntaktes.gr/about" style="text-decoration: none; color: #000;">Ποιοί είμαστε</a> |
        <a href="https://syntaktes.gr/contact" style="text-decoration: none; color: #000;">Επικοινωνία</a> |
        <a href="https://www.facebook.com/profile.php?id=61564528245792" 
          style="text-decoration: none; color: #000; display: flex; align-items: center; justify-content: center">
          Facebook 
          <img src="https://firebasestorage.googleapis.com/v0/b/news-website-a1a1d.appspot.com/o/syntaktes_images%2FFacebook_Logo_2023.png?alt=media&token=16794d55-9910-4d16-a5a7-8d6574f931e8" 
              alt="Facebook Icon" 
              style="width: 14px; height: 14px; margin-left: 5px;" />
        </a>
      </div>
    </div>
  </div>
`,
        // language_id: 24,
      }],
      groups: groupIds // Include groupId if provided
    };

    const createResponse = await axios.post(createCampaignUrl, campaignPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerLiteApiKey}`,
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

    const campaignId = createResponse.data.data.id;

  // Step 2: Schedule the Campaign
  const scheduleCampaignUrl = `https://connect.mailerlite.com/api/campaigns/${campaignId}/schedule`;
    
  const schedulePayload = {
    delivery: 'instant' // Change to 'scheduled' or other options if needed
  };

  const scheduleResponse = await axios.post(scheduleCampaignUrl, schedulePayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mailerLiteApiKey}`,
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });

  if (scheduleResponse.status === 200) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Newsletter sent successfully!' }),
    };
  } else {
    return {
      statusCode: scheduleResponse.status,
      body: JSON.stringify({ message: 'Failed to schedule campaign.', details: scheduleResponse.data }),
    };
  }
} catch (error) {
  return {
    statusCode: error.response ? error.response.status : 500,
    body: JSON.stringify({ message: 'Error sending newsletter.', error: error.message }),
  };
}

};
