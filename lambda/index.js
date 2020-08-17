// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require("ask-sdk-core");
const AWS = require("aws-sdk");
const Adapter = require("ask-sdk-s3-persistence-adapter");
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const dayjs = require("dayjs");


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let speakOutput;
    let persistentAttrs;

    await attributesManager.getPersistentAttributes().then((res) => {
      persistentAttrs = res;
    });

    if (persistentAttrs.launchCount <= 1) {
      speakOutput = requestAttributes.t("FIRST_LOAD_GREETING");
    } else {
      speakOutput = requestAttributes.t("AFTER_LOAD_GREETING");
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

//TODO: REVIEW
const GlobalSummaryIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "GlobalSummaryIntent"
    );
  },
  async handle(handlerInput) {
    let speakOutput = "";
    const attributesManager = handlerInput.attributesManager;
    const requestAttributes = attributesManager.getRequestAttributes();
    const response = await fetch(process.env.COVID_API_URL + 'summary');
    const {Global} = await response.json();
    
    speakOutput = requestAttributes.t("GLOBAL_STATS",Global.NewConfirmed,Global.TotalConfirmed,Global.NewDeaths,Global.TotalDeaths,Global.NewRecovered,Global.TotalRecovered)
    speakOutput+= "\n <break />";
    speakOutput+= requestAttributes.t("GENERAL_REPROMPT");

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(requestAttributes.t("REPROMPT_VERIFICATIONS") + "." + requestAttributes.t("GENERAL_REPROMPT"))
        .getResponse()
    );
  },
};

//TODO: REVIEW
const CountrySummaryIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "CountrySummaryIntent"
    );
  },
  async handle(handlerInput) {
      
    let speakOutput = "";
    
    const attributesManager = handlerInput.attributesManager;
    const requestAttributes = attributesManager.getRequestAttributes();
    const timezone = "T00:00:00Z";
    const todayDate = dayjs().format("YYYY-MM-DD");
    const yesterdayDate = dayjs().subtract(1,"day").format("YYYY-MM-DD");
    const countrySlotObject = Alexa.getSlot(handlerInput.requestEnvelope, 'COVID_COUNTRY');
    const countrySlotId = getSlotId(countrySlotObject);
    const countrySlotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'COVID_COUNTRY');
    
    if(countrySlotId){
        const countrySummary = await getCovidSummaryByCountry(countrySlotId,yesterdayDate,todayDate);
        speakOutput = requestAttributes.t("COUNTRY_STATS",countrySlotValue,countrySummary.Confirmed,countrySummary.Deaths,countrySummary.Recovered,countrySummary.Active)
        speakOutput+= "\n <break />";
        speakOutput+= requestAttributes.t("GENERAL_REPROMPT");
    }else{
        speakOutput = requestAttributes.t("COUNTRY_NOT_FOUND",countrySlotValue);
    }
   
    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
         .reprompt(requestAttributes.t("REPROMPT_VERIFICATIONS") + "." + requestAttributes.t("GENERAL_REPROMPT"))
        .getResponse()
    );
  },
};


const StatusByCountryIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "StatusByCountryIntent"
    );
  },
  async handle(handlerInput) {
      
    let speakOutput = "";
      
    const attributesManager = handlerInput.attributesManager;
    const requestAttributes = attributesManager.getRequestAttributes();
    
    const timezone = "T00:00:00Z";
    const todayDate = dayjs().format("YYYY-MM-DD");
    const yesterdayDate = dayjs().subtract(1,"day").format("YYYY-MM-DD");
    
    const countrySlotObject = Alexa.getSlot(handlerInput.requestEnvelope, 'COVID_COUNTRY');
    const countrySlotId = getSlotId(countrySlotObject);
    const countrySlotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'COVID_COUNTRY');
    
    const statusSlotObject = Alexa.getSlot(handlerInput.requestEnvelope, 'COVID_STATUS');
    const statusSlotId = getSlotId(statusSlotObject);
    const statusSlotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'COVID_STATUS');
    
    const {Cases} = await getCovidStatusByCountry(countrySlotId,statusSlotId,yesterdayDate,todayDate);

    speakOutput = requestAttributes.t("STATUS_BY_COUNTRY",countrySlotValue, Cases.toString(), statusSlotValue);
    
    speakOutput+= "\n <break />";
    speakOutput+= requestAttributes.t("GENERAL_REPROMPT");

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
         .reprompt(requestAttributes.t("REPROMPT_VERIFICATIONS") + "." + requestAttributes.t("GENERAL_REPROMPT"))
        .getResponse()
    );
  },
};

//TODO: More human repeat responses
const RepeatIntentHandler = {
    canHandle(handlerInput){
        return (
              Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
              Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.RepeatIntent"
        );
    },
    handle(handlerInput){
        
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    
    const speakOutput = sessionAttributes.lastResponse.outputSpeech;

    return handlerInput.responseBuilder
      .speak(speakOutput)
        .reprompt(requestAttributes.t("REPROMPT_VERIFICATIONS") + "." + requestAttributes.t("GENERAL_REPROMPT"))
      .getResponse();
    },
};


const NoIntentHandler = {
    canHandle(handlerInput){
        return (
              Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
              Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.NoIntent"
        );
    },
    handle(handlerInput){
 
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    
    const speakOutput = requestAttributes.t("NO_RESPONSE");

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
    },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    
    const speakOutput = requestAttributes.t('HELP_RESPONSE');

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(requestAttributes.t("HELP_REPROMPT"))
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.requestAttributes();
    const speakOutput = requestAttributes.t('NO_RESPONSE');
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  },
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    console.log(`~~~~ Error Object: ${error}`);

    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const InvalidConfigHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getRequestAttributes();

    const invalidConfig = attributes.invalidConfig || false;

    return invalidConfig;
  },
  handle(handlerInput) {
    const { responseBuilder, attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();

    const speakOutput = requestAttributes.t("ENV_NOT_CONFIGURED");

    return responseBuilder.speak(speakOutput).getResponse();
  },
};

//UTILITY CONSTANTS =========================================================================

const languageStrings = {
  "es-ES": require("./i18n/es-ES"),
  "es-MX": require("./i18n/es-MX"),
  en: require("./i18n/en"),
};

//HELPER FUNCTIONS ==========================================================================


async function getCovidSummaryByCountry(countryId,from,to){
    const response = await fetch(process.env.COVID_API_URL + `total/country/${countryId}?from=${from}&to=${to}`);
    const jsonResponse = await response.json();
    return jsonResponse[0];
}

async function getCovidStatusByCountry(countryId, statusId, from, to) {
  const response = await fetch(
    process.env.COVID_API_URL +
      `total/country/${countryId}?from=${from}&to=${to}`
  );
  const jsonResponse = await response.json();
  let data = {};
  switch (statusId) {
    case "deaths":
      data = {
        Cases: jsonResponse[0].Deaths,
      };
      break;
    case "confirmed":
      data = {
        Cases: jsonResponse[0].Confirmed,
      };
      break;
    case "recovered":
      data = {
        Cases: jsonResponse[0].Recovered,
      };

      break;
    case "active":
      data = {
        Cases: jsonResponse[0].Active,
      };

      break;
  }

  return data;
}

function getSlotId(slotObject){
    
    console.log(slotObject.resolutions.resolutionsPerAuthority);
    
    if(slotObject.resolutions.resolutionsPerAuthority[0].values){
      return slotObject.resolutions.resolutionsPerAuthority[0].values[0].value.id
    }
   
   return null;
}

//TODO: Change to DynamoDBClient
async function getDynamoDBClient() {
  const STS = new AWS.STS({ apiVersion: "2012-10-17" });

  const credentials = await STS.assumeRole(
    {
      RoleArn: "arn:aws:iam::387161962493:role/LambdaRole",
      RoleSessionName: "LambdaRole", // You can rename with any name
    },
    (err, res) => {
      if (err) {
        console.log("AssumeRole FAILED: ", err);
        throw new Error("Error while assuming role");
      }
      return res;
    }
  ).promise();

  const dynamoDB = new AWS.DynamoDB({
    apiVersion: "2012-10-17",
    region: "eu-west-1",
    accessKeyId: credentials.Credentials.AccessKeyId,
    secretAccessKey: credentials.Credentials.SecretAccessKey,
    sessionToken: credentials.Credentials.SessionToken,
  });

  console.log(`~~~~ Dynamo: ${dynamoDB}`);

  return dynamoDB;
}

//REQUEST INTERCEPTORS ==========================================================================

const RequestPersistenceInterceptor = {
  async process(handlerInput) {
    const { attributesManager } = handlerInput;

    if (handlerInput.requestEnvelope.session["new"]) {
      let persistentAttributes =
        (await attributesManager.getPersistentAttributes()) || {};

      persistentAttributes["launchCount"] =
        typeof persistentAttributes["launchCount"] === "undefined"
          ? 1
          : persistentAttributes["launchCount"] + 1;

      attributesManager.setPersistentAttributes(persistentAttributes);

      await attributesManager.savePersistentAttributes();
    }
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: "es-MX",
      resources: languageStrings,
    });

    localizationClient.localize = function () {
      const args = arguments;
      let values = [];

      for (var i = 1; i < args.length; i++) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values,
      });

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      } else {
        return value;
      }
    };

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      // pass on arguments to the localizationClient
      return localizationClient.localize(...args);
    };
  },
};

const EnvironmentCheckInterceptor = {
  process(handlerInput) {
    // load environment variable from .env
    dotenv.config();

    if (!process.env.COVID_API_URL) {
      handlerInput.attributesManager.setRequestAttributes({
        invalidConfig: true,
      });
    }
  },
};

const LastResponseInterceptor = {
   process(handlerInput,responseOutput) {
    const { attributesManager } = handlerInput;

    let sessionAttributes = attributesManager.getSessionAttributes();
    
     if (responseOutput && responseOutput.outputSpeech && responseOutput.reprompt) {
      let lastSpeechOutput = {
        outputSpeech: responseOutput.outputSpeech.ssml,
        reprompt: responseOutput.reprompt.outputSpeech.ssml,
      }

      sessionAttributes['lastResponse'] = lastSpeechOutput

      handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
    }
  },
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(
    new Adapter.S3PersistenceAdapter({
      bucketName: process.env.S3_PERSISTENCE_BUCKET,
    })
  )
  .addRequestHandlers(
    InvalidConfigHandler,
    LaunchRequestHandler,
    GlobalSummaryIntentHandler,
    CountrySummaryIntentHandler,
    StatusByCountryIntentHandler,
    RepeatIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addResponseInterceptors(
    LastResponseInterceptor,
   )
  .addRequestInterceptors(
    EnvironmentCheckInterceptor,
    RequestPersistenceInterceptor,
    LocalizationInterceptor
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
