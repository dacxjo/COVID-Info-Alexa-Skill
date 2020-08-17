module.exports = {
  translation: {
    SKILL_NAME: "COVID Info",
    FIRST_LOAD_GREETING: `¡Welcome to COVID Info!. 
      I can provide you with information on the overall situation of COVID-19, statistics by country or figures from specific situations.
      You can start by saying, "Tell me the global statistics." If you want to know what else I can tell you, say "Help".'`,
    AFTER_LOAD_GREETING: "Welcome again, what are you looking for today?",
     ENV_NOT_CONFIGURED:
      "Sorry, there was an error. I can't connect to the Rest COVID 19 API.",
    GLOBAL_STATS:[
        `These are the global statistics so far.
         New confirmed cases : %s.
         Total confirmed cases : %s.
         New deaths : %s.
         Total deaths : %s.
         New recovered cases : %s.
         Total recovered cases : %s.`    
    ],
    COUNTRY_STATS:[
        `These are the statistics of %s so far.
         Confirmed cases : %s.
         Deaths : %s.
         Recovered cases : %s.
         Active cases : %s.
         `,
         "In %s there are %s confirmed cases, %s deaths, %s recovered cases and %s active cases."
         
    ],
     COUNTRY_NOT_FOUND:[
        "Sorry, I can't give you information about %s. Please try another country.",
        "I'm very sorry, I don't have statistics for %s at the moment. You can try another country.",
        "I think I have no information about %s at this time. Try another country.",
    ],
    STATUS_BY_COUNTRY:[
        "In %s there are %s %s.",
        "%s has a number of %s %s.",
        "Currently, in %s there are %s %s cases."
    ],
    REPROMPT_VERIFICATIONS:[
        "Hello?, you still there?",
        "Are you there?",
        "Can you hear me?"
    ],
    GENERAL_REPROMPT:[
        "Do you need anything else?",
        "Do you need any other information?",
        "What else can I help you with?"
    ],
     REPEAT_INIT:[
        "Yes of course, I had said,",
        "Sure, I said that,",
        "Si,",
        "Of course, I was telling you that, "
    ],
     NO_RESPONSE:[
       "Okay, see you later!",
       "OK see you soon. Remember to follow the recommendations against COVID-19.",
       "Very well, I hope I have been of help to you. Bye!",
    ],
     HELP_RESPONSE:[
        `To give you the global statistics you simply have to say, 'Tell me the global statistics', or, 'Tell me the global situation'.
         If you need to know the specific statistics of a country, you simply have to say, "Tell me the statistics of:" followed by the name of the country, or ask, "How is the situation in:?", Followed by the name of the country.
         You can also ask for specific figures such as the number of deceased, recovered, active or confirmed cases in a country.
         To do this, you can say, for example, "How many deaths are there in Mexico", or, "Tell me the number of recovered cases in Mexico."
         For now, this is it, if you have more questions, consult the Skill section in the Alexa App.
        `
    ],
     HELP_REPROMPT:[
        'That said, what do you need?',
        'So how can I help you today?',
        'What information do you need to know?'
    ]
  },
};
