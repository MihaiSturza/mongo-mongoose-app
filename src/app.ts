import * as express from 'express';
import { Response, Request, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { mongoHelper } from './mongo.helper';
const app = express();


mongoose.connect('mongodb://localhost/express-app', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(err))

const courseSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  isPublished: Boolean
})

const Course = mongoose.model('Course', courseSchema);

const course = new Course({
  name: 'alt mimilica',
  title: 'Mr',
  price: 10,
  isPublished: true
})

async function createCourse() {
  const result = await course.save();
  console.log(result);
}


async function getCourses() {
  // eq (equal)
  // ne( not equal)
  // gt (greater then)
  // gte (greater then or equal to)
  // lt (less then)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // or
  // and

  const courses = await Course
    // .find({price: { $gte: 10, $lte: 20 }})
    // .find({ price: { $in: [10, 15, 20] }})

    // starts with Mimi --> regular expression  ^ -> begins with, $ ->  ends with
    // i --> at the end means case insensitive
    // .find({ name: /^Mimi/i })
    // .or([ { author: 'Mimi' }, { price: 10 } ])

    // ends with Sturza
    // .find({ name: /Sturza$/})

    // contains Mimi --> .* means we can have 0 or more characters before and after the name
    .find({ name: /.*Mimi.*/i })
    .limit(10)
    .sort({ name: 1 })
    // .select({ title: 1, name: 1, price: 1 })
    .countDocuments();


  console.log(courses)
    
}

// getCourses();
// createCourse();



// to import a data file to mongo: 
// mongoimport --db mongo-exercises --collection courses --file exercise-data.json --jsonArray


// app.use(cors());
// app.use(bodyParser.json());
// app.get('/', (req: Request, res: Response) => {
//   res.send('hello world')
// });

// app.get('/todo', (req: Request, res: Response, next: NextFunction) => {
//   res.status(200);
//   res.json([{id: 1, description: 'Buy Bread'}]);
//   });

// app.post('/todo', (req: Request, res: Response, next: NextFunction) => {
// console.info(`${JSON.stringify(req.body)}`);
// res.status(200);
// res.end();
// });

// app.put('/todo/:id', (req: Request, res: Response, next: NextFunction) => {
// console.info(`${JSON.stringify(req.body)}`);
// console.info(`:id = ${req.params.id}`);
// res.status(200);
// res.end();
// });

// app.delete('/todo/:id', (req: Request, res: Response, next: NextFunction) => {
// console.info(`:id = ${req.params.id}`);
// res.status(200);
// res.end();
// });



// const port = process.env.PORT || 3000;
// app.listen(port, async () => {
//   console.info(`Listening on port ${port}`);
//   try {
//     await mongoHelper.connect(`mongodb://10.0.0.129:27017/todo`);
//     console.info(`Connected to Mongo!`);
//   } catch (err) {
//     console.error(`Unable to connect to Mongo!`, err);
//   }
// });
