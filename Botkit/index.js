var Botkit=require('botkit')
var controller=Botkit.slackbot();
var bot=controller.spawn({token:'xoxb-274539171298-ZLleqPbIwFbYM28tSuG2IMBL'});



var rasa = require('botkit-rasa')({rasa_uri: 'http://localhost:5000'});
controller.middleware.receive.use(rasa.receive);

	bot.startRTM(
		function(err,bot,payload)
		{
			if(err)
			{
				console.log(err);
				throw new Error('Could not connect to Slack');
			}
		}
	);



	controller.hears('', ['direct_message','direct_mention','mention','ambient'],
		function(bot, message)
		{
			controller.changeEars(
				function (patterns, message)
				{
		 			return rasa.hears(patterns, message);
				}
		})
	);

		bot.startConversation(message,
		function(err,convo)
		{
			convo.addQuestion('How are you?',function(response,convo) {
			convo.say('Cool, you said: ' + response.text);
			convo.next();
		},{},'default');

}));
