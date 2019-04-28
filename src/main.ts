import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';

mongoose.connect('mongodb://localhost/mongo-exercises', {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(err))


const schema = new mongoose.Schema({
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        // do some async work
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result); 
        }, 4000);
      }
    }
  },
  date: { type: Date, default: Date.now },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network']
  },
  author: String,
  isPublished: Boolean,
  price: {
    type: Number,
    min: 10,
    max: 200,
    required: function() { return this.isPublished; }
  }
})

const Course = mongoose.model('course', schema);

async function createCourse (schema) {
  const newCourse = new Course(schema);
  try {
    const result = await newCourse.save();
    console.log(result);
  } catch(err) {
    console.log('Name: ', err.name);
    console.log('Message: ', err.message);
  }
}

async function getCourses() {
  return await Course
  .find({isPublished: true})
  .or([ {price: { $gte: 100 }}, {name: /.*by.*/i } ])
  .sort({price: -1})
  .select('name author price')
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

async function updateCourse(query, update) {
  const course = await Course.findOneAndUpdate(query, update, {new: true})
  console.log(course);
}

async function removeCourse(id) {
 const result = await Course.deleteOne({ _id: id });
 console.log(result);
}


// updateCourse({name: 'Angular Course'}, {
//   price: 14,
//   name: 'Angular Course and stuff'
// });

// run();

async function findCourse(condition) {
  return await Course
    .findOne(condition)
}

async function deleteItem() {
  const theOne = await findCourse({ author: 'Jack', name: 'Mimi'})
  removeCourse(theOne._id);
}

// deleteItem();

createCourse({
    tags: [],
    name: 'Enu Maia',
    category: 'web',
    author: 'SundaQ',
    isPublished: true,
    price: 25
});
