// code away!
const server = require('./server.js');
const userRoute = require('./users/userRouter');
const postRoute = require('./posts/postRouter');

server.use('/api/user', userRoute);
server.use('/api/post', postRoute);

server.listen(4000, () => {
    console.log('\n* Server Running on http://localhost:4000 *\n');
  });