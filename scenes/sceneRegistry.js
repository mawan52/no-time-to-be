const sceneRegistry = {
  "wednesday": {
    "html": "/scenes/wednesday/wednesday.html",
    js: () => import("./wednesday/wednesday.js"),
  },
  "thursday": {
    "html": "/scenes/thursday/thursday.html",
    js: () => import("./thursday/thursday.js"),
  },
  "friday": {
    "html": "/scenes/friday/friday.html",
    js: () => import("./friday/friday.js"),
  },
  "saturday_messages": {
    "html": "/scenes/saturday_messages/saturday_messages.html",
    js: () => import("./saturday_messages/saturday_messages.js"),
  },
  "saturday": {
    "html": "/scenes/saturday/saturday.html",
    js: () => import("./saturday/saturday.js"),
  },
  "sunday": {
    "html": "/scenes/sunday/sunday.html",
    js: () => import("./sunday/sunday.js"),
  },
  "monday": {
    "html": "/scenes/monday/monday.html",
    js: () => import("./monday/monday.js"),
  },
  "tuesday_aftermath": {
    "html": "/scenes/tuesday_aftermath/tuesday_aftermath.html",
    js: () => import("./tuesday_aftermath/tuesday_aftermath.js"),
  },
  "wednesday_boundaries": {
    "html": "/scenes/wednesday_boundaries/wednesday_boundaries.html",
    js: () => import("./wednesday_boundaries/wednesday_boundaries.js"),
  },
  "epilogue": {
    "html": "/scenes/epilogue/epilogue.html",
    js: () => import("./epilogue/epilogue.js"),
  },
};

export default sceneRegistry;
