module.exports = {
  "app": {
    "name": "mobydick-mongo(prod)",
    "port": 3000,
    "host": "http://localhost",

    "session_secret": "MobydickMongo2017",

    "favicon": "/public/favicon-32.png",

    "redis": {
      "host":         "localhost",
      "port":         6379,
      "prefix":       "loa",
      "ttl":          1000,
      "disableTTL":   true,
      "db":           1,
      "unref":        true,
      "pass":         ""
    }
  },

  "mongodb": {
    "host":         "localhost",
    "port":         27017,
    "database":     "mdm-prod",
    // "username":     "USERNAME",
    // "password":     "PASSWORD",
  }
}