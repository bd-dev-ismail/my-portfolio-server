const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run(){
    const projectCategoryCollection = client.db('portfolio').collection('projectCategories');
    const projectCollection = client.db('portfolio').collection('projects');
    const bestProjectsCollection = client
      .db("portfolio")
      .collection("bestProjects");
    
    //get categories
    app.get('/categories', async(req, res)=> {
        const query = {};
        const result = await projectCategoryCollection.find(query).sort({name: -1}).toArray();
        res.send(result);
    });
    //create proejct
    app.post('/proejcts', async(req, res)=> {
        const proejcts = req.body;
        const result = await projectCollection.insertOne(proejcts);
        res.send(result);
    });
    //get single category by product
    app.get('/project/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {
          projectCategoryId: id
        };
        const result = await projectCollection.find(query).sort({name: 1}).toArray();
        res.send(result);
    });
    //get best project
    app.get('/bestProjects', async(req, res)=> {
        const query = {};
        const result = await bestProjectsCollection.find(query).toArray();
        res.send(result)
    })
    //get all project
    app.get('/projects', async(req, res)=> {
        const query = {};
        const result = await projectCollection.find(query).toArray();
        res.send(result)
    })
}


run().catch(err => console.log(err))

app.get('/',(req, res)=> {
    res.send("Portfolio Server is running!!")
});
app.listen(port, ()=> {
    console.log(`Portfolio server is running on port ${port}`);
})