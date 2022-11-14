import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
// import Connect from 'connect-pg-simple';
// import session from 'express-session';
import mongoose from 'mongoose'
import * as AdminJSMongoose from '@adminjs/mongoose'
import Dump from '../models/dumpModel.js';
import Equipment from '../models/equipmentModel.js';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
})

// // ... other code
// const start = async () => {
//   await mongoose.connect(process.env.DB_URL)
//   const adminOptions = {
//     // We pass Category to `resources`
//     resources: [Category],
//   }
//   // Please note that some plugins don't need you to create AdminJS instance manually,
//   // instead you would just pass `adminOptions` into the plugin directly,
//   // an example would be "@adminjs/hapi"
//   const admin = new AdminJS(adminOptions)
//   // ... other code
// }

// start()


const PORT = 4000

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const start = async () => {
  const app = express()
  await mongoose.connect("mongodb://127.0.0.1:27017/wastesentrydb");

  const adminOptions = {
    // We pass Category to `resources`
    resources: [Dump, User, Equipment],
  }

  const admin = new AdminJS(adminOptions)

//   const ConnectSession = Connect(session)
//   const sessionStore = new ConnectSession({
//     conObject: {
//       connectionString: 'postgres://adminjs:adminjs@localhost:5435/adminjs',
//       ssl: process.env.NODE_ENV === 'production',
//     },
//     tableName: 'session',
//     createTableIfMissing: true,
//   })

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
    //   store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  )
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()