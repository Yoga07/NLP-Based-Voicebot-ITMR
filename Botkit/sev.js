//BOTKIT
var Botkit=require('botkit');
var controller=Botkit.slackbot();
var bot=controller.spawn({token:'xoxb-274539171298-8550c5aL2wDqHHNEdssIo2FY'});
//MONGO
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dbx";
var rasa = require('botkit-rasa')({rasa_uri: 'http://localhost:5000'});
controller.middleware.receive.use(rasa.receive);
var PythonShell = require('python-shell');


bot.startRTM(
	function(err,bot,payload)
	{
		if(err){
			console.log(err);
			throw new Error('Could not connect to Slack');
		}
	});
	var sflag=0;
  var sal,dur,amt;
	controller.hears('', ['direct_message','direct_mention','mention','ambient'],
		function(bot, message)
		{
			//bot.reply(message,'new new');
			console.log(message);
			bot.reply(message,'Before we start');
			bot.reply(message,'Let us know eachother better');
			bot.reply(message,'Hope you are looking for loan~~~~');
			bot.startConversation(message,function(err,convo)
			{
				convo.addQuestion('May I know your good name please',function(response,convo)
					{
						name=response.text;
						convo.next();
					});
					convo.addQuestion('May I know who your Father or Husband is',function(response,convo)
					{
						rname=response.text;
						convo.next();
					});
					convo.addQuestion('May I know your DOB please.',function(response,convo)
					{
						dob=(response.text);
						convo.next();
					});
					convo.addQuestion('May I note down your address',function(response,convo)
					{
						addr=response.text;
						convo.next();
					});
					convo.addQuestion('Whats your telephone number?',function(response,convo)
					{
						telno=response.text;
						convo.next();
					});

					convo.addQuestion('Are you a salaried individual or a professional or Self-Employed or Other?',function(response,convo)
					{
						emp_stat=response.text;
						convo.next();
					});
					convo.addQuestion('What is your monthly salary?',function(response,convo)
					{
						sal=parseInt(response.text);
						convo.next();
					});
					convo.addQuestion('What is the time duration(in months) of loan you are looking for?',function(response,convo)
					{
						dur=parseInt(response.text);
						convo.next();
					});
					convo.addQuestion('Which of the following do you want as your supporting document?\nAadhar\npan card\nVoter ID\nPassport\nDriving license.',function(response,convo)
					{
						doctype=(response.text);
						convo.next();
					});
					convo.addQuestion('Enter the unique ID of your document',function(response,convo)
					{
						docid=(response.text);
						convo.next();
					});
					convo.addQuestion('Number of earning members',function(response,convo)
					{
						fam_earners=parseInt(response.text);
						convo.next();
					});
					convo.addQuestion('Number of dependent household',function(response,convo)
					{
						fam_dep=parseInt(response.text);
						convo.next();
					});
					convo.addQuestion('Marital Status',function(response,convo)
					{
						m_stat=(response.text);
						convo.next();
					});
					//inserting into DB*/
					convo.addQuestion('Uploading your information..Enter any text to continue',function(response,convo)
					{
						MongoClient.connect(url, function(err, db) {
						  if (err) throw err;
						  var myobj = {
								name:name,
								relation_name:rname,
								address:addr,
								dob:dob,
								telephone:telno,
								emp_stat:emp_stat,		                        
								salary:sal,
								duration:dur,
								no_of_dependents:fam_dep,
								no_of_earner:fam_earners,
								document_type:doctype,
								document_detail:docid,
								maritial_status:m_stat,
							      };
						  db.collection("formx").insertOne(myobj, function(err, res) {
						    if (err) throw err;
						    console.log("1 document inserted");
							
						    var spawn = require("child_process").spawn;
						    var process = spawn('python',["/home/santhosh/Documents/Project/ITMR/Botkit/pyscripts/mail.py"]);
						    db.close();
						  });
						});
						convo.next();
					});

					
					convo.addQuestion('\nQUERY STARTS HERE',function(response,convo)
					{
					controller.changeEars(
						function (patterns, response)
						{
				 			return rasa.hears(patterns, response);
						});

				      var intent=response.intent.name;
				      console.log(response);
				      if(intent=='greet')
				      {
					bot.reply(message,'How could I help you?');
					bot.reply(message,'Would you like to know our latest plans with respect to repayment or interest rate?');
				      }
				      if(intent=='goodbye')
				      {
					bot.reply(message,'Thank you for your check in.');
					bot.reply(message,'Kindly come in to check with us sooner.');
				      	bot.reply(message,'We\'d glad to extend our service with you in the future');
					//INSERT THE PYTHON SCRIPT HERE
				      }
				      if(intent=='query_int')
				      {
					bot.reply(message,'The interest rates are as follows\n8.60% - 10.35%');
					bot.reply(message,'EMI per lakh:Rs.2056 - 2142');
				      }
				      if(intent=='query_amt')
				      {
					var max='The maximum eligible loan is'+(sal*60);
					bot.reply(message,max);
				      }
					if(intent=='affirm')
					{
					  bot.reply(message,'thank you,agreed');
					}
					if(intent=='query_dur')
					{
					  bot.reply(message,'Maximum loan tenure is 7 years');
					}
								convo.repeat();
						});//qeury

					});//startConversation

});//controller
