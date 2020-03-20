// code away!
require('dotenv').config();
const server = require('./server.js');
const userRoute = require('./users/userRouter');
const postRoute = require('./posts/postRouter');
const port = process.env.PORT || 4000;

server.use('/api/user', userRoute);
server.use('/api/post', postRoute);

server.listen(port, () => {
    console.log(`\n* Server Running on http://localhost:${port} *\n`);
  });

server.get('/', (req, res) => {
  const motd = process.env.MOTD;
  res.status(200).json({motd: motd}) 
});