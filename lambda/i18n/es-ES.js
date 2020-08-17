module.exports = {
  translation: {
    SKILL_NAME: "COVID Info",
    FIRST_LOAD_GREETING: `¡Bienvenido a Covid Info!. 
      Puedo brindar información sobre la situación global del COVID-19, estadísticas por país o cifras de situaciones específicas.
      Puedes comenzar diciendo,"Dime las estadísticas globales". Si quieres saber que más te puedo decir, di "Ayuda".'`,
    AFTER_LOAD_GREETING: "Bienvenido de nuevo, ¿Qué información necesitas hoy?",
     ENV_NOT_CONFIGURED:
      "Lo siento, ha habido un error. No puedo conectarme a la API Rest COVID 19.",
    GLOBAL_STATS:[
        `Estas son las estadísticas globales hasta el momento.
         Casos nuevos confirmados : %s.
         Casos totales confirmados : %s.
         Nuevos fallecimientos: %s.
         Fallecimientos totales: %s.
         Nuevos casos recuperados: %s.
         Casos recuperados totales: %s.`    
    ],
    COUNTRY_STATS:[
        `Estas son las estadísticas de %s hasta el momento.
         Casos confirmados : %s.
         Fallecimientos : %s.
         Casos recuperados: %s.
         Casos activos: %s.
         `,
         "En %s existen %s casos confirmados, %s fallecimientos, %s casos recuperados y %s casos activos."
         
    ],
     COUNTRY_NOT_FOUND:[
        "Lo siento, no te puedo brindar información sobre %s. Intenta con otro país por favor.",
        "Lo lamento mucho, no tengo estadísticas para %s en este momento. Puedes intentar con otro país.",
        "Creo que no tengo información sobre %s en este momento. Intenta con otro país.",
    ],
    STATUS_BY_COUNTRY:[
        "En %s hay %s %s.",
        "%s tiene un número de %s %s.",
        "Actualmente, en %s existen %s casos %s."
    ],
    REPROMPT_VERIFICATIONS:[
        "¿Hola?, ¿sigues ahí?",
        "¿Estás ahí?",
        "¿Me escuchas?"
    ],
    GENERAL_REPROMPT:[
        "¿Necesitas algo más?",
        "¿Necesitas alguna otra información?",
        "¿En que más te puedo ayudar?"
    ],
     REPEAT_INIT:[
        "Si claro, había dicho que,",
        "Claro, he dicho que,",
        "Si,",
        "Por supuesto, te estaba diciendo que, "
    ],
      NO_RESPONSE:[
       "De acuerdo, ¡hasta luego!.",
       "Ok, nos vemos pronto. Recuerda seguir las recomendaciones contra el COVID-19.",
       "Muy bien, espero haberte sido de ayuda. ¡Hasta luego!",
    ],
     HELP_RESPONSE:[
        `Para brindarte las estadísticas globales simplemente tienes que decir, 'Dime las estadísticas globales', ó , 'Dime la situación global'.
         Si necesitas conocer las estadísticas específicas de un país, simplemente tienes que decir,"Dime las estadísticas de:" seguido del nombre del país, o bien preguntar,"¿Como está la situación en: ?", seguido del nombre del país.
         También puedes preguntar por cifras específicas como número de fallecidos, recuperados, casos activos o confirmados de un país.
         Para hacer esto, puedes decir por ejemplo, "Cuantos fallecidos hay en México", ó,"Dime el número de casos recuperados en México".
         De momento, esto es todo, si tienes más duda consulta la sección de la Skill en la App de Alexa.
        `
    ],
     HELP_REPROMPT:[
        'Dicho esto, ¿Que necesitas?',
        'Asi que, ¿Como te puedo ayudar hoy?',
        '¿Que información necesitas saber?'
    ]
  },
  
};
